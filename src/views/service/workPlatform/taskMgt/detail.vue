<template>
  <div class="detail-container">
    <yu-dialog title="客户动账提醒" :visible.sync="dialogVisible" @close="hide" top="5vh" custom-class="task-dialog">
      <div class="remind">
        <div class="chgAmt">
          <span class="num" :style="{ color: custInfo.chgAmt < 0 ? '#0FCB51' : '#f14922' }">{{ (custInfo.chgAmt > 0 ? "+" : "") + $util.formatMoney(custInfo.chgAmt / 10000) }}</span>
          <span class="chgAmt-money f2">万元</span>
        </div>
        <div class="chgAmt-text f2">变动金额</div>
        <div class="format-money f2">
          <span>
            期初余额
            <i class="num moneys f2">{{ $util.formatMoney(custInfo.openBal / 10000) }}</i>
            <i class="chgAmt-money f2">万元</i>
          </span>
          <span>
            期末余额
            <i class="num moneys f2">{{ $util.formatMoney(custInfo.closeBal / 10000) }}</i>
            <i class="chgAmt-money f2">万元</i>
          </span>
        </div>
        <div class="company f2">
          <span class="custName" @click="customerViewFn">
            <i class="iconfont icon-qiyelogo">&nbsp;</i>
            {{ custInfo.custName }}
          </span>
          <span>
            核心客户号 ：
            <i class="num">{{ custInfo.custId }}</i>
          </span>
        </div>
        <div class="contents f2">
          <div class="content-item">
            <div class="content-item__label">开户机构：</div>
            <div class="content-item__value">{{ custInfo.openOrgNm }}</div>
          </div>
          <!-- <div class="content-item">
            <div class="content-item__label">客户类型：</div>
            <div class="content-item__value">{{$lookup.convertKey('CUST_TYPE', custInfo.custType)}}</div>
          </div> -->
          <div class="content-item">
            <div class="content-item__label">管户机构：</div>
            <div class="content-item__value"><yu-detail :value="orgInfo.blgOrgBarchNm"></yu-detail></div>
          </div>
          <div class="content-item">
            <div class="content-item__label">国标行业：</div>
            <div class="content-item__value"><yu-detail :value="$lookup.convertKey('NAT_STD_INDS_MIS', custInfo.indsType)"></yu-detail></div>
          </div>
          <div class="content-item">
            <div class="content-item__label">客户经理：</div>
            <div class="content-item__value">{{ mgrInfo.blgMgrNm }}</div>
          </div>
          <div class="content-item">
            <div class="content-item__label">企业规模：</div>
            <div class="content-item__value">{{ $lookup.convertKey("ENT_SCALE_MIS", custInfo.entScale) }}</div>
          </div>
          <div class="content-item">
            <div class="content-item__label">变动时间：</div>
            <div class="content-item__value">{{ custInfo.etlDate }}</div>
          </div>
        </div>
      </div>
      <div class="edit-reason" v-if="type === 2">
        <div class="section-title f2">动账原因</div>
        <div class="reason-content">
          <el-input type="textarea" :autosize="{ minRows: 4 }" maxlength="20" show-word-limit placeholder="请输入客户动账原因" v-model="reason"></el-input>
          <div class="reason-btn">
            <el-button type="primary" @click="submitFn" class="f2">填报</el-button>
          </div>
        </div>
      </div>
      <div class="history f2">
        <div class="section-title f2">
          历史记录（
          <i class="num">{{ historyList.length }}</i
          >）
        </div>
        <div class="history-content f2">
          <el-timeline>
            <el-timeline-item v-for="(item, index) in historyList" :color="index % 2 ? theme : '#E9E9E9'" :key="index">
              <div class="history-timeline">
                <div class="date num">{{ item.chgRsnTm }}</div>
                <div class="info">
                  <img src="~@/assets/images/notice/man.png" alt />
                  <div class="info-content">
                    <div class="name">{{ item.chgUserNm }}</div>
                    <div class="info-reason">{{ item.chgReason }}</div>
                  </div>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <div slot="footer" class="operate-btns tr">
        <el-button type="primary" @click="hide">关闭</el-button>
      </div>
    </yu-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import * as homeApi from "@/api/home";
import { HomeModule } from "@/store/modules/home";
import { SettingsModule } from "@/store/modules/settings";

@Component({
  name: "TaskDetail",
  components: {},
})
export default class extends Vue {
  @Prop({ default: false }) visible!: boolean;
  @Prop() id!: string;
  @Prop() type!: number;
  private isMgr: boolean = (this as any).$util.getCheckedRole().roleCode === "R300201";

  private dialogVisible = false;
  private reason = "";
  private custInfo: any = {};
  private orgInfo: any = {};
  private mgrInfo: any = {};
  private historyList: any[] = [];

  get theme() {
    return SettingsModule.theme;
  }

  @Watch("visible")
  onVisibleChange(visible: boolean) {
    this.dialogVisible = visible;
    if (visible) {
      (this as any).$lookup.reg("CUST_TYPE,ENT_SCALE_MIS,NAT_STD_INDS_MIS", () => {
        this.largerCustDetail();
      });
    }
  }

  created() {
    this.dialogVisible = this.visible;
  }

  hide() {
    this.$emit("update:visible", false);
    this.reason = "";
  }

