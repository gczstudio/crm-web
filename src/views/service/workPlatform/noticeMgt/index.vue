<template>
  <!-- 查询表单 -->
  <div class="CustMgt-container">
    <div class="yu-main-wrapper">
      <MainLayout>
        <template v-slot:header>
          <el-button icon="el-icon-plus" v-permission="'create'" v-debounce="addFn">新增</el-button>
          <el-button icon="el-icon-delete" v-permission="'delete'" @click="deleteFn">删除</el-button>
          <el-button icon="el-icon-share" v-permission="'public'" @click="publishFn">发布</el-button>
          <el-button icon="el-icon-message" v-permission="'read'" @click="readFn">已阅</el-button>
          <!-- <el-button icon="yx-file-excel" @click="exportFn">导出</el-button> -->
          <!-- <el-button icon="edit" @click="modifyFn">修改</el-button>
          <el-button icon="document" @click="infoFn">详情</el-button>-->
        </template>
        <template v-slot:form>
          <yu-xform
            ref="announceForm"
            :model="queryFormData"
            class="search"
            related-table-name="refAnnounceTable"
            form-type="search"
          >
            <yu-xform-group :column="4">
              <yu-xform-item
                label="阅读标记"
                placeholder="阅读标记"
                ctype="select"
                name="readSts"
                data-code="READS"
                :rules="globalRules.input"
              ></yu-xform-item>
              <yu-xform-item label="发布日期从" name="beginTime" ctype="date-picker" placeholder="开始日期" :picker-options="startPickerOptions"></yu-xform-item>
              <yu-xform-item label="至" name="endTime" ctype="date-picker" placeholder="结束日期" :picker-options="endPickerOptions"></yu-xform-item>
              <yu-xform-item
                label="公告标题"
                placeholder="公告标题"
                ctype="input"
                name="noticeTitle"
                :rules="globalRules.input500"
              ></yu-xform-item>
              <yu-xform-item
                label="发布人"
                placeholder="发布人"
                ctype="input"
                name="pubUserName"
                :rules="globalRules.input"
              ></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable
            ref="refAnnounceTable"
            :dynamic-height="true"
            border
            row-number
            :data-url="announceDataUrl"
            :base-params="initTableParams"
            selection-type="checkbox"
          >
            <yu-xtable-column label="阅读标记" prop="readSts" min-width="100" fixed="left" is-num  sortable="custom"></yu-xtable-column>
            <yu-xtable-column
              label="公告标题"
              prop="noticeTitle"
              :show-overflow-tooltip="true"
              min-width="170"
              fixed="left"
              rules="required"
              is-num
              sortable="custom"
            ></yu-xtable-column>
            <!-- <yu-xtable-column label="公告类型" prop="noticeId" width="200"> -->
            <!-- </yu-xtable-column> -->
            <yu-xtable-column
              label="发布机构"
              prop="pubOrgName"
              :show-overflow-tooltip="true"
              min-width="160"
              is-num
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column label="发布人" prop="pubUserName" min-width="130" is-num  sortable="custom"></yu-xtable-column>
            <yu-xtable-column
              label="发布时间"
              prop="pubTime"
              min-width="170"
              :show-overflow-tooltip="true"
              is-num
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="有效期"
              min-width="130"
              prop="activeDate"
              :show-overflow-tooltip="true"
              is-num
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column label="发布状态" prop="pubSts"  min-width="120" data-code="PUB_STS" fixed="left"  sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="重要程度" prop="noticeLevel" min-width="120" data-code="NOTICE_LEVEL"  sortable="custom"></yu-xtable-column>
            <yu-xtable-column
              label="是否置顶"
              data-code="YES_NO"
              prop="isTop"
              :show-overflow-tooltip="true"
              sortable="custom"
              min-width="100"
            ></yu-xtable-column>
            <yu-xtable-column
              label="置顶期"
              is-num
              min-width="130"
              prop="topActiveDate"
              :show-overflow-tooltip="true"
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column label="操作" fixed="right" align="center" min-width="120" is-num>
              <template slot-scope="scope">
                <el-button
                  class="yu-action-btn"
                  @click.native.prevent="modifyFn(scope.row)"
                  type="text"
                  v-permission="'update'"
                >修改</el-button>
                <el-button
                  class="yu-action-btn"
                  type="text"
                  @click.native.prevent="detailFn(scope.row)"
                >详情</el-button>
              </template>
            </yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
      <!-- 说明dialog可配置宽高属性，若不配置则宽度默认为屏幕50%，高度自适应
      width="650px" height="380px"-->
      <yu-dialog
        :title="viewTitle[viewType]"
        :visible.sync="dialogVisible"
        width="800px"
        @close="cancelFn"
      >
        <yu-xform :model="refFormdata" ref="refForm" label-width="105px" :disabled="formDisabled">
          <yu-xform-group>
            <yu-xform-item
              label="公告标题"
              ctype="input"
              :rules="globalRules.required500"
              name="noticeTitle"
            ></yu-xform-item>
            <yu-xform-item label="重要程度" ctype="select" name="noticeLevel" data-code="NOTICE_LEVEL"></yu-xform-item>
            <yu-xform-item
              label="有效期"
              ctype="date-picker"
              name="activeDate"
              :picker-options="pickerOptions"
            ></yu-xform-item>
            <yu-xform-item
              label="是否置顶"
              @change="isTopSelect"
              :rules="globalRules.required"
              ctype="select"
              data-code="YES_NO"
              name="isTop"
            ></yu-xform-item>
            <yu-xform-item
              label="置顶期至"
              :picker-options="pickerOptions"
              @change="ischange"
              :disabled="isTopDisabled"
              ctype="date-picker"
              name="topActiveDate"
            ></yu-xform-item>
            <yu-xform-item
              label="接收机构"
              placeholder="请选择机构(不选默认发布全行)"
              name="reciveOrgId"
              ctype="yufp-org-tree"
              :tree-options="treeOptions"
            ></yu-xform-item>
            <yu-xform-item
              v-if="viewTitle[viewType] =='详情'"
              label="发布人"
              ctype="input"
              name="pubUserName"
            ></yu-xform-item>
            <yu-xform-item
              v-if="viewTitle[viewType] =='详情'"
              label="发布日期"
              name="pubTime"
              ctype="date-picker"
              :show-overflow-tooltip="true"
            ></yu-xform-item>
            <yu-xform-item
              v-if="viewTitle[viewType] =='详情'"
              label="创建人"
              name="creatorName"
              ctype="input"
              :show-overflow-tooltip="true"
            ></yu-xform-item>
            <yu-xform-item
              v-if="viewTitle[viewType] =='详情'"
              label="发布机构"
              name="pubOrgName"
              ctype="input"
              :show-overflow-tooltip="true"
            ></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
        <div style="padding: 5px 23px 15px">公告内容 :</div>
        <Tinymce v-if="tinymceFlag" :edit="edit" v-model="content" :content="content" ref="one"></Tinymce>
        <div slot="footer" align="center">
          <el-button v-show="saveBtnShow" icon="check" type="primary" @click="saveFn">保存</el-button>
          <el-button icon="yx-undo2" @click="cancelFn">取消</el-button>
        </div>
      </yu-dialog>
    </div>
    <Details
      class="Details"
      :Visible="dialogVisibles"
      :noticeDetail="noticeDetail"
      @close="closeHandler"
    ></Details>
  </div>
