<template>
  <div class="custRunAccount-container">
    <div class="yu-main-wrapper">
      <!-- 表格工具栏 -->
      <div class="yu-main__header clearfix">
        <div class="yu-main-toolbar fr">
          <el-button icon="el-icon-download"  @click="exportFn" v-permission="'trendExport'">导出</el-button>
        </div>
      </div>
      <!--查询form表单 -->
      <div class="yu-main-form">
        <yu-xform ref="searchForm" class="search" :model="queryFormData" :reset="resetFn" related-table-name="refTable" form-type="search" :need-export="true">
          <yu-xform-group :column="4">
            <yu-xform-item label="开始日期" name="tranDateStart" ctype="date-picker" placeholder="开始日期" :picker-options="startPickerOptions"></yu-xform-item>
            <yu-xform-item label="结束日期" name="tranDateEnd" ctype="date-picker" placeholder="结束日期" :picker-options="endPickerOptions"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </div>
      <div class="yu-main-content">
        <!-- 查询结果表格 -->
        <div class="yu-main-table">
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number :base-params="baseParams" :dynamic-height="true" border>
            <yu-xtable-column label="账号" prop="acctNo" width="180" fixed="left" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="款项代码" prop="acctSubNo" width="180" fixed="left" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="交易日期" prop="tranDate" width="120" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="交易时间" prop="tranTime" width="180" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="币种" prop="currCd" width="100" :show-overflow-tooltip="true" data-code="CURR_CD" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="借贷标志" prop="dcFlg" width="100" :show-overflow-tooltip="true" data-code="DC_FLAG" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="现转标志" prop="tsFlg" width="100" :show-overflow-tooltip="true" data-code="TS_FLG" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="交易金额（元）" prop="tranAmt" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="余额（元）" prop="depBal" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="生效日期" prop="effDate" width="180" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="记录类型说明" prop="recType" width="180" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="对方账号" prop="opstAcctNo" width="180" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="对方户名" prop="opstAcctNm" width="300" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="对手方行号" prop="opstBankNo" width="180" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="对手方行名" prop="opstBankNm" width="300" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="流水号" prop="seqNo" width="180" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="子交易流水号" prop="subSeqNo" width="180" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="交易码说明" prop="tranCodeDesc" width="120" :show-overflow-tooltip="true" data-code="TRAN_CODE" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="交易渠道来源说明" prop="tranChnlDesc" width="160" :show-overflow-tooltip="true" data-code="TRAN_CHNL" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="被冲销标志说明" prop="reversFlagDesc" width="140" :show-overflow-tooltip="true" data-code="YESNO" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="核算代码说明" prop="settCodeDesc" width="170" :show-overflow-tooltip="true" data-code="SETT_CODE" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="摘要码说明" prop="memoCodeDesc" width="120" :show-overflow-tooltip="true" data-code="MEMO_CODE" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="管理机构名称" prop="mgrOrgNm" width="200" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="交易机构名称" prop="tranOrgNm" width="200" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="备注" prop="remark" width="200" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          </yu-xtable>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { backend } from '@/config'
import { getUserInfo } from '@/utils'
import moment from 'moment'
@Component({
  name: 'CustRunAccount',
  components: {
  }
})
export default class extends Vue {
  @Ref('searchForm') searchForm: any;
  @Ref('refTable') refTable: any;
  private dataUrl = backend.custService + '/api/custoverview/accountdeallist'
  private queryFormData = {
    tranDateStart: moment().subtract(3, 'month').format('YYYY-MM-DD'),
    tranDateEnd: moment().format('YYYY-MM-DD')
  }
  private baseParams = {
    condition: JSON.stringify({
      ...this.$route.query,
      tranDateStart: moment().subtract(3, 'month').format('YYYY-MM-DD'),
      tranDateEnd: moment().format('YYYY-MM-DD')
    })
  }

  private userInfo = getUserInfo()

  private startPickerOptions = {
    disabledDate: (time: Date) => {
      if (this.queryFormData.tranDateEnd) {
        return time.getTime() >= new Date(this.queryFormData.tranDateEnd).getTime();
      }
    }
  }

  private endPickerOptions = {
    disabledDate: (time: Date) => {
      if (this.queryFormData.tranDateStart) {
        return time.getTime() <= new Date(this.queryFormData.tranDateStart).getTime() - 86400000;
      }
    }
  }

  mounted () {
    this.$checkCtr('trendExport') && this.$exportQueue.addQueue(this.$route.path, this.exportFn)
  }


  resetFn () {
    this.queryFormData = {
      tranDateStart: '',
      tranDateEnd: ''
    }
  }

  // 导出
  exportFn (showTipModal?:boolean) {
    let queryField =  (this as any).$util.formatQueryField([ 
      { cnName: this.$route.query.acctSubNo ? '款项代码' : '账号', value: this.$route.query.acctSubNo || this.$route.query.acctNo}
    ])
    var searchQuery: any = (this as any)._.assign({}, {
      ...this.$route.query,
      ...this.searchForm.searchModel,
      fileName: this.$route.query.title,
      queryField: queryField + this.searchForm.searchQueryField
    });
    var apiParams = {
      url: backend.custService + '/api/custoverview/exportaccountdeallist',
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