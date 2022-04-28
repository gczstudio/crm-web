<template>
  <div class="custCredit-container yu-main-wrapper">
    <!--查询form表单 -->
    <!-- <div class="yu-main__fixed"> -->
    <div class="yu-main-form">
      <yu-xform ref="searchForm" class="search" :model="queryFormData" form-type="search" :show-search-btn="false">
        <yu-xform-group :column="3">
          <yu-xform-item label="信息类别选择" ctype="select" name="type" :options="types" style="width: 350px"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
    </div>
    <!-- </div> -->
    <div class="yu-main-content">
      <!-- 查询结果表格 -->
      <div class="yu-main-table">
        <iframe v-if="queryFormData.type === '1'" :src="creditUrl" frameborder="0" style="width: 100%; height: calc(100vh - 225px); padding: 0 20px"></iframe>
        <yu-xtable v-if="queryFormData.type === '2'" key="credit" :data-url="dataUrl.credit" request-type="post" :base-params="baseParams" :dynamic-height="true" border>
          <yu-xtable-column label="额度编号" prop="limitNo" width="250" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="协议状态" prop="agreeStatus" :show-overflow-tooltip="true" width="150" data-code="AGREE_STATUS"></yu-xtable-column>
          <yu-xtable-column label="授信冻结状态" prop="creditFrozenStatus" :show-overflow-tooltip="true" min-width="120" data-code="CREDIT_FROZEN_STATUS"></yu-xtable-column>
          <yu-xtable-column label="业务品种" prop="bussCategory" min-width="150" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="名义金额（元）" prop="nominalAmt" min-width="150" align="right" format-money :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="敞口金额（元）" prop="execExposureAmt" min-width="150" align="right" format-money :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="主要担保方式" prop="guaranteeMode" min-width="120" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="额度生效日" prop="limitEffectiveDate" min-width="120" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="额度到期日" prop="limitExpiryDate" min-width="120" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="经办人" prop="apperName" min-width="120" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="经办机构" prop="appBranchName" min-width="120" :show-overflow-tooltip="true"></yu-xtable-column>
        </yu-xtable>
        <yu-xtable v-if="queryFormData.type === '3'" key="group" :data-url="dataUrl.group" request-type="post" :base-params="baseParams" :dynamic-height="true" border>
          <yu-xtable-column label="集团额度编号" prop="limitNo" :show-overflow-tooltip="true" min-width="150" is-num></yu-xtable-column>
          <yu-xtable-column label="协议状态" prop="agreeStatus" :show-overflow-tooltip="true" min-width="150" data-code="AGREE_STATUS"></yu-xtable-column>
          <yu-xtable-column label="授信冻结状态" prop="creditFrozenStatus" :show-overflow-tooltip="true" min-width="120" data-code="CREDIT_FROZEN_STATUS"></yu-xtable-column>
          <yu-xtable-column label="业务品种" prop="bussCategory" min-width="150" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="集团名义金额（元）" prop="nominalAmt" align="right" format-money min-width="150" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="集团敞口金额（元）" prop="execExposureAmt" align="right" format-money min-width="150" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="主要担保方式" prop="guaranteeMode" min-width="120" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="额度生效日" prop="limitEffectiveDate" min-width="120" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="额度到期日" prop="limitExpiryDate" min-width="120" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="经办人" prop="apperName" min-width="120" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="经办机构" prop="appBranchName" min-width="120" :show-overflow-tooltip="true"></yu-xtable-column>
        </yu-xtable>
        <yu-xtable v-if="queryFormData.type === '4'" key="unsolved" :data-url="dataUrl.unsolved" request-type="post" :base-params="baseParams" :dynamic-height="true" border>
          <yu-xtable-column label="合同流水号" prop="contractNo" min-width="200" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="业务品种" prop="bussName" min-width="180" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="发生类型" prop="occurType" min-width="100" :show-overflow-tooltip="true" data-code="OCCUR_TYPE"></yu-xtable-column>
          <yu-xtable-column label="币种" prop="ccy" min-width="100" data-code="CURR_CD" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="合同金额（元）" prop="contractAmt" min-width="150" align="right" format-money :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="余额（元）" prop="contractBalance" align="right" format-money min-width="150" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="主要担保方式" prop="guaranteeModeName" min-width="120" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="合同生效日" prop="startDate" min-width="120" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="合同到期日" prop="endDate" min-width="120" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="合同状态" prop="contractStatus" min-width="120" :show-overflow-tooltip="true" data-code="CONTRACT_STATE"></yu-xtable-column>
          <yu-xtable-column label="经办人" prop="apperName" min-width="120" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="经办机构" prop="appBranchName" min-width="120" :show-overflow-tooltip="true"></yu-xtable-column>
        </yu-xtable>
        <yu-xtable v-if="queryFormData.type === '5'" key="solved" :data-url="dataUrl.solved" request-type="post" :base-params="baseParams" :dynamic-height="true" border>
          <yu-xtable-column label="合同流水号" prop="contractNo" min-width="150" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="业务品种" prop="bussName" min-width="180" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="发生类型" prop="occurType" min-width="100" :show-overflow-tooltip="true" data-code="OCCUR_TYPE"></yu-xtable-column>
          <yu-xtable-column label="币种" prop="ccy" min-width="100" data-code="CURR_CD" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="合同金额（元）" align="right" format-money prop="contractAmt" min-width="150" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="合同生效日" prop="startDate" min-width="120" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="合同到期日" prop="endDate" min-width="120" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="结清日期" prop="payOffDate" min-width="120" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="合同终结方式" prop="contractEndMode" min-width="120" :show-overflow-tooltip="true" data-code="CONTRACT_END_MODE"></yu-xtable-column>
          <yu-xtable-column label="经办人" prop="apperName" min-width="120" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="经办机构" prop="appBranchName" min-width="120" :show-overflow-tooltip="true"></yu-xtable-column>
        </yu-xtable>
        <yu-xtable v-if="queryFormData.type === '6'" key="provide" :data-url="dataUrl.provide" request-type="post" :base-params="baseParams" :dynamic-height="true" border>
          <yu-xtable-column label="担保合同流水号" prop="guaranteeContractNo" width="150" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="被担保人名称" prop="clientName" width="200" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="担保类型" prop="guaranteeType" width="100" :show-overflow-tooltip="true" data-code="GUARANTEE_TYPE"></yu-xtable-column>
          <yu-xtable-column label="担保方式" prop="guaranteeMode" width="100" :show-overflow-tooltip="true" data-code="GUARANTEE_MODE"></yu-xtable-column>
          <yu-xtable-column label="担保合同状态" prop="guaranteeContractStatus" width="120" :show-overflow-tooltip="true" data-code="GUARANTEE_CONTRACT_STATUS"></yu-xtable-column>
          <yu-xtable-column label="币种" data-code="CURR_CD" prop="ccy" width="100" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="担保总金额（元）" prop="guaranteeTotalAmt" align="right" format-money width="150" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="担保对应业务余额（元）" align="right" format-money prop="guaranteeBal" width="200" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="担保对应业务表内欠息（元）" align="right" format-money prop="inGuaranteeDefaultInterest" width="220" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="担保对应业务表外欠息（元）" align="right" format-money prop="onGuaranteeDefaultInterest" width="220" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="起始日期" prop="startDate" width="120" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="到期日期" prop="endDate" width="120" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="经办人" prop="apperName" width="120" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="经办机构" prop="appBranchName" width="120" :show-overflow-tooltip="true"></yu-xtable-column>
        </yu-xtable>
        <yu-xtable v-if="queryFormData.type === '7'" key="beguaranteed" :data-url="dataUrl.beguaranteed" request-type="post" :base-params="baseParams" :dynamic-height="true" border>
          <yu-xtable-column label="担保合同流水号" prop="guaranteeContractNo" width="150" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="担保人名称" prop="clientName" width="200" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="担保类型" prop="guaranteeType" width="100" :show-overflow-tooltip="true" data-code="GUARANTEE_TYPE"></yu-xtable-column>
          <yu-xtable-column label="担保方式" prop="guaranteeMode" width="100" :show-overflow-tooltip="true" data-code="GUARANTEE_MODE"></yu-xtable-column>
          <yu-xtable-column label="担保合同状态" prop="guaranteeContractStatus" width="120" :show-overflow-tooltip="true" data-code="GUARANTEE_CONTRACT_STATUS"></yu-xtable-column>
          <yu-xtable-column label="币种" data-code="CURR_CD" prop="ccy" width="100" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="担保总金额（元）" prop="guaranteeTotalAmt" align="right" format-money width="150" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="担保对应业务余额（元）" prop="guaranteeBal" align="right" format-money width="180" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="担保对应业务表内欠息（元）" align="right" format-money prop="inGuaranteeDefaultInterest" width="220" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="担保对应业务表外欠息（元）" align="right" format-money prop="onGuaranteeDefaultInterest" width="220" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="起始日期" prop="startDate" width="120" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="到期日期" prop="endDate" width="120" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="经办人" prop="apperName" width="120" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="经办机构" prop="appBranchName" width="120" :show-overflow-tooltip="true"></yu-xtable-column>
        </yu-xtable>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { backend } from "@/config";
