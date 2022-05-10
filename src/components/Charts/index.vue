<!--
 * @Descripttion: 
 * @Author: gaocz
 * @Date: 2022-04-21 08:33:29
 * @LastEditors: gaocz
 * @LastEditTime: 2022-04-28 15:27:53
 * @FilePath: /edmp-web/src/components/Charts/index.vue
-->
<template>
  <div class="Charts-component">
    <component :is="type" v-bind="$attrs"></component>
  </div>
</template>

<script>
import BasicLineChart from "./BasicLineChart";
import MixedLineAndBar from "./MixedLineAndBar";
export default {
  name: "Charts",
  components: {
    BasicLineChart,
    MixedLineAndBar,
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
