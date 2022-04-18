<template>
  <div class="CustMgt-container">
    <div class="yu-main-wrapper">
      <MainLayout is-tab>
        <template v-slot:header>
          <el-button icon="el-icon-upload2" @click="exportFn">批量导入</el-button>
          <el-button icon="el-icon-download" @click="downTempFn">模板下载</el-button>
          <el-button icon="el-icon-video-play" @click="runBatch">执行跑批</el-button>
        </template>
        <template v-slot:form>
          <yu-xform
            ref="searchForm"
            :model="queryFormData"
            form-type="search"
            :need-export="true"
            class="search"
          >
            <yu-xform-group :column="4">
              <yu-xform-item
                label="数据日期"
                placeholder="数据日期"
                ctype="date-picker"
                name="etlDate"
                :rules="globalRules.input"
              ></yu-xform-item>
              <yu-xform-item
                label="调整类型"
                placeholder="调整类型"
                ctype="select"
                data-code="ADJ_TYPE"
                name="adjType"
                :rules="globalRules.input"
              ></yu-xform-item>
              <yu-xform-item
                label="账户名称"
                placeholder="账户名称"
                ctype="input"
                name="acctNm"
                :rules="globalRules.input"
              ></yu-xform-item>
              <yu-xform-item
                label="账号/款项/借据"
                placeholder="账号/款项/借据"
                ctype="input"
                name="acctSubDebtNo"
                :rules="globalRules.input"
              ></yu-xform-item>
              <yu-xform-item
                label="考核归属条线"
                placeholder="考核归属条线"
                ctype="select"
                name="settBlgBusi"
                data-code="SETT_BLG_BUSI"
                :rules="globalRules.input"
              ></yu-xform-item>
              <yu-xform-item
                label="考核归属机构"
                placeholder="考核归属机构"
                ctype="yufp-org-tree"
                name="settBlgOrgCode"
                :tree-options="treeOptions"
              ></yu-xform-item>
              <!-- <yu-xform-item
                label="考核归属机构"
                placeholder="考核归属机构"
                ctype="input"
                name="settBlgOrgCode"
                :rules="globalRules.input"
              ></yu-xform-item>-->
              <yu-xform-item
                label="调整方向"
                placeholder="调整方向"
                ctype="select"
                data-code="ADJ_DIR_TYPE"
                name="adjDirType"
              ></yu-xform-item>
              <yu-xform-item
                label="导入人"
                placeholder="导入人工号"
                ctype="input"
                name="impUserId"
                :rules="globalRules.input"
              ></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable
            ref="refTable"
            :data-url="dataUrl"
            row-number
            :dynamic-height="true"
            border
            max-height="700px"
          >
            <yu-xtable-column
              label="调整类型"
              prop="adjType"
              width="120"
              :show-overflow-tooltip="true"
              data-code="ADJ_TYPE"
              fixed="left"
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="账户名称"
              prop="acctNm"
              width="250"
              fixed="left"
              :show-overflow-tooltip="true"
              is-num
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="账户/款项/借据"
              prop="acctSubDebtNo"
              min-width="180"
              :show-overflow-tooltip="true"
              fixed="left"
              is-num
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="考核归属条线"
              prop="settBlgBusi"
              width="150"
              data-code="SETT_BLG_BUSI"
              :show-overflow-tooltip="true"
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="考核归属机构号"
              prop="settBlgOrgCode"
              width="140"
              :show-overflow-tooltip="true"
              is-num
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="考核归属机构名称"
              prop="orgName"
              width="160"
              :show-overflow-tooltip="true"
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="涉及金额(元)"
              prop="invoAmt"
              width="130"
              align="right"
              format-money
              :show-overflow-tooltip="true"
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="计算起始日"
              prop="calBeginDate"
              width="120"
              :show-overflow-tooltip="true"
              is-num
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="计算到期日"
              prop="calEndDate"
              width="120"
              :show-overflow-tooltip="true"
              is-num
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="调整方向"
              prop="adjDirDesc"
              width="120"
              :show-overflow-tooltip="true"
              data-code="ADJ_DIR_TYPE"
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="调整方向值"
              prop="adjDirType"
              width="120"
              :show-overflow-tooltip="true"
              is-num
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="余额调整方式"
              prop="balAdjMode"
              width="130"
              :show-overflow-tooltip="true"
              is-num
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="余额调整比例"
              prop="balAdjPct"
              width="150"
              :show-overflow-tooltip="true"
              sortable="custom"
            >
              <template slot-scope="scope">
                <span class="num" v-if="scope.row.balAdjPct || scope.row.balAdjPct === 0">{{scope.row.balAdjPct}}%</span>
              </template>
            </yu-xtable-column>
            <yu-xtable-column
              label="余额调整固定金额（元）"
              prop="balAdjFixedAmt"
              min-width="210"
              :show-overflow-tooltip="true"
              align="right"
              format-money
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="应调整存款/贷款余额（万元）"
              prop="adjDepLoanAmt"
              min-width="230"
              align="right"
              format-money
              :show-overflow-tooltip="true"
              sortable="custom"
            >
              <template slot-scope="scope">
                <span class="num">{{$util.formatMoney(scope.row.adjDepLoanAmt / 10000)}}</span>
              </template>
            </yu-xtable-column>
            <yu-xtable-column
              label="日均调整方式"
              prop="avgAdjDesc"
              width="180"
              :show-overflow-tooltip="true"
              is-num
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="日均调整比例"
              prop="avgAdjPct"
              width="180"
              :show-overflow-tooltip="true"
              sortable="custom"
            >
              <template slot-scope="scope">
                <span class="num" v-if="scope.row.avgAdjPct || scope.row.avgAdjPct === 0">{{scope.row.avgAdjPct}}%</span>
              </template>
            </yu-xtable-column>
            <yu-xtable-column
              label="日均调整固定金额(元)"
              prop="avgAdjFixedAmt"
              width="180"
              :show-overflow-tooltip="true"
              align="right"
              format-money
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="应调整存款日均（万元）"
              prop="avgDepAmt"
              width="200"
              :show-overflow-tooltip="true"
              align="right"
              format-money
              sortable="custom"
            >
              <template slot-scope="scope">
                <span class="num">{{$util.formatMoney(scope.row.avgDepAmt / 10000)}}</span>
              </template>
            </yu-xtable-column>
            <yu-xtable-column
              label="数据日期"
              prop="etlDate"
              width="150"
              :show-overflow-tooltip="true"
              is-num
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="系统账户/款项/借据余额(元)"
              prop="acctSubDebtBal"
              min-width="220"
              :show-overflow-tooltip="true"
              align="right"
              format-money
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="系统账户/款项日均（元）"
              prop="acctSubAvg"
              width="210"
              align="right"
              format-money
              :show-overflow-tooltip="true"
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="导入时间"
              prop="impTime"
              width="150"
              align="right"
              format-money
              :show-overflow-tooltip="true"
              is-num
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="导入人用户ID"
              prop="impUserId"
              width="150"
              align="right"
              format-money
              :show-overflow-tooltip="true"
              is-num
              sortable="custom"
            ></yu-xtable-column>
            <yu-xtable-column
              label="导入人姓名"
              prop="impUserName"
              width="150"
              align="right"
              format-money
              :show-overflow-tooltip="true"
              is-num
              sortable="custom"
            ></yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
    <upload-excel :visible.sync="uploadVisible" @success="successFn" :options="uploadOptions"></upload-excel>
    <yu-dialog
      class="dialog1"
      :visible.sync="dialogVisibles"
      width="600px"
      title="执行跑批"
      @close="runClose"
    >
      <!-- <el-date-picker v-model="runData" type="date" placeholder="请选择跑批日期"></el-date-picker> -->
      <yu-xform :model="queryFormData1" ref="runRefForm">
        <yu-xform-group :column="4">
          <yu-xform-item
            label="选择跑批日期"
            placeholder="选择跑批日期"
            ctype="date-picker"
            name="etlDate"
            :rules="globalRules.required"
          ></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div class="button">
        <el-button style="margin-left: 10px;" type="success" @click.stop="startRunBatch">开始跑批</el-button>
        <el-button type="gary" class="cannel" @click.stop="cannel">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import { backend } from "@/config";
