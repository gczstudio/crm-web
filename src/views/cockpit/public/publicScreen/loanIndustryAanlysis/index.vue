<template>
  <div class="loanIndustryAanlysis-component">
    <div ref="chartRef" style="width: 100%; height: 172px"></div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Inject, Watch } from "vue-property-decorator";
import * as echarts from "echarts";
import * as screenApi from "@/api/screen";
import { ScreenModule } from "@/store/modules/screen";
@Component({
  name: "LoanIndustryAanlysis",
})
export default class extends Vue {
  @Inject() readonly screenInstance!: any;
  @Ref("chartRef") chartRef: any;

  private timer: any = null;
  private chart: any = null;
  private loanData = null;

  get uniqueKey() {
    return ScreenModule.uniqueKey;
  }

  @Watch("uniqueKey")
  onChangeUniqueKey() {
    this.queryloan();
  }

  mounted() {
    this.queryloan();
  }

  queryloan() {
    if (this.loanData) {
      return this.renderChart(this.loanData);
    }
    screenApi
      .queryloan({
        condition: JSON.stringify({
          busiLine: this.screenInstance.busiLine,
        }),
      })
      .then((res: any) => {
        this.loanData = res.data;
        this.renderChart(res.data);
      });
  }

  renderChart(data: any) {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    this.chart = echarts.init(this.chartRef);
    let yData = ["制造业", "批发和零售业", "租赁和商务服务业", "房地产业", "建筑业", "其他"];
    let xData: any = [],
      percent: any = [],
      sum = 0;
    yData.forEach((item: any, index: number) => {
      let curData = data.find((ele: any) => item === ele.indsNm);
      percent.push(curData.loanBalRatio);
      sum += curData.loanBal / 100000000;
      xData.push(this.$util.toFixed(curData.loanBal / 100000000));
    });

    var barWidth = 10;
    let option = {
      tooltip: {
        trigger: "item",
        padding: 0,
        borderWidth: 0,
        backgroundColor: "transparent",
        formatter: (data: any) => {
          if (data.color === "#01EDFB") {
            return "";
          }
          return `<div class="chart-tooltip">
              <p><span class="chart-dot" style="background:#127AE7"></span>${data.name}：<span class="amount num">${(this as any).$util.toFixed(data.value)}</span><span class="unit">亿元</span></p>
            </div>`;
        },
      },
      grid: {
        top: 20,
        right: 40,
        bottom: 0,
        left: 120,
      },
      xAxis: {
        show: false,
        type: "value",
      },
      yAxis: [
        {
          type: "category",
          inverse: true,
          axisLabel: {
            show: true,
            textStyle: {
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: 14,
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          data: yData,
        },
        {
          type: "category",
          inverse: true,
          axisTick: "none",
          axisLine: "none",
          show: true,
          offset: -15,
          axisLabel: {
            textStyle: {
              color: "#FFC801",
              fontSize: 14,
            },
            formatter: (value: any, index: any) => {
              return `${percent[index]}%`;
            },
          },
          data: xData,
        },
      ],
      series: [
        {
          // 底部背景
          name: "",
          type: "bar",
          barWidth: barWidth,
          z: 0,
          itemStyle: {
            color: "#01EDFB",
            opacity: 0.1,
            borderRadius: 5,
          },
          animationDuration: 2000,
          animationEasing: "cubicInOut",
          data: new Array(xData.length).fill(sum),
        },
        {
          //柱子
          name: "",
          type: "bar",
          barWidth: barWidth,
          barGap: "-100%",
          itemStyle: {
            //lenged文本
            opacity: 0.7,
            color: function () {
              return new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#127AE7", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#44F0FF", // 100% 处的颜色
                  },
                ],
                false
              );
            },
          },
          animationDuration: 2000,
          animationEasing: "cubicInOut",
          data: xData,
        },
        {
          //柱子顶部圆片
          name: "",
          type: "pictorialBar",
          symbolSize: [5, barWidth],
          symbolOffset: [2, 0],
          z: 12,
          itemStyle: {
            opacity: 1,
            color: function () {
              return new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#127AE7", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#44F0FF", // 100% 处的颜色
                  },
                ],
                false
              );
            },
          },
          symbolPosition: "end",
          animationDuration: 2000,
          animationEasing: "cubicInOut",
          data: xData,
        },
        {
          //柱子底部圆片
          name: "",
          type: "pictorialBar",
          symbolSize: [5, barWidth],
          symbolOffset: [-2, 0],
          z: 12,
          itemStyle: {
            opacity: 1,
            color: function () {
              return new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#127AE7", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#44F0FF", // 100% 处的颜色
                  },
                ],
                false
              );
            },
          },
          animationDuration: 2000,
          animationEasing: "cubicInOut",
          data: xData,
        },
      ],
    };
    this.chart.setOption(option);
  }
}
</script>
