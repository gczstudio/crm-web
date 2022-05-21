<!--
 * @Descripttion: 
 * @Author: gaocz
 * @Date: 2022-04-21 08:31:44
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-19 20:18:57
 * @FilePath: /edmp-web/src/components/charts/FunnelChart.vue
-->
<!-- 漏斗图 -->
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
  name: "FunnelChart",
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
      console.log(series);
      this.chart.setOption({
        title: {
          text: "Funnel",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}%",
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {},
          },
        },
        legend: {
          data: ["Show", "Click", "Visit", "Inquiry", "Order"],
        },
        series: [
          {
            name: "Funnel",
            type: "funnel",
            left: "10%",
            top: 60,
            bottom: 60,
            width: "80%",
            min: 0,
            max: 100,
            minSize: "0%",
            maxSize: "100%",
            sort: "descending",
            gap: 2,
            label: {
              show: true,
              position: "inside",
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: "solid",
              },
            },
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 1,
            },
            emphasis: {
              label: {
                fontSize: 20,
              },
            },
            data: [
              { value: 60, name: "Visit" },
              { value: 40, name: "Inquiry" },
              { value: 20, name: "Order" },
              { value: 80, name: "Click" },
              { value: 100, name: "Show" },
            ],
          },
        ],
      });
    }
  }
}
</script>
