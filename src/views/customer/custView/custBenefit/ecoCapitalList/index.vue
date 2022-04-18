<template>
  <div class="ecoCapitalList-container">
    <div class="yu-main-wrapper">
      <MainLayout  is-tab>
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
          <div class="total f3">信用风险经济资本占用合计：<span class="num">{{$util.formatMoney(creditRiskBalT)}}</span> 元</div>
          <yu-xtable ref="refTable" :data-url="dataUrl" :base-params="baseParams" :loadEnd="loadEndFn" :dynamic-height="true" border>
            <yu-xtable-column label="">
              <yu-xtable-column label="客户号" prop="custId" width="200" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="账号" prop="accoutNumber" width="200" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="科目" prop="glAccountId" width="200" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="产品类型" prop="commonCoaType" width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="业务条线" prop="department" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="余额" prop="curBookBal" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="各项减值准备" prop="cutBookBal" width="180" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="风险暴露" prop="riskExpos" width="150" :show-overflow-tooltip="true" align="right" format-money sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="风险缓释">
              <yu-xtable-column label="权重0%" prop="mitigantsBal_0" width="200" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="权重20%" prop="mitigantsBal_20" width="120" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="权重25%" prop="mitigantsBal_25" width="120" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="权重50%" prop="mitigantsBal_50" width="120" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="权重75%" prop="mitigantsBal_75" width="120" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="小计" prop="mitigantsBalTotal" width="160" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="">
              <yu-xtable-column label="未缓释的风险暴露" prop="nonReleRiskExpos" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="风险权重" prop="riskPower" width="120" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="调节前风险资产余额" prop="riskBal" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="调节系数">
              <yu-xtable-column label="信用评级" prop="coe1" width="120" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="期限" prop="coe2" width="120" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="担保方式" prop="coe3" width="120" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="企业规模" prop="coe4" width="120" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="贷款质量" prop="coe5" width="120" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="科技金融" prop="coe6" width="120" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="行业类型" prop="coe7" width="120" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="战略客户" prop="coe8" width="120" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
            <yu-xtable-column label="">
              <yu-xtable-column label="风险资产金额" prop="riskBalAjust" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="信用风险经济资本占用" prop="creditRiskBal" width="200" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            </yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { backend } from '@/config'
import moment from 'moment';
@Component({
  name: 'CustMIncome',
  components: {
  }
})
export default class extends Vue {
  @Ref('searchForm') searchForm: any;
  @Ref('refTable') refTable: any;
  private dataUrl = backend.custService + '/api/acrmfcioccinfo/occlist'
  private crmCustId = this.$route.query.crmCustId
  private dataDt = sessionStorage.getItem('dataDt');
  private queryFormData = {
    startDate: moment(this.dataDt).format('YYYY-MM-DD')
  }
  private baseParams = {
    condition: JSON.stringify({
      crmCustId: this.crmCustId,
      startDate: moment(this.dataDt).format('YYYY-MM-DD')
    })
  }
  private creditRiskBalT = 0

  mounted () {
    this.$exportQueue.addQueue(this.$route.path, this.exportFn)
  }

  loadEndFn (data:any) {
    this.creditRiskBalT = data[0]?.creditRiskBalT || 0
  }

  exportFn (showTipModal?:boolean) {
    let queryField =  (this as any).$util.formatQueryField([ 
      { cnName: "CRM内部客户号", value: this.crmCustId }
    ])

    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      fileName: '经济资本占用',
      queryField: queryField + this.searchForm.searchQueryField,
      crmCustId: this.crmCustId
    });

    var apiParams = {
      url: backend.custService + '/api/acrmfcioccinfo/exportocclist',
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

<style lang="scss" scoped>
  .ecoCapitalList-container {
    .total {
      padding: 0 16px 10px;
    }
  }
</style>
