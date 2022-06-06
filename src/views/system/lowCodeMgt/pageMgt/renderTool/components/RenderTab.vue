<template>
  <div class="render-tab" v-editor.tab="{ action: ['delete'] }">
    <el-tabs v-model="activeName" :type="data.tabType" :key="data.tabType" :class="{ 'tab-custom': data.tabType === 'custom' }" v-bind="data">
      <el-tab-pane v-for="tab in tabs" v-bind="tab" :key="tab.id">
        <div class="tabs-pane" v-editor.tab-pane="{ id: tab.id }">
          <render-type v-if="tab.body && tab.body.length" :data="tab.body"></render-type>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="sort">
      <div class="sort-field" @click="clickSortFn(field)" v-for="field in sortFields" :key="field.id" :class="[field.sortType]">
        <span class="caret-wrapper">
          <i class="sort-caret ascending" @click.stop="clickSortFn(field, 'ascending')"></i>
          <i class="sort-caret descending" @click.stop="clickSortFn(field, 'descending')"></i>
        </span>
        <span>{{ field.value }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject, Watch } from "vue-property-decorator";
@Component({
  name: "RenderTab",
})
export default class extends Vue {
  @Inject("type") type!: string;
  @Prop() data!: any;
  activeName = "";
  tabs: { name: string }[] = [];

  get sortFields() {
    return this.data.body.find((item: any) => item.name === this.activeName)?.sortFields;
  }

  @Watch("data", { immediate: true, deep: true })
  onDataChange() {
    this.tabs = this.data.body;
    this.activeName = this.tabs[0].name;
  }

  // 点击排序
  clickSortFn(field: any, type?: string) {
    this.sortFields.map((item: any) => {
      if (item.id === field.id) {
        if (type && type === item.sortType) {
          this.$set(item, "sortType", undefined);
        } else {
          this.$set(item, "sortType", type ? type : this.getNextSort(field.sortType));
        }
      } else {
        this.$set(item, "sortType", undefined);
      }
    });
    console.log(this.sortFields, 444);
  }
  // 获取下一个排序
  getNextSort(type: string) {
    console.log(type, 222);
    let typeArr = ["ascending", "descending", undefined];
    let sortIndex = typeArr.indexOf(type) + 1;
    console.log(sortIndex, 333);
    return sortIndex > 2 ? "ascending" : typeArr[sortIndex];
  }
}
</script>

<style lang="scss" scoped>
.render-tab {
  position: relative;
}
.tabs-pane {
  min-height: 40px;
}
.tab-custom {
  ::v-deep &.el-tabs {
    .el-tabs__header {
      padding: 20px;
      margin: 0;
      background: #fff;
    }
    .el-tabs__item {
      height: 25px;
      line-height: 25px;
      padding: 0 16px !important;
      color: #333;
      font-weight: normal;
      margin-right: 16px;
    }
    .el-tabs__item.is-active {
      background: #00a4db;
      color: #fff;
    }
    .el-tabs__nav-wrap::after {
      height: 0;
    }
  }
}

.sort {
  position: absolute;
  top: 25px;
  right: 20px;
  color: #666666;
  .sort-field {
    cursor: pointer;
    position: relative;
    margin-left: 16px;
    padding-left: 20px;
    display: inline-block;
    &.ascending {
      .sort-caret {
        &.ascending {
          border-bottom-color: #007eff;
        }
      }
    }
    &.descending {
      .sort-caret {
        &.descending {
          border-top-color: #007eff;
        }
      }
    }
  }

  .caret-wrapper {
    position: absolute;
    display: inline-block;
  }
  .sort-caret {
    display: inline-block;
    position: absolute;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    position: absolute;
    left: -15px;
    &.ascending {
      border-bottom-color: #999;
      top: -4px;
    }
    &.descending {
      border-top-color: #999;
      top: 9px;
    }
  }
}
</style>
