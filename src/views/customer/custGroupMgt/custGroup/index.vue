<template>
  <div class="custGroup-container">
    <div class="yu-main-wrapper">
      <MainLayout>
        <template v-slot:header>
          <el-button icon="el-icon-plus" @click="createFn" v-permission="'add'">新增客户群</el-button>
          <el-button icon="el-icon-tickets" @click="maintainFn" v-permission="'edit'">维护客户群</el-button>
          <el-button icon="el-icon-delete" @click="deleteFn" v-permission="'delete'">删除客户群</el-button>
          <el-button icon="el-icon-download" @click="downTempFn" v-permission="'downTemp'">模板下载</el-button>
          <el-button icon="el-icon-upload2" @click="uploadFn" v-permission="'upload'">客户群导入</el-button>
          <el-button icon="el-icon-s-check" @click="applyFn" v-permission="'apply'">提交审批</el-button>
          <el-button icon="el-icon-download" @click="exportFn" v-permission="'export'">导出</el-button>
        </template>
        <template v-slot:form>
          <yu-xform ref="searchForm" class="search" :model="queryFormData" related-table-name="refTable" form-type="search" :reset="resetFn">
            <yu-xform-group :column="4">
              <yu-xform-item label="数据日期" name="etlDate" ctype="date-picker" placeholder="数据日期" :rules="globalRules.required"></yu-xform-item>
              <yu-xform-item label="客户群名称" placeholder="客户群名称" ctype="input" name="custGroupNm" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="客户群类别" placeholder="客户群类别" ctype="select" name="custGroupType" data-code="CUST_GROUP_TYPE"></yu-xform-item>
              <yu-xform-item label="客户群状态" placeholder="客户群状态" ctype="select" name="custGroupStatus" data-code="CUST_GROUP_STATUS"></yu-xform-item>
              <yu-xform-item label="创建人名称" placeholder="创建人名称" ctype="input" name="creatorName" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="创建人工号" placeholder="创建人工号" ctype="input" name="creatorId" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="创建人机构" placeholder="创建人机构" ctype="yufp-org-tree" name="orgId"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number :base-params="baseParams" selection-type="checkbox" :dynamic-height="true" border>
            <yu-xtable-column label="客户群名称" prop="custGroupNm" width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="存款余额（元）" prop="custBal" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="存款日均（元）" prop="custBalAvg" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="信贷余额（元）" prop="xdLoanBal" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="贷款余额（元）" prop="loanBal" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="EVA（元）" prop="eva" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="业务利润（元）" prop="profitContribution" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="FTP利润（元）" prop="ftpProfitBalnc" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="中间业务收入（元）" prop="midBizInc" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="授信总额（元）" prop="creditAmt" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="已使用授信额度（元）" prop="usedCreditAmt" width="200" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="授信敞口额度（元）" prop="creditExposureAmt" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="已使用敞口额度（元）" prop="userdCreditExposureAmt" width="200" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="客户群成员数" prop="custGroupMember" width="150" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="创建日期" prop="creatorTime" width="150" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="创建人名称" prop="creatorName" width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="创建人工号" prop="creatorId" width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="创建人机构" prop="orgName" width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="客户群描述" prop="custGroupRemark" width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="客户群类别" prop="custGroupType" width="120" fixed="right" data-code="CUST_GROUP_TYPE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="客户群状态" prop="custGroupStatus" width="120" fixed="right" data-code="CUST_GROUP_STATUS" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="操作" width="100" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button class="yu-action-btn" @click.native.prevent="viewFn(scope.row)" type="text">查看详情</el-button>
              </template>
            </yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
    <upload-excel :visible.sync="uploadVisible" @success="successFn" :options="uploadOptions"></upload-excel>
    <create-group-modal :visible.sync="createVisible" @success="refreshTable" />
    <content-modal :visible.sync="contentVisible">
      <template slot-scope="scope">
        <maintain-group :instance="scope" :row="currentRow" />
      </template>
    </content-modal>
    <content-modal :visible.sync="detailVisible">
      <template slot-scope="scope">
        <group-detail :instance="scope" :row="currentRow" />
      </template>
    </content-modal>
    <yu-dialog custom-class="apply-error-modal" title="错误信息" :visible.sync="errVisible" width="800px" @close="applyErrCloseFn">
      <div class="check">
        <span class="icon iconfont icon-guanbixuanjiao"></span>
        经系统校验，以下客户已存在于其他客户群中
      </div>
      <div class="yu-main-table">
        <yu-xtable :data="errTableDate" :total="errTotal" :pageable="false" row-number border>
          <yu-xtable-column label="客户名称" prop="custNm" :show-overflow-tooltip="true">
            <template slot-scope="scope">
            <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{scope.row.custNm}}</div>
            </template>
          </yu-xtable-column>
          <yu-xtable-column label="核心客户号" prop="custId" :show-overflow-tooltip="true"></yu-xtable-column>
        </yu-xtable>
      </div>
    </yu-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Provide, ProvideReactive, Ref, Vue } from "vue-property-decorator";