import moment from "moment";
import md5 from "js-md5";

@Component({
  name: "CustCredit",
  components: {},
})
export default class extends Vue {
  private custId = this.$route.query.custId;
  private types = [
    { key: "1", value: "授信额度统一视图" },
    { key: "2", value: "授信额度信息" },
    { key: "3", value: "所属集团授信额度信息" },
    { key: "4", value: "未结清授信业务情况" },
    { key: "5", value: "已结清授信业务情况" },
    { key: "6", value: "为本行客户提供担保情况" },
    { key: "7", value: "被本行客户担保情况" },
  ];
  // 103350 00000154
  private loginInfo = JSON.parse(sessionStorage.getItem("loginInfo") as any);

  private prefixStr = `CRM${this.loginInfo.username}${moment().format("YYYYMMDDHHmmss")}`;
  private md5Str = this.prefixStr + md5(`CRM${this.loginInfo.username}HKBANKCRM`).toUpperCase();
  private creditUrl = "";
  // private creditUrl = `http://192.16.5.53:8083/clm-web/unified/index.view?customerId=${this.custId}&AWE_AUTH_TOKEN=${this.md5Str}`

  private queryFormData = {
    type: "1",
  };

  private baseParams = {
    condition: JSON.stringify({
      custId: this.custId,
    }),
  };
  private activeName = "1";
  private dataUrl = {
    credit: backend.custService + "/api/creditinfo/creditlimitinfo",
    group: backend.custService + "/api/creditinfo/groupcreditlimitinfo",
    unsolved: backend.custService + "/api/creditinfo/unsolvedcreditbizinfo",
    solved: backend.custService + "/api/creditinfo/solvedcreditbizinfo",
    provide: backend.custService + "/api/creditinfo/provideguaranteeinfo",
    beguaranteed: backend.custService + "/api/creditinfo/beguaranteedinfo",
  };

  created() {
    (this as any).$lookup.bind("CREDIT_URL", (lookup: any) => {
      this.creditUrl = `${lookup[0].key}?customerId=${this.custId}&AWE_AUTH_TOKEN=${this.md5Str}`;
    });
  }
}
</script>

<style lang="scss" scoped>
.custCredit-container {
  margin-left: 16px;
  min-height: calc(100vh - 125px);
  background: #ffffff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}
</style>
