<template>
  <div class="CustMgt-container">
    <div class="yu-main-wrapper">
      <MainLayout>
        <template v-slot:header>
          <el-button icon="el-icon-download" @click="exportFn" v-permission="'export'">导出</el-button>
        </template>
        <template v-slot:form>
          <yu-xform ref="searchForm" class="search" :model="queryFormData" related-table-name="refTable" form-type="search" :need-export="true">
            <yu-xform-group :column="4">
              <yu-xform-item label="机构名称" placeholder="机构名称" ctype="yufp-org-tree" name="orgName"></yu-xform-item>
              <yu-xform-item label="开始日期" name="loginTmStart" ctype="date-picker" placeholder="开始日期" :picker-options="startPickerOptions" :rules="globalRules.required"></yu-xform-item>
              <yu-xform-item label="结束日期" name="loginTmEnd" ctype="date-picker" placeholder="结束日期" :picker-options="endPickerOptions" :rules="globalRules.required"></yu-xform-item>
              <yu-xform-item label="登录方式" name="loginChnl" ctype="select" placeholder="登录方式" data-code="LOGIN_CHNL" multiple></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number :dynamic-height="true" border>
            <yu-xtable-column label="机构名称" prop="orgName"  :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="员工人数" prop="userNum" is-num align="right" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="期间使用系统人数" prop="loginedUserNum" is-num align="right" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="工作日天数" prop="workDay" is-num align="right" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="实际使用天数" prop="loginedDay" is-num align="right" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="使用次数" prop="usedNum" is-num align="right" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import { backend } from '@/config'

@Component({
  name: "OrgSysLog",
})
export default class extends Vue {
  @Ref('searchForm') searchForm: any;
  @Ref('refTable') refTable: any;
  private dataUrl = backend.appOcaService + '/api/sysorgbusiness/queryorgbusi'
  private queryFormData = {}
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

  exportFn (showTipModal?:boolean) {
    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      fileName: '机构系统使用情况分析',
      queryField: this.searchForm.searchQueryField
    });
    var apiParams = {
      url: backend.appOcaService + '/api/sysorgbusiness/exportqueryorgbusi',
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
