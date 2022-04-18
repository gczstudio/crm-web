<template>
  <div class="quitEffectCust-container">
    <MainLayout>
      <template v-slot:header>
        <el-button icon="el-icon-download" @click="exportFn" v-permission="'export'">导出</el-button>
      </template>
      <template v-slot:form>
        <yu-xform ref="searchForm" :model="queryFormData" related-table-name="refTable" form-type="search">
          <yu-xform-group :column="4">
            <yu-xform-item label="开始日期" name="startDate" ctype="date-picker" placeholder="开始日期" :picker-options="startPickerOptions" :rules="globalRules.required"></yu-xform-item>
            <yu-xform-item label="结束日期" name="endDate" ctype="date-picker" placeholder="结束日期" :picker-options="endPickerOptions" :rules="globalRules.required"></yu-xform-item>
            <yu-xform-item label="查询口径" name="type" ctype="select" placeholder="查询口径" data-code="DIMENSION_TYPE" @change="typeChangeFn" :rules="globalRules.required" :clearable="false"></yu-xform-item>
            <yu-xform-item label="主管机构" v-if="queryFormData.type==='1'" placeholder="主管机构" ctype="yufp-org-tree" name="orgCode" :rules="globalRules.input"></yu-xform-item>
            <yu-xform-item label="考核机构" v-else placeholder="考核机构" ctype="yufp-org-tree" name="orgCode" :rules="globalRules.input"></yu-xform-item>
            <yu-xform-item label="考核条线" placeholder="考核条线" name="busiLine" ctype="select" data-code="BUINESS_LINE"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>
      <template v-slot:table>
        <yu-xtable ref="refTable" :data-url="dataUrl" row-number :dynamic-height="true" border :default-load="false">
          <yu-xtable-column label="客户名称" prop="custNm" width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom">
            <template slot-scope="scope">
              <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{scope.row.custNm}}</div>
            </template>
          </yu-xtable-column>
          <yu-xtable-column label="核心客户号" prop="custId" width="120" :show-overflow-tooltip="true" fixed="left" is-num sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="组织机构代码" prop="insCredCode" width="150" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="考核条线" prop="busiLine" width="120" data-code="BUINESS_LINE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="期初存款余额（元）" prop="openDeptBal" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="期初存款日均（元）" prop="openDeptBalAvg" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="期初信贷余额（元）" prop="openXdLoanBal" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="期初贷款余额（元）" prop="openLoanBal" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="期末存款余额（元）" prop="closeDeptBal" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="期末存款日均（元）" prop="closeDeptBalAvg" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="期末信贷余额（元）" prop="closeXdLoanBal" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="期末贷款余额（元）" prop="closeLoanBal" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="存款余额增量（元）" prop="deptBalChg" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="存款日均增量（元）" prop="deptBalAvgChg" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="信贷余额增量（元）" prop="xdLoanBalChg" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="贷款余额增量（元）" prop="loanBalChg" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column v-if="queryFormData.type==='1'" label="主管机构" prop="orgNm"  width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column v-else label="考核机构" prop="appraiseOrgNm" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
        </yu-xtable>
      </template>
    </MainLayout>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { backend } from '@/config'
import moment from 'moment';
@Component({
  name: 'QuitEffectCust',
  components: {
  }
})
export default class extends Vue {
  @Ref('searchForm') searchForm: any;
  @Ref('refTable') refTable: any;
  private dataUrl = backend.custService + '/api/custchganaly/exitvalidcustlist'
  private queryFormData = {
    startDate: '',
    endDate: '',
    type: '1'
  }


  private startPickerOptions = {
    disabledDate: (time: Date) => {
      if (this.queryFormData.endDate) {
        return time.getTime() >= new Date(this.queryFormData.endDate).getTime();
      }
    }
  }

  private endPickerOptions = {
    disabledDate: (time: Date) => {
      if (this.queryFormData.startDate) {
        return time.getTime() <= new Date(this.queryFormData.startDate).getTime() - 86400000;
      }
    }
  }

  customerViewFn(row: any) {
    this.$router.push({ path: '/custInfo/custView/' + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: '客户详情-' + row.custNm }})
  }

  mounted () {
    this.$checkCtr('export') && this.$exportQueue.addQueue(this.$route.path, this.exportFn)
  }

  typeChangeFn(val:string) {
    this.refTable.clearTable()
  }

  exportFn (showTipModal?:boolean) {
    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      fileName: '退出有效客户查询',
      queryField: this.searchForm.searchQueryField,
    });
    var apiParams = {
      url: backend.custService + '/api/custchganaly/exportexitvalidcust',
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
