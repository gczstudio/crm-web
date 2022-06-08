<!--展示-->
<template>
  <div class="renderTool-container" ref="renderBoxRef">
    <render-type :data="[pageConfigData]" :layout="pageConfigData.layout"></render-type>
    <preview-widgets></preview-widgets>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Provide, Watch, Prop } from "vue-property-decorator";
import { LowCodeModule } from "@/store/modules/lowCode";
import request from "@/utils/request";
import { backend } from "@/config";

@Component({
  name: "RenderShow",
})
export default class extends Vue {
  @Ref("renderBoxRef") renderBoxRef: any;
  @Provide("type") type = "show";

  pageConfigData: Record<string, unknown> = {};

  get pageConfig() {
    return LowCodeModule.pageConfig;
  }

  created() {
    this.getPageConfig();
  }

  // 查询配置数据
  getPageConfig() {
    // 预览模式
    if (this.$route.meta?.type === "preview") {
      this.pageConfigData = this.pageConfig;
      return;
    }
    request({
      url: backend.comptMgrService + "/api/page/list",
      method: "get",
      params: {
        condition: JSON.stringify({
          pageId: this.$route.meta?.pageId,
        }),
      },
    }).then((res) => {
      this.pageConfigData = JSON.parse(res.data[0].pageConfig);
    });
  }
}
</script>

<style lang="scss" scoped>
.renderTool-container {
  position: relative;
  height: 100%;
  overflow-y: auto;
}
</style>
