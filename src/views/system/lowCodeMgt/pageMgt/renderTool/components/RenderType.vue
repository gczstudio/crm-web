<template>
  <div :class="{ 'render-type': true, 'render-type__fixed': layout === 'fixed' }">
    <div v-for="(item, index) in data" :key="index">
      <component :is="'render-' + item.type" :data="item"></component>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import RenderChart from "./RenderChart.vue";
import RenderCard from "./RenderCard.vue";
import RenderCurd from "./RenderCurd.vue";
import RenderTable from "./RenderTable.vue";
import RenderDialog from "./RenderDialog.vue";
import RenderForm from "./RenderForm.vue";
import RenderGrid from "./RenderGrid.vue";
import RenderLeftTree from "./RenderLeftTree.vue";
import RenderCommonSearch from "./RenderCommonSearch.vue";
import RenderTab from "./RenderTab.vue";
import RenderDiv from "./RenderDiv.vue";

@Component({
  name: "RenderType",
  components: {
    RenderChart,
    RenderCard,
    RenderCurd,
    RenderTable,
    RenderDialog,
    RenderForm,
    RenderGrid,
    RenderLeftTree,
    RenderCommonSearch,
    RenderTab,
    RenderDiv,
  },
})
export default class extends Vue {
  @Prop({ default: () => [] }) data!: any;
  @Prop() layout!: string;
}
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
