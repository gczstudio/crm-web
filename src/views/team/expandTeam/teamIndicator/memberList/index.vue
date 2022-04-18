<template>
  <div class="MemberList-component">
    <MainLayout is-tab>
      <template v-slot:header>
        <el-button icon="el-icon-download" v-permission="'exportMember'" @click="exportFn">导出</el-button>
      </template>
      <template v-slot:form>
        <yu-xform ref="searchForm" :model="queryFormData" related-table-name="refTable" form-type="search">
            <yu-xform-group :column="4">
              <yu-xform-item label="数据日期" name="etlDate" ctype="date-picker" placeholder="数据日期"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
      </template>
      <template v-slot:table>
        <yu-xtable ref="refTable" :data-url="dataUrl" row-number :base-params="baseParams" selection-type="checkbox" :dynamic-height="true" border>
          <yu-xtable-column label="团队名称" prop="teamNm" width="200" fixed="left" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="团队成员姓名" prop="mebNm" width="130" :show-overflow-tooltip="true" fixed="left" sortable="custom"></yu-xtable-column>
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
          <yu-xtable-column label="操作" width="140" fixed="right" align="center" v-permission="'viewMemberCust'">
            <template slot-scope="scope">
              <el-button class="yu-action-btn" @click.native.prevent="viewCustomer(scope.row)" type="text">查看客户</el-button>
            </template>
          </yu-xtable-column>
        </yu-xtable>
      </template>
    </MainLayout>
    <content-modal :visible.sync="contentVisible">
      <template slot-scope="scope">
        <member-cust-list :instance="scope" :row="currentRow" />
      </template>
    </content-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";
import { backend } from '@/config';
import moment from "moment";
import MemberCustList from '../memberCustList/index.vue'
@Component({
  name: "MemberList",
  components: {
    MemberCustList
  }
})
export default class extends Vue {
  @Ref('searchForm') searchForm: any;
  @Ref('refTable') refTable: any;
  private dataDt = sessionStorage.getItem('dataDt');
  private dataUrl = backend.teamCenter + '/api/custteam/querytmebinfo';
  private queryFormData = {
    etlDate: moment(this.dataDt).format('YYYY-MM-DD')
  }
  private baseParams = {
    condition: JSON.stringify({
      etlDate: moment(this.dataDt).format('YYYY-MM-DD')
    })
  }
  private contentVisible = false
  private currentRow = {}

  mounted () {
    this.$checkCtr('exportMember') && this.$exportQueue.addQueue(this.$route.path, this.exportFn, true);
  }

  viewCustomer(row: any) {
    this.currentRow = {
      ...row,
      etlDate: this.queryFormData.etlDate
    };
    this.contentVisible = true;
  }

  exportFn (showTipModal?:boolean) {
    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      etlDate: moment(this.dataDt).format('YYYY-MM-DD'),
      fileName: '团队成员列表',
      queryField: this.searchForm.searchQueryField,
    });
    var apiParams = {
      url: backend.teamCenter + '/api/custteam/exportquerytmebinfo',
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

