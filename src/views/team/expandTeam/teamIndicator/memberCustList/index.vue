<template>
  <div class="memberCustList-component">
    <MainLayout :title="row.teamNm + '-' + row.mebNm">
      <template v-slot:header>
        <el-button icon="el-icon-download" v-permission="'exportMemberCust'" @click="exportFn">导出</el-button>
        <el-button icon="el-icon-close" @click="closeFn">关闭</el-button>
      </template>
      <template v-slot:form>
        <yu-xform ref="searchForm" :model="queryFormData" label-width="83px">
          <yu-xform-group :column="4">
            <yu-xform-item label="数据日期" name="etlDate" ctype="date-picker" placeholder="数据日期" disabled :clearable="false"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>
      <template v-slot:table>
        <yu-xtable ref="refTable" :data-url="dataUrl" row-number :base-params="baseParams" selection-type="checkbox" :dynamic-height="true" border>
          <yu-xtable-column label="客户名称" prop="custName" min-width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom">
            <template slot-scope="scope">
              <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{scope.row.custName}}</div>
            </template>
          </yu-xtable-column>
          <yu-xtable-column label="核心客户号" prop="custId" min-width="120" :show-overflow-tooltip="true" fixed="left" is-num sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="组织机构代码" prop="insCredCode" min-width="130" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="存款余额（元）" prop="custBal" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="存款余额增量（元）" prop="custBalLastYGr" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="存款日均（元）" prop="custBalAvg" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="存款日均增量（元）" prop="custBalAvgLastYGr" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="信贷余额（元）" prop="xdLoanBal" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="信贷余额增量（元）" prop="xdLoanBalLastYGr" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="贷款余额（元）" prop="loanBal" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="贷款余额增量（元）" prop="loanBalLastYGr" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="EVA（元）" prop="eva" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="业务利润（元）" prop="profitContribution" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="FTP利润（元）" prop="ftpProfitBalnc" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="中间业务收入（元）" prop="midBizInc" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="团队成员姓名" prop="mebNm" width="170" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
        </yu-xtable>
      </template>
    </MainLayout>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";
import { backend } from '@/config';
import moment from "moment";
@Component({
  name: "MemberCustList",
})
export default class extends Vue {
  @Prop() private instance!: any;
  @Prop() private row!: any;
  @Ref('searchForm') searchForm: any;
  @Ref('refTable') refTable: any;
  private dataDt = sessionStorage.getItem('dataDt');
  
  private dataUrl = backend.teamCenter + '/api/teammember/queryecust';
  private queryFormData = {}
  private baseParams = {}

  created () {
    const { mebId, teamId, etlDate } = this.row;
    this.queryFormData = {
      mebId,
      teamId,
      etlDate
    }
    this.baseParams = {
      condition: JSON.stringify(this.queryFormData)
    }
  }

  mounted () {
    this.$checkCtr('exportMemberCust') && this.$exportQueue.addQueue(this.$route.path, this.exportFn, true);
  }

  customerViewFn(row: any) {
    this.$router.push({ path: '/custInfo/custView/' + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: '客户详情-' + row.custName }})
  }

  closeFn () {
    this.instance.hide();
  }

  exportFn (showTipModal?:boolean) {
    const { mebId, teamId, etlDate } = this.row;
    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      etlDate: moment(etlDate).format('YYYY-MM-DD'),
      mebId,
      teamId,
      fileName: '成员客户指标',
      queryField: this.searchForm.searchQueryField,
    });

    var apiParams = {
      url: backend.teamCenter + '/api/teammember/exportqueryecust',
      params: searchQuery,
      sort: this.refTable.sort
    };
    (this as any).$util.exportTable({
      _this: this,
      apiParams,
      showTipModal
    });
  }

  destroyed () {
    this.$exportQueue.removeQueue(this.$route.path, true);
  }


}
</script>

<style lang="scss" scoped>
::v-deep.memberCustList-component {
  .el-input.is-disabled .el-input__inner, 
  .el-textarea.is-disabled .el-textarea__inner {
    background-color: #fff;
    color: #606266;
    border: 0;
    cursor: default;
  }
}

</style>

