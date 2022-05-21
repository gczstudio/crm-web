<!--
 * @Descripttion: 表单配置弹出框
 * @Author: gaocz
 * @Date: 2022-04-28 15:44:40
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-19 14:38:04
 * @FilePath: /edmp-web/src/components/dialogs/FormDialog.vue
-->
<template>
  <yu-dialog class="form-dialog-container" :title="title" :visible.sync="dialogVisible" width="1000px" @close="hide" top="5vh">
    <yu-xtable ref="tableRef" :data="tableData" border :pageable="false">
      <yu-xtable-column label="标题" prop="label" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <yu-xform-item-part v-model="scope.row.label" ctype="input"></yu-xform-item-part>
        </template>
      </yu-xtable-column>
      <yu-xtable-column label="字段名" prop="name" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <yu-xform-item-part v-model="scope.row.name" ctype="input"></yu-xform-item-part>
        </template>
      </yu-xtable-column>
      <yu-xtable-column label="组件" prop="ctype" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <yu-xform-item-part v-model="scope.row.ctype" ctype="select" data-code="LC_COMPS"></yu-xform-item-part>
        </template>
      </yu-xtable-column>
      <yu-xtable-column label="校验规则" prop="rules" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <yu-xform-item-part v-model="scope.row.rules" ctype="select" data-code="LC_RULES"></yu-xform-item-part>
        </template>
      </yu-xtable-column>
      <yu-xtable-column label="列数" prop="column" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <yu-xform-item-part v-model="scope.row.column" ctype="input"></yu-xform-item-part>
        </template>
      </yu-xtable-column>
      <yu-xtable-column label="操作" prop="action" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="operate-btns">
            <span v-if="scope.$index === tableData.length - 1" class="plus" @click="addFn">+</span>
            <span v-if="tableData.length > 1" class="delete" @click="deleteFn(scope.$index)">-</span>
          </div>
        </template>
      </yu-xtable-column>
    </yu-xtable>
    <div slot="footer" class="operate-btns tc">
      <el-button type="primary" @click="sureFn">确定</el-button>
      <el-button @click="cancelFn">取消</el-button>
    </div>
  </yu-dialog>
</template>
<script>
import { backend } from "@/config";
import request from "@/utils/request";
export default {
  name: "CurdDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "表单配置",
    },
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [{}],
    };
  },
  watch: {
    visible: function () {
      this.dialogVisible = this.visible;
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
      this.$emit("sure", this.tableData);
      this.hide();
    },
    cancelFn() {
      this.hide();
    },
    addFn() {
      this.tableData.push({});
    },
    deleteFn(index) {
      this.tableData.splice(index, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.form-dialog-container {
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
