<!--编辑-->
<template>
  <div class="renderTool-container" ref="renderBoxRef">
    <div class="render-box" v-editor.render>
      <render-type :data="[pageConfigData]" :layout="pageConfigData.layout"></render-type>
      <preview-widgets></preview-widgets>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Provide, Watch } from "vue-property-decorator";
import { LowCodeModule } from "@/store/modules/lowCode";
import PreviewWidgets from "./components/PreviewWidgets.vue";

@Component({
  name: "RenderTool",
  components: {
    PreviewWidgets,
  },
})
export default class extends Vue {
  @Ref("renderBoxRef") renderBoxRef: any;
  @Provide("type") type = "edit";

  pageConfigData: Record<string, unknown> = {};

  get layout() {
    return LowCodeModule.layout;
  }

  get pageConfig(): any {
    return LowCodeModule.pageConfig;
  }

  get hoverEditorId() {
    return LowCodeModule.hoverEditorId;
  }

  get hoverWidgets() {
    return LowCodeModule.hoverWidgets;
  }

  get widgetsMap() {
    return LowCodeModule.widgetsMap;
  }

  get hasSideConfig() {
    return LowCodeModule.hasSideConfig;
  }

  @Watch("pageConfig", { immediate: true, deep: true })
  onPageConfigChange(val: any) {
    console.log(val, 111);
    this.pageConfigData = val;
  }

  mounted() {
    this.$el.addEventListener("mousemove", this.mousemoveFn);
    this.$el.addEventListener("mouseout", this.mouseoutFn);
    this.$el.addEventListener("click", this.clickFn);
  }

  mousemoveFn(e: Event) {
    if (this.layout === "none") {
      this.findEditorDomUp(e.target as HTMLElement);
    }
  }

  mouseoutFn() {
    LowCodeModule.SET_HOVER_EDITOR_ID("");
  }

  async clickFn() {
    LowCodeModule.SET_ACTIVE_EDITOR_ID(this.hoverEditorId);
    LowCodeModule.SET_ACTIVE_WIDGETS(this.hoverWidgets);
    LowCodeModule.SET_ACTIVE_WIDGETS_AUTH((this.widgetsMap as any)[this.hoverEditorId]?.actions);
    await this.$nextTick();
    this.hasSideConfig && LowCodeModule.SET_SHOW_RIGHT_PANEL(true);
  }

  findEditorDomUp(target: HTMLElement) {
    // 一直往上找到当前编辑的元素
    if (target.className === "center-box") return;
    if (target.dataset.editorId) {
      const { top: bTop, left: BLeft } = this.renderBoxRef.getBoundingClientRect();
      const { width, height, top, left } = target.getBoundingClientRect();
      let scrollTop = this.renderBoxRef.scrollTop;
      let widgetsInfo = {
        width: width + "px",
        height: height + "px",
        top: top - bTop + scrollTop + "px",
        left: left - BLeft + "px",
      };
      LowCodeModule.SET_HOVER_EDITOR_ID(target.dataset.editorId);
      LowCodeModule.SET_HOVER_WIDGETS(widgetsInfo);
      return;
    }
    target.parentNode && this.findEditorDomUp(target.parentNode as HTMLElement);
  }
}
</script>

<style lang="scss" scoped>
.renderTool-container {
  position: relative;
  height: 100%;
  overflow-y: auto;
  .render-box {
    padding: 16px;
  }
}
</style>
