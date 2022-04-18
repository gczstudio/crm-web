<template>
  <div class="CustList-container">
    <div class="yu-main-wrapper">
      <MainLayout :title="row.tagNm">
        <template v-slot:header>
          <el-button icon="el-icon-plus" @click="addFn" v-permission="'addCust'">添加客户</el-button>
          <el-button icon="el-icon-upload2" @click="uploadFn" v-permission="'uploadCust'">导入客户</el-button>
          <el-button icon="el-icon-download" @click="downTempFn" v-permission="'downloadTemp'">模板下载</el-button>
          <el-button icon="el-icon-delete" @click="deleteFn" v-permission="'deleteCust'">删除客户</el-button>
          <el-button icon="el-icon-close" @click="closeFn">关闭</el-button>
        </template>
        <template v-slot:form>
          <yu-xform ref="searchForm" :model="queryFormData" :search="searchFn" form-type="search" :need-export="true">
            <yu-xform-group :column="4">
              <yu-xform-item label="标签值" placeholder="标签值" ctype="select" name="tagItemCode" :options="tagValues" multiple></yu-xform-item>
              <yu-xform-item label="客户名称" placeholder="客户名称" ctype="input" name="custNm" :rules="globalRules.input"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number :base-params="baseParams" selection-type="checkbox" :dynamic-height="true" border>
            <yu-xtable-column label="客户名称" prop="custNm" min-width="200" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
               <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{scope.row.custNm}}</div>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="核心客户号" prop="custId" min-width="120" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="标签名称" prop="tagNm" min-width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="标签值" prop="itemCodeNm" min-width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="导入时间" prop="creatorTime" min-width="130" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="导入人" prop="creatorNm" min-width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
    <create-tag-customer-modal :visible.sync="visible" :data="row" :tag-values="tagValues" @success="successFn" />
    <upload-excel :visible.sync="uploadVisible" @success="successFn" :options="uploadOptions"></upload-excel>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";
import { backend } from '@/config'
import * as customerApi from '@/api/customer'
import CreateTagCustomerModal from './components/CreateTagCustomerModal/index.vue'
@Component({
  name: "CustList",
  components: {
    CreateTagCustomerModal
  }
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
  private visible = false;
  private uploadVisible = false;
  private tagValues = []
  private uploadOptions = {
    url: backend.custService + "/api/ocrmftagcust/importexcel",
    exportUrl: backend.custService + '/api/ocrmftagcust/exporterrortagcust',
    uploadType: true,
    params: {
      tagNo: this.row.tagNo
    }
  }

  @Watch('row', { immediate: true})
  onRowChange() {
    this.getTagValue();
  }

  mounted () {
    // this.$exportQueue.addQueue(this.$route.path, this.exportFn)
  }

  customerViewFn(row: any) {
    this.$router.push({ path: '/custInfo/custView/' + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: '客户详情-' + row.custNm }})
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

  closeFn () {
    this.instance.hide();
  }

  addFn () {
    this.visible = true;
  }

  // 添加客户成功
  successFn () {
   this.refTable.remoteData();
  }

  deleteFn () {
    let selections = this.refTable.selections;
    if(!selections.length) {
      this.$message.warning('请至少选择一条数据！');
      return;
    }
    this.$confirm('此操作将删除所选客户, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      callback: (action) => {
        if (action === 'confirm') {
          let ids = selections.map((item: any) => item.id).join(',');
          customerApi.deltagcust({ids}).then(res => {
            this.$message.success('删除成功！');
            this.refTable.remoteData();
          })
        }
      }
    });
    
  }

  downTempFn () {
    this.$util.downFile({
      url: backend.custService + '/api/ocrmftagcust/downloadtemplate',
      method: "get",
      fileName: "标签客户模板.xlsx",
    });
  }

  uploadFn () {
    this.uploadVisible = true;
  }


  exportFn (showTipModal?:boolean) {
    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      fileName: '标签客户列表',
      tagItemCode: this.searchForm.searchModel.tagItemCode.join(','),
      tagNo: this.row.tagNo,
      queryField: this.searchForm.searchQueryField
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
