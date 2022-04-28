<template>
  <div class="MemberList-container">
    <div class="yu-main-wrapper">
      <MainLayout :title="row.groupName">
        <template v-slot:header>
          <el-button icon="el-icon-download" @click="exportFn" v-permission="'mbExport'">导出</el-button>
          <el-button icon="el-icon-close" @click="closeFn">关闭</el-button>
        </template>
        <template v-slot:form>
          <yu-xform ref="searchForm" class="search" :model="queryFormData" label-width="83px">
            <yu-xform-group :column="4">
              <yu-xform-item label="数据日期" placeholder="数据日期" name="etlDate" ctype="date-picker" disabled :clearable="false"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number :dynamic-height="true" border :default-load="false">
            <yu-xtable-column label="成员名称" prop="memberName" width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
                <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{ scope.row.memberName }}</div>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="核心客户号" prop="custId" width="150" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="组织机构代码" prop="insCredCode" width="140" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="存款余额（元）" prop="custBal" width="140" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="存款日均（元）" prop="custBalAvg" width="140" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="信贷余额（元）" prop="xdLoanBal" width="140" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="贷款余额（元）" prop="loanBal" width="140" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="EVA（元）" prop="eva" width="120" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="业务利润（元）" prop="profitContribution" align="right" width="140" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="FTP利润（元）" prop="ftpProfitBalnc" width="140" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="中间业务收入（元）" prop="midBizInc" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="存款付息率（%）" prop="avgDpsRate" width="160" align="right" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="平均贷款利率（%）" prop="avgLneRate" width="180" align="right" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="授信总额（元）" prop="creditAmt" width="140" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="已使用授信额度（元）" prop="usedCreditAmt" width="190" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="授信敞口额度（元）" prop="creditExposureAmt" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="已使用敞口额度（元）" prop="userdCreditExposureAmt" width="190" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="是否存在未结清业务或有效授信" prop="iseffCredit" width="250" data-code="YESNO" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="是否纳入授信集团管理" prop="isincluded" width="190" data-code="YESNO" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="主管客户经理" prop="blgMgrNm" width="140" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="主管机构" prop="blgOrgNm" width="140" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Prop, Watch } from "vue-property-decorator";
import { backend } from "@/config";
import moment from "moment";
@Component({
  name: "MemberList",
})
export default class extends Vue {
  @Ref("searchForm") searchForm: any;
  @Ref("refTable") refTable: any;
  @Prop() private instance!: any;
  @Prop() private visible!: any;
  @Prop() private row!: any;
  private dataUrl = backend.custService + "/api/groupcust/grpmemquery";
  private queryFormData = {
    etlDate: "",
  };

  private currentRow = {};

  @Watch("row", { immediate: true })
  onRowChange(row: any) {
    this.$set(this.queryFormData, "etlDate", row.etlDate);
    this.$nextTick(() => {
      this.searchFn(row.etlDate);
    });
  }

  @Watch("visible", { immediate: true })
  onVisibleChange(visible: boolean) {
    if (visible) {
      this.$checkCtr("mbExport") && this.$exportQueue.addQueue(this.$route.path, this.exportFn, true);
    }
  }

  searchFn(etlDate: any) {
    this.refTable.remoteData({
      condition: JSON.stringify({
        groupId: this.row.groupId,
        etlDate: etlDate || this.queryFormData.etlDate,
      }),
    });
  }

  customerViewFn(row: any) {
    this.$router.push({ path: "/custInfo/custView/" + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: "客户详情-" + row.memberName } });
  }

  closeFn() {
    this.instance.hide();
    // 关闭页面移除导出
    this.$exportQueue.removeQueue(this.$route.path, true);
  }

  exportFn(showTipModal?: boolean) {
    let queryField = (this as any).$util.formatQueryField([{ cnName: "集团编号", value: this.row.groupId }]);

    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      groupId: this.row.groupId,
      fileName: "集团成员列表",
      queryField: queryField + this.searchForm.searchQueryField,
    });
    var apiParams = {
      url: backend.custService + "/api/groupcust/exportgrpmber",
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
::v-deep.MemberList-container {
  .el-input.is-disabled .el-input__inner,
  .el-textarea.is-disabled .el-textarea__inner {
    background-color: #fff;
    color: #606266;
    border: 0;
    cursor: default;
  }
}
</style>
