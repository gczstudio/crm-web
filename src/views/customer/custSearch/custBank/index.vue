<template>
  <div class="CustBank-container">
    <div class="yu-main-wrapper">
      <MainLayout>
        <template v-slot:form>
          <yu-xform ref="searchForm" class="search" :model="queryFormData" form-type="search" related-table-name="refTable">
            <yu-xform-group :column="4">
              <yu-xform-item label="客户名称" placeholder="客户名称" ctype="input" name="custNm" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="核心客户号" placeholder="核心客户号" ctype="input" name="custId" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="统一社会信用代码" placeholder="统一社会信用代码" ctype="input" name="socialCode" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="组织机构代码" placeholder="组织机构代码" ctype="input" name="insCredCode" :rules="globalRules.input"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number :dynamic-height="true" border :default-load="false">
            <yu-xtable-column label="客户名称" prop="custNm" min-width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
               <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{scope.row.custNm}}</div>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="核心客户号" prop="custId" min-width="120" :show-overflow-tooltip="true" fixed="left" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="统一社会信用代码" prop="socialCode" min-width="200" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="组织机构代码" prop="insCredCode" min-width="120" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="客户类型" prop="custType" min-width="120" :show-overflow-tooltip="true" data-code="CUST_TYPE_MIS" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="企业规模" prop="entScale" min-width="120" :show-overflow-tooltip="true" data-code="ENT_SCALE_MIS" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="国标行业（一级）" prop="natStdIndsOne" min-width="200" :show-overflow-tooltip="true" data-code="NAT_STD_INDS1_MIS" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="是否在我行开户" prop="openAcctFlg" min-width="140" :show-overflow-tooltip="true" data-code="YESNO" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="开户数量" prop="openAcctNum" min-width="120" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="是否授信客户" prop="isCreditCust" min-width="140" :show-overflow-tooltip="true" data-code="YESNO" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="开户机构" prop="openOrgNmCore" min-width="180" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="操作" width="100" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button class="yu-action-btn" @click.native.prevent="customerViewFn(scope.row)" type="text">客户视图</el-button>
              </template>
            </yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from "vue-property-decorator";
import { backend } from '@/config'
import lookup from '@/utils/lookup'
import { CommonModule } from '@/store/modules/common'

@Component({
  name: "CustBank",
})
export default class extends Vue {
 
  @Ref('refTable') refTable: any;
  private dataUrl = backend.custService + '/api/custquery/allcustlist'
  private queryFormData = {}

  beforeRouteEnter (to:any, from:any, next:any) {
    lookup.bind('YESNO', () => {
      next()
    }) 
  }

  @Watch("$route")
  private onRouteChange() {
    if (this.$route.params.keyword) {
      this.refTable.remoteData({
        condition: JSON.stringify({
          homeSearch: this.$route.params.keyword
        })
      })
    }
  }

  mounted() {
    if(this.$route.params.keyword) {
       this.refTable.remoteData({
        condition: JSON.stringify({
          homeSearch: this.$route.params.keyword
        })
      })
    } else {
      this.refTable.remoteData()
    }
  }

  customerViewFn(row: any) {
    this.$router.push({ path: '/custInfo/custView/' + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: '客户详情-' + row.custNm }})
  }
}
</script>
