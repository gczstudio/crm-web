<template>
  <div>
    <yu-dialog custom-class="upload-excel-modal" :visible.sync="dialogVisible" title="批量导入" width="780px" @close="cancelFn">
      <div class="upload-container">
        <div v-show="!showFile && !showSuccess" class="upload-file">
          <div class="upload-button" @click="uploadFileFn">
            <img src="@/assets/images/manual/upload.png" alt />
          </div>
          <input type="file" ref="fileInput" v-show="false" @change="onChange" />
          <div class="upload-desc" v-if="options.tip">{{ options.tip }}</div>
        </div>
        <div class="select-file" v-if="showFile">
          <img src="@/assets/images/manual/file.png" alt />
          <div class="file-name">{{ fileName }}</div>
          <div class="file-size">
            <span class="file-size__label">文件大小：</span>
            <span class="file-size__value num">{{ fileSize }}</span>
          </div>
          <div class="upload-type" v-if="options.uploadType">
            <el-radio v-model="flag" label="0">追加</el-radio>
            <el-radio v-model="flag" label="1">覆盖</el-radio>
          </div>
        </div>
        <div class="upload-success" v-if="showSuccess">
          <img src="~@/assets/images/manual/success.png" alt />
          <div class="success-tip">导入{{ successMsg || "成功" }}</div>
        </div>
      </div>
      <div slot="footer" class="operate-btns tr" v-if="showFile">
        <el-button @click="cancelFn">取消</el-button>
        <el-button type="primary" @click="submitUpload" v-loading.fullscreen.lock="loading" element-loading-text="文件导入中">开始导入</el-button>
      </div>
    </yu-dialog>
    <!-- 导入失败列表 -->
    <yu-dialog custom-class="upload-error-modal" title="错误信息" :visible.sync="errVisible" width="800px" @close="errVisible = false">
      <div class="check">
        <span class="icon iconfont icon-guanbixuanjiao"></span>
        经系统校验，{{ errMsg ? errMsg : `有${errTotal}行数据出错！` }}
      </div>
      <div class="yu-main-table">
        <yu-xtable ref="refTable" :data="errTableDate" :total="errTotal" :pageable="false" row-number border>
          <yu-xtable-column label="出错行号" prop="lineNo" min-width="90" :show-overflow-tooltip="true" border is-num></yu-xtable-column>
          <yu-xtable-column label="出错原因" prop="errorMsg" min-width="400" :show-overflow-tooltip="true"></yu-xtable-column>
        </yu-xtable>
      </div>
      <div slot="footer" class="operate-btns tr">
        <el-button @click="errVisible = false">取消</el-button>
        <el-button type="primary" @click="closeAll">确定</el-button>
        <el-button type="primary" @click="repeatUploadFn">重新导入</el-button>
        <el-button type="primary" v-if="options.exportUrl" @click="exportFn">导出</el-button>
      </div>
    </yu-dialog>
  </div>
</template>

