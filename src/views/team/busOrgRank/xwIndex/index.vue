<template>
  <div class="CustMgt-container">
    <div class="yu-main-wrapper">
      <MainLayout>
        <template v-slot:header>
          <el-button icon="el-icon-download" @click="exportFn" v-permission="'export'">导出</el-button>
        </template>
        <template v-slot:form>
          <yu-xform ref="searchForm" class="search" :model="queryFormData" related-table-name="refTable" form-type="search" :need-export="true">
            <yu-xform-group :column="4">
              <yu-xform-item label="查询日期" name="queryDate" ctype="date-picker" placeholder="查询日期"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" :page-size="50" row-number :base-params="baseParams" :dynamic-height="true" border>
            <yu-xtable-column label="机构名称" prop="orgNm" width="150" fixed="left" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="小企业存款余额（万元）" prop="meDepBal" width="200" align="right" format-money :unit="10000" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column
              label="小企业存款余额增量（万元）"
              prop="meDepBalLastY"
              width="240"
              align="right"
              format-money
              :unit="10000"
              :show-overflow-tooltip="true"
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column label="小企业存款日均（万元）" prop="meDepBalAvg" width="200" align="right" format-money :unit="10000" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column
              label="小企业存款日均增量（万元）"
              prop="meDepBalAvgLastY"
              width="240"
              align="right"
              format-money
              :unit="10000"
              :show-overflow-tooltip="true"
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column label="小微贷款余额（万元）" prop="meLoanBal" width="190" align="right" format-money :unit="10000" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column
              label="小微贷款余额增量（万元）"
              prop="meLoanBalLastY"
              width="210"
              align="right"
              format-money
              :unit="10000"
              :show-overflow-tooltip="true"
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column label="普惠贷款余额（万元）" prop="icLoanBal" width="200" align="right" format-money :unit="10000" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column
              label="普惠贷款余额增量（万元）"
              prop="icLoanBalLastY"
              width="210"
              align="right"
              format-money
              :unit="10000"
              :show-overflow-tooltip="true"
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="小企业中间业务收入（万元）"
              prop="interBusIncom"
              width="240"
              align="right"
              format-money
              :unit="10000"
              :show-overflow-tooltip="true"
              sortable="custom"
            ></yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import { backend } from "@/config";
import moment from "moment";
@Component({
  name: "XwIndex",
})
export default class extends Vue {
  @Ref("searchForm") searchForm: any;
  @Ref("refTable") refTable: any;
  private dataUrl = backend.teamCenter + "/api/indexquery/miscrolist";
  private dataDt = sessionStorage.getItem("dataDt");

  private queryFormData = {
    queryDate: moment(this.dataDt).format("YYYY-MM-DD"),
  };

  private baseParams = {
    condition: JSON.stringify({
      queryDate: moment(this.dataDt).format("YYYY-MM-DD"),
    }),
  };

  mounted() {
    this.$checkCtr("export") && this.$exportQueue.addQueue(this.$route.path, this.exportFn);
  }

  exportFn(showTipModal?: boolean) {
    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      fileName: "小微类指标排名",
      queryField: this.searchForm.searchQueryField,
    });
    var apiParams = {
      url: backend.teamCenter + "/api/indexquery/exportmiscrolist",
      params: searchQuery,
      sort: this.refTable.sort,
    };
    (this as any).$util.exportTable({
      _this: this,
      apiParams,
      showTipModal,
    });
  }
}
</script>
