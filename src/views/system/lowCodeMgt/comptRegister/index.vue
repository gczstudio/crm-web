<template>
  <div class="ComponentRegister-container">
    <el-row :gutter="16">
      <el-col :span="12">
        <MainLayout>
          <template v-slot:header>
            <el-button icon="el-icon-plus" @click="addCompFn">新增</el-button>
          </template>
          <template v-slot:form>
            <yu-xform ref="searchForm" related-table-name="refCompTable" form-type="search">
              <yu-xform-group :column="2">
                <yu-xform-item label="组件注册名" placeholder="组件注册名" ctype="input" name="modRegName" :rules="globalRules.input"></yu-xform-item>
                <yu-xform-item label="组件名称" placeholder="组件名称" ctype="input" name="modName" :rules="globalRules.input"></yu-xform-item>
                <yu-xform-item label="组件类型" placeholder="组件类型" ctype="select" name="modType" data-code="LC_MOD_TYPE"></yu-xform-item>
              </yu-xform-group>
            </yu-xform>
          </template>
          <template v-slot:table>
            <yu-xtable ref="refCompTable" @row-click="rowClickFn" :data-url="compDataUrl" row-number :dynamic-height="true" border>
              <yu-xtable-column label="组件注册名" prop="modRegName" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="组件名称" prop="modName" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="组件类型" prop="modType" data-code="LC_MOD_TYPE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button class="yu-action-btn" @click.native.prevent="editCompFn(scope.row)" type="text">修改</el-button>
                  <el-button class="yu-action-btn" @click.native.prevent="deleteCompFn(scope.row)" type="text">删除</el-button>
                </template>
              </yu-xtable-column>
            </yu-xtable>
          </template>
        </MainLayout>
        <yu-dialog :title="compStatus === 'add' ? '新增组件' : '修改组件'" :visible.sync="addCompVisible" width="400px">
          <yu-xform ref="compFormRef" :model="compForm" label-width="100px">
            <yu-xform-group :column="1">
              <yu-xform-item label="组件注册名" placeholder="组件注册名" name="modRegName" ctype="input" :rules="globalRules.requiredInput50"></yu-xform-item>
              <yu-xform-item label="组件名称" placeholder="组件名称" name="modName" ctype="input" :rules="globalRules.requiredInput50"></yu-xform-item>
              <yu-xform-item label="组件类型" placeholder="组件类型" name="modType" ctype="select" data-code="LC_MOD_TYPE" :rules="globalRules.required"></yu-xform-item>
              <yu-xform-item label="备注" placeholder="备注" name="remark" ctype="input" type="textarea" :rules="globalRules.desc"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
          <div slot="footer" align="center">
            <el-button type="primary" @click="saveCompFn">保存</el-button>
            <el-button @click="addCompVisible = false">取消</el-button>
          </div>
        </yu-dialog>
      </el-col>
      <el-col :span="12">
        <MainLayout>
          <template v-slot:header>
            <el-button icon="el-icon-plus" @click="addPropFn">新增</el-button>
          </template>
          <template v-slot:form>
            <yu-xform ref="searchForm" related-table-name="refPropTable" form-type="search">
              <yu-xform-group :column="2">
                <yu-xform-item label="属性标识" placeholder="组件注册名" ctype="input" name="proId" :rules="globalRules.input"></yu-xform-item>
                <yu-xform-item label="类型" placeholder="组件名称" ctype="input" name="proType" data-code="LC_PRO_TYPE"></yu-xform-item>
                <yu-xform-item label="值类型" placeholder="组件类型" ctype="select" name="valType" data-code="LC_VAL_TYPE"></yu-xform-item>
              </yu-xform-group>
            </yu-xform>
          </template>
          <template v-slot:table>
            <yu-xtable ref="refPropTable" :data-url="propDataUrl" row-number :dynamic-height="true" border>
              <yu-xtable-column label="属性标识" prop="proId" width="100" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="属性名称" prop="proName" width="100" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="类型" prop="proType" width="100" data-code="LC_PRO_TYPE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="常用属性" prop="proComm" width="100" data-code="YESNO" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="值类型" prop="valType" width="100" data-code="LC_VAL_TYPE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="可选值" prop="valChoose" width="100" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="默认值" prop="valDefault" width="100" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="操作" width="100" fixed="right" align="center">
                <template slot-scope="scope">
                  <el-button class="yu-action-btn" @click.native.prevent="editPropFn(scope.row)" type="text">修改</el-button>
                  <el-button class="yu-action-btn" @click.native.prevent="deletePropFn(scope.row)" type="text">删除</el-button>
                </template>
              </yu-xtable-column>
            </yu-xtable>
          </template>
        </MainLayout>
        <yu-dialog :title="propStatus === 'add' ? '新增属性' : '修改属性'" :visible.sync="addPropVisible" width="800px">
          <yu-xform ref="propFormRef" :model="propForm" label-width="100px">
            <yu-xform-group :column="2">
              <yu-xform-item label="属性标识" placeholder="组件注册名" name="proId" ctype="input" :rules="globalRules.requiredInput50"></yu-xform-item>
              <yu-xform-item label="属性名称" placeholder="组件名称" name="proName" ctype="input" :rules="globalRules.requiredInput50"></yu-xform-item>
              <yu-xform-item label="类型" placeholder="类型" name="proType" ctype="select" data-code="LC_PRO_TYPE" :rules="globalRules.required"></yu-xform-item>
              <yu-xform-item label="常用属性" placeholder="常用属性" name="proComm" ctype="select" data-code="YESNO"></yu-xform-item>
              <yu-xform-item label="启用" name="proSts" ctype="switch"></yu-xform-item>
              <yu-xform-item label="值类型" placeholder="值类型" name="valType" data-code="LC_VAL_TYPE" ctype="select"></yu-xform-item>
              <yu-xform-item label="可选值" placeholder="可选值" name="valChoose" ctype="input">
                <template v-slot:label>
                  可选值
                  <el-popover placement="top-start" width="400" trigger="hover">
                    <div>
                      <p>支持3种方式:</p>
                      <p>1.多个值以逗号分隔，例如true,false或者true[是],false[否]</p>
                      <p>2.支持码值，例如YESNO</p>
                      <p>3.支持接口(支持参数传递)，例如api/test/getdata?id=1</p>
                    </div>
                    <i slot="reference" class="iconfont icon-bangzhu"></i>
                  </el-popover>
                  ：</template
                >
              </yu-xform-item>
              <yu-xform-item label="默认值" placeholder="默认值" name="valDefault" ctype="input"></yu-xform-item>
              <yu-xform-item label="排序" placeholder="排序" name="orderBy" ctype="input"></yu-xform-item>
            </yu-xform-group>
            <yu-xform-group :column="1">
              <yu-xform-item label="备注" placeholder="备注" name="remark" ctype="input" type="textarea" :rules="globalRules.desc"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
          <div slot="footer" align="center">
            <el-button type="primary" @click="savePropFn">保存</el-button>
            <el-button @click="addPropVisible = false">取消</el-button>
          </div>
        </yu-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import { backend } from "@/config";
