<template>
  <div class="div-config">
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="样式" name="1">
        <json-editor ref="jsonEditor" v-model="jsonValue" @change="jsonChangeFn" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import JsonEditor from "@/components/JsonEditor/index.vue";
import { setCompConfigById } from "@/utils/lowCode";
@Component({
  name: "LeftTreeConfig",
  components: {
    JsonEditor,
  },
})
export default class extends Vue {
  @Prop({ default: () => ({}) }) data!: any;
  activeTab = "1";

  // 编辑器
  jsonValue = "";

  @Watch("data", { immediate: true })
  onDataChange() {
    this.jsonValue = this.data.styles;
  }

  async jsonChangeFn() {
    await this.$nextTick();
    this.updateConfig();
  }

  updateConfig() {
    let config = {
      ...this.data,
      styles: this.jsonValue,
    };
    setCompConfigById(this.data.id, config);
  }
}
</script>

<style lang="scss" scoped>
.div-config {
  height: 100%;
  ::v-deep .el-tab-pane {
    height: 100%;
  }
}
</style>
