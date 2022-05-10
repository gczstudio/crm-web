<!--
 * @Descripttion: 
 * @Author: gaocz
 * @Date: 2022-04-28 09:12:04
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-09 11:04:09
 * @FilePath: /edmp-web/src/views/system/lowCodeMgt/pageMgt/renderTool/index.vue
-->
<script lang="tsx">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import { LowCodeModule } from "@/store/modules/lowCode";
import { guid } from "@/utils";
import RenderChartById from "./components/RenderChartById.vue";
import RenderCurd from "./components/RenderCurd.vue";
import PreviewWidgets from "./components/PreviewWidgets.vue";
@Component({
  name: "RenderTool",
  components: {
    RenderChartById,
    RenderCurd,
    PreviewWidgets,
  },
})
export default class extends Vue {
  @Ref("chunkRef") chunkRef: any;
  private chunkHeight = 0;
  private activeFixedLayoutItem = -1;

  get layout() {
    return LowCodeModule.layout;
  }

  get pagConfig(): any {
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

  mounted() {
    this.changeSize();
    window.addEventListener("resize", this.changeSize);
    this.$el.addEventListener("mousemove", this.mousemoveFn);
    this.$el.addEventListener("mouseout", this.mouseoutFn);
    this.$el.addEventListener("click", this.clickFn);
  }

  destroyed() {
    window.removeEventListener("resize", this.changeSize);
  }

  changeSize() {
    if (!this.chunkRef) return;
    this.chunkHeight = (this.chunkRef.clientWidth / 4 - 16) * 0.618;
  }

  mousemoveFn(e: Event) {
    if (this.layout === "none") {
      this.findEditorDomUp(e.target as HTMLElement);
    }
  }

  mouseoutFn() {
    LowCodeModule.SET_HOVER_EDITOR_ID("");
  }

  clickFn() {
    LowCodeModule.SET_ACTIVE_EDITOR_ID(this.hoverEditorId);
    LowCodeModule.SET_ACTIVE_WIDGETS(this.hoverWidgets);
    console.log(this.widgetsMap, 888);
    LowCodeModule.SET_ACTIVE_WIDGETS_AUTH((this.widgetsMap as any)[this.hoverEditorId]);
  }

  findEditorDomUp(target: HTMLElement) {
    // 一直往上找到当前编辑的元素
    if (target.className === "content") return;
    if (target.dataset.editorId) {
      const { top: bTop, left: BLeft } = this.chunkRef.getBoundingClientRect();
      const { width, height, top, left } = target.getBoundingClientRect();
      let scrollTop = this.chunkRef.scrollTop;
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

  getChunkStyle(item: { row: number; col: number }) {
    if (!this.chunkHeight) return;
    return {
      width: `calc(${25 * item.col}% - 16px)`,
      height: this.chunkHeight * item.row + (item.row - 1) * 16 + "px",
    };
  }

  selectFixedLayoutItem(index: number) {
    this.activeFixedLayoutItem = index;
    LowCodeModule.SET_ACTIVE_FIXED_LAYOUT_ITEM(index);
  }

  renderType(ele: any) {
    console.log(ele, 12121);
    switch (ele.type) {
      case "chart":
        return <render-chart-by-id id="1111"></render-chart-by-id>;
      case "curd":
        return <render-curd></render-curd>;
    }
  }

  render() {
    return (
      <div class={{ "renderTool-container": true, fixed: this.layout === "fixed" }} ref="chunkRef">
        <div class="content">
          {this.pagConfig.body.map((item: any) => {
            return (
              <div class="editor-main" data-editor-id={guid()}>
                {item.layout === "fixed" && (
                  <div class="fixed-layout clearfix">
                    {(item.body as any[]).map((ele: any, index: number) => {
                      return (
                        <div
                          class={{ "layout-item": true, active: this.activeFixedLayoutItem === index }}
                          key={index}
                          style={this.getChunkStyle(ele)}
                          onClick={() => this.selectFixedLayoutItem(index)}
                        >
                          {this.renderType(ele)}
                          {!ele.type && (
                            <div class="tip">
                              <i class="iconfont icon-zujianxinxi"></i>从左侧选择组件
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {item.layout === "none" && (
                  <div class="none-layout">
                    {(item.body as any[]).map((ele: any, index: number) => {
                      return this.renderType(ele);
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <preview-widgets></preview-widgets>
      </div>
    );
  }
}
</script>

<style lang="scss" scoped>
.renderTool-container {
  position: relative;
  padding: 16px;
  height: 100%;
  overflow-y: auto;
  &.fixed {
    padding: 0 16px 16px 0;
    .content {
      background: none;
      box-shadow: none;
    }
  }
  .content {
    min-height: 100%;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }
  .layout-item {
    cursor: pointer;
    position: relative;
    float: left;
    margin: 16px 0 0 16px;
    width: calc(25% - 16px);
    height: 3rem;
    overflow: hidden;
    background: #fff;
    border-radius: 5px;
    position: relative;
    &.active,
    &:hover {
      border: 1px dashed #007eff;
    }
    .tip {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .iconfont {
        color: #999;
      }
      color: #999;
    }
  }
  .none-layout {
    padding: 16px;
  }
}
</style>
