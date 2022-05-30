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
    <yu-dialog class="curd-dialog__component" :title="title" :visible.sync="dialogVisible" width="1200px" @close="hide" top="5vh">
      <yu-xform :model="queryFormData" label-width="80px" style="width: 400px">
        <yu-xform-group :column="1">
          <yu-xform-item label="标题" placeholder="标题" name="title" ctype="input"></yu-xform-item>
          <yu-xform-item label="接口地址" placeholder="接口地址" name="api" ctype="input" v-debounce="[apiChangeFn, 'input']" :rules="globalRules.required"></yu-xform-item>
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
        <div class="label">按钮功能：</div>
        <div class="select-actions">
          <el-tag v-for="(action, index) in selectActions" size="small" :key="action.key" closable :type="action.key" @close="deleteSelectAction(index)">
            {{ action.type === "2" ? action.value + "-操作栏" : action.value }}
          </el-tag>
        </div>
        <div class="add-func" @click="addFuncFn"><i class="el-icon-plus">添加功能</i></div>
      </div>
      <yu-xtable ref="tableRef" border :data="urlFields" :pageable="false">
        <yu-xtable-column label="标题" prop="label" width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-xform-item-part v-model="scope.row.label" ctype="input" :rules="globalRules.input"></yu-xform-item-part>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="字段名" prop="name" :show-overflow-tooltip="true"></yu-xtable-column>
        <yu-xtable-column label="类型" prop="dataType" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-xform-item-part v-model="scope.row.dataType" ctype="select" data-code="LC_FORM_ITEM_TYPE"></yu-xform-item-part>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="是否查询条件" width="140" prop="isSearch" :render-header="renderHeaderFn">
          <template slot-scope="scope">
            <yu-xform-item-part v-model="scope.row.isSearch" ctype="radio" data-code="YESNO" :key="scope.row.isSearch"></yu-xform-item-part>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="是否展示列" prop="isShowCol" width="130" :render-header="renderHeaderFn">
          <template slot-scope="scope">
            <yu-xform-item-part v-model="scope.row.isShowCol" ctype="radio" data-code="YESNO" :key="scope.row.isShowCol"></yu-xform-item-part>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="查询组件" prop="ctype" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-xform-item-part v-model="scope.row.ctype" ctype="select" :options="ctypeOptions" clearable></yu-xform-item-part>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="码值" prop="dataCode" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-xform-item-part v-model="scope.row.dataCode" ctype="input" clearable></yu-xform-item-part>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="校验规则" prop="rules" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-xform-item-part v-model="scope.row.rules" ctype="select" :options="rulesOptions" clearable></yu-xform-item-part>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="固定方式" prop="fixed" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-xform-item-part
              v-model="scope.row.fixed"
              ctype="select"
              :options="[
                { key: 'left', value: '左侧' },
                { key: 'right', value: '右侧' },
              ]"
              clearable
            ></yu-xform-item-part>
          </template>
        </yu-xtable-column>
      </yu-xtable>
      <div slot="footer" class="operate-btns tc">
        <el-button type="primary" @click="sureFn">确定</el-button>
        <el-button @click="cancelFn">取消</el-button>
      </div>
    </yu-dialog>
    <form-action-dialog :data="selectActions" :visible.sync="addVisible" @sure="sureAddFuncFn"></form-action-dialog>
  </div>
