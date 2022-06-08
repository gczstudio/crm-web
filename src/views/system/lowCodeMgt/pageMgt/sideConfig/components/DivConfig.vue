<template>
  <div class="div-config">
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="属性" name="1">
        <yu-xform :model="formConfigForm" label-width="100px" key="form">
          <yu-xform-group :column="1">
            <yu-xform-item name="tabId" label="关联tabId" placeholder="关联tabId"></yu-xform-item>
            <yu-xform-item name="activeIds" label="关联tab选中id" placeholder="多个值，以逗号分隔"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </el-tab-pane>
      <el-tab-pane label="样式" name="2">
        <json-editor ref="jsonEditor" v-model="jsonValue" @change="jsonChangeFn" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import JsonEditor from "@/components/JsonEditor/index.vue";
import { setCompConfigById } from "@/utils/lowCode";
import { LowCodeModule } from "@/store/modules/lowCode";
@Component({
  name: "LeftTreeConfig",
  components: {
    JsonEditor,
  },
})
export default class extends Vue {
  @Prop({ default: () => ({}) }) data!: any;
  activeTab = "1";

  formConfigForm: Record<string, unknown> = {
    tabId: "",
  };

  // 编辑器
  jsonValue = "";

  @Watch("data", { immediate: true })
  onDataChange() {
    this.formConfigForm = { ...this.data };
    this.jsonValue = this.data.styles;
  }

  @Watch("formConfigForm", { deep: true })
  onFormConfigFormChange() {
    this.updateConfig();
  }

  async jsonChangeFn() {
    await this.$nextTick();
    this.updateConfig();
  }

  updateConfig() {
    let config = {
      ...this.data,
      ...this.formConfigForm,
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
