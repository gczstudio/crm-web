<template>
  <div class="AccountList-container">
    <div class="yu-main-wrapper">
      <MainLayout is-tab>
        <template v-slot:header>
          <el-button icon="el-icon-tickets" @click="transDetailFn">交易明细</el-button>
          <el-button icon="el-icon-document" @click="transTotalFn">交易汇总</el-button>
          <el-button icon="el-icon-search" @click="realTimeFn">实时余额查询</el-button>
        </template>
        <template v-slot:form>
         <yu-xform class="search" :model="queryFormData" :search="searchFn" form-type="search">
          <yu-xform-group :column="4">
            <yu-xform-item label="账号" name="acctNo" ctype="input" placeholder="账号"></yu-xform-item>
            <yu-xform-item label="款项代码" name="acctSubNo" ctype="input" placeholder="款项代码"></yu-xform-item>
            <yu-xform-item label="款项状态" name="acctStat" ctype="select" placeholder="款项状态" data-code="ACC_SUB_STAT"></yu-xform-item>
            <yu-xform-item label="余额（元）" ctype="yufp-range-input" name="depBal" :rules="$validator.rangeInput"></yu-xform-item>
            <yu-xform-item label="款项性质" name="acctPropCd" ctype="select" placeholder="款项性质" filterable data-code="ACCT_SUB_PROP_CD"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number :base-params="baseParams" selection-type="radio" :dynamic-height="true" border>
            <yu-xtable-column label="账号" prop="acctNo" width="145" :show-overflow-tooltip="true" fixed="left" is-num  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="款项代码" prop="acctSubNo" width="170" :show-overflow-tooltip="true" fixed="left" is-num  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="客户号" prop="custId" width="90" :show-overflow-tooltip="true" is-num  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="可用余额（元）" prop="depRemBal" width="140" align="right" format-money :show-overflow-tooltip="true"  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="款项状态" prop="acctStat" width="100" :show-overflow-tooltip="true" data-code="ACC_SUB_STAT"  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="款项性质" prop="acctPropCd" width="180" :show-overflow-tooltip="true" data-code="ACCT_SUB_PROP_CD"  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="币种" prop="currCd" width="100" :show-overflow-tooltip="true" data-code="CURR_CD"  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="产品代码" prop="prodCd" width="100" :show-overflow-tooltip="true" is-num  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="产品种类" prop="prodType" width="100" :show-overflow-tooltip="true" data-code="PROD_TYPE"  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="期限类型" prop="termType" width="100" :show-overflow-tooltip="true" data-code="TERM_TYPE"  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="期限" prop="termNum" width="100" :show-overflow-tooltip="true" is-num  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="协定到期日" prop="agreeDueDate" width="120" :show-overflow-tooltip="true" is-num  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="账户名称" prop="acctName" width="250" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="科目代码" prop="subjectCd" width="100" :show-overflow-tooltip="true" is-num  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="余额方向" prop="depBalDir"  width="100" :show-overflow-tooltip="true" data-code="DEP_BAL_DIR"  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="起息日期" prop="indsDate" width="120" :show-overflow-tooltip="true" is-num  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="到期日期" prop="dueDate" width="120" :show-overflow-tooltip="true" is-num  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="上笔非结息交易日" prop="lastNoneIntsDate" width="160" :show-overflow-tooltip="true" is-num  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="上笔交易日" prop="lastTranDate" width="120" :show-overflow-tooltip="true" is-num  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="开户日期" prop="openDate" width="120" :show-overflow-tooltip="true" is-num  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="销户日期" prop="closeDate" width="120" :show-overflow-tooltip="true" is-num  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="核算机构" prop="calcOrgNm" width="180" :show-overflow-tooltip="true"  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="管理机构" prop="mgrOrgNm" width="180" :show-overflow-tooltip="true"  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="开户机构" prop="openOrgNm" width="180" :show-overflow-tooltip="true"  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="余额（元）" prop="depBal" width="200" fixed="right" align="right" class-name="dep-bal-column" sortable="custom">
              <template slot-scope="scope">
                <div :class="['num','dep-bal', scope.$index === 0 ? 'first' : '']">
                  <div class="dep-tooltip" v-if="refTable.selections[0] && refTable.selections[0].acctSubNo === scope.row.acctSubNo && realAmount[scope.row.acctSubNo]">¥ {{realAmount[scope.row.acctSubNo] ? $util.formatMoney(realAmount[scope.row.acctSubNo].balance) : ''}}</div>
                  <span class="num">{{$util.formatMoney(scope.row.depBal)}}</span>
                </div>
              </template>
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
import * as customerApi from '@/api/customer'
@Component({
  name: 'AccountList',
  components: {
  }
})
export default class extends Vue {

