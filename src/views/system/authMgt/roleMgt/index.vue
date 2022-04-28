<template>
  <div class="yu-main-wrapper">
    <!-- <el-row :gutter="16">
      <el-col :span="5"> -->
    <yu-left-tree
      tree-key="authOrg"
      ref="roleTree"
      title="机构列表"
      :data-url="treeUrl"
      data-id="orgId"
      data-label="orgName"
      data-pid="upOrgId"
      @node-xclick="nodeClickFn"
      :show-checkbox="false"
      :expand-level="2"
      :highlight-current="true"
      :expand-on-click-node="true"
      :height="500"
      v-show="false"
    ></yu-left-tree>
    <!-- </el-col>
      <el-col :span="19"> -->
    <!-- 表格工具栏 -->
    <div class="yu-main__header clearfix">
      <div class="yu-main-toolbar fr">
        <el-button icon="el-icon-plus" @click="openCreateFn">新增</el-button>
        <!-- <el-button icon="edit" @click="modifyFn">修改</el-button> -->
        <el-button icon="el-icon-delete" @click="deleteFn">删除</el-button>
        <el-button icon="el-icon-unlock" @click="useFn">启用</el-button>
        <el-button icon="el-icon-lock" @click="unUseFn">停用</el-button>
      </div>
    </div>
    <div class="yu-main-form">
      <yu-xform class="search" :model="query" :search="queryMainGridFn" ref="query" form-type="search" label-width="120px">
        <yu-xform-group :column="4">
          <yu-xform-item label="角色代码" placeholder="角色代码" name="roleCode" ctype="input" :rules="globalRules.input"></yu-xform-item>
          <yu-xform-item label="角色名称" placeholder="角色名称" name="roleName" ctype="input" :rules="globalRules.input"></yu-xform-item>
          <yu-xform-item label="状态" placeholder="状态" name="roleSts" ctype="select" data-code="DATA_STS"> </yu-xform-item>
        </yu-xform-group>
      </yu-xform>
    </div>
    <div class="yu-main-content">
      <!-- 查询结果表格 -->
      <div class="yu-main-table">
        <yu-xtable ref="roletable" :data-url="mainGridDataUrl" selection-type="checkbox" :default-load="true" border dynamic-height>
          <yu-xtable-column label="角色代码" prop="roleCode" :show-overflow-tooltip="true" is-num></yu-xtable-column>
          <yu-xtable-column label="角色名称" prop="roleName" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="状态" prop="roleSts" min-width="80" :show-overflow-tooltip="true" data-code="DATA_STS"></yu-xtable-column>
          <!-- <yu-xtable-column label="所属机构" prop="orgName" :show-overflow-tooltip="true"></yu-xtable-column> -->
          <yu-xtable-column label="最新更新人" prop="userName" name="userName" ctype="input"></yu-xtable-column>
          <yu-xtable-column label="最新更新时间" prop="lastChgDt" name="lastChgDt" ctype="input" is-num></yu-xtable-column>
          <yu-xtable-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button class="yu-action-btn" @click.native.prevent="modifyFn(scope.row)" type="text">修改</el-button>
              <el-button class="yu-action-btn" @click.native.prevent="openRoleUserFn(scope.row)" type="text">角色用户</el-button>
            </template>
          </yu-xtable-column>
        </yu-xtable>
      </div>
    </div>
    <!-- </el-col>
    </el-row> -->
    <!--新增修改维护面板-->
    <yu-dialog :title="viewTitle[viewType]" :visible.sync="dialogFormVisible" width="400px" height="350px">
      <yu-xform :model="roleForm" :disabled="formDisabled" :form-type="viewType == 'DETAIL' ? 'details' : ''" ref="roleForm" label-width="120px">
        <yu-xform-group :column="1">
          <yu-xform-item label="角色代码" :readonly="dutyCdeRead" :rules="globalRules.requiredInput50" placeholder="角色代码" name="roleCode" ctype="input"></yu-xform-item>
          <yu-xform-item label="角色名称" :rules="globalRules.requiredInput50" placeholder="角色名称" name="roleName" ctype="input"> </yu-xform-item>
          <!-- <yu-xform-item label="所属机构" :params="orgIdParams" name="orgId" ctype="yufp-org-tree"></yu-xform-item> -->
          <yu-xform-item label="状态" :rules="globalRules.required" placeholder="状态" name="roleSts" ctype="select" data-code="DATA_STS"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button type="primary" @click="saveCreateFn()">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </yu-dialog>

    <!--角色用户-->
    <yu-dialog :title="roleUser" v-if="dialogGridVisible" :visible.sync="dialogGridVisible" height="400px" width="800px">
      <yu-xform :model="userQuery" ref="userQuery" form-type="search">
        <yu-xform-group :column="3">
          <yu-xform-item placeholder="登录代码" name="loginCode" ctype="input" :rules="globalRules.input"></yu-xform-item>
          <yu-xform-item placeholder="员工姓名" name="userName" ctype="input" :rules="globalRules.input"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div class="mb16">
        <el-button icon="el-icon-plus" @click="addUserFn">新增用户</el-button>
        <el-button icon="el-icon-delete" @click="deleteUserFn">删除用户</el-button>
      </div>
      <yu-xtable ref="userTable" :height="400" selection-type="checkbox" :data-url="roleUserUrl" :checkbox="false" :default-load="false" border>
        <yu-xtable-column label="登录代码" prop="loginCode" :show-overflow-tooltip="true" is-num></yu-xtable-column>
        <yu-xtable-column label="员工姓名" prop="userName" :show-overflow-tooltip="true"></yu-xtable-column>
        <yu-xtable-column label="所属机构" prop="orgName" :show-overflow-tooltip="true"></yu-xtable-column>
        <yu-xtable-column label="权限机构" prop="authOrgName" :show-overflow-tooltip="true"></yu-xtable-column>
      </yu-xtable>
    </yu-dialog>
    <!--用户选择-->
    <yu-dialog title="用户选择" :visible.sync="dialogUserVisible" height="400px" width="800px">
      <yu-xform :model="userSelectQuery" ref="userSelectForm" :search="userSelectSearchFn" form-type="search">
        <yu-xform-group :column="3">
          <yu-xform-item placeholder="登录代码/员工姓名" name="userInfo" ctype="input" :rules="globalRules.input"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <yu-xtable ref="userSelectTable" :height="400" selection-type="checkbox" :base-params="userSelectParams" :data-url="userSelectDataUrl" :default-load="false">
        <yu-xtable-column label="登录代码" prop="loginCode" :show-overflow-tooltip="true" is-num></yu-xtable-column>
        <yu-xtable-column label="员工姓名" prop="userName" :show-overflow-tooltip="true"></yu-xtable-column>
        <yu-xtable-column label="所属机构" prop="orgName" :show-overflow-tooltip="true"></yu-xtable-column>
        <yu-xtable-column label="权限机构" prop="authOrg" width="180" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yufp-auth-org-tree :tree-options="treeOptions" :orgLevel="orgLevel" v-model="scope.row.selectAuthOrg" :filterIds="['1009999']"></yufp-auth-org-tree>
          </template>
        </yu-xtable-column>
      </yu-xtable>
      <div slot="footer" align="center">
        <el-button type="primary" @click="saveUserRole">确定</el-button>
        <el-button @click="dialogUserVisible = false">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import { backend, baseUrl } from "@/config";
