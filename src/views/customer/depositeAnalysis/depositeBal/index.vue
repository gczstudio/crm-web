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
              <yu-xform-item label="查询日期" placeholder="查询日期" name="etlDate" ctype="date-picker" :rules="globalRules.required"></yu-xform-item>
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
                label="存款余额>="
                :show-label-suffix="false"
                suffix-label="万元"
                suffix-label-width="28px"
                placeholder="存款余额"
                ctype="input"
                name="custBal"
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
            <yu-xtable-column label="国标行业" prop="natStdIndsOne" min-width="120" data-code="NAT_STD_INDS1_MIS" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="对公存款余额（元）" prop="custBal" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="活期201（元）" prop="casaDpsBal" width="160" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="定期205（元）" prop="termDpsBal" width="160" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="信用卡217（元）" prop="creditCardDpsBal" width="160" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="财政221（元）" prop="fisDpsBal" width="160" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="地方财政222（元）" prop="localFisDpsBal" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="待结算财政223（元）" prop="settFisDpsBal" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="财政预算外225（元）" prop="offFisDpsBal" width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="国库定期226（元）" prop="timeDpsBal" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="同业234（元）" prop="persLiquDpsBal" width="160" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="同业235（元）" prop="persGenDpsBal" width="160" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="境外同业236（元）" prop="persAbroadDpsBal" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="临时243（元）" prop="tempDpsBal" width="160" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="保证金251（元）" prop="bondDpsBal" width="160" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
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

@Component({
  name: "DepositeBal",
})
export default class extends Vue {
  @Ref("searchForm") searchForm: any;
  @Ref("refTable") refTable: any;
  private dataUrl = backend.custService + "/api/custdepanalybycst/depballist";
  private queryFormData = {
    type: "1",
  };
  private baseParams = {
    condition: JSON.stringify({
      type: "1",
    }),
  };

  mounted() {
    this.$checkCtr("export") && this.$exportQueue.addQueue(this.$route.path, this.exportFn);
  }

  typeChangeFn(val: string) {
    this.dataUrl = backend.custService + (val === "1" ? "/api/custdepanalybycst/depballist" : "/api/custdepanaly/depballist");
    this.refTable.clearTable();
  }

  customerViewFn(row: any) {
    this.$router.push({ path: "/custInfo/custView/" + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: "客户详情-" + row.custNm } });
  }

  exportFn(showTipModal?: boolean) {
    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      fileName: "客户存款余额查询",
      queryField: this.searchForm.searchQueryField,
    });
    var apiParams = {
      url: backend.custService + (this.queryFormData.type === "1" ? "/api/custdepanalybycst/exportdepballist" : "/api/custdepanaly/exportdepballist"),
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