import request from "@/utils/request";
import lookup from "@/utils/lookup";
import { getUserInfo } from "@/utils";
import * as commonApi from "@/api/common";

@Component({
  name: "DataList"
})
export default class extends Vue {
  @Ref("searchForm") searchForm: any;
  @Ref("refTable") refTable: any;
  @Ref("runRefForm") runRefForm: any;
  private uploadVisible = false; // 控制上传弹出框
  private dialogVisibles = false; // 控制点击跑批选择跑批日期弹出框
  private runDate = "";
  private dataUrl = backend.dataSupplement + "/api/adjdeploanrec/infolist"; //请求地址
  private queryFormData = {};
  private dataDt = "";
  private queryFormData1 = {
    etlDate: "",
  };
  private treeOptions = {
    showCheckbox: true,
  };
  private userInfo = getUserInfo();
  private uploadOptions = {
    url: backend.dataSupplement + "/api/adjdeploanrec/import",
    tip: '上传文件（最多只能导入5天的数据）'
  }


  created() {
    this.getSysDataDt();
  }
  customerViewFn(row: any) {
    this.$router.push({
      path: "/custInfo/custView/" + row.crmCustId,
      query: {
        crmCustId: row.crmCustId,
        custId: row.custId,
        title: "客户详情-" + row.custNm,
      },
    });
  }

