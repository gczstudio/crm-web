<template>
  <div>
    <el-row :gutter="16">
      <!--对象部分-->
      <el-col :span="13">
        <div class="yu-main-wrapper">
          <!-- 表格工具栏 -->
          <div class="yu-main__header clearfix">
            <div class="yu-main-toolbar fr">
              <el-button icon="el-icon-document-copy" @click="copyInfoFn">复制</el-button>
            </div>
          </div>
          <!--查询form表单 -->
          <div class="yu-main-form">
            <yu-xform :model="roleGrid.query" class="search" :search="queryRoleFn" :reset="resetQueryRoleFn" ref="custSearchForm" form-type="search">
              <yu-xform-group :column="2">
                <yu-xform-item placeholder="角色代码" name="roleCode" ctype="input" :rules="globalRules.input"></yu-xform-item>
                <yu-xform-item placeholder="角色名称" name="roleName" ctype="input" :rules="globalRules.input"></yu-xform-item>
              </yu-xform-group>
            </yu-xform>
          </div>
          <div class="yu-main-content">
            <!-- 查询结果表格 -->
            <div class="yu-main-table">
              <yu-xtable
                ref="roleTable"
                :height="roleGrid.height"
                row-key="roleCode"
                :highlight-current-row="true"
                @current-change="selectRowRole"
                :data-url="roleGrid.dataUrl"
                :base-params="roleGrid.dataParams"
                :default-load="true"
                border
                dynamic-height
              >
                <yu-xtable-column label="角色名称" prop="roleName" min-width="150" :resizable="true" :show-overflow-tooltip="true"></yu-xtable-column>
                <yu-xtable-column label="角色代码" prop="roleCode" min-width="140" :resizable="true" :show-overflow-tooltip="true" is-num></yu-xtable-column>
              </yu-xtable>
            </div>
          </div>
        </div>
      </el-col>
      <!--资源部分-->
      <el-col :span="11">
        <div class="yu-basic-content">
          <!--菜单和控制点资源-->
          <div class="yu-main__header">
            <div class="yu-main-toolbar">
              <el-button icon="el-icon-folder-checked" @click="selectAllFn">全选</el-button>
              <el-button icon="el-icon-check" @click="reSelectFn">反选</el-button>
              <el-button icon="el-icon-refresh" @click="reSetFn">重置</el-button>
              <el-button icon="el-icon-finished" @click="saveAllInfoFn" center>保存</el-button>
            </div>
          </div>
          <div class="tree-container">
            <yu-ext-tree
              ref="menuTree"
              :show-checkbox="menuTree.treeCheckBox"
              :height="bHeight - (isMaxScreen ? 205 : 176)"
              :data-url="reourceUrl"
              data-id="id"
              data-label="menuName"
              v-mloading="menuTree.loading"
              element-loading-text="拼命加载中"
              node-key="id"
              :check-strictly="false"
              data-pid="upMenuId"
              :render-content="renderContent"
            ></yu-ext-tree>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 复制 -->
    <yu-dialog title="粘贴对象选择" :visible.sync="dialogVisible">
      <yu-xtable
        ref="roleTable1"
        v-if="roleShow"
        selection-type="radio"
        :height="roleGrid.height"
        row-key="roleCode"
        :data-url="roleGrid.dataUrl"
        :base-params="roleGrid.dataParams"
        :default-load="false"
        border
      >
        <yu-xtable-column label="角色名称" prop="roleName" min-width="150" :resizable="true" :show-overflow-tooltip="true"></yu-xtable-column>
        <yu-xtable-column label="角色代码" prop="roleCode" min-width="140" :resizable="true" :show-overflow-tooltip="true"></yu-xtable-column>
      </yu-xtable>
      <yu-xtable
        ref="userTable1"
        v-if="userShow"
        selection-type="radio"
        :height="userGrid.height"
        row-key="loginCode"
        :data-url="userGrid.dataUrl"
        :base-params="userGrid.dataParams"
        :default-load="true"
      >
        <yu-xtable-column label="姓名" prop="userName" min-width="150" :resizable="true" :show-overflow-tooltip="true"></yu-xtable-column>
        <yu-xtable-column label="登录代码" prop="loginCode" min-width="140" :resizable="true" :show-overflow-tooltip="true"></yu-xtable-column>
        <yu-xtable-column label="所属机构" prop="orgName" :resizable="true" :show-overflow-tooltip="true"></yu-xtable-column>
      </yu-xtable>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" icon="check" @click="copyCheck">确定</el-button>
        <el-button icon="yx-undo2" @click="dialogVisible = false">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import { backend, baseUrl } from "@/config";
