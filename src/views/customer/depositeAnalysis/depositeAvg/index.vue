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
              <yu-xform-item label="开始日期" name="startDate" ctype="date-picker" placeholder="开始日期" :picker-options="startPickerOptions" :rules="globalRules.required"></yu-xform-item>
              <yu-xform-item label="结束日期" name="endDate" ctype="date-picker" placeholder="结束日期" :picker-options="endPickerOptions" :rules="globalRules.required"></yu-xform-item>
              <yu-xform-item
                label="查询口径"
                name="type"
                ctype="select"
                placeholder="查询口径"
                data-code="DIMENSION_TYPE"
                @change="typeChangeFn"
                :rules="globalRules.required"
                :clearable="false"
              ></yu-xform-item>
              <yu-xform-item label="主管机构" v-if="queryFormData.type === '1'" placeholder="主管机构" ctype="yufp-org-tree" name="orgCode" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="考核机构" v-else placeholder="考核机构" ctype="yufp-org-tree" name="orgCode" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="考核条线" placeholder="考核条线" name="busiLine" ctype="select" data-code="BUINESS_LINE"></yu-xform-item>
              <yu-xform-item
                label="存款日均>="
                :show-label-suffix="false"
                suffix-label="万元"
                suffix-label-width="28px"
                placeholder="存款日均"
                ctype="input"
                name="depAvg"
                :rules="globalRules.amountInput"
              ></yu-xform-item>
              <yu-xform-item label="客户名称" placeholder="客户名称" ctype="input" name="custNm" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="核心客户号" placeholder="核心客户号" ctype="input" name="custId" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="组织机构代码" placeholder="组织机构代码" ctype="input" name="insCredCode" :rules="globalRules.input"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" :base-params="baseParams" row-number :dynamic-height="true" border :default-load="false">
            <yu-xtable-column v-if="queryFormData.type === '1'" label="主管机构" prop="blgOrgNm" fixed="left" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column v-else label="考核机构" prop="orgNm" width="150" fixed="left" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="客户名称" prop="custNm" width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
                <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{ scope.row.custNm }}</div>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="核心客户号" prop="custId" width="120" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="组织机构代码" prop="insCredCode" width="130" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="考核条线" prop="busiLine" width="120" data-code="BUINESS_LINE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="企业规模" prop="entScale" min-width="120" data-code="ENT_SCALE_MIS" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="国标行业" prop="natStdIndsOne" min-width="200" data-code="NAT_STD_INDS1_MIS" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="对公存款日均（元）" prop="custBalAvg" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="活期201（元）" prop="casaDpsAvg" width="160" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="定期205（元）" prop="termDpsAvg" width="160" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="信用卡217（元）" prop="creditCardDpsAvg" width="160" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="财政221（元）" prop="fisDpsAvg" width="160" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="地方财政222（元）" prop="localFisDpsAvg" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="待结算财政223（元）" prop="settFisDpsAvg" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="财政预算外225（元）" prop="offFisDpsAvg" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="国库定期226（元）" prop="timeDpsAvg" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="同业234（元）" prop="persLiquDpsAvg" width="160" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="同业235（元）" prop="persGenDpsAvg" width="160" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="境外同业236（元）" prop="persAbroadDpsAvg" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="临时243（元）" prop="tempDpsAvg" width="160" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="保证金251（元）" prop="bondDpsAvg" width="160" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="主管客户经理" prop="blgMgrNm" width="160" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import { backend } from "@/config";
import moment from "moment";

@Component({
  name: "DepositeAvg",
})
export default class extends Vue {
  @Ref("searchForm") searchForm: any;
  @Ref("refTable") refTable: any;
  private dataUrl = backend.custService + "/api/custdepanalybycst/depavglist";
  private queryFormData = {
    type: "1",
  };
  private baseParams = {
    condition: JSON.stringify({
      type: "1",
    }),
  };

  // 规则：区间不能跨年
  private startPickerOptions = {
    disabledDate: (time: Date) => {
      var endDate = (this.queryFormData as any).endDate;
      return endDate && (time.getTime() > moment(endDate).valueOf() || time.getTime() < moment(endDate).startOf("year").valueOf());
    },
  };

  private endPickerOptions = {
    disabledDate: (time: Date) => {
      var startDate = (this.queryFormData as any).startDate;
      return startDate && (time.getTime() <= moment(startDate).valueOf() - 86400000 || time.getTime() > moment(startDate).endOf("year").valueOf());
    },
  };

  mounted() {
    this.$checkCtr("export") && this.$exportQueue.addQueue(this.$route.path, this.exportFn);
  }

  typeChangeFn(val: string) {
    this.dataUrl = backend.custService + (val === "1" ? "/api/custdepanalybycst/depavglist" : "/api/custdepanaly/depavglist");
    this.refTable.clearTable();
  }

  customerViewFn(row: any) {
    this.$router.push({ path: "/custInfo/custView/" + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: "客户详情-" + row.custNm } });
  }

  exportFn(showTipModal?: boolean) {
    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      fileName: "客户存款日均查询",
      queryField: this.searchForm.searchQueryField,
    });
    var apiParams = {
      url: backend.custService + (this.queryFormData.type === "1" ? "/api/custdepanalybycst/exportdepavglist" : "/api/custdepanaly/exportdepavglist"),
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
