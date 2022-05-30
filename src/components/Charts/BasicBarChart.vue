<!--
 * @Descripttion: 
 * @Author: gaocz
 * @Date: 2022-04-21 08:31:44
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-19 20:08:47
 * @FilePath: /edmp-web/src/components/charts/BasicBarChart.vue
-->
<!-- 基础柱状图 -->
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
  name: "BasicBarChart",
})
export default class extends mixins(ResizeMixin) {
  @Prop({ required: true }) chartData!: IChartData;
  @Prop({ default: "100%" }) width!: string;
  @Prop({ default: "100%" }) height!: string;

  @Watch("chartData", { immediate: true, deep: true })
  private onChartDataChange() {
    this.setOptions();
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
    this.setOptions();
  }

  private formatMinVal(val: any) {
    val = parseInt(val);
    return val;
  }

  private setOptions() {
    if (this.chart) {
      let series = this.chartData.yAxis.map((item) => {
        return {
          type: "bar",
          name: item.value,
          data: this.chartData.data ? this.chartData.data.map((ele) => ele[item.key]) : [],
        };
      });
      console.log(series);
      this.chart.setOption({
        grid: {
          top: 20,
          left: 40,
          right: 20,
          bottom: 30,
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
        },
        xAxis: {
          type: "category",
          data: this.chartData.data ? this.chartData.data.map((item) => item[this.chartData.xAxis[0].key]) : [],
        },
        yAxis: {
          type: "value",
        },
        series,
      });
    }
  }
}
</script>
