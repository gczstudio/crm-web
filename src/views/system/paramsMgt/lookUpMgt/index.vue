<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="5">
        <yu-left-tree
          class="box-shadow"
          title="数据字典目录"
          ref="lookuptypetree"
          @node-xclick="nodeClickFn"
          :height="bHeight - (isMaxScreen ? 232 : 202)"
          :data-url="typeUrl"
          data-id="lookupTypeId"
          data-label="lookupTypeName"
          :highlight-current="true"
          data-pid="upLookupTypeId"
          :filter-node-method="filterNode"
          default-expand-all
          :operates="treeOperates"
          :create-fn="createLkType"
          :showCreate="true"
        >
        </yu-left-tree>
      </el-col>
      <el-col :span="9">
        <div class="yu-main-wrapper">
          <!-- 表格工具栏 -->
          <div class="yu-main__header clearfix">
            <div class="yu-main__header--title fl">字典类别</div>
            <div class="yu-main-toolbar fr">
              <el-button icon="el-icon-plus" @click="addFilterRecord">新增</el-button>
              <el-button icon="el-icon-edit" @click="lookuptableEditFn">修改</el-button>
              <el-button icon="el-icon-delete" @click="dataFiltermultDeleteFn">删除</el-button>
            </div>
          </div>
          <div class="yu-main-form">
            <yu-xform class="search" :model="query" :search="queryMainGridFn" form-type="search">
              <yu-xform-group :column="1">
                <yu-xform-item label="类别别名或名称" name="lookupName" ctype="input" :rules="globalRules.input"></yu-xform-item>
              </yu-xform-group>
            </yu-xform>
          </div>
          <div class="yu-main-content">
            <!-- 查询结果表格 -->
            <div class="yu-main-table">
              <yu-xtable ref="filterTable" @row-click="rowClickFn" :data-url="typetableUrl" :default-load="true" :dynamic-height="true" border layout="total, prev, pager, next">
                <yu-xtable-column label="字典类别英文别名" prop="lookupCode"></yu-xtable-column>
                <yu-xtable-column label="字典类别名称" prop="lookupName"></yu-xtable-column>
              </yu-xtable>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="yu-main-wrapper">
          <!-- 表格工具栏 -->
          <div class="yu-main__header clearfix">
            <div class="yu-main__header--title fl">数据字典内容</div>
            <div class="yu-main-toolbar fr">
              <el-button icon="el-icon-plus" @click="createLkItem">新增</el-button>
              <el-button icon="el-icon-edit" @click="updateLkItem">修改</el-button>
              <el-button icon="el-icon-delete" @click="deleteLkItem">删除</el-button>
              <el-button icon="el-icon-delete" @click="refreshLkItem">刷新缓存</el-button>
            </div>
          </div>
          <div class="yu-main-form">
            <yu-xform class="search" :model="itemQuery" :search="itemQueryMainGridFn" form-type="search">
              <yu-xform-group :column="1">
                <yu-xform-item label="字典代码或名称" name="lookupItemName" ctype="input" :rules="globalRules.input"></yu-xform-item>
              </yu-xform-group>
            </yu-xform>
          </div>
          <div class="yu-main-content">
            <!-- 查询结果表格 -->
            <div class="yu-main-table">
              <yu-xtable ref="itemTable" @row-click="itemClickFn" :data-url="itemUrl" :default-load="true" :dynamic-height="true" border layout="total, prev, pager, next">
                <yu-xtable-column label="字典代码" prop="lookupItemCode" :sortable="true" :resizable="true"></yu-xtable-column>
                <yu-xtable-column label="字典名称" prop="lookupItemName"></yu-xtable-column>
                <yu-xtable-column label="字典排序" prop="lookupItemOrder" :width="100"></yu-xtable-column>
                <yu-xtable-column label="字典备注说明" prop="lookupItemComment"></yu-xtable-column>
              </yu-xtable>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <yu-dialog title="类别目录" :visible.sync="lkTypeDialogVisible" width="500px">
      <yu-xform :model="lookupType" ref="lookupTypeForm" :disabled="lookupTypeFormDisabled" label-width="120px">
        <yu-xform-group :column="1">
          <yu-xform-item label="目录名称" name="lookupTypeName" :rules="globalRules.requiredInput" ctype="input"></yu-xform-item>
          <yu-xform-item label="上级目录" name="upLookupTypeName" :rules="globalRules.required" ctype="input"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button v-if="lktypeviewType == 'ADD'" type="primary" @click="saveLookUpType()">保 存</el-button>
        <el-button v-if="lktypeviewType == 'UPDATE'" type="primary" @click="updateLookUpType()">保 存</el-button>
        <el-button @click="lkTypeDialogVisible = false">取消</el-button>
      </div>
    </yu-dialog>
    <yu-dialog title="字典内容" :visible.sync="lkItemDialogVisible" width="500px">
      <yu-xform :model="lookupItem" ref="lookupItemForm" :disabled="lookupItemFormDisabled" label-width="140px">
        <yu-xform-group :column="1">
          <yu-xform-item label="字典代码" name="lookupItemCode" :rules="globalRules.required" ctype="input"></yu-xform-item>
          <yu-xform-item label="字典名称" name="lookupItemName" :rules="globalRules.required" ctype="input"></yu-xform-item>
          <yu-xform-item label="类别英文别名" name="lookupCode" :readonly="true" :rules="globalRules.required" ctype="input"></yu-xform-item>
          <yu-xform-item label="字典排序" :rules="$validator.orderNumber" name="lookupItemOrder" ctype="input"></yu-xform-item>
          <yu-xform-item label="字典备注说明" name="lookupItemComment" ctype="input"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button v-if="lkItemviewType == 'ADD'" type="primary" @click="saveLookUpItem()">保 存</el-button>
        <el-button v-if="lkItemviewType == 'UPDATE'" type="primary" @click="updateLookUpItem()">保 存</el-button>
        <el-button @click="lkItemDialogVisible = false">取消</el-button>
      </div>
    </yu-dialog>
    <yu-dialog title="数据字典类别" :visible.sync="dialogVisible" width="500px">
      <yu-xform :model="datafilter" ref="datafilterForm" :disabled="formDisabled" label-width="140px">
        <yu-xform-group :column="1">
          <yu-xform-item label="类别英文别名" name="lookupCode" :rules="globalRules.requiredInput" ctype="input"></yu-xform-item>
          <yu-xform-item label="字典类别名称" name="lookupName" :rules="globalRules.required" ctype="input"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button v-if="viewType == 'ADD'" type="primary" @click="createFilter()">保 存</el-button>
        <el-button v-if="viewType == 'UPDATE'" type="primary" @click="lookuptableUpdateFn()">保 存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import { backend } from "@/config";
