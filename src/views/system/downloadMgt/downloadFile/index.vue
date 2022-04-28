<template>
  <div class="yu-main-wrapper">
    <!--查询form表单 -->
    <div class="yu-main-form">
      <yu-xform ref="searchForm" class="search" :model="queryFormData" form-type="search" :search="searchHandler" :reset="resetHandler">
        <yu-xform-group :column="4">
          <yu-xform-item label="功能名称" placeholder="功能名称" ctype="input" name="functionName" :rules="globalRules.input"></yu-xform-item>
          <yu-xform-item label="文件生成日期" placeholder="文件生成日期" ctype="date-picker" name="creatDate" :editable="false" format="yyyy-MM-dd"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
    </div>
    <div class="yu-main-content">
      <!-- 表格工具栏 -->
      <!-- <div class="yu-main-content__header clearfix">
        <div class="yu-main-toolbar fl">
          <el-button icon="el-icon-check" @click="exportFn">保存到本地</el-button>
          <el-button icon="el-icon-delete" @click="deleteFn">删除</el-button>
        </div>
      </div> -->
      <!-- 查询结果表格 -->
      <div class="yu-main-table">
        <yu-xtable ref="reftable" :data-url="dataUrl" row-number :default-load="false" border dynamic-height>
          <yu-xtable-column label="文件名称" prop="fileName" min-width="300" fixed="left" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="功能名称" prop="functionName" min-width="120" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="查询字段" prop="queryField" min-width="300" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="文件生成日期" prop="creatDate" min-width="180" sortable :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="创建文件用户" prop="creatUser" min-width="150" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="下载次数" prop="downAmount" min-width="120" sortable :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="文件状态" prop="fileState" min-width="120" data-code="FILE_STATE" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="下载状态" prop="downState" min-width="120" data-code="DOWN_STATE" :show-overflow-tooltip="true"></yu-xtable-column>
          <yu-xtable-column label="操作" width="150" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button class="yu-action-btn" @click.native.prevent="exportFn(scope.row)" type="text">保存到本地</el-button>
              <el-button class="yu-action-btn" @click.native.prevent="deleteFn(scope.row)" type="text">删除</el-button>
            </template>
          </yu-xtable-column>
        </yu-xtable>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { UserModule } from "@/store/modules/user";
import { getUserInfo } from "@/utils";
import { backend } from "@/config";
import request from "@/utils/request";
import { downFile } from "@/utils";

export default {
  name: "DownloadFile",
  data: function () {
    let userInfo = getUserInfo();
    return {
      userInfo: userInfo,
      queryFormData: {},
      rules: {
        functionName: [
          { validator: this.$validator.speChar, message: "输入字符含有特殊字符" },
          { max: 50, message: "输入字符不能超过50个字符", trigger: "blur" },
        ],
      },
      dataUrl: backend.fileService + "/api/downloadManage/search",
    };
  },
  mounted: function () {
    this.searchHandler();
  },
  methods: {
    /**
     * 查询按钮
     */
    searchHandler: function () {
      var params = {
        condition: JSON.stringify({
          creatUser: this.userInfo.userId,
          functionName: this.queryFormData.functionName,
          creatDate: this.queryFormData.creatDate,
        }),
      };
      this.$refs.reftable.remoteData(params);
    },
    /**
     * 重置按钮
     */
    resetHandler: function () {
      this.$refs.searchForm.resetFields();
    },
    /**
     * 导出操作
     */
    exportFn: function (row) {
      var _this = this;
      // if (_this.$refs.reftable.selections.length != 1) {
      //   _this.$message({ message: '请先选择一条记录', type: 'warning' });
      //   return;
      // }

      if (row.downState !== "3") {
        _this.$message({ message: "请选择下载完成的记录", type: "warning" });
        return;
      }
      _this.$confirm("是否确认保存到本地?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
        callback: function (action) {
          if (action === "confirm") {
            // 直接导出
            var param = {
              fileName: row.fileName,
              filePath: row.filePath,
            };

            let url = _this.$util.getUrl(backend.fileService + "/api/downloadManage/downloadFile");
            downFile({
              method: "post",
              url: url,
              fileName: param.fileName,
              data: {
                access_token: UserModule.token,
                condition: JSON.stringify(param),
              },
            });

            // _this.$util.downloadByPost(url, {
            //   access_token: UserModule.token,
            //   condition: JSON.stringify(param)
            // });

            setTimeout(function () {
              _this.searchHandler();
            }, 300);
          }
        },
      });
    },
    /**
     * 删除
     */
    deleteFn: function (row) {
      var _this = this;
      // if (_this.$refs.reftable.selections.length != 1) {
      //   _this.$message({ message: '请先选择一条记录', type: 'warning' });
      //   return;
      // }
      _this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: function (action) {
          if (action === "confirm") {
            request({
              method: "POST",
              url: backend.fileService + "/api/downloadManage/deleteFile",
              data: {
                fileId: row.fileId.toString(),
              },
            }).then((res) => {
              _this.$message.success({ message: "删除成功！" });
              _this.searchHandler();
            });
          }
        },
      });
    },
  },
};
</script>