</template>

<script>
import Tinymce from "./components/tinymce.vue";
import request from "@/utils/request";
// import { noticeList } from "@/api/home";
import { backend, baseUrl } from "@/config"; //微服务地址前缀
import { getUserInfo } from "@/utils";
import Details from "./components/details.vue";
import { getCheckedRole } from "@/utils";
// import { HomeModule } from "@/store/modules/home";
import lookup from "@/utils/lookup";
import { join } from "lodash";
import { time } from "echarts";
export default {
  name: "NoticeMgt", //公告管理
  data: function () {
    var _this = this;
    let roleInfo = getCheckedRole();
    return {
      roleInfo: roleInfo,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 64800000;
        },
      },
      treeOptions: {
        showCheckbox: true,
      },
      viewTitle: {
        DETAIL: "详情",
        ADD: "新增",
        EDIT: "修改",
      },
      content: "请输入内容",
      roleDialogVisible: false, // 控制接收角色弹出框
      reciveRoleName: "", // 接收角色双向数据绑定变量
      isTopDisabled: true, //新增默认置顶期禁选
      edit: false, // 富文本是否可编辑控制变量
      refFormdata: {
        isTop: "N", //新增默认显示不置顶
        topActiveDate: "",
        activeDate: "",
      },
      treeUrl:
        backend.appOcaService +
        "/api/adminsmorg/orgtreequery?orgId=" +
        _this.userInfo.org.code +
        "&orgSts=A",
      orgParams: {
        dataUrl:
          backend.appOcaService +
          "/api/adminsmorg/orgtreequery?orgId=" +
          _this.userInfo.org.code +
          "&orgSts=A",
        dataId: "orgCode",
      },
      formModel: {
        // orgId: userInfo.org.code,
      },
      announceDataUrl:
        backend.noticeService + "/api/adminsmnotice/queryByCondition", // 公告表dataUrl
      // dataUrl: '/trade/example/list',
      // 附件表格dataUrl
      // attachmentDataUrl: backend.appOcaService + "/trade/example/list",
      // 新增公告信息对象
      announcementdata: {
        formdata: {},
        // 附件对象，来自附件表格_this.$refs.refAnnounceTable.datacreatorId
        attachmentdata: {},
      },
      contrUrl: backend.appOcaService + "/api/provider/findrolelist", //角色列表请求地址
      initTableParams: {
        condition: JSON.stringify({
          reciveOrg: [
            { id: _this.userInfo.org.code },
            { id: roleInfo.orgCode },
          ],
          // reciveOrgId: _this.userInfo.org.code,
          belongOrgId: _this.userInfo.details.userBelongOrg,
          // pubSts: "O",
          userId: _this.userInfo.userId,
          creatorId: _this.userInfo.userId,
          creatorName: _this.userInfo.userName,
          roles: [{ id: roleInfo.roleCode }],
        }),
      }, // 初始进入页面的查询参数
      rule: [
        //  校验规则
        { required: true, message: "必填项", trigger: "blur" }, //文本框失去焦点会触发
        { validator: this.$validator.number, message: "数字", trigger: "blur" },
      ],
      dialogVisible: false, //点击表单弹出控制变量
      formDisabled: false, //控制禁用该表单内的所有组件的变量。若设置为 true，则表单内组件上的 disabled 属性不再生效
      attachmentdialogVisible: false, // 控制附件上传弹出框展示
      fileName: "", // 附件文件名
      viewType: "DETAIL", // 点击按钮的类型
      // viewTitle: this.$lookup.find("CRUD_TYPE", false), //不明白的点1
      saveBtnShow: true, //控制保存按钮是否显示
      userId: _this.userInfo.userId, // 用户id
      userName: _this.userInfo.userName, // 用户名称
      orgId: _this.userInfo.org.id, // 机构id
      orgName: _this.userInfo.org.name, //机构名称
      createdNoticeId: "", // 新增时创建的空noticeId数据
      model: {}, // 新增,修改请求参数
      tinymceFlag: false, // 控制富文本框是否显示
      noticeDetail: {}, //详情的返回数据
      dialogVisibles: false,
      orgTreeParams: {
        needCheckbox: true, // 机构树多选参数
      },
      orgParams: {
        dataUrl:
          backend.appOcaService +
          "/api/adminsmorg/orgtreequery?orgId=" +
          _this.userInfo.org.code +
          "&orgSts=A",
        dataId: "orgCode",
      },
      queryFormData: {},
      startPickerOptions: {
        disabledDate: (time) => {
          if (this.queryFormData.endTime) {
            return time.getTime() >= new Date(this.queryFormData.endTime).getTime();
          }
        }
      },
      endPickerOptions: {
        disabledDate: (time) => {
          if (this.queryFormData.beginTime) {
            return time.getTime() <= new Date(this.queryFormData.beginTime).getTime() - 86400000;
          }
        }
      }
    };
  },
  computed: {
    isDetail: function () {
      return this.viewType === "DETAIL";
    },
  },
  beforeCreate() {
    var userInfo = {};
    this.userInfo = getUserInfo(); // 获取登录后seesion中的数据
  },
  components: { Tinymce, Details }, // 富文本组件注册
  watch: {
    content(val) {
      // console.log(val);
    },
  },
  methods: {
    /**
     * 取消
     */
    cancelFn: function () {
      var _this = this;
      _this.content = "请输入内容";
      _this.dialogVisible = false; // 控制弹出框显示
      _this.tinymceFlag = false; // 控制富文本框是否显示
      _this.edit = false; // 控制富文本是否可以编辑
      _this.$refs.refForm.resetFields(); // 清空表单
    },
    // 改变是否置顶时触发
    isTopSelect: function () {
      var _this = this;
      setTimeout(function () {
        if (_this.refFormdata.isTop === "Y") {
          _this.isTopDisabled = false;
        } else {
          _this.isTopDisabled = true; // 为false才能选择置顶时间选项
          _this.refFormdata.topActiveDate = "";
        }
      }, 0);
    },
    /**
     * 保存
     */
    saveFn: function () {
      var _this = this;
      if (_this.content.length < 1 || _this.content == "请输入内容") {
        _this.$message({ message: "请输入公告内容", type: "warning" });
        return;
      }
      let params = {
        ...JSON.parse(this.initTableParams.condition),
        ..._this.refFormdata,
        reciveOrgId: _this.refFormdata.reciveOrgId || "",
        content: _this.content,
        // ..._this.noticeFormdata,
      }; // 定义查询参数
      this._.assign(_this.model, params);
      var validate = false;
      _this.$refs.refForm.validate(function (valid) {
        validate = valid; //表单验证
      });
      if (!validate) {
        _this.$message("缺少必填项");
        return;
      }
      _this.$refs.refForm.resetFields();
      if (this.viewType == "ADD") {
        _this.model.pubSts = "C";
        _this.model.noticeId = _this.createdNoticeId;
        request({
          method: "POST",
          url: backend.noticeService + "/api/adminsmnotice/createinfo",
          data: _this.model,
        }).then((code, message, response) => {
          _this.model = {};
          _this.$refs.refAnnounceTable.remoteData();
          _this.$message({ message: "新增公告成功", type: "success" });
          _this.dialogVisible = false;
        });
      } else {
        console.log(_this.model);
        request({
          method: "POST",
          url: backend.noticeService + "/api/adminsmnotice/updates",
          data: _this.model,
        }).then((code, message, response) => {
          _this.model = {};
          _this.$message({ message: "修改公告成功", type: "success" });
          _this.$refs.refAnnounceTable.getTableData(); // 更新视图
          _this.dialogVisible = false;
        });
      }
      //   _this.reciveRoleName = "";
      _this.$refs.refForm.resetFields(); //清空表单
    },
    /**
     * 控制保存按钮、xdialog、表单的状态
     * @param viewType 表单类型
     * @param editable 可编辑,默认false
     */
    switchStatus: function (viewType, editable) {
      var _this = this;
      _this.viewType = viewType;
      _this.saveBtnShow = editable;
      _this.dialogVisible = true;
      _this.formDisabled = !editable;
      _this.tinymceFlag = true;
      _this.edit = false;
    },
    /**
     * 新增按钮
     */
    addFn: function () {
      var _this = this;
      this.isTopDisabled = true;
      request({
        url: backend.noticeService + "/api/adminsmnotice/createNoticeId",
        method: "get",
        data: null,
      }).then((response) => {
        if (response.code == 0) {
          _this.createdNoticeId = response.data;
          _this.switchStatus("ADD", true);
        } else {
          _this.$message({ message: "生成公告ID失败!", type: "warning" });
        }
      });
    },
    /**
     * 修改
     */
    modifyFn: function (row) {
      var _this = this;
      // _this.Viewtitle = "修改";
      console.log(row);
      if (row.pubSts == "O") {
        _this.$message({ message: "不能修改已发布的公告!", type: "warning" });
        return false;
      }
      if (row.isTop === "Y") {
        _this.isTopDisabled = false;
      } else {
        _this.isTopDisabled = true;
      }
      //   if (_this.$refs.refAnnounceTable.selections.length == 0) {
      //     _this.$message({ message: "请先选择一条记录", type: "warning" });
      //     return;
      //   }
      //   if (_this.$refs.refAnnounceTable.selections.length !== 1) {
      //     _this.$message({ message: "只能选择一条记录", type: "warning" });
      //     return;
      //   }
      row.readUserId = _this.userInfo.userId;
      _this.switchStatus("EDIT", true);
      request({
        method: "post",
        url: backend.noticeService + "/api/adminsmnotice/noticeinfo",
        data: row,
      }).then((response) => {
        _this.content = response.data.list[0].detailcontent;
        _this.refFormdata = response.data.list[0];
        console.log(_this.refFormdata);
      });
      // _this.model.noticeId = row.noticeId;
      _this.$nextTick(function () {
        _this.$refs.refForm.resetFields();
        // this.refFormdata = this._.cloneDeep(row);
      });
    },
    // 详情
    detailFn: function (row) {
      var _this = this;
      row.readUserId = _this.userInfo.userId;
      _this.dialogVisibles = true;
      // _this.switchStatus("DETAIL", false);
      request({
        method: "post",
        url: backend.noticeService + "/api/adminsmnotice/noticeinfo",
        data: row,
      }).then((response) => {
        _this.edit = true;
        _this.noticeDetail = response.data.list[0];
        // _this.detailsData = response.data.list[0].detailcontent;
        // _this.content = response.data.list[0].detailcontent;
        // if (row.readSts !== "已阅") {
        //   this.noticeLists(); // 调用查询未读数据方法
        // }
        _this.$refs.refAnnounceTable.getTableData();
      });
      // _this.$nextTick(function () {
      //   _this.$refs.refForm.resetFields();
      // });
    },
    // async noticeLists() {
    //   let params = {
    //     // 定义查询未读数据的请求参数
    //     condition: JSON.stringify({
    //       reciveOgjId: this.userInfo.org.code,
    //       userId: this.userInfo.userId,
    //       roles: this.getCheckedRoleCode(),
    //     }),
    //     size: 20,
    //   };
    //   var res = await noticeList(params);
    //   console.log(res);
    //   HomeModule.UPDATE_NOTICE_TOATL(res.total); // 更新公告未读数据总条数
    // },
    /**
     * 删除
     */
    deleteFn: function () {
      var _this = this;
      var selections = _this.$refs.refAnnounceTable.selections;
      if (selections.length == 0) {
        _this.$message({ message: "请至少选择一条数据!", type: "warning" });
        return;
      }
      var len = selections.length;
      var arr = [];
      for (var i = 0; i < len; i++) {
        if (selections[i].pubSts == "O") {
          _this.$message({ message: "不能删除已发布的公告!", type: "warning" });
          return false;
        }
        arr.push(selections[i].noticeId);
      }
      var ids = arr.join(",");
      _this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: function (action) {
          if (action === "confirm") {
            // console.log(action, "action");
            request({
              method: "post",
              url: backend.noticeService + "/api/adminsmnotice/deletes/" + ids,
            }).then((code, message, response) => {
              // _this.$refs.refAnnounceTable.remoteData();
              _this.$message({ message: "删除公告成功", type: "success" });
              _this.$refs.refAnnounceTable.getTableData();
            });
          }
        },
      });
    },
    /**
     * 公告发布
     */
    publishFn: function () {
      var _this = this;
      var annoselections = _this.$refs.refAnnounceTable.selections;
      if (annoselections.length < 1) {
        _this.$message({ message: "请选择至少一条记录", type: "warning" });
        return;
      }
      if (_this.$refs.refAnnounceTable.selections.length < 1) {
        _this.$message({ message: "请选择公告进行发布!", type: "warning" });
        return false;
      }
      var arr = _this.$refs.refAnnounceTable.selections;
      for (var i in arr) {
        if (arr[i].pubSts == "O") {
          _this.$message({
            message: "不能发布已经发布的公告",
            type: "warning",
          });
          return false;
        }
      }
      _this.$confirm("确定发布选中记录?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: (action) => {
          // 调用后台接口，发布记录
          console.log(action);
          if (action === "confirm") {
            for (
              var i = 0;
              i < _this.$refs.refAnnounceTable.selections.length;
              i++
            ) {
              _this.$refs.refAnnounceTable.selections[i].pubSts = "O";
              _this.$refs.refAnnounceTable.selections[i].pubOrgId = _this.orgId;
              _this.$refs.refAnnounceTable.selections[i].pubOrgName =
                _this.orgName;
              _this.$refs.refAnnounceTable.selections[i].pubUserId =
                _this.userId;
              _this.$refs.refAnnounceTable.selections[i].pubUserName =
                _this.userName;
            }
            request({
              method: "POST",
              url: backend.noticeService + "/api/adminsmnotice/pubnotices",
              data: this.$refs.refAnnounceTable.selections,
            }).then((code, message, response) => {
              // _this.$refs.refAnnounceTable.remoteData();
              this.readFn();
              _this.$refs.refAnnounceTable.getTableData();
              _this.$message({ message: "发布公告成功", type: "success" });
            });
          }
        },
      });
    },
    //已阅
    // 阅读记录
    readFn: function () {
      var _this = this;
      if (this.$refs.refAnnounceTable.selections.length < 1) {
        _this.$message({ message: "请选择一条记录!", type: "warning" });
        return;
      }
      var arr = this.$refs.refAnnounceTable.selections;
      for (var i in arr) {
        if (arr[i].readSts == "已阅") {
          _this.$message({ message: "公告已阅", type: "warning" });
          return false;
        }
      }
      for (var i = 0; i < this.$refs.refAnnounceTable.selections.length; i++) {
        if (this.$refs.refAnnounceTable.selections[i].pubSts != "O") {
          _this.$message({
            message: "不能修改未发布的公告为已阅!",
            type: "warning",
          });
          return;
        }
        _this.$refs.refAnnounceTable.selections[i].readUserId = this.userId;
        console.log(_this.$refs.refAnnounceTable.selections[i], "已阅参数");
      }
      console.log(arr);
      request({
        url: backend.noticeService + "/api/adminsmnotice/reads",
        method: "post",
        data: this.$refs.refAnnounceTable.selections,
      }).then((response) => {
        // console.log("已阅");
        if (response.code == "0") {
          _this.$message({ message: "已阅成功", type: "success" });
          for (
            var i = 0;
            i < _this.$refs.refAnnounceTable.selections.length;
            i++
          ) {
            _this.$refs.refAnnounceTable.selections[i].readSts = "Y";
          }
          // vm.$refs.noticeTable.remoteData();
          _this.$refs.refAnnounceTable.getTableData();
          // console.log("已阅");
        } else {
          _this.$message({ message: "加载阅读状态失败!", type: "warning" });
        }
      });
    },
    getRoleTable: function () {
      var me = this;
      me.initRolesTableParams = {
        condition: JSON.stringify({
          orgIds: me.noticeFormdata.reciveOrgId,
        }),
      };
      me.roleDialogVisible = true;
    },
    ischange() {
      var me = this;
      if (me.refFormdata.activeDate.length !== 0) {
        var time1 = new Date(me.refFormdata.activeDate);
        var t1 = time1.getTime();
        var time2 = new Date(me.refFormdata.topActiveDate);
        var t2 = time2.getTime();
        if (t2 > t1) {
          me.$message({
            message: "置顶期限不得超过有效期!",
            type: "warning",
          });
          me.refFormdata.topActiveDate = "";
        }
      }
    },
    closeHandler(e) {
      var _this = this;
      _this.dialogVisibles = e;
    },
    /**
     * 导出操作
     */
  },
};
</script>

<style lang="scss" scoped>
// /deep/ .cell .el-button {
//   padding: 0 !important;
// }
.Details {
  ul {
    list-style: disc inside !important;
  }
  ol {
    list-style: decimal inside !important;
  }
}
</style>
