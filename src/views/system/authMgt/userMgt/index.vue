<template>
  <div class="yu-main-wrapper">
    <!-- 表格工具栏 -->
    <div class="yu-main__header clearfix">
      <div class="yu-main-toolbar fr">
        <!-- <el-button icon="el-icon-plus" @click="openCreateFn">新增</el-button> -->
        <!-- <el-button icon="el-icon-edit" @click="openEditFn">修改</el-button> -->
        <!-- <el-button icon="el-icon-delete" @click="deletestFn">删除</el-button> -->
        <el-button icon="el-icon-unlock" @click="useBatchFn">启用</el-button>
        <el-button icon="el-icon-lock" @click="unUseBatchFn">停用</el-button>
        <el-button icon="el-icon-edit" @click="openRelInfoFn">用户角色</el-button>
        <!-- <el-button icon="el-icon-reset" @click="resetPassword">重置密码</el-button> -->
      </div>
    </div>
    <el-row :gutter="6">
      <el-col :span="5">
        <yu-left-tree
          tree-key="authOrg"
          class="no-border"
          ref="mytree"
          :data-url="treeUrl"
          data-id="orgId"
          data-label="orgName"
          data-pid="upOrgId"
          @node-xclick="nodeClickFn"
          :show-checkbox="false"
          :expand-level="2"
          :highlight-current="true"
          :height="bHeight - (isMaxScreen ? 283 : 249)"
        ></yu-left-tree>
        <div class="blank-box"></div>
      </el-col>
      <el-col :span="19">
        <div>
          <div class="yu-main-form">
            <yu-xform class="search" :model="queryFormData" :search="queryMainGridFn" ref="custSearchForm" form-type="search">
              <yu-xform-group :column="3">
                <yu-xform-item placeholder="用户名称/登录代码" name="userInfo" ctype="input" :rules="globalRules.input"></yu-xform-item>
                <yu-xform-item placeholder="状态" name="userSts" ctype="select" data-code="DATA_STS"></yu-xform-item>
                <yu-xform-item placeholder="角色" name="roleCode" ctype="select" :options="roleOptions" filterable></yu-xform-item>
                <!-- <yu-xform-item placeholder="有效期" name="deadline" ctype="date-picker"></yu-xform-item> -->
              </yu-xform-group>
            </yu-xform>
          </div>
          <div class="yu-main-content">
            <!-- 查询结果表格 -->
            <div class="yu-main-table">
              <yu-xtable ref="mytable" row-number border :data-url="mainGrid.dataUrl" :base-params="mainGrid.dataParams" selection-type="checkbox" :default-load="true" dynamic-height>
                <yu-xtable-column label="用户名称" prop="userName" min-width="100px" :show-overflow-tooltip="true">
                  <template scope="scope">
                    <a onclick="return false;" href="javascipt:void(0);" style="text-decoration: underline" @click="openEditFn(scope.row, 'detail')">{{ scope.row.userName }}</a>
                  </template>
                </yu-xtable-column>
                <yu-xtable-column label="登录代码" prop="loginCode" min-width="100px" :show-overflow-tooltip="true" is-num></yu-xtable-column>
                <yu-xtable-column label="所属机构" prop="orgName" min-width="100px" :show-overflow-tooltip="true"></yu-xtable-column>
                <yu-xtable-column label="业务条线" prop="busiType" min-width="100px" :show-overflow-tooltip="true" data-code="BUINESS_LINE"></yu-xtable-column>
                <yu-xtable-column label="状态" prop="userSts" :show-overflow-tooltip="true" data-code="DATA_STS"></yu-xtable-column>
                <yu-xtable-column label="性别" prop="userSex" :show-overflow-tooltip="true" data-code="SEX_TYPE"></yu-xtable-column>
                <yu-xtable-column label="角色" prop="roleName" min-width="150px" :show-overflow-tooltip="true"></yu-xtable-column>
                <yu-xtable-column label="最新变更用户" prop="lastChgName" min-width="120px" :show-overflow-tooltip="true"></yu-xtable-column>
                <yu-xtable-column label="最新变更时间" prop="lastChgDt" min-width="120px" :show-overflow-tooltip="true" is-num></yu-xtable-column>
                <yu-xtable-column label="操作" width="100" fixed="right" align="center" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <el-button class="yu-action-btn" @click.native.prevent="openEditFn(scope.row, 'update')" type="text">修改</el-button>
                  </template>
                </yu-xtable-column>
              </yu-xtable>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--用户信息维护页面-->
    <yu-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" height="360px" width="800px">
      <yu-xform ref="userForm" :model="userForm" label-width="120px" form-type="details">
        <yu-xform-group :column="2">
          <yu-xform-item label="姓名" name="userName" ctype="input"></yu-xform-item>
          <yu-xform-item label="登录代码" name="loginCode" ctype="input"></yu-xform-item>
          <yu-xform-item label="状态" name="userSts" ctype="select" data-code="DATA_STS"></yu-xform-item>
          <yu-xform-item label="权限机构" name="roleName" ctype="input"></yu-xform-item>
          <yu-xform-item label="人力系统岗位" name="hrPosition" ctype="input"></yu-xform-item>
          <yu-xform-item label="人力系统状态" name="hrPositionStat" ctype="input"></yu-xform-item>
          <yu-xform-item label="业务条线" name="busiType" ctype="select" data-code="BUINESS_LINE"></yu-xform-item>
          <yu-xform-item label="电话" name="userMobilephone" ctype="input" :rules="$validator.phone"></yu-xform-item>
          <yu-xform-item label="年龄" name="userAge" ctype="input" :rules="$validator.orderNumber"></yu-xform-item>
          <yu-xform-item label="性别" name="userSex" ctype="select" data-code="SEX_TYPE"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <yu-xform ref="userInfoRef" :model="userinfoForm" label-width="120px" :form-type="dialogStatus === 'update' ? '' : 'details'">
        <yu-xform-group :column="2">
          <yu-xform-item label="所属机构" v-if="dialogStatus === 'update'" name="orgId" ctype="yufp-auth-org-tree" key="1" :rules="globalRules.required"></yu-xform-item>
          <yu-xform-item label="所属机构" v-else name="orgName" ctype="yufp-auth-org-tree" key="2"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button type="primary" v-if="dialogStatus == 'create'" @click="saveCreateFn()">保存</el-button>
        <el-button type="primary" v-if="dialogStatus == 'update'" @click="saveEditFn()">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </yu-dialog>
    <!--用户角色-->
    <yu-dialog title="用户角色" :visible.sync="dialogVisibleRelInfo" height="400px" width="620px" @close="closeFn">
      <yu-xtable ref="roleTable" :height="500" :pageable="false" row-key="roleId" :data="roleData" :checkbox="true" selection-type="checkbox" :default-load="false" :init-selection="false" border>
        <yu-xtable-column label="角色代码" prop="roleCode" :show-overflow-tooltip="true" is-num></yu-xtable-column>
        <yu-xtable-column label="角色名称" prop="roleName" :show-overflow-tooltip="true"></yu-xtable-column>
        <yu-xtable-column label="权限机构" prop="authOrg" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yufp-auth-org-tree :tree-options="treeOptions" :orgLevel="scope.row.orgLevel" v-model="scope.row.authOrg" :filterIds="['1009999']"></yufp-auth-org-tree>
          </template>
        </yu-xtable-column>
      </yu-xtable>
      <div slot="footer" align="center">
        <el-button type="primary" @click="saveEditFnRole">确定</el-button>
        <el-button @click="closeFn">取消</el-button>
      </div>
    </yu-dialog>
    <!--重置密码-->
    <yu-dialog title="重置密码" :visible.sync="pwdform.dialogVisible" height="200" width="400px">
      <yu-xform ref="pwdform" :model="pwdform.params" label-width="80px">
        <yu-xform-group :column="1">
          <yu-xform-item label="密码" :rules="globalRules.requiredInput" prop="password" name="password" show-password ctype="input"></yu-xform-item>
          <yu-xform-item label="确认密码" :rules="globalRules.requiredInput" prop="confirmPwd" name="confirmPwd" show-password ctype="input"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="resetPwd">确定</el-button>
        <el-button @click="pwdform.dialogVisible = false">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import { backend, baseUrl } from "@/config";
