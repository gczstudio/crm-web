<template>
  <el-scrollbar id="dashScrollbar" :wrap-style="`height: calc(100vh - ${isMaxScreen ? 77 : 65}px);overflow-x: hidden;`">
    <div class="app-main">
      <!-- <transition
        name="fade-transform"
        mode="out-in"
      > -->
        <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive>
      <!-- </transition> -->
    </div>
  </el-scrollbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TagsViewModule } from '@/store/modules/tags-view'
import watermark from '@/utils/watermark'
@Component({
  name: 'AppMain'
})
export default class extends Vue {
  get cachedViews() {
    return TagsViewModule.cachedViews
  }

  get key() {
    return this.$route.path
  }

  mounted () {
    watermark.setWatermark();
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  width: 100%;
  // position: relative;
  padding: 16px;
  // height: 100%;
  margin-bottom: 16px;
}
@media screen and (max-width: 1680px) {
  .app-main {
    padding: 12px;
    margin-bottom: 12px;
  }
}
</style>
