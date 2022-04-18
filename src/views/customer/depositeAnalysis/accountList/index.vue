<template>
  <div class="AccountList-container yu-main-wrapper">
    <MainLayout>
      <template v-slot:form>
        <yu-xform class="search" :model="queryFormData" related-table-name="refTable" form-type="search">
          <yu-xform-group :column="4">
            <yu-xform-item label="账号" name="acctNo" ctype="input" placeholder="账号"></yu-xform-item>
            <yu-xform-item label="款项代码" name="acctSubNo" ctype="input" placeholder="款项代码"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>
      <template v-slot:table>
        <yu-xtable ref="refTable" :data-url="dataUrl" row-number :base-params="baseParams" :dynamic-height="true" border>
          <yu-xtable-column label="客户名称" prop="custNm" min-width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom">
            <template slot-scope="scope">
              <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{scope.row.custNm}}</div>
            </template>
          </yu-xtable-column>
          <yu-xtable-column label="账号" prop="acctNo"  min-width="150" :show-overflow-tooltip="true" fixed="left" is-num sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="款项代码" prop="acctSubNo"  min-width="150" :show-overflow-tooltip="true" fixed="left" is-num sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="客户号" prop="custId"  min-width="100" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="上日余额（元）" prop="depBal"  min-width="160" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="款项状态" prop="acctStat"  min-width="100" :show-overflow-tooltip="true" data-code="ACC_SUB_STAT" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="币种" prop="currCd"  min-width="100" :show-overflow-tooltip="true" data-code="CURR_CD" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="产品代码" prop="prodCd"  min-width="100" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="产品种类" prop="prodType"  min-width="100" :show-overflow-tooltip="true" data-code="PROD_TYPE" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="实时余额" prop="balance"  min-width="130" align="right" format-money :show-overflow-tooltip="true" fixed="right">
            <template slot-scope="scope">
              <div class="num red">{{realAmount[scope.row.acctSubNo] ? $util.formatMoney(realAmount[scope.row.acctSubNo].balance) : ''}}</div>
            </template>
          </yu-xtable-column>
          <yu-xtable-column label="实时可用余额" prop="avalBalance"  min-width="120" align="right" format-money :show-overflow-tooltip="true" fixed="right">
            <template slot-scope="scope">
              <div class="num red">{{realAmount[scope.row.acctSubNo] ? $util.formatMoney(realAmount[scope.row.acctSubNo].avalBalance) : ''}}</div>
            </template>
          </yu-xtable-column>
          <yu-xtable-column label="操作" width="120" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button class="yu-action-btn" @click.native.prevent="realTimeFn(scope.row)" type="text">实时余额查询</el-button>
            </template>
          </yu-xtable-column>
        </yu-xtable>
      </template>
    </MainLayout>
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
  private crmCustId = this.$route.params.id as string;
  private baseParams = {
    condition: JSON.stringify({
      crmCustId: this.crmCustId
    }),
    sort: 'depBal desc'
  }
  private queryFormData = {}
  private realAmount = {}

  realTimeFn(row:any) {
    let data = {
      condition: JSON.stringify({
        acctNo: row.acctNo,
        acctSubNo: row.acctSubNo
      })
    }
    customerApi.getBalanceInfo(data).then(res => {
      this.$set(this.realAmount,row.acctSubNo, res.data);
    })
  }

  customerViewFn(row: any) {
    this.$router.push({ path: '/custInfo/custView/' + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: '客户详情-' + row.custNm }})
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
  .red {
    color: #F14922;
  }
  .dep-bal {
    position: relative;
    .dep-tooltip {
      position: absolute;
      top: -40px;
      // z-index: 99999;
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
