<template>
  <div class="custFtp-container">
    <div class="yu-main-wrapper">
      <MainLayout is-tab>
        <template v-slot:header>
          <el-button icon="el-icon-download" @click="exportFn">导出</el-button>
        </template>
        <template v-slot:form>
          <yu-xform ref="searchForm" :model="queryFormData" related-table-name="refTable" form-type="search">
            <yu-xform-group :column="4">
              <yu-xform-item label="数据日期" name="startDate" ctype="date-picker" placeholder="数据日期" :rules="globalRules.required"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <div class="total f3">
            FTP利润总额：<span class="num">{{ $util.formatMoney(sumFtp) }}</span
            >元
          </div>
          <yu-xtable ref="refTable" :data-url="dataUrl" :base-params="baseParams" :loadEnd="loadEndFn" :dynamic-height="true" border>
            <yu-xtable-column label="基础信息">
              <yu-xtable-column label="账号" prop="acctNo" width="200" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="核算机构号" prop="acctOrg" width="120" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="考核机构号" prop="settOrg" width="120" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="币种" prop="currCd" width="100" :show-overflow-tooltip="true" data-code="CURR_CD" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="当日折算人民币汇率" prop="curdRmbRate" width="170" align="right" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="四级科目明细" prop="acctDetaLv4" width="200" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="四级产品" prop="prodLv4" width="240" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="起息日" prop="indsDate" width="150" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="到期日" prop="dueDate" width="150" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="当前">
              <yu-xtable-column label="余额" prop="curBal" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="客户利率" prop="curCstIrst" width="100" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="FTP利率" prop="curFtpIrst" width="100" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="净利差" prop="curNetIrst" width="100" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="期间">
              <yu-xtable-column label="日均余额" prop="perdBalAvg" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="收益/成本率" prop="perdIncom" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="账面收支" prop="perdRevExpe" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="调节前">
              <yu-xtable-column label="FTP成本/收益率" prop="bAdjFtpCost" width="150" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="FTP收支" prop="bAdjFtpRev" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="FTP利差" prop="bAdjFtpMarg" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="FTP利润" prop="bAdjFtpProf" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="期限流动性溢价调整">
              <yu-xtable-column label="点差" prop="premAdjLiq" width="100" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="金额" prop="permAdjAmt" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="流动性成本调整">
              <yu-xtable-column label="点差" prop="costAdjLiq" width="100" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="金额" prop="costAdjAmt" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="资本利息回扣调整">
              <yu-xtable-column label="点差" prop="irstAdjLiq" width="100" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="金额" prop="irstAdjAmt" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="地区差异调整">
              <yu-xtable-column label="点差" prop="regiAdjLiq" width="100" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="金额" prop="regiAdjAmt" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="产品导向调整">
              <yu-xtable-column label="点差" prop="prdAdjLiq" width="100" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="金额" prop="prdAdjAmt" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="期限结构调整">
              <yu-xtable-column label="点差" prop="struAdjLiq" width="100" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="金额" prop="struAdjAmt" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="税务调整">
              <yu-xtable-column label="点差" prop="taxAdjLiq" width="100" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="金额" prop="taxAdjAmt" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="科技金融调整">
              <yu-xtable-column label="点差" prop="tfAdjLiq" width="100" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="金额" prop="tfAdjAmt" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="企业规模调整">
              <yu-xtable-column label="点差" prop="entAdjLiq" width="100" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="金额" prop="entAdjAmt" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="行业类型调整">
              <yu-xtable-column label="点差" prop="induAdjLiq" width="100" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="金额" prop="induAdjAmt" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="定期提前支取调整">
              <yu-xtable-column label="点差" prop="reguAdjLiq" width="100" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="金额" prop="reguAdjAmt" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="调节后" width="510" fixed="right">
              <yu-xtable-column label="FTP成本/收益率" prop="aAdjFtpCost" width="150" :show-overflow-tooltip="true" fixed="right" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="FTP收支" prop="aAdjFtpRev" width="120" :show-overflow-tooltip="true" fixed="right" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="FTP利差" prop="aAdjFtpMarg" width="120" :show-overflow-tooltip="true" fixed="right" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="FTP利润" prop="aAdjFtpProf" width="120" :show-overflow-tooltip="true" fixed="right" align="right" format-money sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
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
  name: "CustFtp",
  components: {},
})
export default class extends Vue {
  @Ref("searchForm") searchForm: any;
  @Ref("refTable") refTable: any;
  private dataUrl = backend.custService + "/api/acrmfciftpprofinfo/ftpList";
  private crmCustId = this.$route.query.crmCustId;
  private ftpDate = sessionStorage.getItem("ftpDate");
  private queryFormData = {
    startDate: moment(this.ftpDate).format("YYYY-MM-DD"),
  };
  private baseParams = {
    condition: JSON.stringify({
      crmCustId: this.crmCustId,
      startDate: moment(this.ftpDate).format("YYYY-MM-DD"),
    }),
  };

  private sumFtp = 0;

  mounted() {
    this.$exportQueue.addQueue(this.$route.path, this.exportFn);
  }

  loadEndFn(data: any) {
    this.sumFtp = data[0]?.sumFtp || 0;
  }

  exportFn(showTipModal?: boolean) {
    let queryField = (this as any).$util.formatQueryField([{ cnName: "CRM内部客户号", value: this.crmCustId }]);

    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      fileName: "FTP利润",
      queryField: queryField + this.searchForm.searchQueryField,
      crmCustId: this.crmCustId,
    });
    var apiParams = {
      url: backend.custService + "/api/acrmfciftpprofinfo/exportftpList",
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
.custFtp-container {
  .total {
    padding: 0 16px 10px;
  }
}
</style>