import { backend } from '@/config';
import CreateGroupModal from './components/CreateGroupModal/index.vue';
import MaintainGroup from './maintainGroup.vue';
import GroupDetail from './groupDetail.vue';
import { deletecrowd, addnewappro } from '@/api/customer';
import moment from "moment";
import { getCheckedRole } from '@/utils'
@Component({
  name: "CustGroup",
  components: {
    CreateGroupModal,
    MaintainGroup,
    GroupDetail
  }
})
export default class extends Vue {
  @Ref('searchForm') searchForm: any;
  @Ref('refTable') refTable: any;
  private roleInfo = getCheckedRole()
  private dataUrl = backend.custService + '/api/custcrowd/querycrowd';
  private dataDt = sessionStorage.getItem('dataDt');
  private queryFormData = {
    etlDate: moment(this.dataDt).format('YYYY-MM-DD'),
    creatorName: this.roleInfo.userName,
    creatorId: this.roleInfo.userId
  }
  private baseParams = {
    condition: JSON.stringify({
      etlDate: moment(this.dataDt).format('YYYY-MM-DD'),
      creatorName: this.roleInfo.userName,
      creatorId: this.roleInfo.userId
    })
  }
  private uploadVisible = false;
  private uploadOptions = {
    url: backend.custService + "/api/crowdmember/importexcel",
    exportUrl: backend.custService + '/api/crowdmember/exporterrorCwdcust',
    uploadType: true,
    tip: '可输入任意一列，按照核心客户号、客户名称的顺序进行校验',
    params: {}
  }

  

  private createVisible = false;
  private contentVisible = false;
  private detailVisible = false;
  private errVisible = false;
  private errTableDate = [];
  private errTotal = 0;

  @Provide('groupInstance') groupInstance = this;
  @ProvideReactive('row') currentRow = {};
  

  viewFn(row: any) {
    row.etlDate = this.searchForm.searchModel.etlDate;
    this.currentRow = row;
    this.detailVisible = true;
  }

  refreshTable () {
    this.refTable.remoteData();
  }

  createFn () {
    this.createVisible = true;
  }

  mounted () {
    this.$checkCtr('export') && this.$exportQueue.addQueue(this.$route.path, this.exportFn, true);
  }

  resetFn() {
    this.queryFormData = {
      etlDate: moment(this.dataDt).format('YYYY-MM-DD'),
      creatorName: '',
      creatorId: ''
    }
  }

