<template>
  <div :class="{ 'render-type': true, 'render-type__fixed': layout === 'fixed' }">
    <div v-for="(item, index) in data" :key="index">
      <RenderChart v-if="item.type === 'chart'" :data="item" />
      <RenderCard v-if="item.type === 'card'" :data="item" />
      <RenderCurd v-if="item.type === 'curd'" :data="item" />
      <RenderDialog v-if="item.type === 'dialog'" :data="item" />
      <RenderForm v-if="item.type === 'form'" :data="item" />
      <RenderGrid v-if="item.type === 'grid'" :data="item" />
      <RenderLeftTree v-if="item.type === 'left-tree'" :data="item" />
      <RenderCommonSeach v-if="item.type === 'common-search'" :data="item" />
      <RenderCommonTabs v-if="item.type === 'common-tabs'" :data="item" />
    </div>
  </div>
</template>

<script>
import RenderChart from "./RenderChart.vue";
import RenderCard from "./RenderCard.vue";
import RenderCurd from "./RenderCurd.vue";
import RenderDialog from "./RenderDialog.vue";
import RenderForm from "./RenderForm.vue";
import RenderGrid from "./RenderGrid.vue";
import RenderLeftTree from "./RenderLeftTree.vue";
import RenderCommonSeach from "./RenderCommonSeach.vue";
import RenderCommonTabs from "./RenderCommonTabs.vue";
import { LowCodeModule } from "@/store/modules/lowCode";
export default {
  name: "RenderPageType",
  components: {
    RenderChart,
    RenderCard,
    RenderCurd,
    RenderDialog,
    RenderForm,
    RenderGrid,
    RenderLeftTree,
    RenderCommonSeach,
    RenderCommonTabs,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    layout() {
      return LowCodeModule.layout;
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
