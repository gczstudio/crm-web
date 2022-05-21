<!--
 * @Descripttion: 
 * @Author: gaocz
 * @Date: 2022-04-21 08:31:44
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-20 10:46:55
 * @FilePath: /edmp-web/src/components/charts/BasicGaugechart.vue
-->
<!-- 仪表盘 -->
<template>
  <div :style="{ height: height, width: width }" />
</template>

<script lang="ts">
import * as echarts from "echarts";
import { Component, Prop, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ResizeMixin from "./mixins/resize";

export interface IChartData {
  title: string;
  xAxis: any[];
  yAxis: any[];
  data: any[];
}

@Component({
  name: "BasicGaugechart",
})
export default class extends mixins(ResizeMixin) {
  @Prop({ required: true }) private chartData!: IChartData;
  @Prop({ default: "100%" }) private width!: string;
  @Prop({ default: "100%" }) private height!: string;

  @Watch("chartData", { immediate: true, deep: true })
  private onChartDataChange(value: IChartData) {
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

  private setOptions(chartData: IChartData) {
    if (this.chart) {
      let series = this.chartData.yAxis.map((item) => {
        return {
          type: "line",
          name: item.value,
          data: this.chartData.data.map((ele) => ele[item.key]),
        };
      });
      this.chart.setOption({
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%",
        },
        series: [
          {
            name: "Pressure",
            type: "gauge",
            detail: {
              formatter: "{value}",
            },
            data: [
              {
                value: 50,
                name: "SCORE",
              },
            ],
          },
        ],
      });
    }
  }
}
</script>
