<!--编辑-->
<script lang="tsx">
import { Component, Vue, Prop, Ref, Watch, Provide } from "vue-property-decorator";
import { LowCodeModule } from "@/store/modules/lowCode";
import { guid } from "@/utils";
import { ElMenuItemGroup } from "element-ui/types/menu-item-group";

@Component({
  name: "RenderPage",
})
export default class extends Vue {
  @Ref("chunkRef") chunkRef: any;
  @Prop() data!: any;
  @Prop() layout!: string;
  private chunkHeight = 0;
  private activeFixedLayoutItem = -1;
  private pageConfigData: any = {};

  @Watch("data", { immediate: true, deep: true })
  onDataChange(val: any) {
    this.pageConfigData = val;
    console.log(val, 222);
  }

  mounted() {
    this.changeSize();
    window.addEventListener("resize", this.changeSize);
  }

  destroyed() {
    window.removeEventListener("resize", this.changeSize);
  }

  changeSize() {
    if (!this.chunkRef) return;
    this.chunkHeight = (this.chunkRef.clientWidth / 4 - 16) * 0.618;
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
      <div class={{ "renderTool-page": true, fixed: this.layout === "fixed" }} ref="chunkRef">
        <div class="content">
          {this.pageConfigData.body &&
            this.pageConfigData.body.map((item: any) => {
              return (
                <div class="editor-main" data-editor-id={guid()}>
                  {this.layout === "fixed" && (
                    <div class="fixed-layout clearfix">
                      {(item.body as any[]).map((ele: any, index: number) => {
                        return (
                          <div
                            class={{ "layout-item": true, active: this.activeFixedLayoutItem === index }}
                            key={index}
                            style={this.getChunkStyle(ele)}
                            onClick={() => this.selectFixedLayoutItem(index)}
                          >
                            <render-type data={[ele]} layout="fixed"></render-type>
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
                  {this.layout === "none" && (
                    <div class="none-layout">
                      <render-type data={[item]} layout="none"></render-type>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}
</script>

<style lang="scss" scoped>
.renderTool-page {
  &.fixed {
    padding: 0 16px 16px 0;
    .content {
      background: none;
      box-shadow: none;
    }
  }
  .content {
    min-height: 100%;
    // background: #fff;
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
