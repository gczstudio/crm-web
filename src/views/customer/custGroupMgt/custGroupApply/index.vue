<template>
  <div class="custGroup-container">
    <div class="yu-main-wrapper">
      <MainLayout>
        <template v-slot:header>
          <el-button icon="el-icon-s-check" @click="applyFn" v-permission="'apply'">审批</el-button>
          <el-button icon="el-icon-s-check" @click="applyFn" v-permission="'reApply'">复审</el-button>
        </template>
        <template v-slot:form>
          <yu-xform ref="searchForm" class="search" :model="queryFormData" related-table-name="refTable" form-type="search">
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
          <yu-xtable ref="refTable" :data-url="dataUrl" :base-params="baseParams" row-number selection-type="checkbox" :dynamic-height="true" border>
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
            <yu-xtable-column label="客户群类别" prop="custGroupType" width="120" data-code="CUST_GROUP_TYPE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="客户群状态" prop="custGroupStatus" width="120" data-code="CUST_GROUP_STATUS" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="操作" width="100" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button class="yu-action-btn" @click.native.prevent="viewFn(scope.row)" type="text">查看详情</el-button>
              </template>
            </yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
    <content-modal :visible.sync="detailVisible">
      <template slot-scope="scope">
        <group-detail :instance="scope" :row="currentRow" />
      </template>
    </content-modal>
    <yu-dialog
      :title="this.isApply ? '审批' : '复审'"
      :visible.sync="applyVisible"
      width="500px"
      top="20vh"
    >
      <div class="tc">
        <el-button type="primary" @click="execApplyFn('01')">通过</el-button>
        <el-button type="primary" @click="execApplyFn('02')">不通过</el-button>
      </div>
    </yu-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, ProvideReactive } from "vue-property-decorator";
import { backend } from '@/config';
import GroupDetail from '../custGroup/groupDetail.vue';
import moment from "moment";
import { getCheckedRole } from '@/utils';
import { updateappro } from '@/api/customer';
@Component({
  name: "custGroupApply",
  components: {
    GroupDetail
  }
})
export default class extends Vue {
  @Ref('searchForm') searchForm: any;
  @Ref('refTable') refTable: any;
  private dataUrl = backend.custService + '/api/custcrowd/querycrowd';
  private dataDt = sessionStorage.getItem('dataDt');
  private roleInfo = getCheckedRole();
  /**
   * 分支行业务部负责人、分支行分管行长、分支行行长，状态默认显示待初审
   * 总行营销管理岗，状态默认显示待复审
   */
  private queryFormData = {
    etlDate: moment(this.dataDt).format('YYYY-MM-DD'),
    custGroupStatus: this.$checkCtr('apply') ? '03' : '04'
  }
  private baseParams = {
    condition: JSON.stringify({
      etlDate: moment(this.dataDt).format('YYYY-MM-DD'),
      custGroupStatus: this.$checkCtr('apply') ? '03' : '04'
    })
  }
  private detailVisible = false;
  private applyVisible = false;
  private isApply = this.$checkCtr('apply');
  private isReApply = this.$checkCtr('reApply');

  @ProvideReactive('row') currentRow = {};

  viewFn(row: any) {
    row.etlDate = this.searchForm.searchModel.etlDate;
    this.currentRow = row;
    this.detailVisible = true;
  }

  // 审批
  applyFn () {
    let selections = this.refTable.selections;
    if(!selections.length) {
      this.$message.warning('请至少选择一条数据！');
      return;
    }

    let isLdh = selections.every((item: any) => item.custGroupType === '1');
    if(!isLdh) {
      this.$message.warning("自主分析，无需审批！");
      return;
    }

    if(this.isApply) {
      let isDcs = selections.every((item: any) => item.custGroupStatus === '03');
      if (!isDcs) {
        this.$message.warning("只能选择待初审的数据！");
        return;
      }
    }

    if(this.isReApply) {
      let isDfs = selections.every((item: any) => item.custGroupStatus === '04');
      if (!isDfs) {
        this.$message.warning("只能选择待复审的数据！");
        return;
      }
    }
    this.applyVisible = true;
  }

  execApplyFn(apprStatus: string) {
    let selections = this.refTable.selections;
    let params = {
      apprProcess: this.isApply ? '0102' : '0103',
      apprStatus,
      list: selections.map((item: any) => {
        return {
          taskId: item.custGroupId,
          taskNm: item.custGroupNm
        }
      })
    }
    updateappro(params).then((res: any) => {
      this.applyVisible = false;
      this.$message.success(this.isApply ? "审批成功！" : "复核成功！");
      this.refTable.remoteData();
    });
  }
}
</script>