  customerViewFn(row: any) {
    this.applyErrCloseFn();
    this.$router.push({ path: '/custInfo/custView/' + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: '客户详情-' + row.custNm }})
  }

  maintainFn () {
    let selections = this.refTable.selections;
    if(selections.length != 1) {
      this.$message.warning('请选择一条数据！');
      return;
    }
    // 只有创建人且状态为初始或空时才可以操作
    if(this.roleInfo.userId !== selections[0].creatorId) {
      this.$message.warning("只能创建人才能维护！");
      return;
    }

    if(!['01', '02'].includes(selections[0].custGroupStatus)) {
      this.$message.warning("只能维护初始和无审批状态的数据！");
      return;
    }
    this.contentVisible = true;
    selections[0].etlDate = this.searchForm.searchModel.etlDate;
    this.currentRow = selections[0];
  }

  deleteFn () {
    /**
     * 1.审批不通过、初始化以及无状态的，创建人可删除 ['01','02', '06', '07']
     * 2.审批通过的，总行营销管理岗和系统管理员可以删除 ['05'] ['R100001', 'R100107']
     * 3.其他状态不可删除（待初审，待复审）
     */
    let selections = this.refTable.selections;
    if(!selections.length) {
      this.$message.warning('请至少选择一条数据！');
      return;
    }
    let applySuccess = ['01','02', '06', '07'], 
        applyFail = ['05'],
        applyOther = ['03','04'];
        
    for(var i = 0;i < selections.length; i++) {
      let item = selections[i];
      if (applySuccess.includes(item.custGroupStatus) && this.roleInfo.userId !== item.creatorId) {
        this.$message.warning('审批不通过、初始以及无审批的， 只有创建人可删除！');
        return;
      }
      if (applyFail.includes(item.custGroupStatus) && !['R100001', 'R100107'].includes(this.roleInfo.roleCode)) {
        this.$message.warning('审批通过的，只有总行营销管理岗和系统管理员可以删除！');
        return;
      }
      if(applyOther.includes(item.custGroupStatus)) {
        this.$message.warning('待初审，待复审, 无法删除！');
        return;
      }
    }

    this.$confirm('此操作将删除所选客户群, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      callback: (action) => {
        if (action === 'confirm') {
          deletecrowd({
            custGroupId: selections.map((item: any) => item.custGroupId).join(',')
          }).then(res => {
            this.$message.success('删除成功');
            this.refreshTable();
          })
        }
      }
    });
  }

  downTempFn () {
    this.$util.downFile({
      url: backend.custService + '/api/crowdmember/downloadtemplate',
      method: "get",
      fileName: "客户群模板.xlsx",
    });
  }

  uploadFn () {
    let selections = this.refTable.selections;
    if(selections.length!==1) {
      this.$message.warning('请选择一条数据！');
      return;
    }

    // 只有创建人且状态为初始或空时才可以操作
    if(this.roleInfo.userId !== selections[0].creatorId) {
      this.$message.warning("只能创建人才能导入！");
      return;
    }

    if(!['01', '02'].includes(selections[0].custGroupStatus)) {
      this.$message.warning("只有初始和无审批状态的数据才能导入！");
      return;
    }

    this.uploadOptions.params = {
      custGroupId: selections[0].custGroupId
    }
    this.uploadVisible = true;
  }

  // 导入成功
  successFn () {
   this.refTable.remoteData();
  }

  applyFn () {
    let selections = this.refTable.selections;
    if(selections.length !== 1) {
      this.$message.warning('请选择一条数据！');
      return;
    }
    /**
     * 自主分析,无需审批
     */
    const { custGroupType, custGroupNm, custGroupId, custGroupStatus, custGroupMember } = selections[0];
    if(custGroupType === '0') {
      this.$message.warning("自主分析，无需审批！");
      return;
    }

    if(custGroupStatus != '02') {
      this.$message.warning("只能提交审批初始状态的数据！");
      return;
    }

    if (!custGroupMember) {
      this.$message.warning("请先加入群成员！");
      return;
    }


    this.$confirm('确认提交审批吗？', '提示', {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning',
      callback: (action) => {
        if (action === 'confirm') {
          let params = {
            taskId: custGroupId,
            taskNm: custGroupNm,
            apprProcess: '0101'
          }
          addnewappro(params, {
            customHandler: true
          }).then((res: any) => {
            if(res.code === 0) {
              this.$message.success('提交审批成功');
              this.refreshTable();
            } else if (res.code === -2) {
              this.errVisible = true;
              this.errTableDate = res.data;
              this.errTotal = res.data.lenght;
            }
          });
        }
      }
    });
  }

  applyErrCloseFn () {
    this.errVisible = false;
    this.errTableDate = [];
    this.errTotal = 0;
  }

  exportFn (showTipModal?:boolean) {
    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      etlDate: moment(this.dataDt).format('YYYY-MM-DD'),
      fileName: '客户群管理',
      queryField: this.searchForm.searchQueryField,
    });
    var apiParams = {
      url: backend.custService + '/api/custcrowd/exportcrowd',
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
  .apply-error-modal {
    .check {
      height: 48px;
      line-height: 48px;
      font-size: 15px;
      background-color: #feece8;
    }
    .icon-guanbixuanjiao {
      position: relative;
      top: -2px;
      padding: 0 10px;
      color: #f14922;
    }
  }
</style>
