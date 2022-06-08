<template>
  <yu-dialog :title="title" :visible.sync="dialogVisible" width="1000px" @close="hide" top="5vh">
    <div class="pageMgt-container">
      <el-row :gutter="16">
        <el-col :span="5">
          <yu-left-tree
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
          >
          </yu-left-tree>
        </el-col>
        <el-col :span="19">
          <yu-xform ref="searchForm" :model="queryFormData" related-table-name="refTable" form-type="search">
            <yu-xform-group :column="4">
              <yu-xform-item label="页面名称" placeholder="页面名称" ctype="input" name="pageName" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="创建人" placeholder="创建人" ctype="input" name="createUserName" :rules="globalRules.input"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-key="id" selection-type="radio" row-number :dynamic-height="true" border>
            <yu-xtable-column label="页面名称" prop="pageName" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="状态" prop="pageSts" data-code="LC_STATUS" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="创建人" prop="createUserName" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="创建时间" prop="createTime" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          </yu-xtable>
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="operate-btns tc">
      <el-button type="primary" @click="sureFn">确定</el-button>
      <el-button @click="cancelFn">取消</el-button>
    </div>
  </yu-dialog>
</template>
<script>
import { backend } from "@/config";
export default {
  name: "SelectPageDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "页面组件",
    },
  },
  data() {
    return {
      dialogVisible: false,
      treeUrl: backend.comptMgrService + "/api/page/catalog/info",
      dataUrl: backend.comptMgrService + "/api/page/list",
      queryFormData: {},
      nowNode: {},
      selections: [],
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
    nodeClickFn(node) {
      this.refTable.remoteData({
        condition: JSON.stringify({
          catalogId: node.id,
        }),
      });
    },
    show() {
      this.$emit("update:visible", true);
    },
    hide() {
      this.$emit("update:visible", false);
    },
    sureFn() {
      let selections = this.$refs.refTable.selections;
      this.$emit("sure", selections);
      this.hide();
    },
    cancelFn() {
      this.hide();
    },
  },
};
</script>
