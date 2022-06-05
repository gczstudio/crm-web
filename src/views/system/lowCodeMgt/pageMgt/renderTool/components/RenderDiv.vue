<template>
  <div class="render-div" v-editor.div="{ action: ['delete'] }" :style="styles">
    <render-type v-if="data.body && data.body.length" :data="data.body"></render-type>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Inject, Watch } from "vue-property-decorator";
@Component({
  name: "RenderDiv",
})
export default class extends Vue {
  @Inject("type") type!: string;
  @Prop() data!: any;
  styles = {};
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
  padding: 16px;
}
</style>