  @Ref('refTable') refTable: any;

  private dataUrl = backend.custService + '/api/depoistinfo/custaccountlist'
  private crmCustId = this.$route.query.crmCustId as string;
  private baseParams = {
    condition: JSON.stringify({
      crmCustId: this.crmCustId
    }),
    sort: 'depBal desc'
  }
  private realAmount = {}
  private manualVisible = true
  private queryFormData = {
    depBal: null
  }

  searchFn() {
    var depBals = (this.queryFormData as any).depBal;
    let obj: any = {
      ...this.queryFormData,
      depBalStart: depBals?.[0],
      depBalEnd: depBals?.[1]
    }
    delete obj.depBal
    let params = {
      condition: JSON.stringify(obj),
      sort: 'depBal desc'
    }
    this.refTable.remoteData(params)
  }

  transDetailFn() {
    const selections = this.refTable.selections;
    if(!selections.length) {
      this.$message.warning('请先选择一条记录！');
      return;
    }
   this.$router.push({ path: '/custInfo/custRunAccount/' + selections[0].acctSubNo, query: { acctSubNo: selections[0].acctSubNo, crmCustId: this.crmCustId, title: '交易明细-' + selections[0].acctSubNo }})

  }

  transTotalFn() {
    const { crmCustId } = this.$route.query;
    const selections = this.refTable.selections;
    if(!selections.length) {
      this.$message.warning('请先选择一条记录！');
      return;
    }
    this.$router.push({path: '/custInfo/tradeGather/' + selections[0].acctSubNo, query: { crmCustId, acctSubNo: selections[0].acctSubNo, title: '交易汇总-' + selections[0].acctSubNo  }});
  }

  realTimeFn() {
    const selections = this.refTable.selections;
    if(!selections.length) {
      this.$message.warning('请先选择一条记录！');
      return;
    }
    let data = {
      condition: JSON.stringify({
        acctNo: selections[0].acctNo,
        acctSubNo: selections[0].acctSubNo
      })
    }

    customerApi.getBalanceInfo(data).then(res => {
      this.$set(this.realAmount, selections[0].acctSubNo, res.data);
    })
  }

}
</script>
<style lang="scss">
  .main-theme {
    .el-table .dep-bal-column {
      .cell {
        overflow: visible;
      }
    }
    .el-badge__content.is-fixed {
      z-index: 1;
      top: -5px;
    }
  }
  
</style>
<style lang="scss" scoped>
  .yu-main-wrapper {
    box-shadow: none;
  }
  .dep-bal {
    position: relative;
    .dep-tooltip {
      position: absolute;
      top: -40px;
      right: 0;
      z-index: 9;
      padding: 6px 12px;
      background: #F14922;
      border-radius: 2px;
      color: #fff;
      font-weight: bold;
      box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, .2);
      &::before {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        display: inline-block;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid #F14922;
        border-radius: 2px;
      }
    }
     &.first {
      .dep-tooltip {
        top: 28px;
        &::before {
          top: -8px;
          border: none;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 8px solid #F14922;
          border-radius: 2px;
        }
      }
    }
  }
  
</style>
