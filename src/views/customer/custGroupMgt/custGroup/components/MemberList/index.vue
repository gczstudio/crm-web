<template>
  <div class="MemberList-component">
    <MainLayout is-tab>
      <template v-slot:header>
        <el-button icon="el-icon-download" @click="exportFn" v-permission="'exportMember'">导出</el-button>
        <el-button icon="el-icon-close" @click="closeFn">关闭</el-button>
      </template>
      <template v-slot:form>
        <yu-xform ref="searchForm" :model="queryFormData" related-table-name="refTable" form-type="search">
            <yu-xform-group :column="4">
              <yu-xform-item label="数据日期" name="etlDate" ctype="date-picker" placeholder="数据日期" disabled></yu-xform-item>
              <yu-xform-item label="成员名称" placeholder="成员名称" ctype="input" name="custNm" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="核心客户号" placeholder="核心客户号" ctype="input" name="custId" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="组织机构代码" placeholder="组织机构代码" ctype="input" name="insCredCode" :rules="globalRules.input" ></yu-xform-item>
              <yu-xform-item label="主管客户经理" placeholder="主管客户经理" ctype="yufp-customer-modal" selection-type="radio" name="blgMgrNo" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="主管机构" placeholder="主管机构" ctype="yufp-org-tree" name="blgOrgNo" :rules="globalRules.input"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
      </template>
      <template v-slot:table>
        <yu-xtable ref="refTable" :data-url="dataUrl" row-number :base-params="baseParams" selection-type="checkbox" :dynamic-height="true" border>
          <yu-xtable-column label="成员名称" prop="custNm" min-width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom">
            <template slot-scope="scope">
            <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{scope.row.custNm}}</div>
            </template>
          </yu-xtable-column>
          <yu-xtable-column label="核心客户号" prop="custId" width="120" is-num :show-overflow-tooltip="true" fixed="left" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="组织机构代码" prop="insCredCode" width="130" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="存款余额（元）" prop="custBal" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="存款日均（元）" prop="custBalAvg" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="信贷余额（元）" prop="xdLoanBal" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="贷款余额（元）" prop="loanBal" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="EVA（元）" prop="eva" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="业务利润（元）" prop="profitContribution" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="FTP利润（元）" prop="ftpProfitBalnc" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="中间业务收入（元）" prop="midBizInc" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="存款付息率（%）" prop="avgDpsRate" width="170" align="right" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="平均贷款利率（%）" prop="avgLneRate" width="170" align="right" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="授信总额（元）" prop="creditAmt" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="已使用授信额度（元）" prop="usedCreditAmt" width="190" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="授信敞口额度（元）" prop="creditExposureAmt" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="已使用敞口额度（元）" prop="userdCreditExposureAmt" width="190" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="是否存在未结清业务或有效授信" prop="isCreditCust" width="250" data-code="YESNO" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="主管客户经理" prop="blgMgrNm" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="主管机构" prop="blgOrgNm" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
        </yu-xtable>
      </template>
    </MainLayout>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Ref, Vue, Watch } from "vue-property-decorator";
import { backend } from '@/config';
@Component({
  name: "MemberList",
})
export default class extends Vue {
  @InjectReactive() readonly row!: any;
  @Prop({default: false }) private visible!: boolean;
  @Ref('searchForm') searchForm: any;
  @Ref('refTable') refTable: any;
  @Prop() private instance!: any;
  private queryFormData = {};
  private dataUrl = backend.custService + '/api/crowdmember/querycrowdmem';
  private baseParams = {}

  created () {
    const { custGroupId, etlDate } = this.row;
    this.baseParams = {
      condition: JSON.stringify({
        custGroupId,
        etlDate
      })
    }
    this.queryFormData = {
      etlDate
    }
  }

  mounted () {
    this.$checkCtr('exportMember') && this.$exportQueue.addQueue(this.$route.path, this.exportFn, true);
  }

  sureFn () {
    this.$emit('success');
  }

  customerViewFn(row: any) {
    this.$router.push({ path: '/custInfo/custView/' + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: '客户详情-' + row.custNm }})
  }

  exportFn (showTipModal?:boolean) {

    let queryField =  (this as any).$util.formatQueryField([ 
      { cnName: '客户群名称', value: this.row.custGroupNm},
      { cnName: '数据日期', value: this.searchForm.searchModel.etlDate}
    ])

    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      fileName: '群成员列表',
      queryField: queryField + this.searchForm.searchQueryField,
      custGroupId: this.row.custGroupId
    });
    var apiParams = {
      url: backend.custService + '/api/crowdmember/exportcrowdmem',
      params: searchQuery,
      sort: this.refTable.sort
    };
    (this as any).$util.exportTable({
      _this: this,
      apiParams,
      showTipModal
    });
  }

  closeFn () {
    this.instance.hide();
  }

  destroyed () {
    this.$exportQueue.removeQueue(this.$route.path, true);
  }


}
</script>

