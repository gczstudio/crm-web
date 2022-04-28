<template>
  <div class="custMIncome-container">
    <div class="yu-main-wrapper">
      <MainLayout is-tab>
        <template v-slot:header>
          <el-button icon="el-icon-download" @click="exportFn">导出</el-button>
        </template>
        <template v-slot:form>
          <yu-xform ref="searchForm" :model="queryFormData" :search="searchFn" form-type="search">
            <yu-xform-group :column="4">
              <yu-xform-item label="开始日期" name="startDate" ctype="date-picker" placeholder="开始日期" :picker-options="startPickerOptions" :rules="globalRules.required"></yu-xform-item>
              <yu-xform-item label="结束日期" name="endDate" ctype="date-picker" placeholder="结束日期" :picker-options="endPickerOptions" :rules="globalRules.required"></yu-xform-item>
              <!-- <yu-xform-item label="科目名称" placeholder="科目名称" ctype="select" name="subjNm" data-code="ENT_SCALE_MIS" filterable></yu-xform-item> -->
              <yu-xform-item label="交易金额(元税后收入)" ctype="yufp-range-input" name="aTaxTranAmt" :rules="$validator.rangeInput"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <div class="total f3">
            中间业务收入：<span class="num">{{ $util.formatMoney(sumTran) }}</span> 元
          </div>
          <yu-xtable ref="refTable" :data-url="dataUrl" :base-params="baseParams" :loadEnd="loadEndFn" :dynamic-height="true" border>
            <yu-xtable-column label="机构" prop="orgNm" width="200" fixed="left" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="客户名称" prop="custNm" width="200" fixed="left" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="交易金额(元税前收入)" prop="bTaxTranAmt" align="right" format-money width="180" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="交易金额(元税后收入)" prop="aTaxTranAmt" align="right" format-money width="180" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="交易日期" prop="tranDate" width="150" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="科目名称" prop="subjNm" width="200" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="户名" prop="acctNm" width="180" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="一级科目" prop="subjLv1" width="200" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="二级科目" prop="subjLv2" width="200" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="三级科目" prop="subjLv3" width="200" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="四级科目" prop="subjLv4" width="200" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="核心科目号" prop="subjCore" width="200" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="账号" prop="acctNo" width="200" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="管理机构" prop="mgrOrgNm" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="上级管理机构" prop="supMgrOrgNm" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="流水号" prop="seqNo" width="180" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="交易机构" prop="tranOrgNm" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="交易机构网点" prop="tranBrchNm" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="借贷方向" prop="dcFlg" width="100" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="客户号" prop="custId" width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="备注" prop="remark" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="摘要" prop="memoDesc" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="产品编码" prop="prodNo" width="150" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="产品名称" prop="prodNm" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import { backend } from "@/config";
import moment from "moment";
@Component({
  name: "CustMIncome",
  components: {},
})
export default class extends Vue {
  @Ref("searchForm") searchForm: any;
  @Ref("refTable") refTable: any;
  private dataUrl = backend.custService + "/api/acrmfciimdbusiinfo/listmdbusi";
  private crmCustId = this.$route.query.crmCustId;
  private dataDt = sessionStorage.getItem("dataDt");
  private queryFormData = {
    startDate: moment(this.dataDt).format("YYYY-MM-DD"),
    endDate: moment(this.dataDt).format("YYYY-MM-DD"),
  };
  private baseParams = {
    condition: JSON.stringify({
      crmCustId: this.crmCustId,
      startDate: moment(this.dataDt).format("YYYY-MM-DD"),
      endDate: moment(this.dataDt).format("YYYY-MM-DD"),
    }),
  };

  private sumTran = 0;

  private startPickerOptions = {
    disabledDate: (time: Date) => {
      if ((this.queryFormData as any).endDate) {
        return time.getTime() >= new Date((this.queryFormData as any).endDate).getTime();
      }
    },
  };

  private endPickerOptions = {
    disabledDate: (time: Date) => {
      if ((this.queryFormData as any).startDate) {
        return time.getTime() <= new Date((this.queryFormData as any).startDate).getTime() - 86400000;
      }
    },
  };

  mounted() {
    this.$exportQueue.addQueue(this.$route.path, this.exportFn);
  }

  loadEndFn(data: any) {
    this.sumTran = data[0]?.sumTran || 0;
  }

  searchFn() {
    var aTaxTranAmts = (this.queryFormData as any).aTaxTranAmt;
    let obj: any = {
      ...this.queryFormData,
      aTaxTranAmtMin: aTaxTranAmts?.[0],
      aTaxTranAmtMax: aTaxTranAmts?.[1],
    };
    delete obj.aTaxTranAmt;
    let params = {
      condition: JSON.stringify(obj),
    };
    this.refTable.remoteData(params);
  }

  exportFn(showTipModal?: boolean) {
    var aTaxTranAmts = (this.queryFormData as any).aTaxTranAmt;
    let queryField = (this as any).$util.formatQueryField([{ cnName: "CRM内部客户号", value: this.crmCustId }]);

    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      fileName: "中间业务收入",
      queryField: queryField + this.searchForm.searchQueryField,
      crmCustId: this.crmCustId,
      aTaxTranAmtMin: aTaxTranAmts?.[0],
      aTaxTranAmtMax: aTaxTranAmts?.[1],
    });
    delete searchQuery.aTaxTranAmt;

    var apiParams = {
      url: backend.custService + "/api/acrmfciimdbusiinfo/exportlistmdbusi",
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

<style lang="scss" scoped>
.custMIncome-container {
  .total {
    padding: 0 16px 10px;
  }
  ::v-deep.yu-xform {
    .el-row {
      .el-col:nth-child(1),
      .el-col:nth-child(2) {
        width: 25%;
      }
      .el-col:nth-child(3) {
        width: 40%;
      }
    }
  }
}
</style>
