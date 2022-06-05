<template>
  <div :class="['render-grid', type]" v-editor.grid="{ action: ['delete'] }">
    <el-row v-bind="data">
      <el-col v-for="col in colData" v-bind="col" :key="col.id">
        <div class="render-grid__col" v-editor.grid-col="{ id: col.id }">
          <render-type v-if="col.body && col.body.length" :data="col.body"></render-type>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

@Component({
  name: "RenderGrid",
})
export default class extends Vue {
  @Inject("type") type!: string;
  @Prop() data!: any;
  colData = [];

  @Watch("data", { immediate: true, deep: true })
  onDataChange() {
    this.colData = this.data.body.map((item) => {
      return {
        ...item,
        span: Number(item.span),
      };
    });
  }
}
</script>
<style lang="scss" scoped>
.render-grid {
  &.edit {
    padding: 16px;
    .render-grid__col {
      padding: 16px;
      min-height: 40px;
      border: 1px dashed #ccc;
    }
  }
}
</style>
