<template>
  <div class="CustMgt-container">
    <div class="yu-main-wrapper">
      <MainLayout>
        <!-- <template v-slot:header>
          <el-button icon="el-icon-download" @click="exportFn" v-permission="'export'">导出</el-button>
        </template> -->
        <template v-slot:form>
          <yu-xform ref="searchForm" class="search" :model="queryFormData" related-table-name="refTable" form-type="search" :need-export="true">
            <yu-xform-group :column="4">
              <yu-xform-item label="机构名称" placeholder="机构名称" ctype="yufp-org-tree" name="mappingOrgId"></yu-xform-item>
              <yu-xform-item label="员工姓名/工号" placeholder="员工姓名/工号" ctype="input" name="userInfo" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="开始日期" name="loginTmStart" ctype="date-picker" placeholder="开始日期" :picker-options="startPickerOptions"></yu-xform-item>
              <yu-xform-item label="结束日期" name="loginTmEnd" ctype="date-picker" placeholder="结束日期" :picker-options="endPickerOptions"></yu-xform-item>
              <yu-xform-item label="登录方式" name="loginChnl" ctype="select" placeholder="登录方式" data-code="LOGIN_CHNL" multiple></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number :dynamic-height="true" border>
            <yu-xtable-column label="机构名称" prop="mappingOrgName" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <!-- <yu-xtable-column label="员工姓名/工号" prop="custId" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
                {{scope.row.userName + '/' + scope.row.userId}}
              </template>
            </yu-xtable-column> -->
            <yu-xtable-column label="员工姓名" prop="userName" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="工号" prop="userId" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="登录地址" prop="loginIp" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <!-- <yu-xtable-column label="登录日期" prop="custId" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column> -->
            <yu-xtable-column label="登录时间" prop="loginTm" is-num align="right" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="退出时间" prop="logoutTm" is-num align="right" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="登录方式" prop="loginChnl" data-code="LOGIN_CHNL" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import { backend } from "@/config";

@Component({
  name: "SysLoginLog",
})
export default class extends Vue {
  @Ref("searchForm") searchForm: any;
  @Ref("refTable") refTable: any;
  private dataUrl = backend.appOcaService + "/api/loginlog/logininfo";
  private queryFormData = {};
  private startPickerOptions = {
    disabledDate: (time: Date) => {
      if ((this.queryFormData as any).endDate) {
        return time.getTime() >= new Date((this.queryFormData as any).endDate).getTime();
      }
    },
  };

  private endPickerOptions = {
    disabledDate: (time: Date) => {
      if ((this.queryFormData as any).startDate) {
        return time.getTime() <= new Date((this.queryFormData as any).startDate).getTime() - 86400000;
      }
    },
  };
}
</script>
