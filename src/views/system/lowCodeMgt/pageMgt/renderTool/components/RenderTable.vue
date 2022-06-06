<template>
  <div class="render-table" v-editor.table="{ action: ['delete', 'drag'] }" :key="data.id">
    <div class="switch-view">
      <span>切换视图</span>
      <div class="switch-tab">
        <i class="iconfont icon-loudoutu active"></i>
        <i class="iconfont icon-yibiaopan"></i>
      </div>
    </div>
    <yu-xtable ref="refTable" :data="testData" row-number border v-bind="data" :type="data.tableType" :key="JSON.stringify(data)">
      <template v-slot:default>
        <yu-xtable-column
          v-for="column in data.columns"
          v-bind="column"
          :key="column.prop"
          :label="column.label"
          :prop="column.prop"
          :min-width="column['min-width'] || column.label.length * 15 + 40"
          :show-overflow-tooltip="true"
          sortable="custom"
        ></yu-xtable-column>
        <yu-xtable-column v-if="data.itemActions && data.itemActions.length" label="操作" :width="getActionWidth(data.itemActions)" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button v-for="action in data.itemActions" :key="action.key" class="yu-action-btn" @click.native.prevent="customerViewFn(scope.row)" type="text">{{
              action.value.split("-")[0]
            }}</el-button>
          </template>
        </yu-xtable-column>
      </template>
      <template v-slot:custom="scope">
        <div class="custom-container">
          <component :is="data.customName" :data="scope.tableData"></component>
        </div>
      </template>
    </yu-xtable>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";
import { backend } from "@/config";
@Component({
  name: "RenderCurd",
})
export default class extends Vue {
  @Inject("type") type!: string;
  @Prop() data!: any;
  queryFormData = {};
  testData: any = [];

  @Watch("data", { immediate: true, deep: true })
  onDataChange() {
    let { url } = this.data;
    console.log(this.data, 777);
    if (!url) {
      this.data.columns.map((item: any) => {
        this.testData[0] = this.testData[0] || {};
        this.testData[0][item.prop] = "测试数据";
      });
    } else {
      this.testData = null;
    }
  }

  getActionWidth(data: any[]) {
    let width = 0;
    data.map((item) => {
      width += item.value.split("-")[0].length * 15 + 10;
    });
    return width + 40;
  }
}
</script>

<style lang="scss" scoped>
.render-table {
  min-height: 40px;
  .switch-view {
    padding: 12px 0;
    text-align: right;
    font-size: 12px;
    .switch-tab {
      margin-left: 6px;
      display: inline-block;
      background: rgba(0, 126, 255, 0.1);
      color: #999;
      border-radius: 10px;
      i {
        cursor: pointer;
        font-size: 12px;
        display: inline-block;
        padding: 3px 6px;
        color: #999;
        &.active {
          color: #fff;
          border-radius: 10px;
          background: #007eff;
        }
      }
    }
  }
}
.curd-editor {
  padding: 16px;
}
.curd-toolbar {
  position: relative;
  height: 36px;
  padding: 10px;
  margin-bottom: 16px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
  .yu-button-group {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }
}
</style>
