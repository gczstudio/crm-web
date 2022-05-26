<template>
  <div>
    <yu-dialog class="form-action-dialog__component" :title="title" :visible.sync="dialogVisible" width="800px" @close="hide" top="5vh">
      <yu-xtable ref="tableRef" border row-key="key" :data="actions" :pageable="false" :init-selection="false" selection-type="checkbox">
        <yu-xtable-column label="功能类型" prop="type" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.type === "1" ? "内置" : "自定义" }}
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="功能名称" prop="value" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-xform-item-part v-model="scope.row.value" ctype="input" :rules="globalRules.input"></yu-xform-item-part>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="功能代码" prop="key" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-xform-item-part :disabled="scope.row.type === '1'" v-model="scope.row.key" ctype="input" :rules="globalRules.input"></yu-xform-item-part>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="显示位置" prop="showPos" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-xform-item-part v-model="scope.row.showPos" ctype="select" data-code="LC_ACTION_TYPE"></yu-xform-item-part>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="图标" prop="icon" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-xform-item-part v-model="scope.row.icon" ctype="input" :rules="globalRules.input"></yu-xform-item-part>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="操作" prop="action" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="operate-btns">
              <span class="plus" v-if="actions.length === scope.$index + 1" @click="addFn">+</span>
              <span class="delete" v-if="scope.row.type === '2'" @click="deleteFn(scope.$index)">-</span>
            </div>
          </template>
        </yu-xtable-column>
      </yu-xtable>
      <div slot="footer" class="operate-btns tc">
        <el-button type="primary" @click="sureFn">确定</el-button>
        <el-button @click="cancelFn">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>
<script>
export default {
  name: "FormActionDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "添加按钮功能",
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogVisible: false,
      actions: [
        { type: "1", key: "create", value: "新增", icon: "el-icon-plus", showPos: "1" },
        { type: "1", key: "edit", value: "修改", icon: "el-icon-edit", showPos: "2" },
        { type: "1", key: "delete", value: "删除", icon: "el-icon-delete", showPos: "1" },
        { type: "1", key: "detail", value: "详情", icon: "el-icon-tickets", showPos: "2" },
        { type: "1", key: "import", value: "导入", icon: "el-icon-upload2", showPos: "1" },
        { type: "1", key: "download", value: "模版下载", icon: "el-icon-download", showPos: "1" },
        { type: "1", key: "export", value: "导出", icon: "el-icon-download", showPos: "1" },
      ],
    };
  },
  watch: {
    visible: function () {
      this.dialogVisible = this.visible;
      let data = this._.cloneDeep(this.data) || [];
      let keys = this.actions.map((item) => item.key);
      data.map((item) => {
        if (!keys.includes(item.key)) {
          this.actions.push(item);
        }
      });
      this.$nextTick(() => {
        console.log(this.$refs.tableRef, data, 1111);
        this.$refs.tableRef && this.$refs.tableRef.toggleSelection(data);
      });
    },
  },
  created() {
    this.dialogVisible = this.visible;
  },
  methods: {
    show() {
      this.$emit("update:visible", true);
    },
    hide() {
      this.$emit("update:visible", false);
    },
    sureFn() {
      let selections = this.$refs.tableRef.selections;
      this.$emit("sure", this._.cloneDeep(selections));
      this.hide();
    },
    cancelFn() {
      this.hide();
    },
    addFn() {
      this.actions.push({
        type: "2",
        showPos: "1",
        key: "custom" + this.actions.length,
      });
    },
    deleteFn(index) {
      this.actions.splice(index, 1);
    },
  },
};
</script>
<style lang="scss">
.form-action-dialog__component {
  .operate-btns {
    text-align: center;
    .plus {
      cursor: pointer;
      margin-right: 10px;
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      border-radius: 50%;
      text-align: center;
      background: #007eff;
      color: #fff;
      font-weight: bold;
    }
    .delete {
      cursor: pointer;
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-radius: 50%;
      background: #f56c6c;
      color: #fff;
      font-weight: bold;
    }
  }
}
</style>
