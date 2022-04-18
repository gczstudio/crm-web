<template>
  <div class="custDeposite-container">
    <el-tabs class="yu-tabs is-header" v-model="activeName">
      <el-tab-pane label="数据列表" name="1" lazy>
        <DataList @runBatch="runBatch" />
      </el-tab-pane>
      <el-tab-pane label="跑批情况" name="2" lazy>
        <RunBatch />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DataList from "./dataList/index.vue";
import RunBatch from "./runBatch/index.vue";

@Component({
  name: "Manual",
  components: {
    DataList,
    RunBatch,
  },
})
export default class extends Vue {
  private activeName = "1";
  runBatch() {
    this.activeName = "2";
  }
}
</script>

<style lang="scss" scoped>
.custDeposite-container {
  // margin-left: 16px;
  // min-height: calc(100vh - 125px);
  background: #ffffff;
  // box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  // border-radius: 5px;
}
/deep/ .el-tabs__header {
  z-index: 10;
}
</style>
