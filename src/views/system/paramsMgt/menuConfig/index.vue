<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="6">
        <yu-left-tree
          class="box-shadow"
          title="菜单树"
          ref="menuTree"
          :show-checkbox="false"
          :height="bHeight - (isMaxScreen ? 232 : 202)"
          :data-url="menuTreeUrl"
          data-id="menuId"
          data-label="menuName"
          @node-xclick="nodeClickFn"
          data-pid="upMenuId"
          :filterOperateNodes="['0']"
          :expand-level="2"
          :highlight-current="true"
          :operates="treeOperates"
          :show-create="true"
          :create-fn="createFn"
        >
        </yu-left-tree>
      </el-col>
      <el-col :span="7">
        <div class="yu-main-wrapper">
          <div class="yu-main__header">
            <div class="yu-main__header--title">子节点维护</div>
          </div>
          <div class="yu-basic-content" :style="{ height: bHeight - (isMaxScreen ? 166 : 136) + 'px' }">
            <yu-xform :model="menuForm" ref="menuForm" label-width="120px">
              <yu-xform-group :column="1">
                <yu-xform-item label="菜单名称" :rules="globalRules.requiredInput" name="menuName" ctype="input"></yu-xform-item>
                <yu-xform-item label="业务功能" @focus="nameFocus" placeholder="请从业务功能列表选择" :clearable="true" name="funcName" ctype="input"></yu-xform-item>
                <yu-xform-item label="页面组件" @focus="pageFocus" placeholder="请从页面组件列表选择" :clearable="true" name="pageName" ctype="input"></yu-xform-item>
                <yu-xform-item label="排序" name="menuOrder" ctype="input"></yu-xform-item>
                <yu-xform-item label="图标" name="menuIcon" ctype="input"></yu-xform-item>
                <yu-xform-item
                  label="上级节点"
                  :readonly="true"
                  @focus="upMenuNameFocus"
                  placeholder="请从上级菜单列表选择"
                  :rules="globalRules.required"
                  name="upMenuName"
                  ctype="input"
                ></yu-xform-item>
                <yu-xform-item label="说明" :rules="globalRules.input" name="menuTip" ctype="input" type="textarea"></yu-xform-item>
              </yu-xform-group>
            </yu-xform>
            <div align="center">
              <el-button type="primary" @click="saveFn()">保存</el-button>
              <el-button type="primary" @click="resetFn()">重置</el-button>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="11">
        <div class="yu-main-wrapper">
          <div class="yu-main__header">
            <div class="yu-main__header--title">业务功能</div>
          </div>
          <div class="yu-basic-content" :style="{ height: bHeight - (isMaxScreen ? 166 : 136) + 'px', 'overflow-y': 'auto' }">
            <el-collapse v-model="expandCollapseName" accordion>
              <el-collapse-item title="业务功能列表" name="funcList">
                <yu-xform :model="query" :search="queryMainGridFn" form-type="search">
                  <yu-xform-group :column="2">
                    <yu-xform-item placeholder="关键字" name="queryKey" ctype="input" :rules="globalRules.input"></yu-xform-item>
                  </yu-xform-group>
                </yu-xform>
                <yu-xtable ref="funcTable" :height="515" :data-url="funcUrl" @row-click="funcSelect" :default-load="true">
                  <yu-xtable-column label="模块名称" prop="modName" min-width="145" :sortable="true" :resizable="true"></yu-xtable-column>
                  <yu-xtable-column label="业务功能名称" prop="funcName" min-width="150" :show-overflow-tooltip="true" :sortable="true" :resizable="true"></yu-xtable-column>
                  <yu-xtable-column label="URL链接" prop="funcUrl" min-width="100" :show-overflow-tooltip="true" :sortable="true" :resizable="true"></yu-xtable-column>
                </yu-xtable>
              </el-collapse-item>
              <el-collapse-item title="上层菜单" name="upMenu">
                <yu-left-tree
                  ref="upMenuTree"
                  :show-checkbox="false"
                  :height="500"
                  :data-url="menuTreeUrl"
                  data-id="menuId"
                  data-label="menuName"
                  @node-xclick="upMenuClickFn"
                  data-pid="upMenuId"
                  :data-root="{ id: '0', label: '主菜单' }"
                  :expand-level="2"
                  :highlight-current="true"
                >
                </yu-left-tree>
              </el-collapse-item>
              <el-collapse-item title="页面组件列表" name="pageList">
                <yu-xform :model="pageParams" :search="queryPageFn" form-type="search">
                  <yu-xform-group :column="2">
                    <yu-xform-item placeholder="页面名称" name="pageName" ctype="input" :rules="globalRules.input"></yu-xform-item>
                  </yu-xform-group>
                </yu-xform>
                <yu-xtable ref="pageTable" :height="515" :data-url="pageUrl" @row-click="pageSelect" :default-load="true">
                  <yu-xtable-column label="页面名称" prop="pageName" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
                  <yu-xtable-column label="状态" prop="pageSts" data-code="LC_STATUS" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
                  <yu-xtable-column label="创建人" prop="createUserName" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
                  <yu-xtable-column label="创建时间" prop="createTime" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
                </yu-xtable>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </el-col>
    </el-row>
    <yu-dialog title="图标选择" :visible.sync="iconDialogVisible" height="400px">
      <div class="yu-icons">
        <a v-for="icons in icons" href="javascript:void(0)" :key="icons" :class="icons" :title="icons" @click="iconSelect"></a>
      </div>
    </yu-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import { backend, baseUrl } from "@/config";
