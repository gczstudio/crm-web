<template>
  <div class="tradeReduceWarn-component">
    <MainLayout :title="title">
      <template v-slot:header>
        <el-button icon="el-icon-download" v-permission="'exportTrade'" @click="exportFn">导出</el-button>
        <el-button icon="el-icon-close" @click="closeFn">关闭</el-button>
      </template>
      <template v-slot:form>
        <yu-xform ref="searchForm" :model="queryFormData" :search="searchFn" form-type="search">
          <yu-xform-group :column="4">
            <yu-xform-item label="客户名称" placeholder="客户名称" ctype="input" name="custName" :rules="globalRules.input"></yu-xform-item>
            <yu-xform-item label="开始日期" name="dateStart" ctype="date-picker" placeholder="提醒日期" :picker-options="startPickerOptions"></yu-xform-item>
            <yu-xform-item label="结束日期" name="dateEnd" ctype="date-picker" placeholder="提醒日期" :picker-options="endPickerOptions"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>
      <template v-slot:table>
        <div style="padding-top: 16px;">
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number selection-type="checkbox" :dynamic-height="true" border :default-load="false">
            <yu-xtable-column label="客户名称" prop="custName" width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
                <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{scope.row.custName}}</div>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="核心客户号" prop="custId" width="120" :show-overflow-tooltip="true" fixed="left" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="组织机构代码" prop="insCredCode" width="130" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="上上月交易笔数" prop="lsSettNum" width="200" align="right" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="上月交易笔数" prop="settNum" width="200" align="right" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="交易笔数降幅（%）" prop="settNumDecline" width="200" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="上上月交易金额（元）" prop="lsSettAmt" width="200" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="上月交易金额（元）" prop="settAmt" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="交易金额降幅（%）" prop="settAmtDecline" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="存款余额（元）" prop="custBal" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="存款日均（元）" prop="custAvgBal" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="信贷余额（元）" prop="xdLoanBal" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="贷款余额（元）" prop="loanBal" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="主管客户经理" prop="mgrNm" width="170" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="主管机构" prop="orgNm" width="170" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="提醒日期" prop="remindDate" width="120" fixed="right" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          </yu-xtable>
        </div>
      </template>
    </MainLayout>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from "vue-property-decorator";
import { backend } from '@/config';
@Component({
  name: "TradeReduceWarn",
})
export default class extends Vue {
  @Prop() private instance!: any;
  @Prop() private title!: any;
  @Prop() private isMark!: any;
  @Ref('refTable') refTable: any;
  @Ref('searchForm') searchForm: any;
  private dataUrl = backend.mgrMkt + '/api/mkcustmbse/querymbse';
  private queryFormData: any = {}
  private startPickerOptions = {
    disabledDate: (time: Date) => {
      if (this.queryFormData.dateEnd) {
        return time.getTime() >= new Date(this.queryFormData.dateEnd).getTime();
      }
    }
  }

  private endPickerOptions = {
    disabledDate: (time: Date) => {
      if (this.queryFormData.dateStart) {
        return time.getTime() <= new Date(this.queryFormData.dateStart).getTime() - 86400000;
      }
    }
  }

  mounted () {
    this.getTableData()
    this.$checkCtr('exportTrade') && this.$exportQueue.addQueue(this.$route.path, this.exportFn, true);
  }

  async searchFn() {
    this.$emit('mark-change', '1')
    await this.$nextTick()
    this.getTableData()
  }

  getTableData() {
    this.refTable.remoteData({
      condition: JSON.stringify({
        ...this.queryFormData,
        isMark: this.isMark
      })
    })
  }

  customerViewFn(row: any) {
    this.$router.push({ path: '/custInfo/custView/' + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: '客户详情-' + row.custName }})
  }

  closeFn () {
    this.$emit('mark-change', '1')
    this.instance.hide();
  }

  exportFn (showTipModal?:boolean) {

    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      fileName: '交易减少预警',
      queryField: this.searchForm.searchQueryField,
      isMark: this.isMark
    });

    var apiParams = {
      url: backend.mgrMkt + '/api/mkcustmbse/exportquerymbse',
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

