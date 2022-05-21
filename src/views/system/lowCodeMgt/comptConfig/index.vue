<!--
 * @Descripttion: 
 * @Author: gaocz
 * @Date: 2022-04-20 08:40:23
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-20 11:07:00
 * @FilePath: /edmp-web/src/views/system/lowCodeMgt/comptConfig/index.vue
-->
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
          :data-url="treeUrl"
          data-id="id"
          data-label="catalogName"
          @node-xclick="nodeClickFn"
          data-pid="upId"
          :expand-level="2"
          :highlight-current="true"
          :operates="treeOperates"
          :show-create="true"
          :create-fn="createFn"
        >
        </yu-left-tree>
      </el-col>
      <el-col :span="19">
        <div class="left-container">
          <el-tabs class="lowcode-tabs" v-model="activeName">
            <el-tab-pane label="图表组件" name="1">
              <ChartList v-if="activeName === '1'" ref="chartListRef" type="chart" />
            </el-tab-pane>
            <el-tab-pane label="指标卡组件" name="2">
              <ChartList v-if="activeName === '2'" ref="chartListRef" type="card" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
    <yu-dialog :title="viewType === 'add' ? '新增目录' : '修改目录'" :visible.sync="visible" width="400px">
      <yu-xform ref="formRef" :model="addForm" label-width="100px">
        <yu-xform-group :column="1">
          <yu-xform-item v-if="viewType === 'add'" label="上级目录" placeholder="上级目录" name="upName" ctype="input" disabled></yu-xform-item>
          <yu-xform-item label="目录名称" placeholder="目录名称" name="catalogName" ctype="input" :rules="globalRules.requiredInput50"></yu-xform-item>
          <yu-xform-item label="排序" placeholder="排序" name="orderBy" ctype="input" :rules="$validator.orderNumber"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button type="primary" @click="saveFn">保存</el-button>
        <el-button @click="visible = false">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import { backend } from "@/config";
import { getUserInfo } from "@/utils";
import ChartList from "./chartList/index.vue";
import { saveBusiModuleCataLog, deleteBusiModuleCataLog } from "@/api/lowCode";

export interface IMenuItem {
  id: string;
  upId: string;
  catalogName: string;
  orderBy: number;
}

@Component({
  name: "ComptConfig",
  components: {
    ChartList,
  },
})
export default class extends Vue {
  @Ref("formRef") formRef: any;
  @Ref("chartListRef") chartListRef: any;
  @Ref("menuTree") menuTree: any;
  private treeUrl = backend.comptMgrService + "/api/busimodule/catalog/info";

  private activeName = "1";
  private viewType = "add";
  private visible = false;
  private addForm = {};
  private treeOperates = [
    { label: "修改", func: this.editFn, disabled: true },
    { label: "删除", func: this.deleteFn, disabled: true },
  ];
  private clickNode = {};

  async createFn() {
    this.viewType = "add";
    await this.$nextTick();
    this.addForm = {
      upName: (this.clickNode as IMenuItem).catalogName,
    };
    this.visible = true;
    this.formRef && this.formRef.resetFields();
  }

  // 新增目录
  saveFn() {
    saveBusiModuleCataLog({
      upId: (this.clickNode as IMenuItem).id || "",
      ...this.addForm,
    }).then((res) => {
      this.$message.success((this.addForm as IMenuItem).id ? "修改成功" : "新增成功");
      this.visible = false;
      this.menuTree.remoteData();
      this.clickNode = {};
    });
  }

  editFn() {
    this.viewType = "edit";
    this.addForm = {
      ...this.clickNode,
    };
    this.visible = true;
  }

  deleteFn() {
    deleteBusiModuleCataLog({
      condition: JSON.stringify({
        id: (this.clickNode as IMenuItem).id,
      }),
    }).then((res) => {
      this.$message.success("删除成功");
      this.menuTree.remoteData();
    });
  }

  nodeClickFn(node: IMenuItem) {
    this.clickNode = node;
    this.chartListRef.searchFn({
      condition: JSON.stringify({
        catalogId: node.id,
      }),
    });
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
