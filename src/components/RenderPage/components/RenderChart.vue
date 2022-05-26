<!--
 * @Descripttion: 根据传递id渲染图表
 * @Author: gaocz
 * @Date: 2022-04-28 15:08:11
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-20 10:41:27
 * @FilePath: /edmp-web/src/views/system/lowCodeMgt/pageMgt/renderTool/components/RenderChart.vue
-->
<template>
  <charts v-editor.chart="{ id: data.id }" :type="type" :chart-data="chartData" />
</template>

<script>
import { queryDsData } from "@/api/lowCode";
export default {
  name: "RenderChart",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dsId: "",
      type: "",
      chartData: {},
    };
  },
  watch: {
    data: {
      handler(val) {
        if (Object.keys(val).length) {
          this.chartData = JSON.parse(val.modConfig);
          this.type = this.chartData.compName;
          this.dsId = this.chartData.dsId;
          this.getDsData();
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 请求数据模型数据
    getDsData() {
      queryDsData({
        condition: JSON.stringify({
          dsId: this.dsId,
        }),
      }).then((res) => {
        this.chartData = {
          ...this.chartData,
          data: res.data,
        };
      });
    },
  },
};
</script>
<style lang="scss"></style>
