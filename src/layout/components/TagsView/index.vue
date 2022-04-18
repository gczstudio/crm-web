<template>
  <div
    id="tags-view-container"
    class="tags-view-container"
  >
    <scroll-pane
      ref="scrollPane"
      class="tags-view-wrapper"
      @scroll="handleScroll"
      :key="visitedViews.length"
    >
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{path: tag.path, query: tag.query, fullPath: tag.fullPath}"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        {{ tag.query && tag.query.title ? tag.query.title : tag.meta.title }}
        <i v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"></i>
      </router-link>
    </scroll-pane>
    <ul
      v-show="visible"
      :style="{left: left+'px', top: 32+'px'}"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li
        v-if="!isAffix(selectedTag)"
        @click="closeSelectedTag(selectedTag)"
      >
       关闭
      </li>
      <li @click="closeOthersTags">
        关闭其它
      </li>
      <li @click="closeAllTags(selectedTag)">
        关闭所有
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { PermissionModule } from '@/store/modules/permission'
import { TagsViewModule, ITagView } from '@/store/modules/tags-view'
import ScrollPane from './ScrollPane.vue'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'TagsView',
  components: {
    ScrollPane
  }
})
export default class extends Vue {
  private visible = false
  private top = 0
  private left = 0
  private selectedTag: ITagView = {}
  private affixTags: ITagView[] = []

  get visitedViews() {
    return TagsViewModule.visitedViews
  }

  get routes() {
    return PermissionModule.routes
  }

  get isRenderTag () {
    return UserModule.isRenderTag;
  }


  @Watch('$route')
  private onRouteChange() {
    // 控制页面刷新后，切换角色，除首页外其他都要清除
    if(!this.isRenderTag) {
      this.addTags()
    }
    this.moveToCurrentTag()
  }

  @Watch('visible')
  private onVisibleChange(value: boolean) {
    if (value) {
      document.body.addEventListener('click', this.closeMenu)
    } else {
      document.body.removeEventListener('click', this.closeMenu)
    }
  }

  mounted() {
    this.initTags()
    this.addTags()
  }

  private isActive(route: ITagView) {
    return route.path === this.$route.path
  }

  private isAffix(tag: ITagView) {
    return tag.meta && tag.meta.affix
  }

  private filterAffixTags(routes: RouteConfig[]) {
    let tags: ITagView[] = []
    routes.forEach(route => {
      if (route.meta && route.meta.affix) {
        const tagPath = route.path
        tags.push({
          fullPath: tagPath,
          path: tagPath,
          name: route.name,
          meta: { ...route.meta }
        })
      }
      if (route.children) {
        const childTags = this.filterAffixTags(route.children)
        if (childTags.length >= 1) {
          tags = [...tags, ...childTags]
        }
      }
    })
    return tags
  }

  private initTags() {
    this.affixTags = this.filterAffixTags(this.routes)
    for (const tag of this.affixTags) {
      // Must have tag name
      if (tag.name) {
        TagsViewModule.addVisitedView(tag)
      }
    }
  }

  private addTags() {
    const { name } = this.$route
    if (name) {
      TagsViewModule.addView(this.$route)
    }
    return false
  }

  private moveToCurrentTag() {
    const tags = this.$refs.tag as any[] // TODO: better typescript support for router-link
    this.$nextTick(() => {
      for (const tag of tags) {
        if ((tag.to as ITagView).path === this.$route.path) {
          (this.$refs.scrollPane as ScrollPane).moveToTarget(tag as any)
          // When query is different then update
          if ((tag.to as ITagView).fullPath !== this.$route.fullPath) {
            TagsViewModule.updateVisitedView(this.$route)
          }
          break
        }
      }
    })
  }

  private refreshSelectedTag(view: ITagView) {
    TagsViewModule.delCachedView(view)
    const { fullPath } = view
    this.$nextTick(() => {
      this.$router.replace({
        path: '/redirect' + fullPath
      }).catch(err => {
        console.warn(err)
      })
    })
  }

  private closeSelectedTag(view: ITagView) {
    TagsViewModule.delView(view)
    if (this.isActive(view)) {
      this.toLastView(TagsViewModule.visitedViews, view)
    }
  }

  private closeOthersTags() {
    if (this.selectedTag.fullPath !== this.$route.path && this.selectedTag.fullPath !== undefined) {
      this.$router.push(this.selectedTag.fullPath).catch(err => {
        console.warn(err)
      })
    }
    TagsViewModule.delOthersViews(this.selectedTag)
    this.moveToCurrentTag()
  }

  private closeAllTags(view: ITagView) {
    TagsViewModule.delAllViews()
    if (this.affixTags.some(tag => tag.path === this.$route.path)) {
      return
    }
    this.toLastView(TagsViewModule.visitedViews, view)
  }

  private toLastView(visitedViews: ITagView[], view: ITagView) {
    const latestView = visitedViews.slice(-1)[0]
    if (latestView !== undefined && latestView.fullPath !== undefined) {
      this.$router.push(latestView.fullPath).catch(err => {
        console.warn(err)
      })
    } else {
      // Default redirect to the home page if there is no tags-view, adjust it if you want
      if (view.name === 'Home') {
        // to reload home page
        this.$router.replace({ path: '/redirect' + view.fullPath }).catch(err => {
          console.warn(err)
        })
      } else {
        this.$router.push('/').catch(err => {
          console.warn(err)
        })
      }
    }
  }

  private openMenu(tag: ITagView, e: MouseEvent) {
    const menuMinWidth = 105
    const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
    const offsetWidth = (this.$el as HTMLElement).offsetWidth // container width
    const maxLeft = offsetWidth - menuMinWidth // left boundary
    const left = e.clientX - offsetLeft + 15 // 15: margin right
    if (left > maxLeft) {
      this.left = maxLeft
    } else {
      this.left = left
    }
    this.visible = true
    this.selectedTag = tag
  }

  private closeMenu() {
    this.visible = false
  }

  private handleScroll() {
    this.closeMenu()
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  padding: 0 16px;
  height: 32px;
  width: 100%;
  background: #fff;
  // border-bottom: 1px solid red;
  position: relative;
  z-index: 999;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 32px;
      line-height: 32px;
      color: #495060;
      background: #fff;
      padding: 0 30px 0 35px;
      font-size: 16px;
      // border-right: 1px solid #E6E6E6;
      // &:nth-child(1) {
      //   border-left: 1px solid #E6E6E6;
      // }
      &.active {
        // background-color: $blue;
        color: #333;
      }
      .el-icon-close {
        position: absolute;
        top: 8px;
        right: 5px;
        display: none;
      }
      &:hover .el-icon-close {
        display: block;
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
@media screen and (max-width: 1680px) {
.tags-view-container {
  height: 28px;
  .tags-view-wrapper {
      .tags-view-item {
        height: 28px;
        line-height: 28px;
        font-size: 15px;
      }
    }
  }
}
</style>
