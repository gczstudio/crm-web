<template>
  <div class="TrendChart-container">
    <div class="chart-title f3">{{ options.name }}<small-tab class="fr" type="top" v-model="curTab" :data="['日', '月']" @change="tabChange"></small-tab></div>
    <div id="custTrendChart" style="height: 202px"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import * as echarts from "echarts";
import ResizeMixin from "@/components/Charts/mixins/resize";
import * as customerApi from "@/api/customer";
import { CustomerModule } from "@/store/modules/customer";

@Component({
  name: "TrendChart",
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: () => null }) private options!: any;

  private chartData = {};
  private curTab = 0;
  private crmCustId = this.$route.query.crmCustId as string;
  private colorArrs: any = {
    custom: { color: "#00a4db", shadowColor: "rgba(0, 164, 219, 0.5)" },
    red: { color: "#F25A5A", shadowColor: "rgba(242, 90, 90, 0.5)" },
  };

  private colorObj = this.colorArrs["custom"];

  @Watch("themeType", { immediate: true })
  onThemeTypeChange(val: any) {
    this.colorObj = this.colorArrs[val];
    this.tabChange();
  }

  mounted() {
    this.tabChange();
  }

  async getData() {
    return this.curTab ? this.getDepoistTrendByMonth() : this.getDepoistTrendByDay();
  }

  async tabChange() {
    let res = await this.getData();
    this.renderChart(this.curTab ? res.data.monthTrendInfo : res.data.dayTrendInfo);
  }

  async getDepoistTrendByDay() {
    return customerApi.getDepoistTrendByDay(this.crmCustId);
  }

  async getDepoistTrendByMonth() {
    return customerApi.getDepoistTrendByMonth(this.crmCustId);
  }

  // res.data?.dayTrendInfo;

  renderChart(data: []) {
    let chart = echarts.init(document.getElementById("custTrendChart") as HTMLElement, "macarons");
    let xData = data.map((item: any) => {
      if (this.curTab) {
        return item.etlDate.slice(0, 6);
      }
      return item.etlDate;
    });
    let yData1 = data.map((item: any) => (this as any).$util.toFixed(item.depBal / 10000));
    let yData2 = data.map((item: any) => (this as any).$util.toFixed(item.depBalAvg / 10000));
    // let minVal = Math.min.apply(null, yData1.concat(yData2) as any)

    chart.setOption(
      {
        color: ["#0FCB51", this.colorObj.color],
        grid: {
          left: 42,
          right: 40,
          bottom: 40,
          top: 40,
          containLabel: true,
        },
        legend: {
          icon: "circle",
          data: ["余额", "日均"],
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          padding: 8,
          formatter: (data: any) => {
            var params = data[0];
            var str = "";
            data.forEach((item: any) => {
              str += `<p><span class="chart-dot" style="background:${item.color}"></span>${item.seriesName}：<span class="amount num">${(this as any).$util.toFixed(item.value)}</span</p>`;
            });
            return `<div class="chart-tooltip">
            <p class="num">${params.axisValue}</p>
            ${str}
          </div>`;
          },
        },
        dataZoom: {
          type: "slider",
          start: 0,
          end: 100,
          bottom: 10,
          height: 15,
          borderColor: "#CFF3FF",
          backgroundColor: "transparent",
          dataBackground: {
            lineStyle: {
              color: "transparent",
            },
            areaStyle: {
              color: "transparent",
            },
          },
          selectedDataBackground: {
            lineStyle: {
              color: "transparent",
            },
            areaStyle: {
              color: "transparent",
            },
          },
          fillerColor: "rgba(60, 207, 255, 0.1)",
          moveHandleSize: 0,
        },
        xAxis: {
          data: xData,
          boundaryGap: false,
          axisTick: {
            show: true,
          },
          axisLine: {
            lineStyle: {
              color: "#BFBFBF",
            },
          },
          axisLabel: {
            color: "#333",
            fontFamily: "Times New Roman",
          },
        },
        yAxis: {
          name: "金额（万元）",
          nameTextStyle: {
            color: "#333",
            fontSize: 14,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#333",
            fontFamily: "Times New Roman",
          },
          // min: minVal
        },
        series: [
          {
            name: "余额",
            smooth: true,
            type: "line",
            symbol: "none",
            lineStyle: {
              width: 3,
              shadowColor: "rgba(15, 203, 81, 0.3)",
              shadowBlur: 10,
              shadowOffsetY: 8,
            },
            data: yData1,
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          },
          {
            name: "日均",
            smooth: true,
            type: "line",
            symbol: "none",
            lineStyle: {
              width: 3,
              shadowColor: this.colorObj.shadowColor,
              shadowBlur: 10,
              shadowOffsetY: 8,
            },
            data: yData2,
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          },
        ],
      },
      true
    );
  }
}
</script>

<style lang="scss" scoped>
.TrendChart-container {
  position: relative;
  padding: 20px 20px 0;
  background: #fff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  .el-icon-close {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
    // color: $blue;
    font-weight: bold;
    transform: rotate(0);
    transition: all 0.3s;
    &:hover {
      transform: rotate(90deg);
    }
  }
  .chart-title {
    padding-left: 10px;
    font-weight: bold;
    // border-left: 4px solid $blue;
    margin-bottom: 10px;
  }
  #basicChart {
    height: 220px;
  }
}
</style>