  //开始导入
  exportFn () {
    this.uploadVisible = true;
  }
  successFn () {
    this.refTable.remoteData();
  } 


  cannel() {
    //取消
    var _this = this;
    _this.dialogVisibles = false;
    _this.queryFormData1.etlDate = "";
  }

  downTempFn () {
    this.$util.downFile({
      url: backend.dataSupplement + "/api/adjdeploanrec/download",
      method: "get",
      fileName: "手工调整数据补录模板.xlsx",
    });
  }
  runBatch() {
    // 点击执行跑批按钮
    var _this = this;
    _this.dialogVisibles = true;
  }
  runClose() {
    // 点击取消执行跑批按钮
    this.queryFormData1.etlDate = "";
  }
  startRunBatch() {
    // 点击开始跑批按钮
    var _this = this;
    var validate = false;
    _this.runRefForm.validate(function (valid: any) {
      validate = valid; //表单验证
    });
    if (!validate) {
      _this.$message({ message: "请选择跑批日期", type: "warning" });
      return;
    }
    if (_this.queryFormData1.etlDate.length !== 0) {
      var time1 = new Date(_this.queryFormData1.etlDate);
      var t1 = time1.getTime();
      var time2 = new Date(_this.dataDt);
      var t2 = time2.getTime();
      var t3 = Date.parse("2021-6-1");
      if (t1 < t3) {
        _this.$message({
          message: "跑批日期数据不得小于系统上线日期",
          type: "warning",
        });
        return;
      }
      if (t1 > t2) {
        _this.$message({
          message: "该日期数据无需手动跑批",
          type: "warning",
        });
        _this.queryFormData1.etlDate = "";
        return;
      }
    } else {
      _this.$message({
        message: "请选择跑批日期",
        type: "warning",
      });
      return;
    }
    let params = {
      etlDate: this.queryFormData1.etlDate,
    };
    request({
      method: "get",
      url: backend.dataSupplement + "/api/adjdeploanrec/runbatch",
      params: params,
    }).then((res: any) => {
      _this.$message({
        message: res.message + "  ,  请稍后查看",
        type: "success",
      });
    });
    _this.dialogVisibles = false;
    // this.$emit("runBatch");
  }
  getSysDataDt() {
    commonApi.getSysDataDt().then((res: any) => {
      if (res.code === 0) {
        this.dataDt = res.data;
      }
    });
  }
}
</script>
<style scoped lang="scss" scoped>
// /deep/ .el-button--text {
//   position: relative;
//   left: 13px;
// }
.header {
  padding-bottom: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  opacity: 1;
  border-radius: 0px;
}
.dialog {
  /deep/ .el-dialog__header::before {
    height: 0;
  }
  /deep/ .yu-pagination {
    display: none;
  }
  /deep/ .el-dialog__header {
    position: relative;
    box-shadow: 0 0 0 0 !important;
  }
  /deep/ .cell.el-tooltip {
    white-space: normal;
    min-width: 50px;
  }
}
.dialog1 {
  /deep/ .el-form-item__content {
    display: flex;
  }
  /deep/ .el-form-item__label {
    width: 175px;
  }
  /deep/.el-input__inner {
    width: 250px;
  }
  /deep/ .el-input__suffix {
    right: -230px;
  }
  /deep/.el-form-item__error {
    padding-top: 4px;
    width: 100px;
  }
  .button {
    margin-left: 165px;
    margin-top: 25px;
  }
}
.check {
  // margin: 0 20px;
  height: 48px;
  line-height: 48px;
  font-size: 15px;
  background-color: #feece8;
}
.icon-guanbixuanjiao {
  padding: 10px 7px 10px 10px;
  color: #f14922;
}
.icon-guanbixuanjiao:before {
  content: "\e620";
  position: relative;
  top: -2px;
}
.button {
  margin-left: 215px;
  margin-top: 25px;
}
/deep/ .cannel {
  margin-left: 30px !important;
}
/deep/ .yu-main-tabs__toolbar {
  z-index: 21;
}
</style>