import { UserModule } from "@/store/modules/user";
import { getUserInfo, getCheckedRole } from "@/utils";
import { JSEncrypt } from "jsencrypt";

export default {
  name: "UserMgt",
  data: function () {
    var em = this;
    let userInfo = getUserInfo();
    let roleInfo = getCheckedRole();
    return {
      userInfo: userInfo,
      roleInfo: roleInfo,
      // treeUrl: backend.appOcaService + '/api/util/getorg?userId=' + userInfo.userId + '&orgCode=' + roleInfo.orgCode,
      treeUrl: backend.appOcaService + "/api/util/getorgtree?orgId=" + roleInfo.orgCode,
      uploadAction: baseUrl + backend.fileService + "/api/file/provider/uploadfile?access_token=" + UserModule.token,
      queryFormData: {},
      nowNode: {}, // 当前选中节点数据
      dialogFormVisible: false, // 新增，修改页面是否显示
      dialogDetailVisible: false, // 详情页面是否显示
      datePick: {
        // 限制不可小于当前日期
        disabledDate: function (time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      userForm: {}, // 表单信息
      userinfoForm: {},
      userinfoOtherForm: {},
      dialogStatus: "", // create update detail

      userIdInfo: null,
      roleUserUrl: backend.appOcaService + "/api/adminsmuser/queryByUser",
      orgRootId: roleInfo.orgCode, // 根据节点ID
      dialogVisibleImage: false,
      roleOptions: [],
      // orgIdParams: {
      //   dataUrl: backend.appOcaService + '/api/adminsmorg/orgtreequery?orgCode=' + userInfo.org.code + '&orgSts=A',
      //   dataId: 'orgCode'
      // },
      treeOptions: {
        checkStrictly: true,
        showCheckbox: true,
        readonly: false,
      },
      dptIdParams: {
        dataUrl: backend.appOcaService + "/api/util/getdpt",
        dataId: "orgCode",
        needCheckbox: false,
      },
      infoOrgId: "",
      mainGrid: {
        query: {
          userInfo: "",
          orgId: "",
        },
        dataUrl: backend.appOcaService + "/api/adminsmuser/querypage",
        dataParams: {
          condition: JSON.stringify({
            orgId: roleInfo.orgCode,
          }),
        },
      },
      activeFlag: "first",

      // 角色色数据
      roleData: [],
      originRoleData: [],
      roleDataUrl: backend.appOcaService + "/api/adminsmuser/querybyrolests",
      stsOptions: null,
      busiTypeOptions: null,
      editNow: "",
      rootId: "root", // 根节点ID
      rootName: "组织机构树", // 根节点名称
      readonly: false, // 维护信息是否只读
      dialogVisibleRelInfo: false, // 用户关联信息是否显示
      dialogVisibleRole: false, // 用户角色是否显示
      textMap: {
        update: "修改",
        create: "新增",
        detail: "详情",
        relInfo: "用户关联信息",
        role: "用户角色",
      },
      pwdform: {
        dialogVisible: false,
        params: {
          password: "",
          confirmPwd: "",
        },
        pwdButtons: [],
        tempUserId: userInfo.userId,
      },
      imageUrl: "",
    };
  },
  created() {
    this.getAllRoleData();
  },
  methods: {
    // 获取角色数据
    getAllRoleData() {
      var _this = this;
      var params = {
        page: 1,
        size: 100,
      };
      request({
        method: "GET",
        url: backend.appOcaService + "/api/adminsmrole/querypage",
        params: params,
      }).then((res) => {
        _this.roleOptions = res.data.map((item) => {
          return {
            key: item.roleCode,
            value: item.roleName,
          };
        });
      });
    },
    // 查询
    queryMainGridFn() {
      var param = {
        condition: JSON.stringify({
          ...this.queryFormData,
          orgId: this.nowNode.orgId || this.roleInfo.orgCode,
        }),
      };
      this.$refs.mytable.remoteData(param);
    },
    // 点击机构树节点
    nodeClickFn(node, obj, nodeComp) {
      if (node != "") {
        this.nowNode = node;
        this.$nextTick(() => {
          this.queryMainGridFn();
        });
      }
    },
    // 点击新增
    openCreateFn() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.userForm.resetFields();
        this.$refs.userInfoRef.resetFields();
        this.$refs.userOtherInfo.resetFields();
        this.$set(this.userForm, "userSts", "A");
        if (this.nowNode != null) {
          this.$set(this.userinfoForm, "orgId", this.nowNode.orgId);
        }
      });
    },
    // 保存
    saveCreateFn() {
      var me = this;
      var userInfoRef = this.$refs.userInfoRef;
      var infoValid = true;
      userInfoRef.validate(function (valid) {
        infoValid = valid;
      });

      if (infoValid) {
        var comitData = {};
        delete this.userinfoForm.userId;
        comitData = this._.assign(comitData, this.userForm, this.userinfoForm);
        comitData.lastChgUsr = this.userInfo.userId;
        request({
          method: "POST",
          url: backend.appOcaService + "/api/adminsmuser/adduserinfo",
          data: comitData,
        }).then((res) => {
          me.dialogFormVisible = false;
          me.queryMainGridFn();
          me.$message.success({ message: "保存成功！" });
        });
      }
    },
    // 修改
    openEditFn: function (row, type) {
      var me = this;
      if (type === "edit" && row.userSts === "A") {
        this.$message({ message: "只能选择失效或者待生效的数据", type: "warning" });
        return;
      }
      this.dialogStatus = type;
      this.dialogFormVisible = true;
      this.dialogDetailVisible = false;
      this.readonly = true;
      this.userForm = this._.cloneDeep(row);
      this.userinfoForm = this._.cloneDeep(row);
    },
    saveEditFn: function (form) {
      var me = this;
      var userInfoRef = this.$refs.userInfoRef;
      var infoValid = true;
      userInfoRef.validate(function (valid) {
        infoValid = valid;
      });
      if (infoValid) {
        var comitData = {};
        comitData = this._.assign(comitData, this.userForm, this.userinfoForm);
        comitData.lastChgUsr = this.userInfo.userId;
        request({
          method: "POST",
          url: backend.appOcaService + "/api/adminsmuser/update",
          data: comitData,
        }).then((res) => {
          me.dialogFormVisible = false;
          me.$message.success("修改成功");
          me.queryMainGridFn();
        });
      }
    },
    // 用户角色
    async openRelInfoFn() {
      var row = this.$refs.mytable.selections;
      if (row.length != 1) {
        this.$message({ message: "请选择一条数据", type: "warning" });
        return;
      }
      await this.getRoleData({ orgId: row[0].orgId });
      this.dialogStatus = "relInfo";
      this.dialogVisibleRelInfo = true;
      var em = this;
      this.$nextTick(function () {
        var param = {
          condition: JSON.stringify({
            paramId: row[0].userId,
          }),
          page: 1,
          size: 10000,
        };
        request({
          method: "GET",
          url: backend.appOcaService + "/api/adminsmuser/queryuserrole",
          params: param,
        }).then((response) => {
          var infos = response.data;
          var roleIds = infos.map((item) => item.roleId);

          // 回显还有问题
          this.roleData = this.originRoleData.map((item) => {
            return {
              ...item,
              authOrg: infos.find((ele) => ele.roleId === item.roleId)?.authOrg || "",
            };
          });
          this.$nextTick(() => {
            var selections = this.roleData.filter((item) => roleIds.includes(item.roleId));
            em.$refs.roleTable.toggleSelection(selections);
          });
        });
      });
    },
    // 查询角色数据
    getRoleData(params) {
      return request({
        method: "GET",
        url: this.roleDataUrl,
        params,
      }).then((res) => {
        let data = res.data.map((item) => {
          return {
            ...item,
            authOrg: "",
          };
        });
        this.originRoleData = this._.cloneDeep(data);
        this.roleData = this._.cloneDeep(data);
      });
    },
    // 修改用户角色
    saveEditFnRole() {
      var list = this.$refs.roleTable.selections;
      var row = this.$refs.mytable.selections[0];
      var commit = [];
      var len = list.filter((item) => item.authOrg).length;
      if (len !== list.length) {
        this.$message.warning("请选择权限机构");
        return;
      }
      commit = list.map((item) => {
        return {
          userId: row.userId,
          lastChgUsr: this.userInfo.userId,
          roleId: item.roleId,
          authOrg: item.authOrg || "",
        };
      });

      // var flag = false;
      // var flag1 = false;
      // var roles = userInfo.roles;
      // roles.forEach(element => {
      //   if (element.code == 'R200801') {
      //     flag = true;
      //   }
      // });

      // var row = em.$refs.mytable.selections[0];
      // for (var i = 0; i < list.length; i++) {
      //   var data = {
      //     userId: row.userId,
      //     lastChgUsr: userInfo.userId,
      //     roleId: list[i].roleId,
      //     authOrg: list[i].authOrg
      //   };
      //   if (list[i].roleCode == 'R200501' || list[i].roleCode == 'R200502' || list[i].roleCode == 'R200301' || list[i].roleCode == 'R200302') {
      //     flag1 = true;
      //   }
      //   commit.push(data);
      // }
      // if (flag && flag1) {
      //   this.$message({ message: '分支行系统管理员不能给用户授权分支行公司/小微主管行领导或分支行公司/小微业务主管角色', type: 'warning' });
      //   return;
      // }
      request({
        method: "POST",
        url: backend.appOcaService + "/api/adminsmuser/saverole/" + row.userId,
        data: commit,
      }).then((res) => {
        this.dialogVisibleRelInfo = false;
        this.$message.success("修改成功");
        this.$refs.mytable.remoteData();
      });
    },
    // 批量启用
    useBatchFn: function () {
      var rows = this.$refs.mytable.selections;
      if (rows.length > 0) {
        var id = "";
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          if (row.userSts === "I" || row.userSts === "W") {
            id = id + "," + row.userId;
          } else {
            this.$message({ message: "只能选择停用或待生效的数据", type: "warning" });
            return;
          }
        }
        var vue = this;
        this.$confirm("此操作将启用该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",

          callback: (action) => {
            if (action === "confirm") {
              request({
                method: "POST",
                data: {
                  id: id,
                  userId: this.userInfo.userId,
                },
                url: backend.appOcaService + "/api/adminsmuser/usebatch?id=" + id + "&userId=" + this.userInfo.userId,
              }).then((res) => {
                vue.$message({ message: "操作成功！", type: "success" });
                vue.queryMainGridFn();
              });
            }
          },
        });
      } else {
        this.$message({ message: "请先选择要启用的数据", type: "warning" });
        return;
      }
    },
    // 批量停用
    unUseBatchFn: function () {
      var rows = this.$refs.mytable.selections;
      if (rows.length > 0) {
        var id = "";
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          if (row.userSts === "A") {
            id = id + "," + row.userId;
          } else {
            this.$message({ message: "只能选择已生效的数据", type: "warning" });
            return;
          }
        }
        var vue = this;
        this.$confirm("此操作将停用该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: (action) => {
            if (action === "confirm") {
              request({
                method: "POST",
                data: {
                  id: id,
                  userId: this.userInfo.userId,
                },
                url: backend.appOcaService + "/api/adminsmuser/unusebatch?id=" + id + "&userId=" + this.userInfo.userId,
              }).then((res) => {
                vue.$message({ message: "数据操作成功！", type: "success" });
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
    // 批量删除
    deletestFn: function () {
      var rows = this.$refs.mytable.selections;
      if (rows.length > 0) {
        var id = "";
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          if (row.userSts === "I") {
            id = id + "," + row.userId;
          } else {
            this.$message({ message: "只能删除停用的数据", type: "warning" });
            return;
          }
        }
        var vue = this;
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: function (action) {
            if (action === "confirm") {
              request({
                method: "POST",
                data: {
                  id: id,
                },
                url: backend.appOcaService + "/api/adminsmuser/deletebatch?id=" + id,
              }).then((res) => {
                vue.$message({ message: "删除成功！", type: "success" });
                vue.queryMainGridFn();
                vue.$refs.mytable.clearSelection();
              });
            }
          },
        });
      } else {
        this.$message({ message: "请先选择要删除的数据", type: "warning" });
        return;
      }
    },
    closeFn: function () {
      this.dialogVisibleRelInfo = false;
    },
    // 重置密码按钮
    resetPassword: function () {
      if (this.$refs.mytable.selections.length != 1) {
        this.$message("请选择一条数据", "提示");
        return;
      }
      var temp = this.$refs.mytable.selections[0];
      this.pwdform.tempUserId = temp.userId;
      this.pwdform.dialogVisible = true;
    },
    // 确认修改密码
    resetPwd: function () {
      var data = this.pwdform.params;
      var password = data.password;
      var comfirmPwd = data.confirmPwd;
      if (password == null || password == "" || comfirmPwd == null || comfirmPwd == "") {
        this.$message("请输入必填项!", "提示");
        return;
      }

      if (password != comfirmPwd) {
        this.$message("两次输入密码不一致!", "提示");
        return;
      }
      var encodePwd = this.encodePassword(password);
      var me = this;
      request({
        url: backend.uaaService + "/api/passwordcheck/checkpwd", // 校验密码策略
        method: "POST",
        data: {
          sysId: this.userInfo.logicSys.id,
          pwd: encodePwd,
          userId: me.pwdform.tempUserId,
          passwordTyp: "2",
        },
      }).then((res) => {
        request({
          url: backend.appOcaService + "/api/adminsmuser/resetpwd",
          method: "POST",
          data: JSON.stringify({
            userId: me.pwdform.tempUserId,
            password: encodePwd,
            updateUser: this.userInfo.userId,
          }),
        }).then((res) => {
          me.$message({ message: "密码修改成功！" }, "success");
          me.pwdform.dialogVisible = false;
        });
      });
    },
    encodePassword: function (pwd) {
      var encrypt = new JSEncrypt();
      encrypt.setPublicKey(this.$util.getRSAPublicKey());
      return encrypt.encrypt(pwd);
    },
  },
};
</script>

<style lang="scss">
.avatar-uploader {
  margin: 0 auto;
  border: 1px dashed #ccc;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  .el-icon-plus {
    font-size: 30px;
  }
}
</style>
