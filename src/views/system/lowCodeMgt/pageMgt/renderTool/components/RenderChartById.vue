<!--
 * @Descripttion: 根据传递id渲染图表
 * @Author: gaocz
 * @Date: 2022-04-28 15:08:11
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-10 08:33:54
 * @FilePath: /edmp-web/src/views/system/lowCodeMgt/pageMgt/renderTool/components/RenderChartById.vue
-->
<template>
  <charts :type="type" :chart-data="chartData" />
</template>

<script>
import Chart from "@/components/charts/index.vue";
export default {
  name: "RenderChartById",
  props: {
    id: String,
  },
  data() {
    return {
      type: "",
      chartData: {},
    };
  },
  mounted() {
    this.type = "BasicLineChart";
    this.chartData = {
      title: "xxx",
      xData: [1, 12, 321, 12, 43],
      yData: [1, 32, 43, 45, 6],
    };
  },
};
</script>
<style lang="scss"></style>
