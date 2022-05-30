<!--
 * @Descripttion: 
 * @Author: gaocz
 * @Date: 2022-04-28 09:12:04
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-18 18:04:51
 * @FilePath: /edmp-web/src/views/system/lowCodeMgt/pageMgt/renderTool/index.vue
-->
<script lang="tsx">
import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";
import { guid } from "@/utils";
import request from "@/utils/request";
import { backend } from "@/config";
import RenderType from "./components/RenderType.vue";
@Component({
  name: "RenderTool",
  components: {
    RenderType,
  },
})
export default class extends Vue {
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
    }).then((res) => {
      this.pageConfigData = JSON.parse(res.data[1].pageConfig);
    });
  }

  destroyed() {
    window.removeEventListener("resize", this.changeSize);
  }

  changeSize() {
    if (!this.chunkRef) return;
    let boxWidth = this.$el.parentNode.clientWidth;
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
