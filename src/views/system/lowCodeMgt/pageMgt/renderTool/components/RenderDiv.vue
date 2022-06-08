<template>
  <div
    v-show="data.tabId && data.activeIds ? data.activeIds.includes(activeTabMap[data.tabId]) : true"
    :class="{ 'render-div': true, edit: type === 'edit' }"
    v-editor.div="{ action: ['delete'] }"
    :style="styles"
  >
    <render-type v-if="data.body && data.body.length" :data="data.body"></render-type>
  </div>
</template>
<script lang="ts">
import { LowCodeModule } from "@/store/modules/lowCode";
import { Component, Vue, Prop, Inject, Watch } from "vue-property-decorator";
@Component({
  name: "RenderDiv",
})
export default class extends Vue {
  @Inject("type") type!: string;
  @Prop() data!: any;
  styles = {};

  get activeTabMap(): any {
    return LowCodeModule.activeTabMap;
  }

  @Watch("data", { immediate: true, deep: true })
  onDataChange() {
    try {
      console.log(this.data.styles, 111);
      this.styles = JSON.parse(this.data.styles);
    } catch (err) {
      console.log(err);
    }
  }
}
</script>
<style lang="scss" scoped>
.render-div {
  &.edit {
    padding: 16px;
  }
}
</style>