</template>
<script>
import { backend } from "@/config";
import request from "@/utils/request";
import { queryUrlField } from "@/api/lowCode";
import FormActionDialog from "./FormActionDialog.vue";
export default {
  name: "CurdDialog",
  components: {
    FormActionDialog,
  },
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
      compDataUrl: backend.comptMgrService + "/api/sysmodule/list",
      urlFields: [],
      queryFormData: {
        method: "get",
      },
      nowNode: {},
      selectActions: [],
      actions: [
        { type: "1", key: "create", value: "新增", icon: "el-icon-plus", showPos: "1" },
        { type: "1", key: "edit", value: "修改", icon: "el-icon-edit", showPos: "2" },
        { type: "1", key: "delete", value: "删除", icon: "el-icon-delete", showPos: "1" },
        { type: "1", key: "detail", value: "详情", icon: "el-icon-tickets", showPos: "2" },
        { type: "1", key: "import", value: "导入", icon: "el-icon-upload2", showPos: "1" },
        { type: "1", key: "download", value: "模版下载", icon: "el-icon-download", showPos: "1" },
        { type: "1", key: "export", value: "导出", icon: "el-icon-download", showPos: "1" },
      ],
      checkList: [],
      addVisible: false,
      addFormData: {
        actionType: "1",
      },
      ctypeOptions: [],
      rulesOptions: [],
      radioGroup: "",
    };
  },
  watch: {
    visible: function () {
      this.dialogVisible = this.visible;
    },
  },
  created() {
    this.dialogVisible = this.visible;
    this.getCtypeOptions();
    this.getRules();
  },
  methods: {
    // 获取表单项组件
    getCtypeOptions() {
      request({
        url: backend.comptMgrService + "/api/sysmodule/list",
        method: "get",
        params: {
          condition: JSON.stringify({
            modType: "3",
          }),
          page: 1,
          size: 100,
        },
      }).then((res) => {
        this.ctypeOptions = res.data.map((ele) => {
          const { modRegName, modName } = ele;
          return {
            key: modRegName,
            value: modName,
          };
        });
      });
    },
    // 获取验证规则
    getRules() {
      request({
        url: backend.comptMgrService + "/api/verifyrule/list",
        method: "get",
        params: {
          page: 1,
          size: 100,
        },
      }).then((res) => {
        this.rulesOptions = res.data.map((ele) => {
          const { ruleNo, ruleName } = ele;
          return {
            key: ruleNo,
            value: ruleName,
          };
        });
      });
    },
    // 渲染批量赋值
    renderHeaderFn(h, scope) {
      return (
        <div>
          <span style="margin-right: 5px;">{scope.column.label}</span>
          <el-popover placement="bottom-start" title="批量赋值" trigger="click" onShow={() => (this.radioGroup = "")}>
            <el-radio-group value={this.radioGroup} onInput={(value) => this.radioGroupChange(scope, value)}>
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
            <i slot="reference" class="el-icon-arrow-down" style="cursor: pointer;"></i>
          </el-popover>
        </div>
      );
    },
    radioGroupChange(scope, value) {
      this.radioGroup = value;
      this.urlFields = this.urlFields.map((item) => {
        item[scope.column.property] = value;
        return item;
      });
    },
    show() {
      this.$emit("update:visible", true);
    },
    hide() {
      this.$emit("update:visible", false);
    },
    sureFn() {
      const id = this.$util.guid();
      console.log(this.selectActions, 99);
      let result = {
        id,
        ...this.queryFormData,
        formItems: this.$refs.tableRef.tableData.filter((item) => item.isSearch === "1"),
        columns: this.$refs.tableRef.tableData.filter((item) => item.isShowCol === "1"),
        bulkActions: this.selectActions.filter((item) => item.showPos === "1"),
        itemActions: this.selectActions.filter((item) => item.showPos === "2"),
      };
      this.$emit("sure", result);
      this.hide();
    },
    cancelFn() {
      this.hide();
    },
    // 接口地址变化
    apiChangeFn() {
      queryUrlField({
        condition: JSON.stringify({
          url: this.queryFormData.api,
        }),
      }).then((res) => {
        this.urlFields = res.data.map((item) => {
          return {
            name: this.$util.dashToCamel(item.fieldEn),
            prop: this.$util.dashToCamel(item.fieldEn),
            label: item.fieldZh,
            dataType: "1",
            isSearch: "1",
            isShowCol: "1",
            ctype: "input",
          };
        });
      });
    },
    addFuncFn() {
      this.addVisible = true;
    },
    sureAddFuncFn(data) {
      this.selectActions = data;
    },
    deleteSelectAction(index) {
      this.selectActions.splice(index, 1);
    },
  },
};
</script>
<style lang="scss">
.curd-dialog__component {
  .el-radio {
    margin-right: 10px;
  }
}
</style>
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
    left: 80px;
  }
  .select-actions {
    .el-tag {
      margin-right: 10px;
    }
  }
}
</style>
