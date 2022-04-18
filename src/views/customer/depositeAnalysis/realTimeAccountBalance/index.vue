<template>
  <div class="CustMgt-container">
    <div class="yu-main-wrapper">
      <MainLayout>
        <template v-slot:form>
          <yu-xform ref="searchForm" class="search" :model="queryFormData" form-type="search" :search="searchFn" :need-export="true">
            <yu-xform-group :column="4">
              <yu-xform-item label="客户名称" placeholder="客户名称" ctype="input" name="custNm" :rules="globalRules.input"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number :dynamic-height="true" border>
            <yu-xtable-column label="客户名称" prop="custNm" width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
               <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{scope.row.custNm}}</div>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="核心客户号" prop="custId" width="120" :show-overflow-tooltip="true" fixed="left" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="统一社会信用代码" prop="socialCode" width="180" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="组织机构代码" prop="insCredCode" width="130" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="客户类型" prop="custType" width="120" :show-overflow-tooltip="true" data-code="CUST_TYPE_MIS" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="企业规模" prop="entScale" width="120" :show-overflow-tooltip="true" data-code="ENT_SCALE_MIS" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="国标行业（一级）" prop="natStdIndsOne" width="180" :show-overflow-tooltip="true" data-code="NAT_STD_INDS1_MIS" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="国标行业（二级）" prop="natStdIndsTwo" width="160" :show-overflow-tooltip="true" data-code="NAT_STD_INDS2_MIS" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="国标行业（三级）" prop="natStdIndsThree" width="160" :show-overflow-tooltip="true" data-code="NAT_STD_INDS3_MIS" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="注册资本（元）" prop="regCapital" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="总资产（元）" prop="totalAssets" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="营业收入（元）" prop="busiIncom" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="是否上市公司" prop="listFlg" width="130" :show-overflow-tooltip="true" :options="yesNoOptions" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="是否集团客户" prop="groupCustFlg" width="130" :show-overflow-tooltip="true" :options="yesNoOptions" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="是否本行股东" prop="ownerFlg" width="130" :show-overflow-tooltip="true" :options="yesNoOptions" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="是否科技型企业" prop="techCorFlg" width="140" :show-overflow-tooltip="true" :options="yesNoOptions" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="是否高新技术企业" prop="hignTechFlg" width="160" :show-overflow-tooltip="true" :options="yesNoOptions" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="是否战略新兴产业" prop="stratEmerFlg" width="160" :show-overflow-tooltip="true" :options="yesNoOptions" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="是否绿色企业" prop="greenEntFlg" width="130" :show-overflow-tooltip="true" :options="yesNoOptions" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="是否两高一剩行业" prop="thorFlg" width="160" :show-overflow-tooltip="true" :options="yesNoOptions" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="是否异地客户" prop="remtCstFlg" width="130" :show-overflow-tooltip="true" :options="yesNoOptions" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="是否网银客户" prop="onbankCstFlg" width="130" :show-overflow-tooltip="true" :options="yesNoOptions" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="主管机构" prop="blgOrgNm" width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="主管客户经理" prop="blgMgrNm" width="130" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="操作" width="120" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button class="yu-action-btn" @click.native.prevent="searchAccountFn(scope.row)" type="text">账户列表</el-button>
              </template>
            </yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import { backend } from '@/config'
import { getUserInfo } from '@/utils'

@Component({
  name: "RealTimeAccountBalance",
})
export default class extends Vue {
  @Ref('searchForm') searchForm: any;
  @Ref('refTable') refTable: any;
  private dataUrl = backend.custService + '/api/custquery/managecustlist'
  private queryFormData = {}
  private yesNoOptions = [
    { key: '1', value: '是'},
    { key: '0', value: '否'},
  ]
  private userInfo = getUserInfo()

  searchFn() {
    let params = {
      condition: JSON.stringify(this.queryFormData)
    }
    this.refTable.remoteData(params)
  }

  searchAccountFn(row: any) {
    this.$router.push({ path: '/custInfo/accountList/' + row.crmCustId, query: { title: '账户列表-' + row.custNm }})
  }

  customerViewFn(row: any) {
    this.$router.push({ path: '/custInfo/custView/' + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: '客户详情-' + row.custNm }})
  }
}
</script>
