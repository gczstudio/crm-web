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
              <yu-xform-item label="客户名称" placeholder="客户名称" ctype="input" name="custNm" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="组织机构代码" placeholder="组织机构代码" ctype="input" name="insCredCode" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="核心客户号" placeholder="核心客户号" ctype="input" name="custId" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="数据日期" name="etlDate" ctype="date-picker" placeholder="数据日期"></yu-xform-item>
              <yu-xform-item label="考核机构" placeholder="考核机构" ctype="yufp-org-tree" name="appraiseOrg"></yu-xform-item>
              <yu-xform-item label="国标行业" placeholder="国标行业" ctype="yufp-org-tree" name="natStdInds" :tree-options="treeOptions"></yu-xform-item>
              <yu-xform-item label="客户类型" placeholder="客户类型" ctype="select" name="custType" data-code="CUST_TYPE_MIS"></yu-xform-item>
              <yu-xform-item label="企业规模" placeholder="企业规模" ctype="select" name="entScale" data-code="ENT_SCALE_MIS"></yu-xform-item>
              <yu-xform-item
                label="存款余额>="
                :show-label-suffix="false"
                suffix-label="元"
                suffix-label-width="28px"
                placeholder="存款余额"
                ctype="input"
                name="custBal"
                :rules="globalRules.amountInput"
              ></yu-xform-item>
              <yu-xform-item
                label="存款日均>="
                :show-label-suffix="false"
                suffix-label="元"
                suffix-label-width="28px"
                placeholder="存款日均"
                ctype="input"
                name="custBalAvg"
                :rules="globalRules.amountInput"
              ></yu-xform-item>
              <yu-xform-item
                label="信贷余额>="
                :show-label-suffix="false"
                suffix-label="元"
                suffix-label-width="28px"
                placeholder="信贷余额"
                ctype="input"
                name="xdLoanBal"
                :rules="globalRules.amountInput"
              ></yu-xform-item>
              <yu-xform-item
                label="信贷日均>="
                :show-label-suffix="false"
                suffix-label="元"
                suffix-label-width="28px"
                placeholder="信贷日均"
                ctype="input"
                name="xdLoanBalAvg"
                :rules="globalRules.amountInput"
              ></yu-xform-item>
              <yu-xform-item
                label="EVA>="
                :show-label-suffix="false"
                suffix-label="元"
                suffix-label-width="28px"
                placeholder="EVA"
                ctype="input"
                name="eva"
                :rules="globalRules.amountInput"
              ></yu-xform-item>
              <yu-xform-item
                label="业务利润>="
                :show-label-suffix="false"
                suffix-label="元"
                suffix-label-width="28px"
                placeholder="业务利润"
                ctype="input"
                name="profitContribution"
                :rules="globalRules.amountInput"
              ></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <div class="table-header"><span class="fr">单位：元</span></div>
          <yu-xtable ref="refTable" :data-url="dataUrl" :base-params="baseParams" row-number :dynamic-height="true" border>
            <yu-xtable-column label="考核机构" prop="appraiseOrgNm" width="150" fixed="left" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="客户名称" prop="custNm" width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.custNm" class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{ scope.row.custNm }}</div>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="组织机构代码" prop="insCredCode" width="130" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="核心客户号" prop="custId" width="120" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="基本信息">
              <yu-xtable-column label="国标行业分类">
                <yu-xtable-column label="一级" prop="natStdIndsOneNm" width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
                <yu-xtable-column label="二级" prop="natStdIndsTwoNm" width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
                <yu-xtable-column label="三级" prop="natStdIndsThreeNm" width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              </yu-xtable-column>
              <yu-xtable-column label="考核条线" prop="busiLineNm" width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="客户类型" prop="custTypeNm" width="120" :show-overflow-tooltip="true" data-code="CUST_TYPE_MIS"></yu-xtable-column>
              <yu-xtable-column label="企业规模" prop="entScaleNm" width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="主管机构" prop="orgNm" width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="主管客户经理" prop="mgrNm" width="130" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="存款信息">
              <yu-xtable-column label="存款余额" prop="custBal" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="其中">
                <yu-xtable-column label="活期存款" prop="hqBal" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                <yu-xtable-column label="通知存款" prop="tzBal" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                <yu-xtable-column label="定期存款" prop="dqBal" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                <yu-xtable-column label="其中">
                  <yu-xtable-column label="定期存单" prop="dqCundBal" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                </yu-xtable-column>
                <yu-xtable-column label="保证金" prop="bzjBal" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                <yu-xtable-column label="其中">
                  <yu-xtable-column label="活期保证金" prop="hqBzjBal" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                  <yu-xtable-column label="定期保证金" prop="dqBzjBal" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                </yu-xtable-column>
                <yu-xtable-column label="大额存单" prop="daeCundBal" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                <yu-xtable-column label="其他" prop="custBalOther" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              </yu-xtable-column>
              <yu-xtable-column label="存款日均" prop="custBalAvg" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="其中">
                <yu-xtable-column label="活期存款" prop="hqBalAvg" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                <yu-xtable-column label="通知存款" prop="tzBalAvg" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                <yu-xtable-column label="定期存款" prop="dqBalAvg" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                <yu-xtable-column label="其中">
                  <yu-xtable-column label="定期存单" prop="dqCdBalAvg" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                </yu-xtable-column>
                <yu-xtable-column label="保证金" prop="bzjBalAvg" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                <yu-xtable-column label="其中">
                  <yu-xtable-column label="活期保证金" prop="hqBzjBalAvg" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                  <yu-xtable-column label="定期保证金" prop="dqBzjBalAvg" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                </yu-xtable-column>
                <yu-xtable-column label="大额存单" prop="daeCdBalAvg" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                <yu-xtable-column label="其他" prop="custBalAvgOther" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              </yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="信贷信息">
              <yu-xtable-column label="信贷余额" prop="xdLoanBal" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="其中">
                <yu-xtable-column label="表内贷款余额" prop="loanBal" width="150" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                <yu-xtable-column label="其中">
                  <yu-xtable-column label="表内贷款（不含贴现及垫款）" prop="loanBalOff" width="230" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                  <yu-xtable-column label="贴现" prop="pjZtBal" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                  <yu-xtable-column label="其中：银票直贴" prop="ypZtBal" width="140" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                  <yu-xtable-column label="其中：商票直贴" prop="spZtBal" width="140" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                  <yu-xtable-column label="垫款" prop="dikBal" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                </yu-xtable-column>
                <yu-xtable-column label="表外业务余额" prop="bwLoanBal" width="130" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                <yu-xtable-column label="其中">
                  <yu-xtable-column label="银行承兑汇票" prop="yhChenduBal" width="130" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                  <yu-xtable-column label="信用证（表外）" prop="xyzBalBw" width="140" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                  <yu-xtable-column label="保函" prop="bhBal" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                </yu-xtable-column>
              </yu-xtable-column>
              <yu-xtable-column label="信贷日均" prop="xdLoanBalAvg" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="其中">
                <yu-xtable-column label="表内贷款日均" prop="bnLoanBalAvg" width="130" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                <yu-xtable-column label="其中">
                  <yu-xtable-column label="表内贷款（不含贴现及垫款）" prop="bnLoanAvgOff" width="230" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                  <yu-xtable-column label="贴现" prop="pjZtBalAvg" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                  <yu-xtable-column label="其中：银票直贴" prop="ypZtBalAvg" width="140" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                  <yu-xtable-column label="其中：商票直贴" prop="spZtBalAvg" width="140" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                  <yu-xtable-column label="垫款" prop="dikBalAvg" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                </yu-xtable-column>
                <yu-xtable-column label="表外业务日均" prop="bwLoanBalAvg" width="130" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                <yu-xtable-column label="其中">
                  <yu-xtable-column label="银行承兑汇票" prop="yhChenduBalAvg" width="130" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                  <yu-xtable-column label="信用证（表外）" prop="xyzBalBwAvg" width="140" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                  <yu-xtable-column label="保函" prop="bhBalAvg" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                </yu-xtable-column>
              </yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="效益信息">
              <yu-xtable-column label="业务利润" prop="profitContribution" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="其中">
                <yu-xtable-column label="FTP利润" prop="ftpProfitBalnc" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
                <yu-xtable-column label="中间业务收入" prop="midBizInc" width="130" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              </yu-xtable-column>
              <yu-xtable-column label="净利润" prop="netProfit" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="经济资本占用" prop="ecOcc" width="130" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="经济资本成本" prop="ecCost" width="130" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="EVA" prop="eva" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="RAROC" prop="raroc" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="信贷户存贷比">
              <yu-xtable-column label="日均信贷规模（不含银票直贴）" prop="xdLoanAvgYp" width="240" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="存贷比" prop="dpsLoanRatio" width="120" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="所属客户群存贷比" prop="dpsLoanRatioGroup" width="180" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="考核关联人" prop="appraiseUserName" width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
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
  name: "LegalPersonBusiInfo",
})
export default class extends Vue {
  @Ref("searchForm") searchForm: any;
  @Ref("refTable") refTable: any;
  private dataUrl = backend.custService + "/api/custbusiness/querycstbusi";
  private etlDate = sessionStorage.getItem("dataDt");
  private queryFormData = {
    etlDate: this.etlDate,
  };

  private baseParams = {
    condition: JSON.stringify({
      etlDate: this.etlDate,
    }),
  };

  private treeOptions = {
    showCheckbox: false,
    treeKey: "indstree",
    dataUrl: backend.custService + "/api/ocrmfcifqdbcol/indstree",
    dataId: "indsId",
    dataLabel: "indsNm",
    dataPid: "parentId",
    expandLevel: 1,
    level: "level",
    checkStrictly: true,
  };

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
    this.$checkCtr("export") && this.$exportQueue.addQueue(this.$route.path, this.exportFn);
  }

  customerViewFn(row: any) {
    this.$router.push({ path: "/custInfo/custView/" + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: "客户详情-" + row.custNm } });
  }

  exportFn(showTipModal?: boolean) {
    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      fileName: "法人客户业务信息统计表",
      queryField: this.searchForm.searchQueryField,
    });
    var apiParams = {
      url: backend.custService + "/api/custbusiness/exportquerycstbusi",
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
.table-header {
  padding-right: 10px;
  height: 25px;
  font-weight: bold;
}
</style>
