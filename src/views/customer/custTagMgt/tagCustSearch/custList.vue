<template>
  <div class="CustList-container">
    <div class="yu-main-wrapper">
      <MainLayout :title="row.tagNm">
        <template v-slot:header>
          <el-button icon="el-icon-download" @click="exportFn" v-permission="'export'">导出</el-button>
          <el-button icon="el-icon-close" @click="closeFn">关闭</el-button>
        </template>
        <template v-slot:form>
          <yu-xform ref="searchForm" class="search" :model="queryFormData" :search="searchFn" form-type="search" :need-export="true">
            <yu-xform-group :column="4">
              <yu-xform-item label="标签值" placeholder="标签值" ctype="select" name="tagItemCode" :options="tagValues" multiple></yu-xform-item>
              <yu-xform-item label="客户名称" placeholder="客户名称" ctype="input" name="custNm" :rules="globalRules.input"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number :base-params="baseParams" :dynamic-height="true" border>
            <yu-xtable-column label="客户名称" prop="custName" width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
               <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{scope.row.custNm}}</div>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="核心客户号" prop="custId" width="120" is-num :show-overflow-tooltip="true" fixed="left" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="国标行业" prop="natStdIndsOne" min-width="180" :show-overflow-tooltip="true" data-code="NAT_STD_INDS_MIS" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="客户类型" prop="custType" min-width="180" :show-overflow-tooltip="true" data-code="CUST_TYPE_MIS" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="企业规模" prop="entScale" min-width="120" :show-overflow-tooltip="true" data-code="ENT_SCALE_MIS" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="存款余额（元）" prop="custBal" min-width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="存款日均（元）" prop="custAvgBal" min-width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="贷款余额（元）" prop="loanBal" min-width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="FTP利润（元）" prop="ftpProfitBalnc" min-width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="中间业务收入（元）" prop="midBizInc" min-width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="主管机构" prop="blgOrgNm" min-width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from "vue-property-decorator";
import { backend } from '@/config'
import * as customerApi from '@/api/customer'

@Component({
  name: "CustList",
})
export default class extends Vue {
  @Prop() private instance!: any;
  @Prop() private row!: any;
  @Ref('searchForm') searchForm: any;
  @Ref('refTable') refTable: any;
  private dataUrl = backend.custService + '/api/ocrmftagcust/tagcustquery'
  private queryFormData = {
    tagItemCode: []
  }
  private baseParams = {
    condition: JSON.stringify({
      tagNo: this.row.tagNo
    })
  }
  private tagValues = []

  created () {
    this.getTagValue();
  }

  mounted () {
    this.$checkCtr('export') && this.$exportQueue.addQueue(this.$route.path, this.exportFn);
  }

  searchFn () {
    let params = {
      condition: JSON.stringify({
        ...this.queryFormData,
        tagItemCode: this.queryFormData.tagItemCode.join(',')
      })
    }
    this.refTable.remoteData(params);
  }

  // 获取当前标签的标签值
  getTagValue () {
    customerApi.querytagvalue({
      condition: JSON.stringify({
        tagNo: this.row.tagNo,
        isFlag: '1'
      })
    }).then(res => {
      this.tagValues =  res.data.map((item: any) => {
        return {
          key: item.tagItemCode,
          value: item.itemCodeNm
        }
      });
    })
  }

  customerViewFn(row: any) {
    this.$router.push({ path: '/custInfo/custView/' + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: '客户详情-' + row.custNm }})
  }

  closeFn () {
    this.instance.hide();
  }

  exportFn (showTipModal?:boolean) {
    let queryField =  (this as any).$util.formatQueryField([ 
      { cnName: "标签编号", value: this.row.tagNo }
    ])
    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      fileName: '标签客户列表',
      tagNo: this.row.tagNo,
      tagItemCode: this.searchForm.searchModel.tagItemCode.join(','),
      queryField: queryField + this.searchForm.searchQueryField
    });
    var apiParams = {
      url: backend.custService + '/api/ocrmftagcust/exporttagcustquery',
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
