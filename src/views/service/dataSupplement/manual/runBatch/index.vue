<template>
  <div class="CustMgt-container">
    <div class="yu-main-wrapper">
      <MainLayout is-tab>
        <template v-slot:header>
          <el-button icon="el-icon-refresh" @click="reSearch">刷新</el-button>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number :dynamic-height="true" border>
            <!-- <yu-xtable-column
              label="批量ID"
              prop="batchId"
              min-width="200"
              :show-overflow-tooltip="true"
              fixed="left"
              is-num
            ></yu-xtable-column> -->
            <yu-xtable-column label="数据日期" prop="etlDate" min-width="200" fixed="left" :show-overflow-tooltip="true" is-num></yu-xtable-column>
            <yu-xtable-column label="跑批开始时间" prop="batchBeginTime" min-width="200" :show-overflow-tooltip="true" fixed="left" is-num></yu-xtable-column>
            <yu-xtable-column label="跑批结束时间" prop="batchEndTime" min-width="200" :show-overflow-tooltip="true" is-num></yu-xtable-column>
            <yu-xtable-column label="跑批状态" prop="runStat" min-width="200" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import { backend } from "@/config";
import lookup from "@/utils/lookup";
import { getUserInfo } from "@/utils";

@Component({
  name: "RunBatch",
})
export default class extends Vue {
  @Ref("searchForm") searchForm: any;
  @Ref("refTable") refTable: any;
  private dataUrl = backend.dataSupplement + "/api/adjdeploanrec/batchlist";
  private queryFormData = {};
  private userInfo = getUserInfo();
  reSearch() {
    this.refTable.remoteData();
  }
}
</script>
<style scoped lang="scss" scoped>
.header {
  padding-bottom: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  opacity: 1;
  border-radius: 0px;
}
/deep/ .yu-main-content::before {
  content: "";
  display: block;
  width: calc(100% - 40px);
  margin-left: 20px;
  border-top: 0px solid #d8d8d8;
}
/deep/ .yu-main-tabs__toolbar {
  z-index: 21;
}
</style>
