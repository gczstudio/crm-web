<template>
  <div class="render-left-tree" v-editor.left-tree="{ action: ['delete'] }">
    <yu-left-tree
      ref="tree"
      class="no-border"
      :highlight-current="true"
      :height="bHeight - (isMaxScreen ? 283 : 249)"
      @node-xclick="nodeClickFn"
      :operates="treeOperates"
      :create-fn="createFn"
      v-bind="propsData"
    ></yu-left-tree>
    <!-- 新增/修改目录 -->
    <yu-dialog title="目录" :visible.sync="addVisible" width="500px">
      <yu-xform :model="formData" ref="addForm" label-width="120px">
        <yu-xform-group :column="1">
          <yu-xform-item label="目录名称" name="name" :rules="globalRules.requiredInput50" ctype="input"></yu-xform-item>
          <yu-xform-item label="上级目录" name="upName" :rules="globalRules.input50" ctype="input" disabled></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button type="primary" @click="saveFn">保 存</el-button>
        <el-button @click="addVisible = false">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject, Ref } from "vue-property-decorator";
import request from "@/utils/request";
export interface IFrom {
  id: string;
  name: string;
  upName: string;
  upId: string;
}

export interface IAction {
  type: string;
  value: string;
  key: string;
  url: string;
  isPermission: string;
  permissionCode: string;
  eventFunc: string;
  extraParams: string;
  switch: boolean;
}

@Component({
  name: "RenderLeftTree",
})
export default class extends Vue {
  @Inject("type") type!: string;
  @Prop() data!: any;
  @Ref("tree") tree: any;
  propsData: Record<string, string> = {};
  addVisible = false;
  formData: IFrom = {
    id: "",
    upId: "",
    name: "",
    upName: "",
  };
  viewType = "add";
  treeOperates = [
    { label: "修改", func: this.editFn, disabled: this.getPermission("edit") },
    { label: "删除", func: this.deleteFn, disabled: this.getPermission("delete") },
  ];
  curNode: Record<string, string> = {};
  curNodeData: Record<string, string> = {};

  @Watch("data", { immediate: true, deep: true })
  onDataChange() {
    this.propsData = { ...this.data };
    let customAction = this.data.actions.filter((item: IAction) => item.type === "2");
    customAction.map((item: IAction) => {
      this.treeOperates.push({
        label: item.value,
        func: () => this.customFn(item),
        disabled: this.getPermission(item.key),
      });
    });
  }

  // 权限
  getPermission(key: string) {
    let config: IAction = this.getActionByKey(key);
    return config.switch && (config.isPermission ? this.$checkCtr(config.permissionCode) : true);
  }

  isCreate() {
    return this.data["show-create"] === "1" && this.getPermission("create");
  }

  // 根据按钮标识获取配置信息
  getActionByKey(key: string): IAction {
    return this.data.actions.find((item: any) => item.key === key);
  }

  // 点击目录
  nodeClickFn(obj: Record<string, string>, node: any) {
    this.curNode = node;
    this.curNodeData = obj;
  }
  // 新增
  createFn() {
    // 前置逻辑处理
    let eventFunc = this.getActionByKey("create").eventFunc;
    if (eventFunc && !new Function(eventFunc).apply(this)) return;

    this.addVisible = true;
    this.viewType = "add";
    this.formData.id = "";
    this.formData.name = "";
    this.formData.upName = this.curNodeData[this.propsData["data-label"]];
    this.formData.upId = this.curNodeData[this.propsData["data-id"]];
  }
  // 修改
  editFn() {
    // 前置逻辑处理
    let eventFunc = this.getActionByKey("edit").eventFunc;
    if (eventFunc && !new Function(eventFunc).apply(this)) return;

    this.viewType = "edit";
    this.addVisible = true;
    this.formData.name = this.curNodeData[this.propsData["data-label"]];
    this.formData.upName = this.curNodeData[this.propsData["data-plabel"]];
    this.formData.id = this.curNodeData[this.propsData["data-id"]];
    this.formData.upId = this.curNodeData[this.propsData["data-pid"]];
  }
  // 保存
  saveFn() {
    // 处理额外参数
    let extraParams = {};
    let extraParamsStr = this.getActionByKey("create").extraParams;
    if (extraParamsStr) {
      extraParamsStr = "return " + extraParamsStr;
      extraParams = new Function(extraParamsStr).apply(this);
    }

    let params: Record<string, string> = {
      ...extraParams,
      [this.propsData["data-label"]]: this.formData.name,
      [this.propsData["data-plabel"]]: this.formData.upName,
      [this.propsData["data-pid"]]: this.formData.upId,
    };
    let url = this.getActionByKey("create").url;
    if (this.viewType === "edit") {
      url = this.getActionByKey("edit").url;
      params[this.propsData["data-id"]] = this.formData.id;
    }
    request({
      url,
      method: "post",
      data: params,
    }).then((res) => {
      this.$message({ message: this.viewType === "add" ? "保存成功!" : "修改成功", type: "success" });
      this.addVisible = false;
      // 刷新树
      this.tree.remoteData();
    });
  }
  // 删除
  deleteFn() {
    this.$confirm("确认删除该目录吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      callback: (action) => {
        if (action === "confirm") {
          request({
            url: this.getActionByKey("delete").url,
            method: "post",
            data: [this.curNodeData[this.propsData["data-id"]]],
          }).then((res) => {
            this.$message({ message: "删除成功!", type: "success" });
            // 刷新树
            this.tree.remoteData();
            // 刷新表格
            this.curNodeData = {};
          });
        }
      },
    });
  }

  // 自定义按钮操作
  customFn(item: IAction) {
    // 前置逻辑处理
    let eventFunc = this.getActionByKey(item.key).eventFunc;
    if (eventFunc && !new Function(eventFunc).apply(this)) return;
  }
}
</script>
<style lang="scss" scoped>
.render-left-tree {
}
</style>
