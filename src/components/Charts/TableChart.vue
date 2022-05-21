<!--
 * @Descripttion: 
 * @Author: gaocz
 * @Date: 2022-05-19 14:03:59
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-19 20:08:07
 * @FilePath: /edmp-web/src/components/charts/TableChart.vue
-->
<!-- 表格 -->
<template>
  <div :style="{ height: height, width: width }" v-if="columns.length">
    <yu-xtable ref="refTable" :data="tableData" :dynamic-height="true" border :pageable="false">
      <yu-xtable-column v-for="(item, index) in columns" :key="index" v-bind="item" :show-overflow-tooltip="true"></yu-xtable-column>
    </yu-xtable>
  </div>
</template>

<script lang="ts">
import * as echarts from "echarts";
import { Component, Prop, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ResizeMixin from "@/components/charts/mixins/resize";

export interface IChartData {
  title: string;
  xAxis: any[];
  yAxis: any[];
  data: any[];
}

export interface IColumn {
  label: string;
  prop: string;
}

@Component({
  name: "TableChart",
})
export default class extends mixins(ResizeMixin) {
  @Prop({ required: true }) private chartData!: IChartData;
  @Prop({ default: "100%" }) private width!: string;
  @Prop({ default: "100%" }) private height!: string;

  private tableData: any[] = [];
  private columns: IColumn[] = [];

  @Watch("chartData", { immediate: true, deep: true })
  private onChartDataChange(chartData: IChartData) {
    this.columns = chartData.xAxis.concat(chartData.yAxis).map((item) => {
      return {
        label: item.value,
        prop: item.key,
        minWidth: 15 * item.value.length + 40 + "px",
      };
    });
    this.tableData = this.chartData.data;
  }
}
</script>