import { getUserInfo } from "@/utils";
export default {
  name: "MenuConfig",
  data: function () {
    var me = this;
    // 排序校验
    var orderValidate = function (rule, value, callback) {
      var reg = /^\d{0,4}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入数字(不超过9999)"));
        return;
      }
      callback();
    };
    let userInfo = getUserInfo();
    return {
      userInfo: userInfo,
      treeOperates: [{ label: "删除菜单", func: this.deleteFn, disabled: true }],
      currClickNode: "",
      currClickName: "",
      addFlag: false,
      tempCheckNode: "",
      iconDialogVisible: false,
      menuTreeUrl: backend.appOcaService + "/api/adminsmmenu/menutreequery?sysId=" + userInfo.logicSys.id,
      funcUrl: backend.appOcaService + "/api/adminsmmenu/funclistquery",
      expandCollapseName: ["funcList"],
      icons: [],
      query: {},
      menuForm: {},
      // 页面组件
      pageUrl: backend.comptMgrService + "/api/page/list",
      pageParams: {},
    };
  },
  methods: {
    nameFocus: function () {
      this.expandCollapseName = ["funcList"];
    },
    pageFocus: function () {
      this.expandCollapseName = ["pageList"];
    },
    upMenuNameFocus: function () {
      this.expandCollapseName = [];
      this.expandCollapseName.push("upMenu");
    },
    queryMainGridFn: function () {
      var param = { condition: JSON.stringify(this.query) };
      this.$refs.funcTable.remoteData(param);
    },
    queryPageFn: function () {
      var param = {
        condition: JSON.stringify({
          ...this.pageParams,
          pageSts: "1",
        }),
      };
      this.$refs.pageTable.remoteData(param);
    },
    saveFn: function () {
      var me = this;
      this.$refs.menuForm.validate(function (valid) {
        if (valid) {
          me.menuForm.lastChgUsr = me.userInfo.userId;
          if (me.addFlag || me.menuForm.menuId == undefined) {
            // 新增
            me.menuForm.sysId = me.userInfo.logicSys.id;
            me.menuForm.upMenuId = me.currClickNode;
            request({
              method: "POST",
              url: backend.appOcaService + "/api/adminsmmenu/createmenu",
              data: me.menuForm,
            }).then((res) => {
              me.dialogVisible = false;
              me.$message({ message: "保存成功！", type: "success" });
              me.$refs.menuTree.remoteData();
              me.$refs.upMenuTree.remoteData();
              me.$refs.menuForm.resetFields();
              me.menuForm.funcId = "";
              delete me.menuForm.menuId;
            });
            me.addFlag = false;
          } else {
            // 修改
            if (!me.menuForm.funcName) {
              me.$set;
            }
            request({
              method: "POST",
              url: backend.appOcaService + "/api/adminsmmenu/editmenu",
              data: {
                ...me.menuForm,
                funcId: me.menuForm.funcName ? me.menuForm.funcId : "",
              },
            }).then((res) => {
              me.dialogVisible = false;
              me.$message({ message: "保存成功！", type: "success" });
              me.$refs.menuTree.remoteData();
              me.$refs.upMenuTree.remoteData();
              me.$refs.menuForm.resetFields();
              me.menuForm.funcId = "";
              delete me.menuForm.menuId;
            });
          }
        } else {
          me.$message({ message: "请检查输入项是否合法", type: "warning" });
          return false;
        }
      });
    },
    resetFn: function () {
      this.menuForm.upMenuId = "";
      this.menuForm.funcId = "";
      this.$refs.menuForm.resetFields();
    },
    // 菜单树点击事件
    nodeClickFn: function (nodeData, node, self) {
      if (nodeData.id === "0") {
        return;
      }
      this.currClickNode = nodeData.menuId;
      this.currClickName = nodeData.menuName;
      var param = {
        menuId: nodeData.menuId,
      };
      var _this = this;
      request({
        method: "GET",
        params: param,
        url: backend.appOcaService + "/api/adminsmmenu/menuinfoquery",
      }).then((response) => {
        var formModel = _this._.cloneDeep(response.data);
        if (nodeData.pid == "0") {
          formModel.upMenuName = "主菜单";
        }
        _this.menuForm = formModel;
      });
    },
    // 右侧菜单树节点过滤：修改时菜单自身节点及子节点不能作为其上层菜单,因此过滤不展示
    filterFn: function (value, data) {
      var me = this;
      if (me.tempCheckNode.indexOf("," + data.id + ",") >= 0 || me.tempCheckNode.indexOf("," + data.pid + ",") >= 0) {
        me.tempCheckNode += data.id + ",";
        return false;
      } else {
        return true;
      }
    },
    // 右侧菜单树，点击选择上层菜单
    upMenuClickFn: function (nodeData, node, self) {
      this.currClickNode = nodeData.menuId || nodeData.id;
      this.currClickName = nodeData.menuName || nodeData.label;
      var formModel = this._.cloneDeep(this.menuForm);
      formModel.upMenuId = nodeData.menuId || nodeData.id;
      formModel.upMenuName = nodeData.menuName || nodeData.label;
      this.menuForm = this._.cloneDeep(formModel);
    },
    // 点击新增按钮后的响应事件
    createFn: function () {
      var me = this;
      if (me.currClickNode == "") {
        me.$message({ message: "请先选择菜单节点", type: "warning" });
        return;
      }
      me.addFlag = true;
      var temp = {
        menuName: "",
        funcName: "",
        menuOrder: "",
        menuIcon: "",
        upMenuName: me.currClickName,
        menuTip: "",
      };
      me.menuForm = me._.cloneDeep(temp);
      me.menuForm.funcId = "";
      delete me.menuForm.menuId;
    },
    // 业务功能列表选择
    funcSelect: function (row) {
      var formModel = this._.cloneDeep(this.menuForm);
      formModel.funcId = row.funcId;
      formModel.funcName = row.funcName;
      this.menuForm = this._.cloneDeep(formModel);
    },
    // 页面组件列表选择
    pageSelect: function (row) {
      var formModel = this._.cloneDeep(this.menuForm);
      formModel.pageId = row.id;
      formModel.pageName = row.pageName;
      this.menuForm = this._.cloneDeep(formModel);
    },
    // 删除菜单
    deleteFn: function () {
      if (this.currClickNode == "") {
        this.$message({ message: "请先选择菜单节点", type: "warning" });
        return;
      }
      var menuId = this.currClickNode;
      var _this = this;
      _this.$confirm("删除该菜单项的同时将删除其子菜单,确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: function (action) {
          if (action === "confirm") {
            request({
              method: "POST",
              url: backend.appOcaService + "/api/adminsmmenu/deletemenu",
              data: {
                menuId: menuId,
              },
            }).then((res) => {
              _this.$message.success({ message: "删除成功！" });
              var param = {};
              // 刷新树
              _this.$refs.menuTree.remoteData(param);
              _this.$refs.upMenuTree.remoteData(param);
              _this.$refs.menuForm.resetFields();
            });
          }
        },
      });
    },
    // 图标点击事件
    handleIconClick: function () {
      this.iconDialogVisible = true;
    },
    // 获取图标
    iconSelect: function (event) {
      var iconName = event.target.className;
      var formModel = _this._.cloneDeep(this.menuForm);
      formModel.menuIcon = iconName;
      this.menuForm = _this._.cloneDeep(formModel);
      this.iconDialogVisible = false;
    },
  },
};
</script>
