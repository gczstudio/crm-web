<template>
  <div class="AcctLevel-container">
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
              <yu-xform-item label="开始日期" name="dateStart" ctype="date-picker" placeholder="开始日期" :picker-options="startPickerOptions"></yu-xform-item>
              <yu-xform-item label="结束日期" name="dateEnd" ctype="date-picker" placeholder="结束日期" :picker-options="endPickerOptions"></yu-xform-item>
              <yu-xform-item label="考核条线" placeholder="考核条线" name="busiLine" ctype="select" data-code="BUINESS_LINE"></yu-xform-item>
              <yu-xform-item label="管户机构" placeholder="管户机构" ctype="yufp-org-tree" name="blgOrgBrchNo"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number :base-params="baseParams" :dynamic-height="true" border :default-load="false">
            <yu-xtable-column label="客户名称" prop="custName" min-width="230" fixed="left" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
                <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)">
                  <i class="iconfont icon-qiyelogo"></i>
                  {{ scope.row.custName }}
                </div>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="账号" prop="acctNo" min-width="170" fixed="left" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="款项序号" prop="acctSubNo" min-width="170" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="交易时间" prop="tranTime" min-width="160" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="交易金额（万元）" prop="tranAmt" min-width="180" sortable="custom" format-money align="right" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span class="num">{{ $util.formatMoney(scope.row.tranAmt / 10000) }}</span>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="借贷标志" prop="dcFlag" width="120" :show-overflow-tooltip="true" data-code="DC_FLAG" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="摘要码" prop="memoNo" width="120" :show-overflow-tooltip="true" data-code="MEMO_CODE" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="备注" prop="remark" min-width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="考核条线" prop="busiLine" width="120" data-code="BUINESS_LINE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="交易机构" prop="tranOrgNm" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="管户机构" prop="blgOrgBarchNm" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="交易渠道" prop="tranChnlId" data-code="TRAN_CHNL" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="摘要" prop="memoDesc" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="交易码" prop="tranCode" width="120" :show-overflow-tooltip="true" data-code="TRAN_CODE" sortable="custom"></yu-xtable-column>
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
  name: "AcctLevel",
  components: {
    ParamsSet,
  },
})
export default class extends Vue {
  @Ref("searchForm") searchForm: any;
  @Ref("refTable") refTable: any;
  private dataUrl = backend.workService + "/api/actrmdmng/actrmdlist";
  private dataDt = sessionStorage.getItem("dataDt");
  private contentVisible = false;

  private queryFormData: any = {
    remindType: "01",
    remindSType: "0101",
  };

  private baseParams = {
    condition: JSON.stringify({
      remindType: "01",
      remindSType: "0101",
      isMark: "1",
    }),
  };

  private startPickerOptions = {
    disabledDate: (time: Date) => {
      if ((this.queryFormData as any).dateEnd) {
        return time.getTime() >= new Date((this.queryFormData as any).dateEnd).getTime();
      }
    },
  };

  private endPickerOptions = {
    disabledDate: (time: Date) => {
      if ((this.queryFormData as any).dateStart) {
        return time.getTime() <= new Date((this.queryFormData as any).dateStart).getTime() - 86400000;
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
    return (ServiceModule.remindOptions.find((item: any) => item.remindCategoryId === "01") as any)?.childList.map((item: any) => {
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
      fileName: "动账提醒-大额动账提醒",
      queryField: this.searchForm.searchQueryField,
      isMark: this.isMark,
    });
    var apiParams = {
      url: backend.workService + "/api/actrmdmng/exportactrmdlist",
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
