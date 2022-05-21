<!--
 * @Descripttion: 
 * @Author: gaocz
 * @Date: 2022-04-21 08:33:29
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-19 20:23:00
 * @FilePath: /edmp-web/src/components/charts/index.vue
-->
<template>
  <div class="Charts-component">
    <component :is="type" v-bind="$attrs"></component>
  </div>
</template>

<script>
import TableChart from "./TableChart";
import BasicLineChart from "./BasicLineChart";
import MixedLineAndBar from "./MixedLineAndBar";
import BasicBarChart from "./BasicBarChart";
import BasicPieChart from "./BasicPieChart";
import DoughnutChart from "./DoughnutChart";
import BasicRadarChart from "./BasicRadarChart";
import BasicCandlestick from "./BasicCandlestick";
import FunnelChart from "./FunnelChart";
import BasicGaugechart from "./BasicGaugechart";
export default {
  name: "Charts",
  components: {
    BasicLineChart,
    MixedLineAndBar,
    TableChart,
    BasicBarChart,
    BasicPieChart,
    DoughnutChart,
    BasicRadarChart,
    BasicCandlestick,
    FunnelChart,
    BasicGaugechart,
  },
  props: {
    type: {
      required: true,
    },
  },
  data() {
    return {};
  },
  mounted() {
    console.log(this.$attrs, 888);
  },
};
</script>
<style lang="scss">
.Charts-component {
  height: 100%;
}
</style>
