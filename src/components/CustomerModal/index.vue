<template>
  <div class="CustomerModal-container">
    <yu-dialog :title="title" :visible.sync="dialogVisible" :width="selectionType === 'checkbox' ? '1300px' : '1000px'" @close="hide" top="5vh">
      <div>
        <el-row :gutter="16">
          <el-col :span="5">
            <yu-left-tree
              ref="mytree"
              :data-url="treeUrl"
              data-id="orgId"
              data-label="orgName"
              data-pid="upOrgId"
              @node-xclick="nodeClickFn"
              :show-checkbox="false"
              :expand-level="2"
              :highlight-current="true"
              :height="bHeight - 350"
            ></yu-left-tree>
          </el-col>
          <el-col :span="selectionType === 'checkbox' ? 14 : 19">
            <yu-xform :model="queryFormData" ref="custSearchForm" :search="searchFn" form-type="search">
              <yu-xform-group :column="2">
                <yu-xform-item placeholder="用户名称/登录代码" name="userInfo" ctype="input" :rules="globalRules.input"></yu-xform-item>
              </yu-xform-group>
            </yu-xform>
            <!-- 查询结果表格 -->
            <yu-xtable
              v-if="visible"
              ref="mytable"
              row-number
              border
              row-key="userId"
              :data-url="dataUrl"
              :height="bHeight - 380"
              @selections-change="selectionChangeFn"
              :base-params="dataParams"
              :selection-type="selectionType"
              :default-load="true"
            >
              <yu-xtable-column label="用户名称" prop="userName" width="100" :show-overflow-tooltip="true"></yu-xtable-column>
              <yu-xtable-column label="登录代码" prop="loginCode" width="100" :show-overflow-tooltip="true"></yu-xtable-column>
              <yu-xtable-column label="角色" prop="roleName" :show-overflow-tooltip="true"></yu-xtable-column>
            </yu-xtable>
          </el-col>
          <el-col :span="5" v-if="selectionType === 'checkbox'">
            <div class="select-cust">
              <div class="select-title"><i class="el-icon-s-custom"></i>{{ selectTitle }}({{ selectLength }})</div>
              <el-scrollbar wrap-class="scrollbar-wrapper" :style="{ height: bHeight - 324 + 'px' }">
                <!-- 滚动条包裹部分 -->
                <div>
                  <div class="other-cust" v-if="showOther">
                    <div class="title">其他机构协管</div>
                    <ul>
                      <li v-for="item in otherSelections" :key="item.userId">{{ item.userName }}（{{ item.userId }}）</li>
                    </ul>
                  </div>
                  <div class="self-cust">
                    <div class="title" v-if="showOther">本机构协管</div>
                    <ul>
                      <li class="header" v-if="isMarket">
                        <div>客户经理</div>
                        <div>营销标识</div>
                      </li>
                      <li v-for="item in selections" :key="item.userId">
                        <div>{{ item.userName }}（{{ item.userId }}）</div>
                        <div><el-radio v-if="isMarket" v-model="manageUserId" :label="item.userId" @click.native.prevent="radioClick(item.userId)"></el-radio></div>
                        <i class="el-icon-close" @click="deleteFn(item)"></i>
                      </li>
                    </ul>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="operate-btns tc">
        <el-button type="primary" @click="sureFn">确定</el-button>
        <el-button @click="cancelFn">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>
