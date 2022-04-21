<template>
  <div class="ComponentRegister-container">
    <el-row :gutter="16">
      <el-col :span="12">
        <MainLayout>
          <template v-slot:header>
            <el-button icon="el-icon-download" @click="addCompFn">新增</el-button>
          </template>
          <template v-slot:form>
            <yu-xform ref="searchForm" related-table-name="refTable" form-type="search">
              <yu-xform-group :column="2">
                <yu-xform-item label="组件注册名" placeholder="组件注册名" ctype="input" name="name1" :rules="globalRules.input"></yu-xform-item>
                <yu-xform-item label="组件名称" placeholder="组件名称" ctype="input" name="name2" :rules="globalRules.input"></yu-xform-item>
                <yu-xform-item label="组件类型" placeholder="组件类型" ctype="select" name="name3" data-code=""></yu-xform-item>
              </yu-xform-group>
            </yu-xform>
          </template>
          <template v-slot:table>
            <yu-xtable ref="refTable" :data-url="dataUrl" row-number :dynamic-height="true" border>
              <yu-xtable-column label="组件注册名" prop="compRegisterName" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="组件名称" prop="compName" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="组件类型" prop="compType" data-code="BUINESS_LINE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button class="yu-action-btn" @click.native.prevent="editCompFn(scope.row)" type="text">修改</el-button>
                  <el-button class="yu-action-btn" @click.native.prevent="deleteCompFn(scope.row)" type="text">删除</el-button>
                </template>
              </yu-xtable-column>
            </yu-xtable>
          </template>
        </MainLayout>
        <yu-dialog :title="compStatus === 'add'? '新增组件': '修改组件'" :visible.sync="addCompVisible" width="400px">
          <yu-xform ref="compFormRef" :model="compForm" label-width="100px">
            <yu-xform-group :column="1">
              <yu-xform-item label="组件注册名" placeholder="组件注册名" name="name1" ctype="input" :rules="globalRules.requiredInput50"></yu-xform-item>
              <yu-xform-item label="组件名称" placeholder="组件名称" name="name2" ctype="input" :rules="globalRules.requiredInput50"></yu-xform-item>
              <yu-xform-item label="组件类型" placeholder="组件类型" name="name3" ctype="select" data-code="" :rules="globalRules.required"></yu-xform-item>
              <yu-xform-item label="备注" placeholder="备注" name="name" ctype="input" type="textarea" :rules="globalRules.desc"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
          <div slot="footer" align="center">
            <el-button type="primary"  @click="saveCompFn">保存</el-button>
            <el-button @click="addCompVisible=false">取消</el-button>
          </div>
        </yu-dialog>
      </el-col>
      <el-col :span="12">
        <MainLayout>
          <template v-slot:header>
            <el-button icon="el-icon-download" @click="addPropFn">新增</el-button>
          </template>
          <template v-slot:form>
            <yu-xform ref="searchForm" related-table-name="refTable1" form-type="search">
              <yu-xform-group :column="2">
                <yu-xform-item label="属性标识" placeholder="组件注册名" ctype="input" name="name1" :rules="globalRules.input"></yu-xform-item>
                <yu-xform-item label="类型" placeholder="组件名称" ctype="input" name="name2" data-code=""></yu-xform-item>
                <yu-xform-item label="值类型" placeholder="组件类型" ctype="select" name="name3" data-code=""></yu-xform-item>
              </yu-xform-group>
            </yu-xform>
          </template>
          <template v-slot:table>
            <yu-xtable ref="refTable1" :data-url="dataUrl" row-number :dynamic-height="true" border>
              <yu-xtable-column label="属性标识" prop="compRegisterName" width="100" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="属性名称" prop="compName" width="100" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="类型" prop="compType" width="100" data-code="BUINESS_LINE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="常用属性" prop="compType" width="100" data-code="YES_NO" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="可选值" prop="compType" width="100"  :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="默认值" prop="compType" width="100" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="操作" width="100" fixed="right" align="center">
                <template slot-scope="scope">
                  <el-button class="yu-action-btn" @click.native.prevent="editCompFn(scope.row)" type="text">修改</el-button>
                  <el-button class="yu-action-btn" @click.native.prevent="deleteCompFn(scope.row)" type="text">删除</el-button>
                </template>
              </yu-xtable-column>
            </yu-xtable>
          </template>
        </MainLayout>
        <yu-dialog :title="propStatus === 'add'? '新增属性': '修改属性'" :visible.sync="addPropVisible" width="800px">
          <yu-xform ref="cpropFormRef" :model="propForm" label-width="100px">
            <yu-xform-group :column="2">
              <yu-xform-item label="属性标识" placeholder="组件注册名" name="name1" ctype="input" :rules="globalRules.requiredInput50"></yu-xform-item>
              <yu-xform-item label="属性名称" placeholder="组件名称" name="name2" ctype="input" :rules="globalRules.requiredInput50"></yu-xform-item>
              <yu-xform-item label="类型" placeholder="类型" name="name3" ctype="select" :rules="globalRules.required"></yu-xform-item>
              <yu-xform-item label="常用属性" placeholder="常用属性" name="name4" ctype="select"></yu-xform-item>
              <yu-xform-item label="启用" name="name5" ctype="switch"></yu-xform-item>
              <yu-xform-item label="值类型" placeholder="值类型" name="name6" ctype="select"></yu-xform-item>
              <yu-xform-item label="可选值" placeholder="多个值需要用逗号隔开" name="name7" ctype="input"></yu-xform-item>
              <yu-xform-item label="默认值" placeholder="默认值" name="name8" ctype="input"></yu-xform-item>
            </yu-xform-group>
            <yu-xform-group :column="1">
              <yu-xform-item label="备注" placeholder="备注" name="name9" ctype="input" type="textarea" :rules="globalRules.desc"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
          <div slot="footer" align="center">
            <el-button type="primary"  @click="savePropFn">保存</el-button>
            <el-button @click="addPropVisible=false">取消</el-button>
          </div>
        </yu-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from 'vue-property-decorator'
import { backend } from '@/config'
@Component({
  name: 'ComponentRegister',
  components: {
  }
})
export default class extends Vue { 
  @Ref('compFormRef') compFormRef: any;
  @Ref('propFormRef') propFormRef: any;

  private dataUrl = backend.mockService + '/lowcode/comp/list'
  private compForm = {}
  private addCompVisible = false
  private compStatus = 'add'

  private propForm = {}
  private addPropVisible = false
  private propStatus = 'add'

  addCompFn() {
    this.addCompVisible = true;
    this.compFormRef && this.compFormRef.resetFields()
  }

  saveCompFn() {

  }

  addPropFn() {
    this.addPropVisible = true;
    this.propFormRef && this.propFormRef.resetFields()
  }

  savePropFn() {

  }

}
</script>

<style lang="scss" scoped>


 
</style>
