<template>
  <div class="tradeGather-container">
    <div class="yu-main-wrapper">
      <!--查询form表单 -->
      <div class="yu-main-form">
        <yu-xform :model="queryFormData" class="search" :reset="resetFn" :search="analyseSearchFn" form-type="search">
          <yu-xform-group :column="4">
            <yu-xform-item label="开始日期" name="tranDateStart" ctype="date-picker" placeholder="开始日期" :picker-options="startPickerOptions"></yu-xform-item>
            <yu-xform-item label="结束日期" name="tranDateEnd" ctype="date-picker" placeholder="结束日期" :picker-options="endPickerOptions"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </div>
      <div class="yu-main-content">
        <el-row :gutter="isMaxScreen ? 16 : 12" class="trade-gather__row">
          <el-col :span="12">
            <div class="in-out-box">
              <div class="title f3"><i class="iconfont icon-liuru"></i>资金流入</div>
              <div class="yu-main-table">
                <yu-xtable ref="inRef" :data-url="dataUrl" :base-params="inParams" :pageable="false" :dynamic-height="true" border>
                  <yu-xtable-column label="对方户名" prop="opstAcctNm" :show-overflow-tooltip="true" sortable></yu-xtable-column>
                  <yu-xtable-column label="对方行名" prop="opstBankNm" :show-overflow-tooltip="true" sortable></yu-xtable-column>
                  <yu-xtable-column label="流入金额（元）" prop="totalTranAmt" align="right" format-money :show-overflow-tooltip="true" sortable></yu-xtable-column>
                  <yu-xtable-column label="交易笔数" prop="tranNum" :show-overflow-tooltip="true" align="right" is-num sortable></yu-xtable-column>
                </yu-xtable>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="in-out-box">
              <div class="title f3"><i class="iconfont icon-liuchu"></i>资金流出</div>
              <div class="yu-main-table">
                <yu-xtable ref="outRef" :data-url="dataUrl" :base-params="outParams" :pageable="false" :dynamic-height="true" border>
                  <yu-xtable-column label="对方户名" prop="opstAcctNm" :show-overflow-tooltip="true" sortable></yu-xtable-column>
                  <yu-xtable-column label="对方行名" prop="opstBankNm" :show-overflow-tooltip="true" sortable></yu-xtable-column>
                  <yu-xtable-column label="流出金额（元）" prop="totalTranAmt" align="right" format-money :show-overflow-tooltip="true" sortable></yu-xtable-column>
                  <yu-xtable-column label="交易笔数" prop="tranNum" :show-overflow-tooltip="true" align="right" is-num sortable></yu-xtable-column>
                </yu-xtable>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import { formatMoney } from "@/utils";
import * as customerApi from "@/api/customer";
import { backend } from "@/config";
import moment from "moment";

@Component({
  name: "DepositAnalyse",
  components: {},
})
export default class extends Vue {
  @Ref("inRef") inRef: any;
  @Ref("outRef") outRef: any;

  private dataUrl = backend.custService + "/api/depoistinfo/totalflow";
  private queryFormData = {
    tranDateStart: moment().subtract(3, "month").format("YYYY-MM-DD"),
    tranDateEnd: moment().format("YYYY-MM-DD"),
  };
  private inParams = {
    condition: JSON.stringify({
      dcFlag: "C",
      ...this.$route.query,
      tranDateStart: moment().subtract(3, "month").format("YYYY-MM-DD"),
      tranDateEnd: moment().format("YYYY-MM-DD"),
    }),
  };

  private outParams = {
    condition: JSON.stringify({
      dcFlag: "D",
      ...this.$route.query,
      tranDateStart: moment().subtract(3, "month").format("YYYY-MM-DD"),
      tranDateEnd: moment().format("YYYY-MM-DD"),
    }),
  };

  private startPickerOptions = {
    disabledDate: (time: Date) => {
      if (this.queryFormData.tranDateEnd) {
        return time.getTime() >= new Date(this.queryFormData.tranDateEnd).getTime();
      }
    },
  };

  private endPickerOptions = {
    disabledDate: (time: Date) => {
      if (this.queryFormData.tranDateStart) {
        return time.getTime() <= new Date(this.queryFormData.tranDateStart).getTime() - 86400000;
      }
    },
  };

  resetFn() {
    this.queryFormData = {
      tranDateStart: "",
      tranDateEnd: "",
    };
  }

  analyseSearchFn() {
    const { tranDateStart, tranDateEnd } = this.queryFormData as any;
    let params = {
      condition: JSON.stringify({
        tranDateStart: tranDateStart ? moment(tranDateStart).format("YYYY-MM-DD") : null,
        tranDateEnd: tranDateEnd ? moment(tranDateEnd).format("YYYY-MM-DD") : null,
      }),
    };
    this.inRef.remoteData(params);
    this.outRef.remoteData(params);
  }
}
</script>

<style lang="scss" scoped>
.yu-main-content {
  padding-bottom: 16px;
  .in-out-box {
    background: #ffffff;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    .title {
      margin-top: 2px;
      padding: 16px;
      .iconfont {
        margin-right: 10px;
      }
    }
  }
  .trade-gather__row {
    padding: 0 16px;
  }
}
@media screen and (max-width: 1680px) {
  .yu-main-content {
    padding-bottom: 12px;
    .trade-gather__row {
      padding: 0 12px;
    }
  }
}
</style>
