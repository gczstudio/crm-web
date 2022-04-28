<template>
  <div class="componentConfig-container">
    <el-row :gutter="16">
      <el-col :span="5">
        <yu-left-tree
          class="box-shadow"
          title="业务组件目录"
          ref="menuTree"
          :show-checkbox="false"
          :height="bHeight - (isMaxScreen ? 232 : 202)"
          :data-url="menuTreeUrl"
          data-id="menuId"
          data-label="menuName"
          @node-xclick="nodeClickFn"
          data-pid="upMenuId"
          :expand-level="2"
          :highlight-current="true"
          :show-create="true"
          :create-fn="createFn"
        >
        </yu-left-tree>
      </el-col>
      <el-col :span="19">
        <div class="left-container">
          <el-tabs class="lowcode-tabs" v-model="activeName">
            <el-tab-pane label="图表组件" name="1" lazy>
              <ChartList type="chart" />
            </el-tab-pane>
            <el-tab-pane label="指标卡组件" name="2" lazy>
              <ChartList type="card" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import { backend } from "@/config";
import { getUserInfo } from "@/utils";
import ChartList from "./chartList/index.vue";
@Component({
  name: "ComponentConfig",
  components: {
    ChartList,
  },
})
export default class extends Vue {
  private menuTreeUrl = backend.appOcaService + "/api/adminsmmenu/menutreequery?sysId=" + getUserInfo().logicSys.id;

  private activeName = "1";

  createFn() {
    console.log(1);
  }

  nodeClickFn() {
    console.log(2);
  }
}
</script>

<style lang="scss" scoped>
.left-container {
  position: relative;
  height: calc(100vh - 128px);
  background: #ffffff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  .yu-button-text {
    position: absolute;
    top: 18px;
    right: 16px;
    z-index: 11;
  }
}
@media screen and (max-width: 1680px) {
  .left-container {
    .yu-button-text {
      top: 15px;
    }
  }
}
</style>