<script>
import { backend } from "@/config";
import { getCheckedRole } from "@/utils";
import request from "@/utils/request";
export default {
  name: "CustomerModal",
  props: {
    selectionType: {
      type: String,
      default: "checkbox",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "选择客户经理",
    },
    selectTitle: {
      type: String,
      default: "已选择客户经理",
    },
    showOther: {
      // 针对于客户分配
      type: Boolean,
      default: false,
    },
    crmCustId: String,
    isAuthOrg: {
      //   是否按权限机构过滤， true   是   false 按所在分支行过滤
      type: Boolean,
      default: true,
    },
    required: {
      // 是否必选
      type: Boolean,
      default: false,
    },
    isMarket: {
      //营销标识
      type: Boolean,
      default: false,
    },
  },
  data() {
    let roleInfo = getCheckedRole();
    return {
      roleInfo: roleInfo,
      orgCode: this.isAuthOrg ? roleInfo.orgCode : roleInfo.mappingOrg,
      custInfo: {},
      dialogVisible: false,
      treeUrl: backend.appOcaService + "/api/util/getorgtree?orgId=" + (this.isAuthOrg ? roleInfo.orgCode : roleInfo.mappingOrg),
      dataUrl: backend.appOcaService + "/api/adminsmuser/getmgrlist",
      custDataUrl: backend.custService + "/api/custallocate/getcustallmgrinfo",
      queryFormData: {},
      dataParams: {
        condition: JSON.stringify({
          orgId: this.isAuthOrg ? roleInfo.orgCode : roleInfo.mappingOrg,
          roleCode: "R300201",
        }),
      },
      nowNode: {},
      selections: [],
      otherSelections: [],
      manageUserId: "",
    };
  },
  watch: {
    visible: function () {
      this.dialogVisible = this.visible;
      if (this.visible) {
        this.querySelectData();
      }
    },
  },
  computed: {
    selectLength() {
      return this.selections.length + this.otherSelections.length;
    },
  },
  created() {
    this.dialogVisible = this.visible;
  },
  methods: {
    // 查询当前客户下已分配的协管客户经理
    querySelectData() {
      if (!this.crmCustId) {
        this.selections = [];
        this.otherSelections = [];
        return;
      }
      request({
        method: "GET",
        url: this.custDataUrl,
        params: {
          condition: JSON.stringify({
            crmCustId: this.crmCustId,
          }),
        },
      }).then((res) => {
        let data = res.data.map((item) => {
          return {
            ...item,
            userName: item.blgMgrNm,
            userId: item.blgMgrId,
          };
        });
        this.selections = data.filter((item) => item.isCurrent);
        this.otherSelections = data.filter((item) => !item.isCurrent);
        if (this.isMarket) {
          this.manageUserId = data.find((item) => item.isManage == 1)?.blgMgrId;
        }
        this.$nextTick(() => {
          this.$refs.mytable.toggleSelection(this.selections);
        });
      });
    },
    selectionChangeFn(selections) {
      if (this.isMarket) {
        // 如果之前选择的营销标志不存在时，置为空
        if (selections.every((item) => item.userId !== this.manageUserId)) {
          this.manageUserId = "";
        }
      }
      this.selections = this._.cloneDeep(selections);
    },
    radioClick(value) {
      this.manageUserId = this.manageUserId === value ? "" : value;
    },
    // 点击机构树节点
    nodeClickFn(node, obj, nodeComp) {
      if (node != "") {
        this.nowNode = node;
        this.$nextTick(() => {
          this.searchFn();
        });
      }
    },
    searchFn() {
      var param = {
        condition: JSON.stringify({
          ...this.queryFormData,
          orgId: this.nowNode.orgId || this.orgCode,
        }),
      };
      this.$refs.mytable.remoteData(param);
    },
    show() {
      this.$emit("update:visible", true);
    },
    hide() {
      this.$emit("update:visible", false);
    },
    sureFn() {
      let selected = this.$refs.mytable.selections;
      if (!selected.length && this.required) {
        this.$message.warning(this.selectionType === "checkbox" ? "请选择一条或多条记录" : "请选择一条记录");
        return;
      }
      let curSelecte = selected.concat(this.otherSelections);
      if (this.isMarket) {
        curSelecte = curSelecte.map((item) => {
          return {
            ...item,
            manageUserId: this.manageUserId,
          };
        });
      }
      this.$emit("sure", curSelecte);
    },
    cancelFn() {
      this.hide();
    },
    deleteFn(item) {
      if (item.userId === this.manageUserId) {
        this.manageUserId = "";
      }
      for (var i = this.selections.length - 1; i >= 0; i--) {
        let ele = this.selections[i];
        if (ele.userId === item.userId) {
          this.selections.splice(i, 1);
        }
      }
      this.$refs.mytable.deleterSelectionFn(item);
    },
  },
};
</script>
<style lang="scss" scoped>
.select-cust {
  .select-title {
    padding: 16px;
    border: 1px solid #e6e6e6;
    border-bottom: 0;
    font-weight: bold;
    i {
      color: $blue;
      margin-right: 8px;
    }
  }
  .el-scrollbar {
    border: 1px solid #e6e6e6;
  }
  .other-cust,
  .self-cust {
    ::v-deep.el-radio:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
      box-shadow: none;
    }
    padding: 16px 0;
    .title {
      font-weight: bold;
      padding: 0 16px;
    }
    ul {
      padding: 10px 0;
      li {
        position: relative;
        padding: 10px 32px;
        display: table;
        width: 100%;
        &.header {
          font-weight: bold;
        }
        & > div {
          &:nth-child(1) {
            text-align: left;
          }
          &:nth-child(2) {
            text-align: right;
          }
          display: table-cell;
          text-align: center;
        }
        ::v-deep.el-radio__label {
          display: none;
        }
        &:hover {
          background: $blue-hover;
          .el-icon-close {
            display: block;
          }
        }
        .el-icon-close {
          position: absolute;
          top: 12px;
          right: 16px;
          display: none;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