  customerViewFn() {
    let row = this.custInfo;
    this.$router.push({ path: "/custInfo/custView/" + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: "客户详情-" + row.custName } });
    this.hide();
  }

  largerCustDetail() {
    homeApi.largerCustDetail(this.id).then((res: any) => {
      if (res.code === 0) {
        const { largerCustomerInfo, blgOrgNmInfo, blgMgrNmInfo, reasonInfo } = res.data;
        this.custInfo = largerCustomerInfo[0] || {};
        this.orgInfo = blgOrgNmInfo[0] || {};
        this.mgrInfo = blgMgrNmInfo[0] || {};
        this.historyList = reasonInfo || [];
      }
    });
  }

  submitFn() {
    if (!this.reason) {
      this.$message.warning("请输入客户动账原因");
      return;
    }

    // 每个人只能填写一次
    let userId = (this as any).$util.getUserInfo()?.userId;
    let historyIds = this.historyList.map((item) => item.chgUserId);
    if (historyIds.includes(userId)) {
      this.$message.warning("已填报，不能重复填报");
      this.reason = "";
      return;
    }

    let data = {
      rmdId: this.id,
      custId: this.custInfo.custId,
      crmCustId: this.custInfo.crmCustId,
      custName: this.custInfo.custName,
      chgReason: this.reason,
    };
    homeApi.largerCustReason(data).then((res: any) => {
      // if(res.code === 0) {
      this.$message.success("填报成功");
      this.largerCustDetail();
      this.reason = "";
      // }
    });
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  position: relative;
  // height: 760px!important;
}
.task-dialog {
  .base-info {
    .base-content {
      margin-top: 12px;
      .el-col {
        line-height: 30px;
        .label {
          font-weight: bold;
        }
      }
    }
  }
  .edit-reason {
    margin-top: 30px;
    .reason-content {
      margin-top: 16px;
    }
    .reason-btn {
      margin-top: 12px;
      text-align: right;
    }
  }
  .history {
    margin-bottom: 35px;
    margin-top: 20px;
    .history-content {
      margin-top: 20px;
      .history-timeline {
        .date {
          font-size: 12px;
          color: #999;
        }
        .info {
          margin-top: 12px;
          padding: 20px;
          background: #f7f7f7;
          border: 1px solid #e1e1e1;
        }
        .info-content {
          margin-left: 46px;
          .info-reason {
            margin-top: 10px;
            color: #666;
            line-height: 1.3;
          }
        }
        img {
          float: left;
          width: 36px;
          height: 36px;
          border-radius: 50%;
        }
      }
    }
  }
  // .section-title {
  //   font-size: 13px;
  //   font-weight: bold;
  //   padding-left: 8px;
  //   color: #333;
  // }
}
@media screen and (max-width: 1680px) {
  /deep/ .el-dialog__title {
    font-weight: bold;
    font-size: 15px;
  }
  .section-title {
    font-size: 13px;
    font-weight: bold;
    padding-left: 8px;
    color: #333;
  }
  /deep/ .el-button {
    font-size: 13px;
  }
  /deep/ .el-dialog {
    width: 600px;
  }
}
@media screen and (min-width: 1680px) {
  /deep/ .el-dialog__title {
    font-weight: bold;
    font-size: 16px;
  }
  .section-title {
    font-size: 14px;
    font-weight: bold;
    padding-left: 8px;
    color: #333;
  }
  /deep/ .el-button {
    font-size: 14px;
  }
  /deep/ .el-dialog {
    width: 650px;
  }
}
.remind {
  // border: 1px solid red;
  width: 100%;
  // height: 500px;
  text-align: center;
  // font-size: 13px;
  color: #333333;
}
.chgAmt {
  margin-top: 15px;
  margin-bottom: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #f14922;
}
.chgAmt-money {
  margin-left: 5px;
  // font-size: 12px;
  color: #666;
}
.chgAmt-text {
  // font-size: 13px;
  color: #333333;
  font-weight: bold;
}
.format-money {
  display: flex;
  justify-content: space-between;
  padding: 18px 90px;
  // border: 1px solid red;
  width: 100%;
  height: 17px;
  // font-size: 13px;
  color: #333333;
  font-weight: bold;
}
.company {
  margin-top: 15px;
  width: 100%;
  height: 40px;
  border: 1px solid #d8d8d8;
  text-align: left;
  line-height: 40px;
  background-color: #f4f4f4;
  font-weight: bold;
}
.custName {
  cursor: pointer;
  // color: $blue;
  margin-right: 80px;
  padding-left: 10px;
}
.contents {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  opacity: 1;
  border-radius: 10px;
  width: 100%;
  //height: 150px;
  background-color: #fff;
  &::before {
    content: "";
    display: inline-block;
    width: 1px;
    height: calc(100% - 20px);
    background: #d8d8d8;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .blgMgrNm {
    border: 0;
  }
  .content-item {
    margin: 0 10px;
    line-height: 49px;
    width: calc(50% - 20px);
    height: 49px;
    text-align: left;
    font-weight: bold;
    border-top: 1px solid #d8d8d8;
    &:nth-child(1),
    &:nth-child(2) {
      border-top: 0;
    }
    .content-item__label {
      // font-size: 13px;
      display: inline-block;
      vertical-align: middle;
    }
    .content-item__value {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      // font-size: 12px;
      width: calc(100% - 70px);
      font-weight: 400;
    }
  }
}
.footer {
  position: absolute;
  width: 100%;
  bottom: 10px;
  right: 0;
  text-align: right;
  .el-button--primary {
    margin-right: 20px;
  }
}
.el-divider--horizontal {
  margin: 11px 0;
}
.moneys {
  margin-left: 20px;
}
</style>
