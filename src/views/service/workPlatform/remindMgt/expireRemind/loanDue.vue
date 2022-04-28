<template>
  <div class="loanDue-container">
    <div class="yu-main-wrapper">
      <MainLayout>
        <template v-slot:header>
          <el-button icon="el-icon-setting" @click="paramsSetFn" v-permission="'paramsSet'">参数设置</el-button>
          <el-button icon="el-icon-download" @click="exportFn" v-permission="'export'">导出</el-button>
        </template>
        <template v-slot:form>
          <yu-xform ref="searchForm" class="search" :model="queryFormData" related-table-name="refTable" form-type="search" :need-export="true">
            <yu-xform-group :column="4">
              <yu-xform-item label="提醒大类" placeholder="提醒大类" name="remindType" ctype="select" :options="remindTypeOptions" :clearable="false" @change="remindTypeChange"></yu-xform-item>
              <yu-xform-item label="提醒小类" placeholder="提醒小类" name="remindSType" ctype="select" :options="remindSTypeOptions" :clearable="false" @change="remindSTypeChange"></yu-xform-item>
              <yu-xform-item label="客户名称" placeholder="客户名称" ctype="input" name="custName" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="核心客户号" placeholder="核心客户号" ctype="input" name="custId" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="借据流水号" placeholder="借据流水号" ctype="input" name="borrNo" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="开始日期" name="dateStart" ctype="date-picker" placeholder="实际到期日" :picker-options="startPickerOptions"></yu-xform-item>
              <yu-xform-item label="结束日期" name="dateEnd" ctype="date-picker" placeholder="实际到期日" :picker-options="endPickerOptions"></yu-xform-item>
              <yu-xform-item label="经办人" placeholder="经办人" ctype="input" name="operateUserName" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="经办机构" placeholder="经办机构" ctype="yufp-org-tree" name="operateOrgId"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number :base-params="baseParams" :dynamic-height="true" border :default-load="false">
            <yu-xtable-column label="客户名称" prop="custName" width="280" fixed="left" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
                <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)">
                  <i class="iconfont icon-qiyelogo"></i>
                  {{ scope.row.custName }}
                </div>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="核心客户号" prop="custId" min-width="120" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="业务品种" prop="busVarietyNm" min-width="200" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="借据流水号" prop="borrNo" min-width="180" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="币种" prop="currencyCd" min-width="120" :show-overflow-tooltip="true" sortable="custom" data-code="CURR_CD"></yu-xtable-column>
            <yu-xtable-column label="金额（元）" prop="loanAmt" min-width="120" :show-overflow-tooltip="true" format-money align="right" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="余额（元）" prop="loanBal" min-width="120" :show-overflow-tooltip="true" format-money align="right" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="发放日期" prop="grantDate" min-width="120" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="约定到期日" prop="agreeDueDate" min-width="120" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="实际到期日" prop="actualDueDate" min-width="120" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="经办人" prop="operateUserName" min-width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="经办机构" prop="operateOrgName" min-width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
    <content-modal :visible.sync="contentVisible">
      <template slot-scope="scope">
        <params-set :instance="scope" />
      </template>
    </content-modal>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from "vue-property-decorator";
import { backend } from "@/config";
import moment from "moment";
import { ServiceModule } from "@/store/modules/service";
import ParamsSet from "../paramsSet/index.vue";

@Component({
  name: "LoanDue",
  components: {
    ParamsSet,
  },
})
export default class extends Vue {
  @Ref("searchForm") searchForm: any;
  @Ref("refTable") refTable: any;
  private dataUrl = backend.workService + "/api/warntype/queryloan";
  private contentVisible = false;

  private queryFormData: any = {
    remindType: "02",
    remindSType: "0202",
  };

  private baseParams = {
    condition: JSON.stringify({
      remindType: "02",
      remindSType: "0202",
      isMark: "1",
    }),
  };

  private startPickerOptions = {
    disabledDate: (time: Date) => {
      if (this.queryFormData.dateEnd) {
        return time.getTime() >= new Date(this.queryFormData.dateEnd).getTime();
      }
    },
  };

  private endPickerOptions = {
    disabledDate: (time: Date) => {
      if (this.queryFormData.dateStart) {
        return time.getTime() <= new Date(this.queryFormData.dateStart).getTime() - 86400000;
      }
    },
  };

  get remindTypeOptions() {
    return ServiceModule.remindOptions.map((item: any) => {
      return {
        key: item.remindCategoryId,
        value: item.remindCategoryNm,
      };
    });
  }

  get remindSTypeOptions() {
    return (ServiceModule.remindOptions.find((item: any) => item.remindCategoryId === "02") as any)?.childList.map((item: any) => {
      return {
        key: item.remindSubclassId,
        value: item.remindSubclassNm,
      };
    });
  }

  get isMark() {
    return ServiceModule.isMark;
  }

  @Watch("isMark")
  onIsMarkChange() {
    this.isMark === "2" && this.searchFn();
  }

  mounted() {
    this.searchFn();
    this.$checkCtr("export") && this.$exportQueue.addQueue(this.$route.path, this.exportFn);
  }

  searchFn() {
    this.refTable.remoteData(
      {
        condition: JSON.stringify({
          isMark: this.isMark,
        }),
      },
      true,
      () => {
        ServiceModule.SET_IS_MARK("1");
      }
    );
  }

  // 参数设置
  paramsSetFn() {
    this.contentVisible = true;
  }

  customerViewFn(row: any) {
    this.$router.push({
      path: "/custInfo/custView/" + row.crmCustId,
      query: {
        crmCustId: row.crmCustId,
        custId: row.custId,
        title: "客户详情-" + row.custName,
      },
    });
  }

  // 大类变化
  remindTypeChange(value: string) {
    ServiceModule.SET_REMIND_TYPE(value);
    let remindSType = (ServiceModule.remindOptions.find((item: any) => item.remindCategoryId === value) as any)?.childList[0].remindSubclassId;
    ServiceModule.SET_REMIND_S_TYPE(remindSType);
  }

  // 小类变化
  remindSTypeChange(value: string) {
    ServiceModule.SET_REMIND_S_TYPE(value);
  }

  exportFn(showTipModal?: boolean) {
    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      fileName: "贷款到期提醒",
      queryField: this.searchForm.searchQueryField,
      isMark: this.isMark,
    });
    var apiParams = {
      url: backend.workService + "/api/warntype/exportqueryloan",
      params: searchQuery,
      sort: this.refTable.sort,
    };
    (this as any).$util.exportTable({
      _this: this,
      apiParams,
      showTipModal,
    });
  }
}
</script>
