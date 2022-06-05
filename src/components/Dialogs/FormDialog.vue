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
    <yu-xform :model="queryFormData" label-width="80px" style="width: 400px">
      <yu-xform-group :column="1">
        <yu-xform-item label="接口地址" placeholder="获取数据库字段信息" name="api" ctype="input" v-debounce="[apiChangeFn, 'input']" @clear="apiChangeFn"></yu-xform-item>
      </yu-xform-group>
    </yu-xform>
    <yu-xtable ref="tableRef" :data="tableData" row-key="id" selection-type="checkbox" :init-selection="false" border :pageable="false">
      <yu-xtable-column label="标题" prop="label" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <yu-xform-item-part v-model="scope.row.label" ctype="input" :key="scope.row.id" clearable></yu-xform-item-part>
        </template>
      </yu-xtable-column>
      <yu-xtable-column label="字段名" prop="name" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <yu-xform-item-part v-model="scope.row.name" ctype="input" :key="scope.row.id" clearable></yu-xform-item-part>
        </template>
      </yu-xtable-column>
      <yu-xtable-column label="组件" prop="ctype" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <yu-xform-item-part v-model="scope.row.ctype" ctype="select" :options="ctypeOptions" :key="scope.row.id" clearable></yu-xform-item-part>
        </template>
      </yu-xtable-column>
      <yu-xtable-column label="码值" prop="dataCode" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <yu-xform-item-part v-model="scope.row.dataCode" ctype="input" :key="scope.row.id" clearable></yu-xform-item-part>
        </template>
      </yu-xtable-column>
      <yu-xtable-column label="校验规则" prop="rules" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <yu-xform-item-part v-model="scope.row.rules" ctype="select" :options="rulesOptions" :key="scope.row.id" clearable></yu-xform-item-part>
        </template>
      </yu-xtable-column>
      <yu-xtable-column label="列数" prop="column" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <yu-xform-item-part v-model="scope.row.column" ctype="input" :key="scope.row.id" clearable></yu-xform-item-part>
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
      default: "表单配置",
    },
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [
        {
          id: this.$util.guid(),
        },
      ],
      queryFormData: {},
      ctypeOptions: [],
      rulesOptions: [],
    };
  },
  watch: {
    visible: function () {
      this.dialogVisible = this.visible;
    },
  },
  created() {
    this.getRules();
    this.getCtypeOptions();
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
      console.log(selections, 88888);
      this.$emit("sure", this._.cloneDeep(selections));
      this.hide();
    },
    cancelFn() {
      this.hide();
    },
    addFn() {
      this.tableData.push({
        id: this.$util.guid(),
      });
    },
    deleteFn(index) {
      this.tableData.splice(index, 1);
    },
    // 接口地址变化
    async apiChangeFn() {
      await this.$nextTick();
      if (!this.queryFormData.api) {
        this.tableData = [];
        return;
      }
      queryUrlField({
        condition: JSON.stringify({
          url: this.queryFormData.api,
        }),
      }).then((res) => {
        this.tableData = res.data.map((item) => {
          return {
            id: this.$util.guid(),
            name: this.$util.dashToCamel(item.fieldEn),
            ctype: "input",
            label: item.fieldZh,
            column: "1",
          };
        });
      });
    },
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
