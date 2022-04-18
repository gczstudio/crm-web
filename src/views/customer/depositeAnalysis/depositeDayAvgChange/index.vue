<template>
  <div class="depositeDayAvgChange-container">
    <div class="yu-main-wrapper">
      <MainLayout>
        <template v-slot:header>
          <el-button icon="el-icon-download" @click="exportFn" v-permission="'export'">导出</el-button>
        </template>
        <template v-slot:form>
          <yu-xform ref="searchForm" class="search" :model="queryFormData" :search="searchFn" form-type="search" :need-export="true">
            <yu-xform-group :column="4">
              <yu-xform-item label="开始日期" name="startDate" ctype="date-picker" placeholder="开始日期" :picker-options="startPickerOptions" :rules="globalRules.required"></yu-xform-item>
              <yu-xform-item label="结束日期" name="endDate" ctype="date-picker" placeholder="结束日期" :picker-options="endPickerOptions" :rules="globalRules.required"></yu-xform-item>
              <yu-xform-item label="查询口径" name="type" ctype="select" placeholder="查询口径" data-code="DIMENSION_TYPE" @change="typeChangeFn" :rules="globalRules.required" :clearable="false"></yu-xform-item>
              <yu-xform-item label="主管机构" v-if="queryFormData.type==='1'" placeholder="主管机构" ctype="yufp-org-tree" name="orgCode" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="考核机构" v-else placeholder="考核机构" ctype="yufp-org-tree" name="orgCode" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="考核条线" placeholder="考核条线" name="busiLine" ctype="select" data-code="BUINESS_LINE"></yu-xform-item>
              <yu-xform-item label="存款日均变化额>=" :show-label-suffix="false" suffix-label="万元" suffix-label-width="28px" placeholder="存款日均变化额" ctype="input" name="chgAmt" :rules="globalRules.amountInput"></yu-xform-item>
              <yu-xform-item label="客户名称" placeholder="客户名称" ctype="input" name="custNm" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="核心客户号" placeholder="核心客户号" ctype="input" name="custId" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="组织机构代码" placeholder="组织机构代码" ctype="input" name="insCredCode" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="含同业科目" ctype="checkbox" name="isTy"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number :base-params="baseParams" :dynamic-height="true" border :default-load="false">
            <yu-xtable-column label="客户名称" prop="custNm" width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
               <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{scope.row.custNm}}</div>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="核心客户号" prop="custId" width="120" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="组织机构代码" prop="insCredCode" width="130" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="考核条线" prop="busiLine" width="120" data-code="BUINESS_LINE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="企业规模" prop="entScale" min-width="120" data-code="ENT_SCALE_MIS" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="国标行业" prop="natStdIndsOne" min-width="200" data-code="NAT_STD_INDS1_MIS" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <template v-if="queryFormData.isTy == '1'">
              <yu-xtable-column label="期初存款日均（元）" prop="openCustBalAvg" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="期末存款日均（元）" prop="closeCustBalAvg" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="存款日均变化额（元）" prop="chgCustBalAvg" width="200" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            </template>
            <template v-else>
              <yu-xtable-column label="期初存款日均（元）" prop="openCustBalOffTyAvg" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="期末存款日均（元）" prop="closeCustBalOffTyAvg" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="存款日均变化额（元）" prop="chgCustBalOffTyAvg" width="200" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            </template>
            <yu-xtable-column v-if="queryFormData.type==='1'" label="主管机构" prop="blgOrgNm"  width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column v-else label="考核机构" prop="orgNm" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="主管客户经理" prop="blgMgrNm"  width="160" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import { backend } from '@/config'
import moment from "moment";

@Component({
  name: "DepositeDayAvgChange",
})
export default class extends Vue {
  @Ref('searchForm') searchForm: any;
  @Ref('refTable') refTable: any;
  private dataUrl = backend.custService + '/api/custdepavgchg/list'
  private queryFormData:any = {
    type: '1'
  }
  private baseParams = {
    condition: JSON.stringify({
      type: '1'
    })
  }
  
  private startPickerOptions = {
    disabledDate:  (time: Date) => {
      if ((this.queryFormData as any).endDate) {
        return time.getTime() >= new Date((this.queryFormData as any).endDate).getTime();
      }
    }
  }

  private endPickerOptions = {
    disabledDate: (time: Date) => {
      if ((this.queryFormData as any).startDate) {
        return time.getTime() <= new Date((this.queryFormData as any).startDate).getTime() - 86400000;
      }
    }
  }

  mounted () {
    this.$checkCtr('export') && this.$exportQueue.addQueue(this.$route.path, this.exportFn)
  }

  searchFn() {
    let params = {
      ...this.queryFormData,
      isTy: this.queryFormData.isTy ? '1' : null
    }
    this.refTable.remoteData({
      condition: JSON.stringify(params)
    })
  }

  typeChangeFn(val:string) {
    this.refTable.clearTable()
  }

  customerViewFn(row: any) {
    this.$router.push({ path: '/custInfo/custView/' + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: '客户详情-' + row.custNm }})
  }

  exportFn (showTipModal?:boolean) {
    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      fileName: '存款日均变化查询',
      queryField: this.searchForm.searchQueryField,
      isTy: this.queryFormData.isTy ? '1' : null
    });
    var apiParams = {
      url: backend.custService + '/api/custdepavgchg/export',
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
