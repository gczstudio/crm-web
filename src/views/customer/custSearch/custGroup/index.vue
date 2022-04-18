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
              <yu-xform-item label="数据日期" placeholder="数据日期" name="etlDate" ctype="date-picker" :rules="globalRules.required" :clearable="false"></yu-xform-item>
              <yu-xform-item label="集团名称" placeholder="集团名称" ctype="input" name="groupName" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="集团简称" placeholder="集团简称" ctype="input" name="groupabbName" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="管户人名称" placeholder="管户人名称" ctype="input" name="userName" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="管户人编号" placeholder="管户人编号" ctype="input" name="userId" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="管户人机构" placeholder="管户人机构" ctype="yufp-org-tree" name="orgId"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" :base-params="baseParams" row-number :dynamic-height="true" border>
            <yu-xtable-column label="集团名称" prop="groupName" width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="集团简称" prop="groupabbName" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="存款余额（元）" prop="custBal" width="140" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="存款日均（元）" prop="custBalAvg" width="140" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="信贷余额（元）" prop="xdLoanBal" width="140" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="贷款余额（元）" prop="loanBal" width="140" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="EVA（元）" prop="eva" width="120" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="业务利润（元）" prop="profitContribution" width="140" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="FTP利润（元）" prop="ftpProfitBalnc" width="140" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="中间业务收入（元）" prop="midBizInc" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="授信总额（元）" prop="creditAmt" width="140" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="已使用授信额度（元）" prop="usedCreditAmt" width="190" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="授信敞口额度（元）" prop="creditExposureAmt" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="已使用敞口额度（元）" prop="userdCreditExposureAmt" width="190" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="集团客户综合授信到期日" prop="dueDate"  width="220" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="集团类别" prop="groupType" width="120" data-code="GROUP_TYPE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="管户人名称" prop="userName" width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="管户人机构" prop="orgName" width="140" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="操作" width="100" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button class="yu-action-btn" @click.native.prevent="memberListFn(scope.row)" type="text">成员列表</el-button>
              </template>
            </yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
    <content-modal :visible.sync="visible">
      <template slot-scope="scope">
         <member-list :instance="scope" :visible="visible" :row="currentRow" />
      </template>
    </content-modal>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import { backend } from '@/config';
import moment from 'moment';
import MemberList from './memberList.vue'
@Component({
  name: "CustGroup",
  components: {
    MemberList
  }
})
export default class extends Vue {
  @Ref('searchForm') searchForm: any;
  @Ref('refTable') refTable: any;
  private dataUrl = backend.custService + '/api/groupcust/groupquery'
  private dataDt = sessionStorage.getItem('dataDt');
  private queryFormData = {
    etlDate: moment(this.dataDt).format('YYYY-MM-DD')
  }
  private baseParams = {
    condition: JSON.stringify({
      etlDate: moment(this.dataDt).format('YYYY-MM-DD')
    })
  }
  private visible = false;
  private currentRow = {}

  mounted () {
    this.$checkCtr('export') && this.$exportQueue.addQueue(this.$route.path, this.exportFn, true)
  }

  customerViewFn(row: any) {
    this.$router.push({ path: '/custInfo/custView/' + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: '客户详情-' + row.custNm }})
  }

  memberListFn (row: any) {
    row.etlDate = this.searchForm.searchModel.etlDate;
    this.currentRow = row;
    this.visible = true;
  }

  exportFn (showTipModal?:boolean) {
    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      fileName: '集团客户查询',
      queryField: this.searchForm.searchQueryField
    });
    var apiParams = {
      url: backend.custService + '/api/groupcust/exportgroupquery',
      params: searchQuery,
      sort: this.refTable.sort
    };
    (this as any).$util.exportTable({
      _this: this,
      apiParams,
      showTipModal
    });
  }

}
</script>