export default {
  name: "RoleMgt",
  data: function () {
    let userInfo = this.$util.getUserInfo();
    let roleInfo = this.$util.getCheckedRole();
    return {
      userInfo: userInfo,
      roleInfo: roleInfo,
      orgLevel: "",
      userId: userInfo.userId,
      dataRoot: roleInfo.orgCode,
      // treeUrl: backend.appOcaService + '/api/util/getorg?userId=' + userInfo.userId + '&orgCode=' + roleInfo.orgCode,
      treeUrl: backend.appOcaService + "/api/util/getorgtree?orgId=" + roleInfo.orgCode,
      orgRootId: roleInfo.orgCode,
      roleUserUrl: backend.appOcaService + "/api/adminsmrole/roleuser",
      query: {},
      orgIdParams: {
        dataUrl: backend.appOcaService + "/api/adminsmorg/orgtreequery?orgCode=" + roleInfo.orgCode + "&orgSts=A",
        dataId: "orgCode",
      },
      treeOptions: {
        checkStrictly: true,
        showCheckbox: true,
        readonly: false,
      },
      roleForm: {},
      dutyCdeRead: false,
      userQuery: {},
      selectNode: {},
      selectAuthId: "",
      mainGrid: {
        data: null,
        total: null,
        loading: false,
        multipleSelection: [],
        query: {
          orgId: "",
          roleCode: "",
          roleName: "",
          roleSts: "",
        },
        checkbox: true,
        dataUrl: backend.appOcaService + "/api/adminsmrole/querypage",
        currentRow: null,
      },
      mainGridDataUrl: backend.appOcaService + "/api/adminsmrole/querypage",
      // 角色用户
      roleUser: "角色用户",
      viewType: "DETAIL",
      org: {
        treeUrl: "",
        dataRoot: roleInfo.orgCode,
      },
      userGrid: {
        data: null,
        total: null,
        loading: true,
        multipleSelection: [],
        query: {
          loginCode: "",
          userName: "",
          userCode: "",
          userSts: "",
        },
      },
      switchStatus: function (viewType, editable) {
        this.viewType = viewType;
        this.dialogVisible = true;
        this.formDisabled = !editable;
      },
      dialogStatus: "",
      formDisabled: false,
      dialogFormVisible: false, // from弹窗
      dialogGridVisible: false, // 编辑列表弹窗
      dialogDisabled: true,
      viewTitle: {
        DETAIL: "详情",
        ADD: "新增",
        EDIT: "修改",
      },
      yourVal: "",
      rawValue: "",
      // 默认权限  add by chenlin2
      authMap: {
        authTitle: "默认权限",
      },
      authDialogVisible: false,
      authUrl: backend.appOcaService + "/api/adminsmrole/roleauth",
      expandName: ["authAdd", "authList"],
      authAddUrl: "",
      dialogUserVisible: false,
      userSelectQuery: {},
      userSelectDataUrl: backend.appOcaService + "/api/adminsmuser/querypage",
      userSelectParams: {
        condition: JSON.stringify({
          orgId: roleInfo.orgCode,
        }),
      },
    };
  },
  methods: {
    queryMainGridFn: function () {
      var me = this;
      var param = {
        condition: JSON.stringify(me.query),
      };
      me.$refs.roletable.remoteData(param);
      // 发起请求
      request({
        method: "GET",
        url: backend.appOcaService + "/api/adminsmrole/querypage",
        data: param,
      }).then((response) => {
        me.mainGrid.data = response.data;
        me.mainGrid.total = response.total;
        me.mainGrid.loading = false;
      });
    },
    // 点击树查询
    nodeClickFn: function (node, obj, nodeComp) {
      if (node != "") {
        this.nowNode = node;
        this.query.orgId = node.orgCode;
        this.query.orgType = node.orgType;
        this.queryMainGridFn();
      }
    },
    // 新增面板弹出
    openCreateFn: function () {
      this.roleForm.roleId = "";
      this.dialogDisabled = false;
      this.dialogFormVisible = true;
      this.switchStatus("ADD", true);
      this.$nextTick(function () {
        this.$refs.roleForm.resetFields(); // 重置form
        this.roleForm.roleSts = "A";
        this.roleForm.orgId = this.nowNode?.id || "";
      });
    },
    // 保存方法
    saveCreateFn: function () {
      var me = this;
      var roleForm = me.$refs.roleForm;
      roleForm.validate(function (valid) {
        var comitData = {};
        if (me.roleForm.roleId == "" || typeof me.roleForm.roleId == "undefined") {
          // 新增时保存
          delete me.roleForm.roleId;
          if (valid) {
            request({
              method: "GET",
              url: backend.appOcaService + "/api/adminsmrole/createcheckrolecode",
              params: {
                roleCode: me.roleForm.roleCode,
              },
            }).then((res) => {
              if (res === 1) {
                me.$message.error("角色已存在，不能重复添加");
                return;
              }
              comitData = me._.cloneDeep(me.roleForm);
              comitData.roleCode = me.roleForm.roleCode;
              comitData.roleName = me.roleForm.roleName;
              comitData.orgId = "T";
              (comitData.lastChgUsr = me.userInfo.userId),
                request({
                  method: "POST",
                  url: backend.appOcaService + "/api/adminsmrole/createrole",
                  data: comitData,
                }).then((res) => {
                  me.dialogFormVisible = false;
                  me.dialogVisible = false;
                  me.$message({ message: "保存成功！", type: "success" });
                  me.queryMainGridFn();
                });
            });
          }
        } else {
          // 修改时保存
          if (valid) {
            request({
              method: "GET",
              url: backend.appOcaService + "/api/adminsmrole/editcheckrolecode",
              params: {
                roleCode: me.roleForm.roleCode,
                roleId: me.roleForm.roleId,
              },
            }).then((res) => {
              comitData = me._.cloneDeep(me.roleForm);
              comitData.roleCode = me.roleForm.roleCode;
              comitData.roleName = me.roleForm.roleName;
              comitData.orgId = me.roleForm.orgId;
              comitData.lastChgUsr = me.userInfo.userId;
              request({
                method: "POST",
                url: backend.appOcaService + "/api/adminsmrole/editrole",
                data: comitData,
              }).then((res) => {
                me.dialogFormVisible = false;
                me.dialogVisible = false;
                me.$message({ message: "数据保存成功！", type: "success" });
                me.queryMainGridFn();
              });
            });
          }
        }
      });
    },
    // 修改
    modifyFn: function (row) {
      // 修改弹出方法
      // if (this.$refs.roletable.selections.length != 1) {
      //   this.$message({ message: '请选择一条记录', type: 'warning' });
      //   return;
      // }
      if (row.dutySts == "A") {
        this.$message({ message: "只能选择失效和待生效的数据", type: "warning" });
        return;
      }
      this.dialogFormVisible = true;
      this.dialogDisabled = false;
      this.dialogFormVisible = true;
      this.switchStatus("EDIT", true);
      this.$nextTick(function () {
        this.roleForm = this._.cloneDeep(row);
      });
    },
    infoFn: function () {
      // 详情弹出方法
      if (this.$refs.roletable.selections.length != 1) {
        this.$message({ message: "请选择一条记录", type: "warning" });
        return;
      }
      this.dialogFormVisible = true;
      this.dialogDisabled = false;
      this.dialogFormVisible = true;
      this.switchStatus("DETAIL", true);
      this.$nextTick(function () {
        this.$refs.roleForm.formModel = this._.cloneDeep(this.$refs.roletable.selections[0]);
      });
    },
    openEditFn: function (row) {
      if (this.$refs.roletable.selections.length !== 1) {
        this.$message({ message: "请选择一条数据!", type: "warning" });
        return false;
      }
      var row = this.$refs.roletable.selections[0];
      if (row.roleSts === "A") {
        this.$message({ message: "只能选择停用和待启用的数据", type: "warning" });
        return;
      }
      this.dialogStatus = "update";

      this.dialogFormVisible = true;
      this.formDisabled = false;
      this.$nextTick(() => {
        this.$refs.myform.formModel = this._.cloneDeep(row);
        this.$refs.myform1.formModel = this._.cloneDeep(row);
      });
    },
    // 启用方法
    useFn: function () {
      var vue = this;
      if (this.$refs.roletable.selections.length > 0) {
        var id = "";
        var userId = this.userInfo.userId;
        for (var i = 0; i < this.$refs.roletable.selections.length; i++) {
          var row = this.$refs.roletable.selections[i];
          if (row.roleSts === "W" || row.roleSts === "I") {
            id = id + "," + row.roleId;
          } else {
            vue.$message({ message: "只能选择失效或待生效的数据", type: "warning" });
            return;
          }
        }
        this.$confirm("此操作将启用该角色, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: function (action) {
            if (action === "confirm") {
              request({
                method: "POST",
                url: backend.appOcaService + "/api/adminsmrole/usebatch",
                data: {
                  id: id,
                  userId: userId,
                },
              }).then((response) => {
                vue.$message({ message: response.message || response.data, type: "success" });
                vue.$refs.roletable.clearSelection();
                vue.queryMainGridFn();
              });
            }
          },
        });
      } else {
        this.$message({ message: "请先选择要生效的数据", type: "warning" });
        return;
      }
    },
    // 停用方法
    unUseFn: function () {
      // 批量失效
      var vue = this;
      var userId = this.userInfo.userId;
      if (this.$refs.roletable.selections.length > 0) {
        var id = "";
        for (var i = 0; i < this.$refs.roletable.selections.length; i++) {
          var row = this.$refs.roletable.selections[i];
          if (row.roleSts === "A") {
            id = id + "," + row.roleId;
          } else {
            this.$message({ message: "只能选择生效的数据", type: "warning" });
            return;
          }
        }
        this.$confirm("此操作将停用该角色, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: function (action) {
            if (action === "confirm") {
              request({
                method: "POST",
                url: backend.appOcaService + "/api/adminsmrole/unusebatch",
                data: {
                  id: id,
                  userId: userId,
                },
              }).then((response) => {
                vue.$message({ message: response.data.message, type: "success" });
                vue.$refs.roletable.clearSelection();
                vue.queryMainGridFn();
              });
            }
          },
        });
      } else {
        this.$message({ message: "请先选择要停用的数据", type: "warning" });
        return;
      }
    },
    // 删除方法
    deleteFn: function () {
      var vue = this;
      if (this.$refs.roletable.selections.length > 0) {
        var id = "";
        for (var i = 0; i < this.$refs.roletable.selections.length; i++) {
          var row = this.$refs.roletable.selections[i];
          if (row.roleSts != "A") {
            if (i == 0) {
              id = row.roleId;
            } else {
              id = id + "," + row.roleId;
            }
          } else {
            this.$message({ message: "只能删除待生效或失效的数据", type: "warning" });
            return;
          }
        }
        this.$confirm("此操作将删除该角色信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: function (action) {
            if (action === "confirm") {
              request({
                method: "POST",
                url: backend.appOcaService + "/api/adminsmrole/deletebatch",
                data: {
                  ids: id,
                },
              }).then((response) => {
                vue.$message({ message: response.data.message, type: "success" });
                vue.$refs.roletable.clearSelection();
                vue.queryMainGridFn();
              });
            }
          },
        });
      } else {
        this.$message({ message: "请先选择要删除的数据", type: "warning" });
        return;
      }
    },
    // 角色用户
    openRoleUserFn: function (row) {
      // if (this.$refs.roletable.selections.length != 1) {
      //   this.$message({ message: '请先选择一条记录', type: 'warning' });
      //   return;
      // }
      this.userQuery.roleId = row.roleId;
      this.orgLevel = row.orgLevel;
      // yufp.extend(this.userQuery, row);
      this.dialogDisabled = false;
      this.dialogStatus = "roleUser";
      this.dialogGridVisible = true;
      this.queryUserGridFn();
    },
    queryUserGridFn: function () {
      var me = this;
      this.$nextTick(function () {
        var param = {
          condition: JSON.stringify(me.userQuery),
        };
        me.$refs.userTable.remoteData(param);
      });
    },
    // 添加用户
    addUserFn() {
      this.dialogUserVisible = true;
      this.$nextTick(() => {
        this.userSelectSearchFn();
      });
    },
    userSelectSearchFn() {
      let params = {
        condition: JSON.stringify({
          orgId: this.roleInfo.orgCode,
          filterRoleId: this.userQuery.roleId,
          ...this.userSelectQuery,
        }),
      };
      this.$refs.userSelectTable.remoteData(params);
    },
    loadEndFn(data) {
      let transData = data.map((item) => {
        return {
          ...item,
          authOrg: this.$refs.userTable.tableData.find((ele) => ele.userId === item.userId)?.authOrg,
        };
      });
      this.$refs.userSelectTable.setTableData(transData);
    },
    // 保存角色用户
    saveUserRole: function () {
      var _this = this;
      var selections = _this.$refs.userSelectTable.selections;
      if (!selections.length) {
        _this.$message({ message: "请选择一条数据", type: "warning" });
        return;
      }
      let selectInfo = selections.map((item) => {
        return {
          userId: item.userId,
          authOrg: item.selectAuthOrg || "",
        };
      });

      var len = selectInfo.filter((item) => item.authOrg).length;
      if (len !== selectInfo.length) {
        this.$message.warning("请选择权限机构");
        return;
      }

      request({
        method: "POST",
        url: backend.appOcaService + "/api/adminsmrole/addroleuser",
        data: {
          roleId: _this.userQuery.roleId,
          lastChgUsr: _this.userInfo.userId,
          userInfo: selectInfo,
        },
      }).then((res) => {
        _this.$refs.userTable.remoteData();
        _this.$message.success("添加成功");
        _this.dialogUserVisible = false;
      });
    },
    // 删除用户
    deleteUserFn() {
      var _this = this;
      let selections = this.$refs.userTable.selections;
      if (!selections.length) {
        this.$message.warning("请选择一条或多条记录");
        return;
      }
      _this
        .$confirm("此操作将删除所选用户角色，是否继续？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(function () {
          var ids = "";
          for (var i = 0; i < selections.length; i++) {
            ids += selections[i].userId + ",";
          }
          var roleId = _this.userQuery.roleId;
          var param = {
            ids: ids,
            roleId: roleId,
          };
          request({
            method: "POST",
            url: backend.appOcaService + "/api/adminsmrole/delroleuser",
            data: param,
          }).then((res) => {
            _this.$refs.userTable.remoteData();
            _this.$message.success("删除成功");
            _this.dialogUserVisible = false;
          });
        });
    },
  },
};
</script>
