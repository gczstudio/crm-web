<!--
 * @Descripttion: 渲染弹出框
 * @Author: gaocz
 * @Date: 2022-04-28 15:08:11
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-17 15:11:05
 * @FilePath: /edmp-web/src/views/system/lowCodeMgt/pageMgt/renderTool/components/RenderType.vue
-->
<template>
  <div :class="{ 'render-type': true, 'render-type__fixed': layout === 'fixed' }">
    <div v-for="(item, index) in data" :key="index">
      <RenderChart v-if="item.type === 'chart'" :data="item" />
      <RenderCard v-if="item.type === 'card'" :data="item" />
      <RenderCurd v-if="item.type === 'curd'" :data="item" />
      <RenderDialog v-if="item.type === 'dialog'" :data="item" />
      <RenderForm v-if="item.type === 'form'" :data="item" />
    </div>
  </div>
</template>

<script>
import RenderChart from "./RenderChart.vue";
import RenderCard from "./RenderCard.vue";
import RenderCurd from "./RenderCurd.vue";
import RenderDialog from "./RenderDialog.vue";
import RenderForm from "./RenderForm.vue";
export default {
  name: "RenderType",
  components: {
    RenderChart,
    RenderCard,
    RenderCurd,
    RenderDialog,
    RenderForm,
  },
  props: {
    layout: String,
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.render-type {
  &__fixed {
    height: 100%;
    & > div {
      height: 100%;
    }
  }
}
</style>
