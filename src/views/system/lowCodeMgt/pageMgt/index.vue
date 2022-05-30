<template>
  <div class="pageMgt-container">
    <el-row :gutter="16">
      <el-col :span="5">
        <yu-left-tree
          class="box-shadow"
          title="业务组件目录"
          ref="menuTree"
          :show-checkbox="false"
          :height="bHeight - (isMaxScreen ? 232 : 202)"
          :data-url="treeUrl"
          data-id="id"
          data-label="catalogName"
          @node-xclick="nodeClickFn"
          data-pid="upId"
          :expand-level="2"
          :highlight-current="true"
          :operates="treeOperates"
          :show-create="true"
          :create-fn="createFn"
        >
        </yu-left-tree>
      </el-col>
      <el-col :span="19">
        <MainLayout class="yu-main-wrapper">
          <template v-slot:header>
            <el-button icon="el-icon-plus" @click="addPageFn">新增</el-button>
            <el-button icon="el-icon-share" @click="publishFn">发布</el-button>
          </template>
          <template v-slot:form>
            <yu-xform ref="searchForm" :model="queryFormData" related-table-name="refTable" form-type="search">
              <yu-xform-group :column="4">
                <yu-xform-item label="页面名称" placeholder="页面名称" ctype="input" name="pageName" :rules="globalRules.input"></yu-xform-item>
                <yu-xform-item label="创建人" placeholder="创建人" ctype="input" name="createUserName" :rules="globalRules.input"></yu-xform-item>
              </yu-xform-group>
            </yu-xform>
          </template>
          <template v-slot:table>
            <yu-xtable ref="refTable" :data-url="dataUrl" selection-type="checkbox" row-number :dynamic-height="true" border>
              <yu-xtable-column label="页面名称" prop="pageName" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="状态" prop="pageSts" data-code="LC_STATUS" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="创建人" prop="createUserName" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="创建时间" prop="createTime" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button class="yu-action-btn" @click.native.prevent="editPageFn(scope.row)" type="text">修改</el-button>
                  <el-button class="yu-action-btn" @click.native.prevent="deletePageFn(scope.row)" type="text">删除</el-button>
                </template>
              </yu-xtable-column>
            </yu-xtable>
          </template>
        </MainLayout>
      </el-col>
    </el-row>
    <content-modal :visible.sync="contentVisible">
      <template slot-scope="scope">
        <add-page-comp :instance="scope" :data="curPageRow" />
      </template>
    </content-modal>
    <yu-dialog :title="viewType === 'add' ? '新增目录' : '修改目录'" :visible.sync="visible" width="400px">
      <yu-xform ref="formRef" :model="addForm" label-width="100px">
        <yu-xform-group :column="1">
          <yu-xform-item v-if="viewType === 'add'" label="上级目录" placeholder="上级目录" name="upName" ctype="input" disabled></yu-xform-item>
          <yu-xform-item label="目录名称" placeholder="目录名称" name="catalogName" ctype="input" :rules="globalRules.requiredInput50"></yu-xform-item>
          <yu-xform-item label="排序" placeholder="排序" name="orderBy" ctype="input" :rules="$validator.orderNumber"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button type="primary" @click="saveFn">保存</el-button>
        <el-button @click="visible = false">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import { backend } from "@/config";
import { getUserInfo } from "@/utils";
import AddPageComp from "./addPageComp/index.vue";
import { savePageCataLog, deletePageCataLog, savePage, deletePage } from "@/api/lowCode";
import { LowCodeModule } from "../../../../store/modules/lowCode";

export interface IMenuItem {
  id: string;
  upId: string;
  catalogName: string;
  orderBy: number;
}

export interface IPageItem {
  id: string;
  pageName: string;
  pageSts: string;
  pageConfig: string;
}

@Component({
  name: "PageMgt",
  components: {
    AddPageComp,
  },
})
export default class extends Vue {
  @Ref("searchForm") searchForm: any;
  @Ref("refTable") refTable: any;
  @Ref("menuTree") menuTree: any;
  @Ref("formRef") formRef: any;

  // 页面目录
  private treeUrl = backend.comptMgrService + "/api/page/catalog/info";
  private viewType = "add";
  private visible = false;
  private addForm = {};
  private treeOperates = [
    { label: "修改", func: this.editFn, disabled: true },
    { label: "删除", func: this.deleteFn, disabled: true },
  ];
  private clickNode = {};

  // 页面列表
  private dataUrl = backend.comptMgrService + "/api/page/list";
  private queryFormData = {};
  private activeName = "1";
  private contentVisible = false;
  private curPageRow = {};

  async createFn() {
    this.viewType = "add";
    await this.$nextTick();
    this.addForm = {
      upName: (this.clickNode as IMenuItem).catalogName,
    };
    this.visible = true;
    this.formRef && this.formRef.resetFields();
  }

  // 新增目录
  saveFn() {
    savePageCataLog({
      upId: (this.clickNode as IMenuItem).id || "",
      ...this.addForm,
    }).then((res) => {
      this.$message.success((this.addForm as IMenuItem).id ? "修改成功" : "新增成功");
      this.visible = false;
      this.menuTree.remoteData();
      this.clickNode = {};
    });
  }

  editFn() {
    this.viewType = "edit";
    this.addForm = {
      ...this.clickNode,
    };
    this.visible = true;
  }

  deleteFn() {
    deletePageCataLog({
      condition: JSON.stringify({
        id: (this.clickNode as IMenuItem).id,
      }),
    }).then((res) => {
      this.$message.success("删除成功");
      this.clickNode = {};
      this.menuTree.remoteData();
    });
  }

  nodeClickFn(node: IMenuItem) {
    this.clickNode = node;
    this.refTable.remoteData({
      condition: JSON.stringify({
        catalogId: node.id,
      }),
    });
  }

  addPageFn() {
    if (!(this.clickNode as IMenuItem).id) {
      this.$message.warning("请先选择目录");
      return;
    }
    this.contentVisible = true;
    LowCodeModule.CLEAR_PAGE_CONFIG();
    this.curPageRow = {
      ...this.clickNode,
      catalogId: (this.clickNode as IMenuItem).id,
    };
  }

  editPageFn(row: IPageItem) {
    this.curPageRow = row;
    let pageConfig = JSON.parse(row.pageConfig);
    LowCodeModule.SET_PAGE_CONFIG(pageConfig);
    this.contentVisible = true;
  }

  deletePageFn(row: IPageItem) {
    deletePage({
      condition: JSON.stringify({
        id: row.id,
      }),
    }).then((res) => {
      this.$message.success("删除成功");
      this.refTable.remoteData();
    });
  }

  // 发布
  publishFn() {
    let selections = this.refTable.selections;
    if (selections.length !== 1) {
      this.$message.warning("请选择一条数据");
      return;
    }
    let params = {
      ...selections[0],
      pageSts: "1",
    };
    savePage(params).then((res) => {
      this.$message.success("发布成功");
      this.refTable.remoteData();
    });
  }
}
</script>

<style lang="scss">
.pageMgt-container {
  .el-collapse-item__header {
    position: relative;
    padding-left: 20px;
    .el-collapse-item__arrow {
      margin: 0;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      &.is-active {
        transform: translateY(-50%) rotate(90deg);
      }
    }
    .action-operator {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      i {
        cursor: pointer;
        display: inline-block;
        border: 1px solid #ccc;
        padding: 2px;
        border-radius: 2px;
        color: #007eff;
        &:hover {
          border-color: #007eff;
        }
        & + i {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
