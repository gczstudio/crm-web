<!--展示-->
<script lang="tsx">
import { Component, Vue, Prop, Ref, Watch, Provide } from "vue-property-decorator";
import { guid } from "@/utils";
import request from "@/utils/request";
import { backend } from "@/config";
@Component({
  name: "RenderTool",
})
export default class extends Vue {
  @Provide("type") type = "show";
  @Ref("chunkRef") chunkRef: any;
  private chunkHeight = 0;
  private pageConfigData: any = {};

  created() {
    this.getPageConfig();
  }

  mounted() {
    this.changeSize();
    window.addEventListener("resize", this.changeSize);
  }

  // 查询配置数据
  getPageConfig() {
    request({
      url: backend.comptMgrService + "/api/page/list",
      method: "get",
      params: {
        condition: JSON.stringify({
          id: this.$route.meta?.pageId,
        }),
      },
    }).then((res) => {
      this.pageConfigData = JSON.parse(res.data[7].pageConfig);
    });
  }

  destroyed() {
    window.removeEventListener("resize", this.changeSize);
  }

  changeSize() {
    if (!this.chunkRef) return;
    let boxWidth = (this.$el.parentNode as any).clientWidth;
    this.chunkHeight = (boxWidth / 4 - 16) * 0.618;
  }

  getChunkStyle(item: { row: number; col: number }) {
    if (!this.chunkHeight) return;
    return {
      width: `calc(${25 * item.col}% - 16px)`,
      height: this.chunkHeight * item.row + (item.row - 1) * 16 + "px",
    };
  }

  render() {
    return (
      <div class={{ "renderTool-container": true, fixed: this.pageConfigData.body && this.pageConfigData.body[0].layout === "fixed" }} ref="chunkRef">
        <div class="content">
          {this.pageConfigData.body &&
            this.pageConfigData.body.map((item: any) => {
              return (
                <div class="editor-main">
                  {item.layout === "fixed" && (
                    <div class="fixed-layout clearfix">
                      {item.body &&
                        (item.body as any[]).map((ele: any, index: number) => {
                          return (
                            <div class="layout-item" key={index} style={this.getChunkStyle(ele)}>
                              <render-type data={[ele]} layout={item.layout}></render-type>
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
      </div>
    );
  }
}
</script>

<style lang="scss" scoped>
.renderTool-container {
  position: relative;
  height: 100%;
  overflow-y: auto;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  &.fixed {
    padding: 0 16px 16px 0;
    box-shadow: none;
  }
  .layout-item {
    position: relative;
    float: left;
    margin: 16px 0 0 16px;
    width: calc(25% - 16px);
    height: 3rem;
    overflow: hidden;
    background: #fff;
    border-radius: 5px;
    position: relative;
    overflow: auto;
  }
  .none-layout {
    background: #fff;
  }
}
</style>
