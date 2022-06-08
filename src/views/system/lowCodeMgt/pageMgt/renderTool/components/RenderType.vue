<template>
  <div :class="{ 'render-type': true, 'render-type__fixed': layout === 'fixed' }">
    <div v-for="(item, index) in data" :key="index">
      <component :is="'render-' + item.type" :data="item" :layout="layout"></component>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";
import RenderPage from "./RenderPage.vue";
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
    RenderPage,
  },
})
export default class extends Vue {
  @Prop({ default: () => [] }) data!: any;
  @Prop() layout!: string;
  @Inject("type") type!: string;
  @Watch("data")
  onDataChange(val: any) {
    console.log(val, "xff");
  }
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
