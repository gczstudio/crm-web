<template>
  <div class="render-common-search" v-editor.common-search="{ action: ['delete'] }">
    <common-search v-model="inputVal" v-bind="data" @submit="searchFn"></common-search>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Inject, Watch } from "vue-property-decorator";
import CommonSearch from "@/components/CommonSearch/index.vue";
import { LowCodeModule } from "@/store/modules/lowCode";
@Component({
  name: "RenderCommonSeach",
  components: {
    CommonSearch,
  },
})
export default class extends Vue {
  @Inject("type") type!: string;
  @Prop() data!: any;
  inputVal = "";

  get funcMap(): any {
    return LowCodeModule.funcMap;
  }

  searchFn() {
    let func = this.funcMap[this.data["search-comp-id"]];
    func &&
      func({
        [this.data["search-key"]]: this.inputVal,
      });
  }
}
</script>