export default {
  name: "LookUpMgt",
  data: function () {
    return {
      treeOperates: [
        { label: "修改", func: this.updateLkType, disabled: true },
        { label: "删除", func: this.deleteLkType, disabled: true },
      ],
      // 类别目录url
      typeUrl: backend.appCommonService + "/api/adminsmlookuptype/list",
      // 类别表格url
      typetableUrl: backend.appCommonService + "/api/adminsmLookup/",
      // 内容url
      itemUrl: backend.appCommonService + "/api/adminsmlookupitem/",
      lookUpCodeUpdate: false,
      query: {},
      itemQuery: {},
      lookupTypeForm: {},
      lookupItemForm: {},
      datafilterForm: {},
      lookuplookupCodeRead: false,
      defaultInstuId: "100",
      userId: this.$util.getUserInfo().userId,
      // 表单是否显示
      dialogVisible: false,
      // 表单是否可用
      formDisabled: false,
      // 类别表单操作状态
      viewType: "DETAIL",
      // 类别目录
      lktypeviewType: "DETAIL",
      // 内容
      lkItemviewType: "DETAIL",
      lookupTypeFormDisabled: false,
      lookupItemFormDisabled: false,
      // 目录FORM表单
      lkTypeDialogVisible: false,
      // 内容目录FORM表单
      lkItemDialogVisible: false,
      // 当前点击目录ID
      parentTypeId: null,
      // 当前选中目录ID
      currentTypeId: null,
      // 当前选中目录label
      currentTypeName: null,
      // 当前选中目录数据
      currentTypeData: null,
      // 当前目录level
      currentTypeLevel: null,
      // 当前选中内容目录ID
      currentItemId: null,
      // 表格类型目录ID不显示
      lookuptypids: false,
      idView: false,
      // 类别树过滤
      filterText: "",
      // 内容树过滤
      itemText: "",

      // 类别目录表单
      lookupType: {
        lookupTypeId: "",
        instuId: "",
        lookupTypeName: "",
        upLookupTypeId: "",
        upLookupTypeName: "",
        lastChgUsr: "",
        lastChgDt: "",
      },
      // 内容目录表单
      lookupItem: {
        lookupItemId: "",
        lookupItemCode: "",
        lookupItemName: "",
        lookupCode: "",
        upLookupItemId: "",
        lookupItemOrder: "",
        lookupItemComment: "",
        lastChgUsr: "",
        lastChgDt: "",
      },
      datafilter: {},

      filterGrid: {
        // 当前类别行
        currentRow: null,
        // 当前内容行
        currentItemRow: null,

        data: null,
        total: null,
        loading: false,
        multipleSelection: "",
        // 多选类别
        selections: [],
        paging: {
          page: 1,
          pageSize: 10,
        },
        // 类别TABLE模糊查询表头
        query: {
          lookupName: "",
          lookupCode: "",
          lookupTypeId: "",
        },
        lookup: {
          lookupId: "",
          lookupTypeId: "",
          instuId: "",
          lookupName: "",
          lastChgUsr: "",
          lastChgDt: "",
        },
      },
      lookuptypetree: {
        data: [
          {
            id: 0,
            label: "",
            children: [],
          },
        ],
        props: {
          children: "children",
          label: "label",
        },
      },
      itemTable: {
        data: [
          {
            id: 0,
            label: "",
            children: [],
          },
        ],
        props: {
          children: "children",
          label: "label",
        },
      },
    };
  },
  methods: {
    queryMainGridFn() {
      var param = { condition: JSON.stringify(this.query) };
      this.$refs.filterTable.remoteData(param);
    },
    itemQueryMainGridFn() {
      var param = { condition: JSON.stringify(this.itemQuery) };
      this.$refs.itemTable.remoteData(param);
    },
    startChangeFn(val) {
      this.filterGrid.paging.page = val;
      this.queryInitFn();
    },
    limitChangeFn(val) {
      this.filterGrid.paging.page = 1;
      this.filterGrid.paging.pageSize = val;
      this.queryInitFn();
    },
    // 类别目录过滤搜索
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      return data.label.indexOf(value) !== -1;
    },
    // 内容目录过滤搜索
    itemNode(value, data) {
      if (!value) {
        return true;
      }
      return data.label.indexOf(value) !== -1;
    },
    // 点击内容目录
    itemClickFn(row, event, column) {
      // 用于单个修改
      this.filterGrid.currentItemRow = row;
    },
    // 点击类别目录
    nodeClickFn(obj, node, nodeComp) {
      this.currentTypeId = node.data.id;
      this.currentTypeName = node.data.label;
      this.currentTypeData = node.data;
      this.currentTypeLevel = node.level;
      // 获取数据字典类别TABLE start
      this.filterGrid.loading = true;
      var param = {
        page: this.filterGrid.paging.page,
        pageSize: this.filterGrid.paging.pageSize,
        condition: JSON.stringify({
          lookupTypeId: this.currentTypeId,
        }),
      };
      // 发起请求
      this.$refs.filterTable.remoteData(param);
      // 获取数据字典类别TABLE  end
    },

    // 新增类别目录按钮
    createLkType() {
      if (this.currentTypeId == null) {
        this.$message({ message: "请选择目录节点!", type: "warning" });
        return false;
      }
      // 挂在当前选中目录下面
      this.lookupType.upLookupTypeId = this.currentTypeId;
      this.lookupType.upLookupTypeName = this.currentTypeName;
      this.lkTypeDialogVisible = true;
      this.lktypeviewType = "ADD";
      this.$nextTick(() => {
        this.lookupType.lookupTypeName = "";
        this.lookupType.upLookupTypeId = this.currentTypeId;
        this.lookupType.upLookupTypeName = this.currentTypeName;
      });
    },
    // 修改类别目录按钮
    updateLkType() {
      var lkTypeId = this.currentTypeId;
      if (lkTypeId == null) {
        this.$message({ message: "请选择目录节点!", type: "warning" });
        return false;
      }
      if (this.currentTypeLevel == 1) {
        this.$message({ message: "目录根节点不支持修改!", type: "warning" });
        return false;
      }
      this.lktypeviewType = "UPDATE";
      this.$nextTick(function () {
        this.lookupType = this._.cloneDeep(this.currentTypeData);
      });
      this.lkTypeDialogVisible = true;
    },
    // 新增内容目录按钮
    createLkItem() {
      // 挂在当前选中目录下面
      if (this.filterGrid.currentRow == null) {
        this.$message({ message: "请选择类别!", type: "warning" });
        return false;
      }
      this.lookupItem.lookupCode = this.filterGrid.currentRow.lookupCode;
      this.lkItemDialogVisible = true;
      this.lkItemviewType = "ADD";
      this.$nextTick(function () {
        this.$refs.lookupItemForm.resetFields();
        this.lookupItem.lookupCode = this.filterGrid.currentRow.lookupCode;
      });
    },
    // 修改内容目录按钮
    updateLkItem() {
      if (this.filterGrid.currentItemRow == null) {
        this.$message({ message: "请选择数据字典内容!", type: "warning" });
        return false;
      }

      // var lkTypeId = this.filterGrid.currentItemRow.lookupItemId;
      this.lkItemviewType = "UPDATE";
      this.$nextTick(function () {
        this.lookupItem = this._.cloneDeep(this.filterGrid.currentItemRow);
      });
      this.lkItemDialogVisible = true;
    },
    // 新增目录保存
    saveLookUpType() {
      // this.lookupType = model;
      this.lookupType.lastChgUsr = this.userId;
      this.lookupType.instuId = this.defaultInstuId;
      delete this.lookupType.lookupTypeId;
      request({
        url: backend.appCommonService + "/api/adminsmlookuptype/",
        method: "post",
        data: this.lookupType,
      }).then((res) => {
        this.$message({ message: "保存成功!", type: "success" });
        this.lkTypeDialogVisible = false;
        // 刷新树
        this.$refs.lookuptypetree.remoteData();
      });
    },
    // 修改目录保存
    updateLookUpType() {
      this.lookupType.lastChgUsr = this.userId;
      this.lookupType.instuId = this.defaultInstuId;
      request({
        url: backend.appCommonService + "/api/adminsmlookuptype/updates",
        method: "post",
        data: this.lookupType,
      }).then((res) => {
        this.$message({ message: "保存成功!", type: "success" });
        this.lkTypeDialogVisible = false;
        // 刷新树
        this.$refs.lookuptypetree.remoteData();
      });
    },
    // 新增内容目录保存
    saveLookUpItem() {
      this.lookupItem.lastChgUsr = this.userId;
      this.lookupItem.upLookupItemId = "";
      delete this.lookupItem.lookupItemId;
      request({
        url: backend.appCommonService + "/api/adminsmlookupitem/createitem",
        method: "post",
        data: this.lookupItem,
      }).then((res) => {
        this.$message({ message: "保存成功!", type: "success" });
        this.lkItemDialogVisible = false;
        var param = {
          page: 0,
          pageSize: 100,
          condition: JSON.stringify({
            lookupCode: this.lookupItem.lookupCode,
          }),
        };
        // 刷新树
        this.$refs.itemTable.remoteData(param);
      });
    },
    // 修改内容目录保存
    updateLookUpItem() {
      this.lookupItem.lastChgUsr = this.userId;
      request({
        url: backend.appCommonService + "/api/adminsmlookupitem/updates",
        method: "post",
        data: this.lookupItem,
      }).then((res) => {
        this.$message({ message: "保存成功!", type: "success" });
        this.lkItemDialogVisible = false;
        var param = {
          page: 0,
          pageSize: 100,
          condition: JSON.stringify({
            lookupCode: this.lookupItem.lookupCode,
          }),
        };
        // 刷新树
        this.$refs.itemTable.remoteData(param);
      });
    },
    // 删除类别目录
    deleteLkType() {
      var lookupTypeId = this.currentTypeId;
      if (lookupTypeId == null) {
        this.$message({ message: "请选择目录节点!", type: "warning" });
        return false;
      }
      this.$confirm("确认删除该类别目录以及目录下的类别?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: (action) => {
          if (action === "confirm") {
            request({
              url: backend.appCommonService + "/api/adminsmlookuptype/deletes/",
              method: "post",
              data: [lookupTypeId],
            }).then((res) => {
              this.$message({ message: "删除成功!", type: "success" });
              // 刷新树
              this.$refs.lookuptypetree.remoteData();
              this.$refs.filterTable.remoteData();
              this.$refs.itemTable.remoteData();
              this.currentTypeId = null;
            });
          }
        },
      });
    },
    // 删除内容目录
    deleteLkItem() {
      if (this.filterGrid.currentItemRow == null) {
        this.$message({ message: "请选择数据字典内容!", type: "warning" });
        return false;
      }
      var lookupItem = {
        lookupItemId: this.filterGrid.currentItemRow.lookupItemId,
        lookupCode: this.filterGrid.currentItemRow.lookupCode,
      };
      this.$confirm("确认删除该字典内容?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: (action) => {
          if (action === "confirm") {
            request({
              url: backend.appCommonService + "/api/adminsmlookupitem/delete",
              method: "POST",
              data: lookupItem,
            }).then((res) => {
              this.$message({ message: "删除成功!", type: "success" });
              // 刷新树
              var param = {
                page: 0,
                pageSize: 100,
                condition: JSON.stringify({
                  lookupCode: this.filterGrid.currentRow.lookupCode,
                }),
              };
              // 刷新树
              this.$refs.itemTable.remoteData(param);
              this.currentTypeId = null;
            });
          }
        },
      });
    },
    //    ---------------------------------字典类别表格操作 start------------------------------------------
    rowClickFn(row, event, column) {
      // 用于单个修改
      this.filterGrid.currentRow = row;
      // 获取内容目录 start
      var param = {
        page: 0,
        pageSize: 100,
        condition: JSON.stringify({
          lookupCode: this.filterGrid.currentRow.lookupCode,
        }),
      };
      this.$refs.itemTable.remoteData(param);
      // 获取内容目录 end
    },

    // 通过typeId初始化查询类别TABLE
    queryInitFn() {
      var me = this;
      me.filterGrid.loading = true;
      var param = {
        page: me.filterGrid.paging.page,
        pageSize: me.filterGrid.paging.pageSize,
        condition: JSON.stringify({
          lookupTypeId: this.currentTypeId,
        }),
      };
      // 发起请求
      me.$refs.filterTable.remoteData(param);
    },
    // 编辑按钮
    lookuptableEditFn() {
      if (this.filterGrid.currentRow == null) {
        this.$message({ message: "请选择一条字典类别记录!", type: "warning" });
        return false;
      }
      this.viewType = "UPDATE";
      this.dialogVisible = true;
      this.$nextTick(function () {
        this.lookuplookupCodeRead = true;
        // this.$refs.datafilterForm.switch('lookupCode', 'readonly', true);
        this.datafilter = this._.cloneDeep(this.filterGrid.currentRow);
      });
    },
    // 修改字典类别
    lookuptableUpdateFn() {
      this.datafilter.lastChgUsr = this.userId;
      this.datafilter.instuId = this.defaultInstuId;
      this.dialogVisible = false;
      this.$refs.filterTable.remoteData();
      this.filterGrid.currentRow = this.datafilter;
      request({
        url: backend.appCommonService + "/api/adminsmLookup/updates",
        method: "post",
        data: this.filterGrid.currentRow,
      }).then((res) => {
        this.$message({ message: "保存成功!", type: "success" });
        this.queryInitFn();
      });
    },
    // 增加字典类别
    addFilterRecord() {
      if (this.currentTypeId === null) {
        this.$message({ message: "请选择目录!", type: "warning" });
        return false;
      }
      this.dialogVisible = true;
      this.viewType = "ADD";
      this.$nextTick(function () {
        this.datafilter.lookupCode = "";
        this.datafilter.lookupName = "";
        this.lookuplookupCodeRead = false;
        // this.$refs.datafilterForm.switch('lookupCode', 'readonly', false);
        this.datafilter.lookupTypeId = this.currentTypeId;
      });
    },

    // 保存新增字典类别
    createFilter() {
      this.datafilter.lastChgUsr = this.userId;
      this.datafilter.instuId = this.defaultInstuId;
      this.filterGrid.currentRow = this.datafilter;
      this.dialogVisible = false;
      this.$refs.filterTable.remoteData();
      delete this.filterGrid.currentRow.lookupId;
      request({
        url: backend.appCommonService + "/api/adminsmLookup/createvalidate",
        method: "post",
        data: this.filterGrid.currentRow,
      }).then((res) => {
        this.$message({ message: "保存成功!", type: "success" });
        this.queryInitFn();
      });
    },
    // 删除数据字典类别
    dataFilterDeleteFn(row) {
      this.filterGrid.currentRow = row;
      this.$confirm("确认删除该数据字典类别?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: (action) => {
          if (action === "confirm") {
            request({
              url: backend.appCommonService + "/api/adminsmLookup/delete/" + this.filterGrid.currentRow.lookupId,
              method: "post",
              data: null,
            }).then((res) => {
              this.$message({ message: "删除成功!", type: "success" });
              this.queryInitFn();
              this.$refs.itemTable.remoteData();
            });
          }
        },
      });
    },
    // 批量删除数据字典类别
    dataFiltermultDeleteFn() {
      if (this.filterGrid.currentRow == null) {
        this.$message({ message: "请选择一条字典类别记录!", type: "warning" });
        return false;
      }
      this.$confirm("确认删除该字典类别以及类别下的字典内容?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: (action) => {
          if (action === "confirm") {
            request({
              url: backend.appCommonService + "/api/adminsmLookup/deletes/" + this.filterGrid.currentRow.lookupId,
              method: "post",
              data: {
                lookupId: this.filterGrid.currentRow.lookupId,
              },
            }).then((res) => {
              this.$message({ message: "删除成功!", type: "success" });
              this.queryInitFn();
              this.$refs.itemTable.remoteData();
            });
          }
        },
      });
    },
    /**
     *  批量更新数据字典缓存
     * 仅用于非页面操作时更新Redis缓存。可能较慢。
     * 当某个字典更新失败会提示对应code信息，请尝试手动更新。
     */
    refreshLkItem() {
      request({
        method: "GET",
        url: backend.appCommonService + "/api/adminsmlookupitem/refreshitem",
      }).then((res) => {
        this.$message.success("刷新成功");
      });
    },
  },
  mounted: function () {
    // this.getTableHeight();
    // this.queryMainGridFn();
  },
  watch: {
    filterText: function (value) {
      this.$refs.lookuptypetree.filter(value);
    },
  },
};
</script>