import { getUserInfo } from "@/utils";

export default {
  name: "FuncAuthMgt",
  data: function () {
    var em = this;
    let userInfo = getUserInfo();
    return {
      leafNodes: [],
      userInfo: userInfo,
      orgIdParams: {
        dataUrl: backend.appOcaService + "/api/adminsmorg/orgtreequery?orgCode=" + userInfo.org.code + "&orgSts=A",
        dataId: "orgCode",
      },
      i: 0,
      typeOptions: [],
      treeUrl: backend.appOcaService + "/api/adminsmorg/orgtreequery?orgCode=" + userInfo.org.code + "& orgSts=A",
      orgRootId: userInfo.org.code, // 根节点ID
      reourceUrl: backend.appOcaService + "/api/adminsmauthteco/menutreequery?sysId=" + userInfo.logicSys.id,
      showObjectFlag: "R", // 对象标识
      sourObjectId: "", // 复制原ID
      sourObjectType: "R", // 复制源类型-默认是角色
      builObjectType: "R", // 获取复制数据的对象类型-默认是角色
      builObjectId: "", // 获取复制数据的对象ID
      nodeCheckNum: 0, // 资源树节点被勾选操作的次数
      resData: false, // 查询出的资源数据
      ifselectData: false, // 是否选中了数据
      filterSub: [], // 数据权限明细数据字典数据
      // ifCopyFlag: false,//是否启动复制
      dialogVisible: false, // 复制dialog
      roleShow: false,
      dptShow: false,
      userShow: false,
      orgTreeShow: false,
      orgTreeNodes: null,
      formFields: [
        {
          field: "objectType",
          type: "select",
          dataCode: "OBJECT_TYPE",
          change: function (value) {
            em.showObjectFlag = value;
            em.builObjectType = value;
            em.sourObjectType = value;
          },
        },
      ],
      queryButtons: [
        {
          label: "导出",
          icon: "yx-folder-upload",
          click: function () {
            em.exportInfoFn();
          },
        },
        {
          label: "复制",
          icon: "yx-copy",
          click: function () {
            em.copyInfoFn();
          },
        },
      ],
      resourcButtons: [
        {
          label: "全选",
          icon: "yx-cloud-check",
          click: function () {
            em.selectAllFn();
          },
        },
        {
          label: "反选",
          icon: "yx-checkmark2",
          click: function () {
            em.reSelectFn();
          },
        },
        {
          label: "重置",
          icon: "yx-cross",
          click: function () {
            em.reSetFn();
          },
        },
      ],
      resourceForm: {
        resourceType: "",
      },
      roleGrid: {
        query: {
          orgId: "",
          roleCode: "",
          roleName: "",
        },
        currentRow: null,
        checkbox: true,
        dataUrl: backend.appOcaService + "/api/adminsmrole/querybyrolests",
        dataParams: {
          condition: JSON.stringify({
            roleSts: "A",
          }),
        },
      },
      userGrid: {
        query: {},
        checkbox: false,
        currentRow: null,
        dataUrl: backend.appOcaService + "/api/adminsmuser/querypage",
        dataParams: {
          condition: JSON.stringify({
            userSts: "A",
            orgId: userInfo.org.code,
          }),
        },
      },
      orgTree: {
        nowNode: "",
      },
      menuTree: {
        loading: false,
        treeCheckBox: true,
      },
    };
  },
  methods: {
    exportInfoFn: function () {
      // 导出数据
      // var _this = this;
      // var queryField = [
      //   { cnName: '对象类型', value: this.$lookup.convertKey('OBJECT_TYPE', this.showObjectFlag) }
      // ];
      // var objectId = '', objectType = '';
      // if (this.ifselectData) {
      //   if (this.showObjectFlag === 'R') { // 角色
      //     objectId = this.roleGrid.currentRow.roleId;
      //   } else if (this.showObjectFlag === 'U') { // 用户
      //     objectId = this.userGrid.currentRow.userId;
      //   } else if (this.showObjectFlag === 'D') { // 部门
      //     objectId = this.dptGrid.currentRow.dptId;
      //   } else if (this.showObjectFlag === 'G') { // 机构
      //     objectId = this.orgTree.nowNode.orgId;
      //   }
      // }
      // objectType = this.showObjectFlag;
      // var resourceType = ['M', 'C'];
      // var apiParams = {
      //   url: '/api/crm/adminsmuser/export',
      //   params: {
      //     userId: userInfo.userId,
      //     fileName: '功能授权',
      //     queryField: yufp.util.formatQueryField(queryField),
      //     objectId: objectId,
      //     objectType: objectType,
      //     resourceType: resourceType,
      //     sysId: userInfo.logicSys.id
      //   }
      // };
      // yufp.util.exportTable(_{
      //   _this: this,
      //   apiParams,
      //   showTipModal
      // }, '', 'roleTable');
    },
    // 复制时机构树点击事件
    orgClickFn1: function (nodes) {
      this.orgTreeNodes = nodes;
    },
    copyInfoFn: function () {
      // 复制数据
      if (this.sourObjectType === "R") {
        // 角色
        if (this.roleGrid.currentRow == null) {
          this.$message({ message: "请先选择一条待复制对象，然后点击复制", type: "warning" });
          return;
        }
        this.dialogVisible = true;
        this.sourObjectId = this.roleGrid.currentRow.roleId;
        this.roleShow = true;
        this.userShow = false;
        this.dptShow = false;
        this.orgTreeShow = false;
        this.$nextTick(function () {
          this.$refs.roleTable1.remoteData();
        });
      } else if (this.sourObjectType === "U") {
        // 用户
        if (this.userGrid.currentRow == null) {
          this.$message({ message: "请先选择一条待复制对象，然后点击复制", type: "warning" });
          return;
        }
        this.dialogVisible = true;
        this.sourObjectId = this.userGrid.currentRow.userId;
        this.roleShow = false;
        this.userShow = true;
        this.dptShow = false;
        this.orgTreeShow = false;
        this.$nextTick(function () {
          this.$refs.userTable1.remoteData();
        });
      } else if (this.sourObjectType === "D") {
        // 部门
        if (this.dptGrid.currentRow == null) {
          this.$message({ message: "请先选择一条待复制对象，然后点击复制", type: "warning" });
          return;
        }
        this.dialogVisible = true;
        this.sourObjectId = this.dptGrid.currentRow.dptId;
        this.roleShow = false;
        this.userShow = false;
        this.dptShow = true;
        this.orgTreeShow = false;
        this.$nextTick(function () {
          this.$refs.dptTable1.remoteData();
        });
      } else if (this.sourObjectType === "G") {
        // 机构
        if (this.orgTree.nowNode == null || this.orgTree.nowNode == "") {
          this.$message({ message: "请先选择一条待复制对象，然后点击复制", type: "warning" });
          return;
        }
        this.dialogVisible = true;
        this.sourObjectId = this.orgTree.nowNode.orgId;
        this.roleShow = false;
        this.userShow = false;
        this.dptShow = false;
        this.orgTreeShow = true;
        this.$nextTick(function () {
          this.$refs.orgTree1.remoteData();
        });
      }
    },
    copyCheck: function () {
      var em = this;
      if (em.builObjectType === "R") {
        // 角色
        if (em.$refs.roleTable1.selections.length == 0) {
          em.$message({ message: "请先选择粘贴对象", type: "warning" });
          return;
        }
        em.builObjectId = em.$refs.roleTable1.selections[0].roleId;
      } else if (em.builObjectType === "U") {
        // 用户
        if (em.$refs.userTable1.selections.length == 0) {
          em.$message({ message: "请先选择粘贴对象", type: "warning" });
          return;
        }
        em.builObjectId = em.$refs.userTable1.selections[0].userId;
      } else if (em.builObjectType === "D") {
        // 部门
        if (em.$refs.dptTable1.selections.length == 0) {
          em.$message({ message: "请先选择粘贴对象", type: "warning" });
          return;
        }
        em.builObjectId = em.$refs.dptTable1.selections[0].dptId;
      } else if (em.builObjectType === "G") {
        // 机构
        if (em.orgTreeNodes == null) {
          em.$message({ message: "请先选择一条复制对象", type: "warning" });
          return;
        }
        em.builObjectId = em.orgTreeNodes.orgId;
      }
      var param = {
        sourObjectType: em.sourObjectType,
        sourObjectId: em.sourObjectId,
        builObjectType: em.builObjectType,
        builObjectId: em.builObjectId,
        lastChgUsr: em.userInfo.userId,
        sysId: em.userInfo.logicSys.id,
      };
      // 发起请求
      request({
        method: "POST",
        url: backend.appOcaService + "/api/adminsmauthteco/savecopyinfo",
        data: param,
      }).then((res) => {
        em.$message({ message: "复制成功", type: "success" });
        em.dialogVisible = false;
      });
    },
    queryRoleFn: function () {
      // 角色查询
      this.$refs.roleTable.remoteData({
        condition: JSON.stringify({
          orgId: this.roleGrid.query.orgId ? this.roleGrid.query.orgId : null,
          roleCode: this.roleGrid.query.roleCode ? this.roleGrid.query.roleCode : null,
          roleName: this.roleGrid.query.roleName ? this.roleGrid.query.roleName : null,
          roleSts: "A",
        }),
      });
    },
    queryUserFn: function () {
      // 用户查询
      this.$refs.userTable.remoteData({
        condition: JSON.stringify({
          orgId: this.userGrid.query.orgId ? this.userGrid.query.orgId : this.userInfo.org.code,
          userInfo: this.userGrid.query.userInfo ? this.userGrid.query.userInfo : null,
          userSts: "A",
        }),
      });
    },
    resetQueryRoleFn: function () {
      // 角色查询重置
      this.roleGrid.query = {
        orgId: "",
        roleCode: "",
        roleName: "",
      };
    },
    resetUserFn: function () {
      // 用户查询重置
      this.userGrid.query = {
        userInfo: "",
        orgId: "",
      };
    },
    /**
     *刷新菜单树
     * @param param
     */
    refreshMenuTree: function (param) {
      var me = this;
      me.reSetFn(); // 重置
      me.menuTree.loading = true;
      // 发起请求
      request({
        method: "GET",
        url: backend.appOcaService + "/api/adminsmauthteco/queryinfo",
        params: param,
      }).then((response) => {
        var infos = [];
        // 获取所有的子节点
        if (this.leafNodes.length == 0) {
          me.getNodesWithoutChildren(me.$refs.menuTree.getRef().data);
        }
        this.$nextTick(() => {
          let data = response.data;
          let ids = data.map((item) => item.authresId);
          let checkedKeys = this.leafNodes.filter((item) => ids.includes(item.id)).map((item) => item.id);
          me.$refs.menuTree.getRef().setCheckedKeys(checkedKeys);
          me.menuTree.loading = false;
          me.nodeCheckNum = 0;
        });
      });
    },
    getNodesWithoutChildren: function (data) {
      data.forEach((item) => {
        if (item.children && item.children.length) {
          this.getNodesWithoutChildren(item.children);
        } else {
          this.leafNodes.push(item);
        }
      });
    },
    selectRowUser: function (row) {
      // 用户数据选中事件方法
      if (row) {
        this.ifselectData = true;
        this.userGrid.currentRow = row;
        var param = {
          objectType: this.showObjectFlag,
          objectId: row.userId,
          resType: "M,C",
          sysId: this.userInfo.logicSys.id,
        };
        this.refreshMenuTree(param);
      }
    },
    /**
     * 选中角色数据刷新菜单树选中状态
     * @param row
     */
    selectRowRole: function (row) {
      if (row) {
        this.ifselectData = true;
        this.roleGrid.currentRow = row;
        var param = {
          objectType: this.showObjectFlag,
          objectId: row.roleId,
          resType: "M,C",
          sysId: this.userInfo.logicSys.id,
        };
        this.refreshMenuTree(param);
      }
    },
    /**
     * 机构树点击事件
     * @param nodes
     */
    orgClickFn: function (nodes) {
      if (nodes != null) {
        this.ifselectData = true;
        this.orgTree.nowNode = nodes;
        var param = {
          objectType: this.showObjectFlag,
          objectId: nodes.orgId,
          resType: "M,C",
          sysId: this.userInfo.logicSys.id,
        };
        this.refreshMenuTree(param);
      } else {
        this.$message({ message: "请选择一个节点", type: "warning" });
      }
    },
    selectAllFn: function () {
      // 全选
      var nodes = this.$refs.menuTree.getRef().data;
      for (var s = 0; s < nodes.length; s++) {
        this.$refs.menuTree.getRef().setChecked(nodes[s].id, true, true);
      }
    },

    reSelectFn: function () {
      // 反选
      var checks = this.$refs.menuTree.getRef().getCheckedKeys();
      this.selectAllFn();
      for (var i = 0; i < checks.length; i++) {
        this.$refs.menuTree.getRef().setChecked(checks[i], false, false);
      }
    },
    reSetFn: function () {
      // 重置
      this.$refs.menuTree.getRef().setCheckedKeys([]);
    },
    // 是否选中对象 add by chenlin 20171229
    checkObjSelected: function (row) {
      if (row === null || row === "") {
        this.$message({ message: "请先选择一条对象进行授权", type: "warning" });
        return;
      }
    },
    saveAllInfoFn: function () {
      var em = this;
      var objectType = em.showObjectFlag;
      var objectId;
      var dataInfo = [];
      var ctrInfo = []; // 控制点数据
      var dataMap = {};
      if (objectType === "R") {
        // 角色
        em.checkObjSelected(em.roleGrid.currentRow);
        objectId = this.roleGrid.currentRow.roleId;
      } else if (objectType === "U") {
        // 用户
        em.checkObjSelected(em.userGrid.currentRow);
        objectId = em.userGrid.currentRow.userId;
      } else if (objectType === "D") {
        // 部门
        em.checkObjSelected(em.dptGrid.currentRow);
        objectId = em.dptGrid.currentRow.dptId;
      } else if (objectType === "G") {
        // 机构
        em.checkObjSelected(em.orgTree.nowNode);
        objectId = em.orgTree.nowNode.orgId;
      }
      if (objectId === null || objectType === "") {
        em.$message({ message: "请选择一条对象数据", type: "warning" });
        return;
      }
      var checksNodes = em.$refs.menuTree.getRef().getCheckedNodes();
      var checkHalfNodes = em.$refs.menuTree.getRef().getHalfCheckedNodes();

      for (var i = 0; i < checksNodes.length; i++) {
        var data = {
          authRecoId: null,
          authobjId: objectId,
          authobjType: objectType,
          authresType: checksNodes[i].menuType,
          lastChgUsr: em.userInfo.userId,
          sysId: em.userInfo.logicSys.id,
          authresId: checksNodes[i].id,
          menuId: checksNodes[i].menuId,
        };
        if (checksNodes[i].menuType === "M") {
          dataInfo.push(data);
        } else {
          ctrInfo.push(data);
        }
      }

      for (var j = 0; j < checkHalfNodes.length; j++) {
        var data2 = {
          authRecoId: null,
          authobjId: objectId,
          authobjType: objectType,
          authresType: checkHalfNodes[j].menuType,
          lastChgUsr: em.userInfo.userId,
          sysId: em.userInfo.logicSys.id,
          authresId: checkHalfNodes[j].id,
          menuId: checkHalfNodes[j].menuId,
        };
        if (checkHalfNodes[j].menuType === "M") {
          dataInfo.push(data2);
        } else {
          ctrInfo.push(data2);
        }
      }

      dataMap.menuData = dataInfo;
      dataMap.ctrData = ctrInfo;
      if (dataInfo.length > 0 || ctrInfo.length > 0) {
        em.$confirm("确定保存选中的权限?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: (action) => {
            if (action === "confirm") {
              // 发起请求
              request({
                method: "POST",
                url: backend.appOcaService + "/api/adminsmauthteco/saveinfo",
                data: dataMap,
              }).then((res) => {
                em.$message({ message: "操作保存成功", type: "success" });
              });
            }
          },
        });
      } else {
        em.$message({ message: "请选择要保存的资源数据", type: "warning" });
        return;
      }
    },
    // 菜单树加节点样式 add by chenlin 20171229
    renderContent: function () {
      var createElement = arguments[0];
      var type = arguments[1].data.menuType;
      return createElement("span", [createElement("span", { attrs: { class: "yu-treeMenuType" + type } }, type), createElement("span", arguments[1].data.label)]);
    },
    change: function (val) {
      this.sourObjectType = val;
      this.builObjectType = val;
    },
  },
  mounted: function () {
    var me = this;
    this.$lookup.bind("OBJECT_TYPE", function (data) {
      me.typeOptions = data;
    });
  },
};
</script>
<style lang="scss" scoped>
.tree-container {
  padding: 20px;
  background: #fff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
}
</style>
