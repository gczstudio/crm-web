<!--编辑-->
<script lang="tsx">
import { Component, Vue, Prop, Ref, Watch, Provide } from "vue-property-decorator";
import { LowCodeModule } from "@/store/modules/lowCode";
import { guid } from "@/utils";
import PreviewWidgets from "./components/PreviewWidgets.vue";
import RenderType from "./components/RenderType.vue";

@Component({
  name: "RenderTool",
  components: {
    PreviewWidgets,
    RenderType,
  },
})
export default class extends Vue {
  @Ref("chunkRef") chunkRef: any;
  @Provide("type") type = "edit";
  private chunkHeight = 0;
  private activeFixedLayoutItem = -1;
  private pageConfigData: any = {};

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

  get hasSideConfig() {
    return LowCodeModule.hasSideConfig;
  }

  @Watch("pagConfig", { immediate: true })
  onPageConfigChange(val: any) {
    this.pageConfigData = val;
    LowCodeModule.SET_LAYOUT(val.body[0].layout);
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

  async clickFn() {
    LowCodeModule.SET_ACTIVE_EDITOR_ID(this.hoverEditorId);
    LowCodeModule.SET_ACTIVE_WIDGETS(this.hoverWidgets);
    LowCodeModule.SET_ACTIVE_WIDGETS_AUTH((this.widgetsMap as any)[this.hoverEditorId]?.actions);
    await this.$nextTick();
    this.hasSideConfig && LowCodeModule.SET_SHOW_RIGHT_PANEL(true);
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

  render() {
    return (
      <div class={{ "renderTool-container": true, fixed: this.layout === "fixed" }} ref="chunkRef">
        <div class="content">
          {this.pageConfigData.body &&
            this.pageConfigData.body.map((item: any) => {
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
                            <render-type data={[ele]}></render-type>
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
                      <render-type data={item.body}></render-type>
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
    // padding: 16px;
  }
}
</style>