import { saveSysModule, deleteSysModule, saveSysModuleProp, deleteSysModuleProp } from "@/api/lowCode";

export interface ICompItem {
  id: string;
  modRegName: string;
  modName: string;
  modType: string;
  remark: string;
}

export interface IPropItem {
  id: string;
  proId: string;
  proName: string;
  proType: string;
  proComm: string;
  proSts: string;
  valType: string;
  valChoose: string;
  valDefault: string;
  remark: string;
}

@Component({
  name: "ComptRegister",
  components: {},
})
export default class extends Vue {
  @Ref("compFormRef") compFormRef: any;
  @Ref("refCompTable") refCompTable: any;
  @Ref("propFormRef") propFormRef: any;
  @Ref("refPropTable") refPropTable: any;

  private compDataUrl = backend.comptMgrService + "/api/sysmodule/list";
  private compForm = {};
  private addCompVisible = false;
  private compStatus = "add";

  private clickRow = {};
  private propDataUrl = backend.comptMgrService + "/api/sysmodule/property/list";
  private propForm = {};
  private addPropVisible = false;
  private propStatus = "add";

  addCompFn() {
    this.addCompVisible = true;
    this.compFormRef && this.compFormRef.resetFields();
  }

  // 新增组件
  saveCompFn() {
    saveSysModule(this.compForm).then((res) => {
      this.$message.success((this.compForm as ICompItem).id ? "修改成功" : "新增成功");
      this.addCompVisible = false;
      this.refCompTable.remoteData();
    });
  }

  editCompFn(row: ICompItem) {
    this.compForm = row;
    this.addCompVisible = true;
  }

  deleteCompFn(row: ICompItem) {
    deleteSysModule({
      condition: JSON.stringify({
        id: row.id,
      }),
    }).then((res) => {
      this.$message.success("删除成功");
      this.refCompTable.remoteData();
    });
  }

  rowClickFn(row: any, event: any, column: any) {
    this.clickRow = row;
    var params = {
      condition: JSON.stringify({
        moduleId: row.id,
      }),
    };
    this.refPropTable.remoteData(params);
  }

  addPropFn() {
    if (!(this.clickRow as ICompItem).id) {
      this.$message.warning("请先选择组件");
      return;
    }
    this.propStatus = "add";
    this.propForm = {};
    this.addPropVisible = true;
    this.propFormRef && this.propFormRef.resetFields();
  }

  // 新增属性
  savePropFn() {
    saveSysModuleProp({
      ...this.propForm,
      proSts: (this.propForm as IPropItem).proSts ? "1" : "0",
      moduleId: (this.clickRow as ICompItem).id,
    }).then((res) => {
      this.$message.success((this.propForm as IPropItem).proId ? "修改成功" : "新增成功");
      this.addPropVisible = false;
      this.refPropTable.remoteData();
    });
  }

  editPropFn(row: IPropItem) {
    this.propStatus = "edit";
    this.propForm = {
      ...row,
      proSts: row.proSts === "1",
    };
    this.addPropVisible = true;
  }

  deletePropFn(row: IPropItem) {
    deleteSysModuleProp({
      condition: JSON.stringify({
        id: row.id,
      }),
    }).then((res) => {
      this.$message.success("删除成功");
      this.refPropTable.remoteData();
    });
  }
}
</script>

<style lang="scss" scoped></style>
