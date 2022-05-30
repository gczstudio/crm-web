<template>
  <div class="CountTrendChart-container">
    <div class="chart-title">交易笔数趋势图<small-tab class="fr" type="top" v-model="curTab" :data="['日', '月']" @change="tabChange"></small-tab></div>
    <div id="countTrendChart" style="height: 340px"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import * as echarts from "echarts";
import ResizeMixin from "@/components/Charts/mixins/resize";
import * as customerApi from "@/api/customer";

@Component({
  name: "CountTrendChart",
})
export default class extends mixins(ResizeMixin) {
  private chartData = {};
  private curTab = 0;
  private crmCustId = this.$route.query.crmCustId as string;

  async mounted() {
    this.tabChange();
  }

  async getData() {
    return this.curTab ? this.getDealTrendByMonth() : this.getDealTrendByDay();
  }

  async tabChange() {
    let res = await this.getData();
    this.renderChart(res.data);
  }

  async getDealTrendByDay() {
    return customerApi.getDealTrendByDay(this.crmCustId);
  }

  async getDealTrendByMonth() {
    return customerApi.getDealTrendByMonth(this.crmCustId);
  }

  renderChart(data: []) {
    let chart = echarts.init(document.getElementById("countTrendChart") as HTMLElement);
    chart.setOption(
      {
        color: ["#00A4DB", "#0FCB51", "#F8DE63"],
        grid: {
          left: 40,
          right: 40,
          bottom: 50,
          top: 80,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          padding: 8,
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
          data: data.map((item: any) => item[this.curTab ? "dataMonth" : "etlDate"]),
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
          name: "笔数",
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#333",
            fontFamily: "Times New Roman",
          },
        },
        series: [
          {
            name: "交易笔数",
            smooth: true,
            type: "line",
            symbol: "none",
            lineStyle: {
              width: 3,
              shadowColor: "rgba(0, 164, 219, 0.3)",
              shadowBlur: 10,
              shadowOffsetY: 8,
            },
            data: data.map((item: any) => item.tranNum || 0),
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
.CountTrendChart-container {
  position: relative;
  padding: 20px 20px 0;
  background: #fff;
  box-shadow: 0px 3px 10px 1px rgba(0, 92, 187, 0.3);
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
    font-size: 16px;
    padding-left: 10px;
    // border-left: 4px solid $blue;
    margin-bottom: 10px;
    font-weight: bold;
  }
  #basicChart {
    height: 220px;
  }
}
</style>
