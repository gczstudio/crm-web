<template>
  <div class="render-left-tree">
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
          <yu-xform-item label="上级目录" name="upName" :rules="globalRules.requiredInput50" ctype="input"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button type="primary" @click="saveFn">保 存</el-button>
        <el-button @click="addVisible = false">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>
<script>
export default {
  name: "RenderLeftTree",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      propsData: {},
      addVisible: false,
      formData: {},
      treeOperates: [
        { label: "修改", func: this.updateFn, disabled: true },
        { label: "删除", func: this.deleteFn, disabled: true },
      ],
    };
  },
  watch: {
    data: {
      handler() {
        this.propsData = {
          ...this.data,
          "show-create": this.data["show-create"] === "1",
          "expand-level": Number(this.data["expand-level"]),
        };
      },
      immediate: true,
    },
  },
  methods: {
    // 点击目录
    nodeClickFn(obj, node, nodeComp) {},
    // 新增
    createFn() {
      console.log(1111);
      this.addVisible = true;
    },
    // 修改
    updateFn() {
      this.addVisible = true;
    },
    // 保存
    saveFn() {},
    // 删除
    deleteFn() {},
  },
};
</script>
<style lang="scss" scoped>
.render-left-tree {
}
</style>
