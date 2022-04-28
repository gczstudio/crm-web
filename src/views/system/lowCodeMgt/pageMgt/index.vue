<template>
  <div class="pageMgt-container">
    <el-row :gutter="16">
      <el-col :span="5">
        <yu-left-tree
          class="box-shadow"
          title="页面目录"
          ref="menuTree"
          :show-checkbox="false"
          :height="bHeight - (isMaxScreen ? 232 : 202)"
          :data-url="menuTreeUrl"
          data-id="menuId"
          data-label="menuName"
          @node-xclick="nodeClickFn"
          data-pid="upMenuId"
          :expand-level="2"
          :highlight-current="true"
          :show-create="true"
          :create-fn="createFn"
        >
        </yu-left-tree>
      </el-col>
      <el-col :span="19">
        <MainLayout class="yu-main-wrapper">
          <template v-slot:header>
            <el-button icon="el-icon-plus" @click="addFn">新增</el-button>
            <el-button icon="el-icon-share">发布</el-button>
          </template>
          <template v-slot:form>
            <yu-xform ref="searchForm" :model="queryFormData" related-table-name="refTable" form-type="search">
              <yu-xform-group :column="4">
                <yu-xform-item label="页面名称" placeholder="页面名称" ctype="input" name="name" :rules="globalRules.input"></yu-xform-item>
                <yu-xform-item label="创建人" placeholder="创建人" ctype="input" name="creator" :rules="globalRules.input"></yu-xform-item>
              </yu-xform-group>
            </yu-xform>
          </template>
          <template v-slot:table>
            <yu-xtable ref="refTable" :data-url="dataUrl" row-number :dynamic-height="true" border>
              <yu-xtable-column label="页面名称" prop="name" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="状态" prop="status" data-code="BUINESS_LINE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="创建人" prop="creator" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="创建时间" prop="busiLine" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button class="yu-action-btn" @click.native.prevent="editFn(scope.row)" type="text">修改</el-button>
                  <el-button class="yu-action-btn" @click.native.prevent="deleteFn(scope.row)" type="text">删除</el-button>
                </template>
              </yu-xtable-column>
            </yu-xtable>
          </template>
        </MainLayout>
      </el-col>
    </el-row>
    <content-modal :visible.sync="contentVisible">
      <template slot-scope="scope">
        <add-page-comp :instance="scope" />
      </template>
    </content-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import { backend } from "@/config";
import { getUserInfo } from "@/utils";
import AddPageComp from "./addPageComp/index.vue";
@Component({
  name: "PageMgt",
  components: {
    AddPageComp,
  },
})
export default class extends Vue {
  @Ref("searchForm") searchForm: any;
  @Ref("refTable") refTable: any;
  private dataUrl = backend.mockService + "/lowcode/layout/list";
  private queryFormData = {};

  private menuTreeUrl = backend.appOcaService + "/api/adminsmmenu/menutreequery?sysId=" + getUserInfo().logicSys.id;

  private activeName = "1";
  private contentVisible = false;

  createFn() {
    console.log(1);
  }

  nodeClickFn() {
    console.log(2);
  }

  addFn() {
    this.contentVisible = true;
  }

  editFn() {}

  deleteFn() {}
}
</script>

<style lang="scss" scoped></style>
