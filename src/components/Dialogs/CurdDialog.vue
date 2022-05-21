<!--
 * @Descripttion: 增删改查配置弹出框
 * @Author: gaocz
 * @Date: 2022-04-28 15:44:40
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-19 14:54:18
 * @FilePath: /edmp-web/src/components/dialogs/CurdDialog.vue
-->
<template>
  <div>
    <yu-dialog :title="title" :visible.sync="dialogVisible" width="1000px" @close="hide" top="5vh">
      <yu-xform :model="queryFormData" label-width="70px" style="width: 400px">
        <yu-xform-group :column="1">
          <yu-xform-item label="标题" placeholder="标题" name="title" ctype="input"></yu-xform-item>
          <yu-xform-item label="接口地址" placeholder="接口地址" name="api" ctype="input" v-debounce="[apiChangeFn, 'input']"></yu-xform-item>
          <yu-xform-item
            label="发送方式"
            placeholder="发送方式"
            name="method"
            ctype="select"
            :rules="globalRules.input"
            :options="[
              { key: 'get', value: 'GET' },
              { key: 'post', value: 'POST' },
            ]"
          ></yu-xform-item>
          <yu-xform-item label="发送条件" placeholder="发送条件" name="params" ctype="input" type="textarea"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div class="enable-func">
        <div class="label">启用功能：</div>
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="item in actions" :key="item.key" :label="item.key">{{ item.type === "2" ? item.value + "-操作栏" : item.value }}</el-checkbox>
        </el-checkbox-group>
        <div class="add-func" @click="addFuncFn"><i class="el-icon-plus">添加功能</i></div>
      </div>
      <yu-xtable ref="tableRef" border :data="urlFields" :pageable="false">
        <yu-xtable-column label="标题" prop="label" width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-xform-item-part v-model="scope.row.label" ctype="input" :rules="globalRules.input"></yu-xform-item-part>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="字段名" prop="prop" :show-overflow-tooltip="true"></yu-xtable-column>
        <yu-xtable-column label="类型" prop="dataType" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-xform-item-part v-model="scope.row.dataType" ctype="select" :options="[{ key: 'text', value: '文本' }]"></yu-xform-item-part>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="是否查询条件" width="120" prop="isSearch" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-xform-item-part v-model="scope.row.isSearch" ctype="select" data-code="YESNO"></yu-xform-item-part>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="查询组件" prop="ctype" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-xform-item-part v-model="scope.row.ctype" ctype="select" data-code="YESNO"></yu-xform-item-part>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="是否展示列" prop="isShowCol" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-xform-item-part v-model="scope.row.isShowCol" ctype="select" data-code="YESNO"></yu-xform-item-part>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="校验规则" prop="rules" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-xform-item-part v-model="scope.row.rules" ctype="select" data-code="YESNO"></yu-xform-item-part>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="固定方式" prop="align" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-xform-item-part
              v-model="scope.row.align"
              ctype="select"
              :options="[
                { key: 'left', value: '左侧' },
                { key: 'right', value: '右侧' },
              ]"
            ></yu-xform-item-part>
          </template>
        </yu-xtable-column>
      </yu-xtable>
      <div slot="footer" class="operate-btns tc">
        <el-button type="primary" @click="sureFn">确定</el-button>
        <el-button @click="cancelFn">取消</el-button>
      </div>
    </yu-dialog>
    <yu-dialog title="添加功能" :visible.sync="addVisible" width="500px" top="5vh">
      <yu-xform ref="addForm" :model="addFormData" label-width="100px" style="width: 400px">
        <yu-xform-group :column="1">
          <yu-xform-item label="功能名称" placeholder="功能名称" name="funcName" ctype="input" :rules="globalRules.requiredInput50"></yu-xform-item>
          <yu-xform-item label="功能代码" placeholder="功能代码" name="funcCode" ctype="input" :rules="globalRules.requiredInput50"></yu-xform-item>
          <yu-xform-item label="显示位置" placeholder="显示位置" name="actionType" ctype="select" data-code="LC_ACTION_TYPE"></yu-xform-item>
          <yu-xform-item label="图标" placeholder="图标" name="icon" ctype="input" :rules="globalRules.input"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" class="operate-btns tc">
        <el-button type="primary" @click="sureAddFuncFn">确定</el-button>
        <el-button @click="addVisible = false">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>
<script>
import { backend } from "@/config";
import { queryUrlField } from "@/api/lowCode";
export default {
  name: "CurdDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "增删改查配置",
    },
  },
  data() {
    return {
      dialogVisible: false,
      urlFields: [],
      queryFormData: {
        method: "get",
      },
      nowNode: {},
      selections: [],
      actions: [
        { key: "create", value: "新增" },
        { key: "edit", value: "修改" },
        { key: "delete", value: "删除" },
        { key: "detail", value: "详情" },
        { key: "import", value: "导入" },
        { key: "download", value: "模版下载" },
        { key: "export", value: "导出" },
      ],
      checkList: [],
      addVisible: false,
      addFormData: {
        actionType: "1",
      },
    };
  },
  watch: {
    visible: function () {
      this.selections = [];
      this.dialogVisible = this.visible;
    },
  },
  created() {
    this.dialogVisible = this.visible;
  },
  methods: {
    selectionChangeFn(selections) {
      this.selections = selections;
    },
    show() {
      this.$emit("update:visible", true);
    },
    hide() {
      this.$emit("update:visible", false);
    },
    sureFn() {
      const id = this.$util.guid();
      let result = {
        id,
        ...this.queryFormData,
        formItems: this.$refs.tableRef.tableData.filter((item) => item.isSearch),
        columns: this.$refs.tableRef.tableData.filter((item) => item.isShowCol),
        bulkActions: this.actions.filter((item) => this.checkList.includes(item.key) && item.type !== "2"),
        itemActions: this.actions.filter((item) => this.checkList.includes(item.key) && item.type === "2"),
      };
      this.$emit("sure", result);
      this.hide();
    },
    cancelFn() {
      this.hide();
    },
    // 接口地址变化
    apiChangeFn(url) {
      console.log(url, 999);
      queryUrlField({
        condition: JSON.stringify({
          url,
        }),
      }).then((res) => {
        this.urlFields = res.data.map((item) => {
          return {
            prop: item.fieldEn,
            label: item.fieldZh,
          };
        });
      });
    },
    addFuncFn() {
      this.addVisible = true;
      this.$refs.addForm && this.$refs.addForm.resetFields();
    },
    sureAddFuncFn() {
      const { funcName, funcCode, actionType } = this.addFormData;
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (this.actions.find((item) => item.key === funcCode)) {
            this.$message.error("功能代码重复");
            return;
          }
          this.actions.push({
            key: funcCode,
            value: funcName,
            type: actionType,
          });
          this.addVisible = false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.enable-func {
  position: relative;
  margin-bottom: 20px;
  .label {
    font-size: 13px;
    margin-bottom: 10px;
  }
  .el-checkbox {
    margin-bottom: 10px;
  }
  .add-func {
    cursor: pointer;
    color: #007eff;
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
