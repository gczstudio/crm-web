<!--
 * @Descripttion: 
 * @Author: gaocz
 * @Date: 2022-04-21 08:31:44
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-19 20:08:57
 * @FilePath: /edmp-web/src/components/charts/BasicPieChart.vue
-->
<!-- 基础饼图 -->
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
  name: "BasicPieChart",
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
      let data = this.chartData.yAxis.map((item) => {
        return {
          name: item.value,
          value: this.chartData.data[0][item.key],
        };
      });
      this.chart.setOption({
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "50%",
            data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    }
  }
}
</script>
