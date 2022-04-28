<template>
  <div class="evaList-component">
    <div class="base-form">
      <yu-xform ref="searchForm" :model="queryFormData" form-type="search" :search="searchFn">
        <yu-xform-group :column="3">
          <yu-xform-item style="width: 300px" label="数据日期" name="startDate" ctype="date-picker" placeholder="数据日期" :rules="globalRules.required"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <!-- <div class="title">{{$route.query.title.split('-')[1]}}</div> -->
      <div class="quota">
        <yu-xtable ref="refTable" :data="evaData" border :pageable="false" v-loading="loading">
          <yu-xtable-column label="名称" prop="name" width="120"></yu-xtable-column>
          <yu-xtable-column label="数值" prop="value" width="150">
            <template slot-scope="scope">
              <div :class="`${scope.row.key === 'custNm' ? '' : 'num'}`" style="text-align: right">{{ scope.row.value }}</div>
            </template>
          </yu-xtable-column>
          <yu-xtable-column label="计算说明" prop="desc" min-width="200"></yu-xtable-column>
        </yu-xtable>
      </div>
    </div>
    <div class="base-title">
      <img src="~@/assets/images/customer/eva-title.png" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from "vue-property-decorator";
import { getevalist, getevapro } from "@/api/customer";
import moment from "moment";
@Component({
  name: "BaseInfo",
})
export default class extends Vue {
  @Ref("form") form: any;
  private crmCustId = this.$route.query.crmCustId;
  private custNm = (this.$route.query.title as any).split("-")[1];
  private evaData = [
    // { name: '客户名称', key: 'custNm', value: this.custNm, desc: '' },
    { name: "EVA", key: "eva", value: "", desc: "净利润-经济资本成本×年初至数据日天数÷本年总天数。", unit: "元" },
    { name: "净利润", key: "netProfit", value: "", desc: "业务利润-增值税附加-所得税", unit: "元" },
    { name: "业务利润", key: "profitContribution", value: "", desc: "FTP利润+中间业务收入", unit: "元" },
    { name: "FTP利润", key: "ftpProfitBalnc", value: "", unit: "元" },
    { name: "中间业务收入", key: "midBizInc", value: "", unit: "元" },
    { name: "增值税附加", key: "vatAddTax", value: "", desc: "（贷款利息收入+税后中间业务收入）×增值税率6%×增值税附加税率11.5%", unit: "元" },
    { name: "所得税", key: "incomeTax", value: "", desc: "（业务利润-增值税附加）×所得税率25%", unit: "元" },
    { name: "经济资本占用", key: "ecOcc", value: "", unit: "元" },
    { name: "经济资本成本", key: "ecCost", value: "", desc: "经济资本占用×经济资本回报率5.5%", unit: "元" },
    { name: "RAROC", key: "raroc", value: "", desc: "净利润÷经济资本占用÷年初至数据日天数×本年总天数", unit: "%" },
  ];

  private ftpDate = sessionStorage.getItem("ftpDate");
  private queryFormData = {
    startDate: moment(this.ftpDate).format("YYYY-MM-DD"),
  };

  private loading = false;

  created() {
    this.getEvaList();
    this.getEvaPro();
  }

  searchFn() {
    this.getEvaList();
  }

  getEvaList() {
    this.loading = true;
    let params = {
      condition: JSON.stringify({
        crmCustId: this.crmCustId,
        ...this.queryFormData,
      }),
      page: 1,
      size: 10,
    };
    getevalist(params).then((res) => {
      setTimeout(() => {
        this.loading = false;
      }, 300);
      if (res.data) {
        this.evaData = this.evaData.map((item) => {
          let value = this.$util.formatMoney(res.data[0]?.[item.key]);
          value = value ? value + item.unit : "";
          if (item.key === "custNm") {
            value = item.value;
          }
          if (item.key === "raroc") {
            if (res.data[0] && !res.data[0].ecCost) {
              value = "-";
            }
          }
          return {
            ...item,
            value: value,
          };
        });
      }
    });
  }

  getEvaPro() {
    getevapro().then((res) => {
      this.$set(this.evaData, 5, {
        ...this.evaData[5],
        desc: `（贷款利息收入+税后中间业务收入）×增值税率${res.data[0].propValue}%×增值税附加税率${res.data[1].propValue}%`,
      });
      this.$set(this.evaData, 6, {
        ...this.evaData[6],
        desc: `（业务利润-增值税附加）×所得税率${res.data[2].propValue}%`,
      });
      this.$set(this.evaData, 8, {
        ...this.evaData[8],
        desc: `经济资本占用×经济资本回报率${res.data[3].propValue}%`,
      });
    });
  }
}
</script>

<style lang="scss" scoped>
.evaList-component {
  position: relative;
  background: #fff;
  min-height: calc(100vh - 180px);
  .base-form {
    margin-right: 447px;
    padding: 20px 20px 0;
    .title {
      font-size: 18px;
      font-weight: bold;
      padding: 28px 0 10px;
      border-bottom: 1px solid #d8d8d8;
    }
    .quota {
      margin-top: 10px;
      ::v-deep.yu-xtable {
        .el-table--border th {
          background: #efefef;
          height: 48px;
          line-height: 48px;
        }
        .el-table td {
          height: 48px;
          line-height: 48px;
        }
        .el-table .el-table__body tr:hover > td {
          background: #e6f6fb;
        }
        .el-table__body tr.current-row > td {
          background: none;
        }
        .el-table tr:nth-child(2n) {
          background: #efefef;
        }
      }
    }
  }
  .base-title {
    position: absolute;
    top: 0;
    right: 0;
    width: 447px;
    height: 100%;
    background: url("../../../../../assets/images/customer/eva-bg.png") no-repeat center right;
    background-size: 447px 100%;
    img {
      position: absolute;
      top: 82px;
      right: 294px;
    }
  }
}

@media screen and (max-width: 1680px) {
  .evaList-component {
    min-height: calc(100vh - 155px);
  }
}
</style>
