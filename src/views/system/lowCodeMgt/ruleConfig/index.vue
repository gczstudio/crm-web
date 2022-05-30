<template>
  <div class="ruleConfig-container">
    <MainLayout>
      <template v-slot:header>
        <el-button icon="el-icon-plus" @click="addFn">新增</el-button>
      </template>
      <template v-slot:form>
        <yu-xform ref="searchForm" related-table-name="refTable" form-type="search">
          <yu-xform-group :column="4">
            <yu-xform-item label="规则名称" placeholder="规则名称" ctype="input" name="ruleName" :rules="globalRules.input"></yu-xform-item>
            <yu-xform-item label="规则类型" placeholder="规则类型" ctype="input" name="ruleType" :rules="globalRules.input"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>
      <template v-slot:table>
        <yu-xtable ref="refTable" :data-url="compDataUrl" row-number :dynamic-height="true" border>
          <yu-xtable-column label="规则名称" prop="ruleName" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="规则类型" prop="ruleType" data-code="LC_RULE_TYPE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="规则编码" prop="ruleNo" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="正则表达式" prop="regularExpression" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="错误信息" prop="errorInfo" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="备注" prop="remark" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button class="yu-action-btn" @click.native.prevent="editFn(scope.row)" type="text">修改</el-button>
              <el-button class="yu-action-btn" @click.native.prevent="deleteFn(scope.row)" type="text">删除</el-button>
            </template>
          </yu-xtable-column>
        </yu-xtable>
      </template>
    </MainLayout>
    <yu-dialog :title="compStatus === 'add' ? '新增组件' : '修改组件'" :visible.sync="addCompVisible" width="600px">
      <yu-xform ref="formRef" :model="compForm" label-width="100px">
        <yu-xform-group :column="2">
          <yu-xform-item label="规则名称" placeholder="规则名称" name="ruleName" ctype="input" :rules="globalRules.requiredInput50"></yu-xform-item>
          <yu-xform-item label="规则类型" placeholder="规则类型" name="ruleType" ctype="select" data-code="LC_RULE_TYPE" :rules="globalRules.required"></yu-xform-item>
          <yu-xform-item label="规则编码" placeholder="规则编码" name="ruleNo" ctype="input" :rules="globalRules.required"></yu-xform-item>
          <yu-xform-item label="正则表达式" placeholder="正则表达式" name="regularExpression" ctype="input"></yu-xform-item>
          <yu-xform-item label="错误信息" placeholder="错误信息" name="errorInfo" ctype="input"></yu-xform-item>
        </yu-xform-group>
        <yu-xform-group :column="1">
          <yu-xform-item label="备注" placeholder="备注" name="remark" ctype="input" type="textarea" :rules="globalRules.desc"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button type="primary" @click="saveCompFn">保存</el-button>
        <el-button @click="addCompVisible = false">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import { backend } from "@/config";
import { saveRule, deleteRule } from "@/api/lowCode";

export interface IFormItem {
  id: string;
  modRegName: string;
  modName: string;
  modType: string;
  remark: string;
}

@Component({
  name: "ruleConfig",
  components: {},
})
export default class extends Vue {
  @Ref("formRef") formRef: any;
  @Ref("refTable") refTable: any;

  private compDataUrl = backend.comptMgrService + "/api/verifyrule/list";
  private compForm = {};
  private addCompVisible = false;
  private compStatus = "add";

  addFn() {
    this.compStatus = "add";
    this.compForm = {};
    this.addCompVisible = true;
    this.formRef && this.formRef.resetFields();
  }

  // 新增组件
  saveCompFn() {
    this.formRef.validate((valid: any) => {
      if (valid) {
        saveRule(this.compForm).then((res) => {
          this.$message.success((this.compForm as IFormItem).id ? "修改成功" : "新增成功");
          this.addCompVisible = false;
          this.refTable.remoteData();
        });
      }
    });
  }

  editFn(row: IFormItem) {
    this.compStatus = "edit";
    this.compForm = row;
    this.addCompVisible = true;
  }

  deleteFn(row: IFormItem) {
    deleteRule({
      condition: JSON.stringify({
        id: row.id,
      }),
    }).then((res) => {
      this.$message.success("删除成功");
      this.refTable.remoteData();
    });
  }
}
</script>

<style lang="scss" scoped></style>
