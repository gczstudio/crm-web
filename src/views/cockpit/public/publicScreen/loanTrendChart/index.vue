<template>
  <div class="loanTrendChart-component">
    <div ref="chartRef" style="widht: 100%; height: 182px" @mouseenter="mouseenter" @mouseleave="mouseleave"></div>
    <div class="tab">
      <ol class="clearfix">
        <li v-for="(item, index) in tabs" :key="index" :class="{ active: curTab === index }" @click="clickHandler(index)">{{ item }}</li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Inject, Watch } from "vue-property-decorator";
import * as echarts from "echarts";
import * as screenApi from "@/api/screen";
import moment from "moment";
import { ScreenModule } from "@/store/modules/screen";
@Component({
  name: "LoanTrendChart",
})
export default class extends Vue {
  @Inject() readonly screenInstance!: any;
  @Ref("chartRef") chartRef: any;

  private tabs = ["日", "月"];
  private curTab = 0;

  private timer: any = null;
  private chart: any = null;

  private orgLoanD = null;
  private orgLoanM = null;

  get uniqueKey() {
    return ScreenModule.uniqueKey;
  }

  @Watch("uniqueKey")
  onChangeUniqueKey() {
    this.curTab = this.curTab === 0 ? 1 : 0;
    this.clickHandler(this.curTab);
  }

  mounted() {
    this.queryOrgLoanD();
  }

  mouseenter() {
    this.screenInstance.stopAutoSwitch();
  }

  mouseleave() {
    this.screenInstance.startAutoSwitch();
  }

  // 日
  queryOrgLoanD() {
    if (this.orgLoanD) {
      return this.renderChart(this.orgLoanD);
    }
    screenApi
      .queryOrgLoanD({
        condition: JSON.stringify({
          busiType: this.screenInstance.busiLine,
        }),
      })
      .then((res: any) => {
        this.orgLoanD = res.data;
        this.renderChart(res.data);
      });
  }

  // 月
  queryOrgLoanM() {
    if (this.orgLoanM) {
      return this.renderChart(this.orgLoanM);
    }
    screenApi
      .queryOrgLoanM({
        condition: JSON.stringify({
          busiType: this.screenInstance.busiLine,
        }),
      })
      .then((res: any) => {
        this.orgLoanM = res.data;
        this.renderChart(res.data);
      });
  }

  clickHandler(index: number) {
    this.curTab = index;
    index === 0 ? this.queryOrgLoanD() : this.queryOrgLoanM();
  }

  renderChart(data: any) {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    this.chart = echarts.init(this.chartRef);
    let xData: any = [],
      data1: any = [];
    data.forEach((item: any) => {
      let etlDate = moment(item.etlDate).format("YYYY-MM-DD");
      xData.push(this.curTab === 0 ? etlDate : etlDate.slice(0, 7));
      data1.push(this.$util.toFixed(item.loanBal / 100000000));
    });
    let option = {
      color: ["#44F0FF", "#FFC801"],
      grid: {
        left: 10,
        right: 15,
        bottom: 5,
        top: 45,
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        padding: 0,
        borderWidth: 0,
        backgroundColor: "transparent",
        position: function (point: any, params: any, dom: any, rect: any, size: any) {
          // 提示框位置
          let x = 0,
            y = 0;
          // 鼠标位置 特殊情况，去除左边菜单栏的宽度
          let pointX = point[0],
            pointY = point[1];
          // 外面div大小
          let viweWdith = size.viewSize[0],
            viewHeight = size.viewSize[1];
          //提示框大小
          let boxWdith = size.contentSize[0],
            boxHeight = size.contentSize[1];

          if (boxWdith > pointX) {
            x = 5;
          } else {
            x = pointX - boxWdith - 10;
          }

          if (boxHeight > pointY) {
            y = 5;
          } else {
            y = pointY - boxHeight - 10;
          }

          return [x, y];
        },
        formatter: (data: any) => {
          var params = data[0];
          return `<div class="chart-tooltip">
            <p class="num">${params.axisValue}</p>
            <p><span class="chart-dot" style="background:${params.color}"></span>${params.seriesName}：<span class="amount num">${(this as any).$util.toFixed(
            params.value
          )}</span><span class="unit">亿元</span></p>
          </div>`;
        },
      },
      xAxis: {
        data: xData,
        boundaryGap: false,
        axisTick: {
          show: true,
        },
        axisLine: {
          lineStyle: {
            color: "#162B5F",
          },
        },
        axisLabel: {
          color: "#44F0FF",
          fontFamily: "Times New Roman",
          formatter: (data: any) => {
            if (this.curTab === 0) {
              return data.substring(5);
            } else {
              return parseInt(data.substring(5, 7)) + "M";
            }
          },
        },
      },
      yAxis: {
        name: "亿元",
        nameTextStyle: {
          padding: [0, 6, 0, 0],
          align: "right",
          color: "#44F0FF",
          fontSize: 12,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: "#44F0FF",
          fontFamily: "Times New Roman",
        },
        splitLine: {
          lineStyle: {
            color: "#162B5F",
          },
        },
        min: parseInt(Math.min.apply(null, data1 as any) as any),
      },
      series: [
        {
          name: "余额",
          type: "line",
          smooth: true,
          symbol: "none",
          data: data1,
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(68, 240, 255, 0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(2, 17, 50, 0.3)",
                },
              ],
              global: false,
            },
          },
          animationDuration: 2000,
          animationEasing: "cubicInOut",
        },
      ],
    };
    this.chart.setOption(option, true);
  }
}
</script>

<style lang="scss" scoped>
.loanTrendChart-component {
  position: relative;
  .tab {
    font-size: 12px;
    position: absolute;
    top: 10px;
    right: 0;
    border: 1px solid rgba(64, 214, 246, 0.6);
    border-radius: 3px;
    li {
      cursor: pointer;
      float: left;
      padding: 0 14px;
      height: 20px;
      line-height: 20px;
      color: #40d5f5;
      &.active {
        background: rgba(64, 214, 246, 0.2);
      }
    }
  }
}
</style>
