<!--
 * @Descripttion: 增删改查配置
 * @Author: gaocz
 * @Date: 2022-04-28 15:08:11
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-18 17:58:33
 * @FilePath: /edmp-web/src/views/system/lowCodeMgt/pageMgt/sideConfig/index.vue
-->
<template>
  <div class="side-config-container">
    <CurdActionConfig v-if="configType === 'curd-action'" :data="configData" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import CurdActionConfig from "./components/CurdActionConfig.vue";
import { LowCodeModule } from "@/store/modules/lowCode";
import { getCompConfigById } from "@/utils/lowCode";
@Component({
  name: "SideConfig",
  components: {
    CurdActionConfig,
  },
})
export default class extends Vue {
  get configType() {
    return (LowCodeModule.widgetsMap as any)[LowCodeModule.activeEditorId]?.type;
  }

  get configData() {
    let config = (LowCodeModule.widgetsMap as any)[LowCodeModule.activeEditorId];
    let data = getCompConfigById(config.dataId);
    return data;
  }
}
</script>

<style lang="scss" scoped>
.side-config-container {
  height: 100%;
  ::v-deep .el-tabs {
    height: 100%;
    .el-tabs__content {
      height: calc(100% - 60px);
      padding: 0 16px;
      overflow-y: auto;
    }
  }
  ::v-deep .el-radio-group .el-radio {
    margin-right: 10px;
  }
}
</style>
