<!--
 * @Descripttion: 鼠标移动或者点击组件时高亮组件
 * @Author: gaocz
 * @Date: 2022-04-28 15:08:11
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-05 09:14:47
 * @FilePath: /edmp-web/src/views/system/lowCodeMgt/pageMgt/renderTool/components/PreviewWidgets.vue
-->
<template>
  <div class="preview-widgets">
    <div class="editor-hlbox hover" v-if="hoverEditorId" :style="hoverWidgets"></div>
    <div class="editor-hlbox selected" v-if="activeEditorId" :style="activeWidgets">
      <div class="editor-toolbar" v-if="widgetsConfig.length">
        <template v-for="item in widgetsConfig">
          <el-tooltip popper-class="editor-popper" effect="dark" :content="item.content" placement="bottom" :key="item.key">
            <el-button :icon="item.icon"></el-button>
          </el-tooltip>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import { LowCodeModule } from "@/store/modules/lowCode";

export interface IWidgets {
  key: string;
  content: string;
  icon: string;
}

@Component({
  name: "PreviewWidgets",
})
export default class extends Vue {
  private widgets = [
    { key: "delete", content: "删除", icon: "el-icon-delete" },
    { key: "drag", content: "按住拖动调整位置", icon: "el-icon-rank" },
  ];

  get hoverEditorId() {
    return LowCodeModule.hoverEditorId;
  }
  get activeEditorId() {
    return LowCodeModule.activeEditorId;
  }
  get hoverWidgets() {
    return LowCodeModule.hoverWidgets;
  }
  get activeWidgets() {
    return LowCodeModule.activeWidgets;
  }
  get activeWidgetsAuth() {
    return LowCodeModule.activeWidgetsAuth;
  }

  get widgetsConfig() {
    return this.widgets.filter((item: IWidgets) => (LowCodeModule.activeWidgetsAuth as string[]).includes(item.key));
  }
}
</script>
<style lang="scss">
.editor-popper {
  padding: 5px !important;
  border-radius: 2px;
  font-size: 12px;
}
</style>
<style lang="scss" scoped>
.preview-widgets {
  box-sizing: border-box;
  pointer-events: none;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 100;
  .editor-hlbox {
    position: absolute;
    width: 100px;
    height: 100px;
    &.hover {
      border: 1px dashed #007eff;
    }
    &.selected {
      border: 2px solid #007eff;
    }
  }
  .editor-toolbar {
    pointer-events: all;
    padding: 2px 5px;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1;
    background: #007eff;
    border-top-left-radius: 2px;
    .el-button {
      padding: 0;
      background: none;
      border: 0;
      color: #fff;
      border-radius: 0;
      & + .el-button {
        padding-left: 5px;
        margin-left: 5px;
        border-left: 1px solid rgba(255, 255, 255, 0.5);
      }
    }
  }
}
</style>
