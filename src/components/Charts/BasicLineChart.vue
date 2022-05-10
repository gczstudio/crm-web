<!--
 * @Descripttion: 
 * @Author: gaocz
 * @Date: 2022-04-21 08:31:44
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-10 08:34:18
 * @FilePath: /edmp-web/src/components/charts/BasicLineChart.vue
-->
<!-- 基础折线图 -->
<!-- 柱线混合图 -->
<template>
  <div :style="{ height: height, width: width }" />
</template>

<script lang="ts">
import * as echarts from "echarts";
import { Component, Prop, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ResizeMixin from "./mixins/resize";

export interface ILineChartData {
  title: string;
  xData: string[] | number[];
  yData: number[] | number[];
}

@Component({
  name: "BasicLineChart",
})
export default class extends mixins(ResizeMixin) {
  @Prop({ required: true }) private chartData!: ILineChartData;
  @Prop({ default: "100%" }) private width!: string;
  @Prop({ default: "100%" }) private height!: string;

  @Watch("chartData", { deep: true })
  private onChartDataChange(value: ILineChartData) {
    this.setOptions(value);
  }

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

  private formatMinVal(val: any) {
    val = parseInt(val);
    return val;
  }

  private setOptions(chartData: ILineChartData) {
    if (this.chart) {
      this.chart.setOption({
        grid: {
          top: 20,
          left: 40,
          right: 20,
          bottom: 30,
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      });
    }
  }
}
</script>
