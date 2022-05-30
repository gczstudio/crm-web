<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script lang="ts">
import * as echarts from "echarts";
import { Component, Prop, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ResizeMixin from "@/components/Charts/mixins/resize";

export interface ILineChartData {
  title: string;
  xData: string[] | number[];
  yData: number[] | number[];
}

@Component({
  name: "LineChart",
})
export default class extends mixins(ResizeMixin) {
  @Prop({ required: true }) private chartData!: ILineChartData;
  @Prop({ default: "chart" }) private className!: string;
  @Prop({ default: "100%" }) private width!: string;
  @Prop({ default: "220px" }) private height!: string;

  @Watch("chartData", { deep: true })
  private onChartDataChange(value: ILineChartData) {
    this.setOptions(value);
  }

  private roleCodes = ["R300101", "R300201"]; // 网点和客户经理

  private colorArrs: any = {
    custom: { color: "#00a4db", shadowColor: "rgba(0, 164, 219, 0.5)" },
    red: { color: "#F25A5A", shadowColor: "rgba(242, 90, 90, 0.5)" },
  };

  private colorObj = this.colorArrs["custom"];

  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  }

  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  }

  private initChart() {
    if (!this.$el) return;
    this.chart = echarts.init(this.$el as HTMLDivElement, "macarons");
    this.setOptions(this.chartData);
  }

  @Watch("themeType", { immediate: true })
  onThemeTypeChange(val: any) {
    this.colorObj = this.colorArrs[val];
    this.initChart();
  }

  private formatMinVal(val: any) {
    val = parseInt(val);
    // var pos: any = Math.pow(10, (String(val).length - 1));
    // val = parseInt((val / pos) as any) * pos;
    return val;
  }

  private setOptions(chartData: ILineChartData) {
    if (this.chart) {
      let data = (chartData.yData as any[]).map((item: any) => {
        return this.roleCodes.includes((this as any).$util.getCheckedRole().roleCode)
          ? (this as any).$util.toFixed(parseFloat(item) / 10000)
          : (this as any).$util.toFixed(parseFloat(item) / 100000000);
      });

      this.chart.setOption({
        color: [this.colorObj.color],
        grid: {
          left: 42,
          right: 30,
          bottom: 40,
          top: 40,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
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
          padding: 8,
          formatter: (data: any) => {
            var params = data[0];
            return `<div class="chart-tooltip">
              <p class="num">${params.axisValue}</p>
              <p><span class="chart-dot" style="background:${params.color}"></span>${params.seriesName}：<span class="amount num">${(this as any).$util.toFixed(params.value)}</span</p>
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
          data: chartData.xData,
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
          name: this.roleCodes.includes((this as any).$util.getCheckedRole().roleCode) ? "金额（万元）" : "金额（亿元）", // 总分支： 亿元 客户经理：万元
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
          min: this.formatMinVal(Math.min.apply(null, data as any)),
        },
        series: [
          {
            name: chartData.title,
            smooth: true,
            type: "line",
            symbol: "none",
            lineStyle: {
              width: 3,
              shadowColor: this.colorObj.shadowColor || "rgba(0, 0, 9, 0.3)",
              shadowBlur: 10,
              shadowOffsetY: 8,
            },
            data: data,
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          },
        ],
      });
    }
  }
}
</script>