<script>
import { backend, baseUrl } from "@/config";
import { UserModule } from "@/store/modules/user";
import request from "@/utils/request";
export default {
  name: "UploadExcel",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: {
        uploadType: false,
        url: backend.custService + "/api/ocrmftagcust/importexcel",
        exportUrl: "",
        params: {},
        errExcelTitle: "导入失败列表",
      },
    },
  },
  data() {
    return {
      headers: { Authorization: "Bearer " + UserModule.token },
      dialogVisible: false,
      showFile: false,
      showSuccess: false,
      file: {},
      fileName: "",
      fileSize: "",
      fileList: [],
      loading: false,
      flag: "",
      errVisible: false,
      errTotal: 0,
      errMsg: "",
      errTableDate: [],
    };
  },
  watch: {
    visible: {
      handler() {
        this.dialogVisible = this.visible;
      },
      immediate: true,
    },
  },
  methods: {
    show() {
      this.$emit("update:visible", true);
    },
    hide() {
      this.$emit("update:visible", false);
    },
    uploadFileFn() {
      this.$refs.fileInput.click();
    },
    onChange(e) {
      let file = e.target.files[0];
      var suffix = file.name.slice(file.name.lastIndexOf(".") + 1);
      if (!["xls", "xlsx"].includes(suffix)) {
        this.$message.warning("只能上传xls、xlsx格式文件");
        this.$refs.fileInput.value = "";
        return;
      }
      this.file = file;
      this.showFile = true;
      this.fileName = file.name;
      this.fileSize = this.formatSize(file.size);
    },
    submitUpload() {
      if (this.options.uploadType && !this.flag) {
        this.$message.warning("请选择导入方式！");
        return;
      }

      this.loading = true;
      let formData = new FormData();
      formData.append("file", this.file);
      formData.append("flag", this.flag);

      if (this.options.params && Object.keys(this.options.params).length) {
        for (let k in this.options.params) {
          formData.append(k, this.options.params[k]);
        }
      }
      request({
        url: this.options.url,
        method: "post",
        data: formData,
        customHandler: true,
      }).then((res) => {
        this.successMsg = "";
        this.errMsg = "";
        this.errTableDate = [];
        this.errTotal = 0;
        this.$refs.fileInput.value = "";
        this.loading = false;
        this.showSuccess = false;
        if (res.code === 0) {
          this.showSuccess = true;
          this.showFile = false;
          this.successMsg = res.message;
          this.$emit("success");
        } else if (res.code == -1) {
          this.errVisible = true;
          this.errMsg = res.message;
        } else if (res.code == -2) {
          this.$emit("success");
          this.errVisible = true;
          this.$nextTick(() => {
            this.errTableDate = res.data;
            this.errTotal = res.total;
            this.errMsg = res.message;
          });
          this.$exportQueue.addQueue(this.$route.path, this.exportFn);
        }
      });
    },
    cancelFn(flag) {
      this.showFile = false;
      this.showSuccess = false;
      this.flag = "";
      this.$refs.fileInput.value = "";
      !flag && this.hide();
    },
    closeAll() {
      this.errVisible = false;
      this.dialogVisible = false;
    },
    repeatUploadFn() {
      this.errVisible = false;
      this.cancelFn(true);
    },
    formatSize(fileSize) {
      let size = "";
      if (fileSize < 0.1 * 1024) {
        //如果小于0.1KB转化成B
        size = this.$util.toFixed(fileSize, 2) + "B";
      } else if (fileSize < 0.1 * 1024 * 1024) {
        //如果小于0.1MB转化成KB
        size = this.$util.toFixed(fileSize / 1024, 2) + "KB";
      } else if (fileSize < 0.1 * 1024 * 1024 * 1024) {
        //如果小于0.1GB转化成MB
        size = this.$util.toFixed(fileSize / (1024 * 1024), 2) + "MB";
      }
      return size;
    },
    exportFn(showTipModal) {
      var searchQuery = {
        fileName: this.options.errExcelTitle || "导入失败列表",
        queryField: "",
      };
      var apiParams = {
        url: this.options.exportUrl,
        params: searchQuery,
      };
      this.$util.exportTable({
        _this: this,
        apiParams,
        showTipModal,
      });
    },
  },
};
</script>

<style lang="scss">
.upload-excel-modal {
  .upload-container {
    height: 400px;
    .upload-button {
      display: inline-block;
      cursor: pointer;
      width: 100px;
      height: 96px;
      text-align: center;
      border: 1px solid#fff;
      &:hover {
        background-color: #e6f2ff;
        border-color: #b3d8ff;
        color: #007eff;
      }
      img {
        margin-top: 8px;
      }
    }
    .upload-file {
      padding-top: 100px;
      text-align: center;
      .upload-desc {
        margin-top: 20px;
        font-size: 17px;
        font-weight: 700;
      }
    }
    .select-file {
      padding-top: 80px;
      text-align: center;
      .file-name {
        padding: 10px 0 15px 0;
        font-size: 17px;
        font-weight: 700;
      }
      .file-size {
        font-size: 16px;
      }
      .upload-type {
        margin-top: 40px;
        height: 26px;
        background: url("../../assets/images/customer/underline.png") no-repeat center bottom;
      }
    }
    .upload-success {
      padding-top: 100px;
      text-align: center;
      .success-tip {
        margin-top: 15px;
        font-weight: 700;
        font-size: 17px;
      }
    }
  }
}
.upload-error-modal {
  .check {
    height: 48px;
    line-height: 48px;
    font-size: 15px;
    background-color: #feece8;
  }
  .icon-guanbixuanjiao {
    position: relative;
    top: -2px;
    padding: 0 10px;
    color: #f14922;
  }
}
</style>
