<template>
  <div class="detail-container">
    <yu-dialog title="实时大额动账" :visible.sync="dialogVisible" @close="hide" top="5vh" custom-class="remind-dialog">
      <div class="remind">
        <div class="chgAmt">
          <span class="num" :style="{ color: custInfo.dcFlag === 'D' ? '#0FCB51' : '#f14922' }">{{ custInfo.dcFlag === "D" ? "-" : "+" }}{{ $util.formatMoney(custInfo.tranAmt / 10000) }}</span>
          <span class="chgAmt-money f2">万元</span>
        </div>
        <div class="chgAmt-text f2">交易金额</div>
        <div class="format-money f2">
          交易时间 :
          <i class="num">{{ custInfo.tranTime }}</i>
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
        <div class="contents">
          <div>
            <span>账号 :&nbsp;</span>
            <i class="num">{{ custInfo.acctNo }}</i>
          </div>
          <div>
            <span>款项序号 : &nbsp;</span>
            <i class="num">{{ custInfo.acctSubNo }}</i>
          </div>
          <div>
            <span>交易机构 :&nbsp;</span>
            <i>{{ custInfo.tranOrgNm }}</i>
          </div>
          <div>
            <span>交易码 :&nbsp;</span>
            <i class="num">{{ custInfo.tranCode }}</i>
          </div>
          <div>
            <span>交易渠道 :&nbsp;</span>
            <i>{{ $lookup.convertKey("TRAN_CHNL", custInfo.tranChnlId) }}</i>
          </div>
          <div>
            <span>借贷标志 :&nbsp;</span>
            <i>
              {{ custInfo.dcFlag === "C" ? "贷" : "借" }}
            </i>
          </div>
          <div class="blgMgrNm">
            <span>摘要码 :&nbsp;</span>
            <i class="num">{{ custInfo.memoNo }}</i>
          </div>
          <div class="blgMgrNm">
            <span>摘要 :&nbsp;</span>
            <i>{{ custInfo.memoDesc }}</i>
          </div>
          <div class="fenggexian"></div>
        </div>
      </div>
      <div class="section-title f2">备注</div>
      <div class="remark f2">{{ custInfo.remark }}</div>
      <div slot="footer" class="operate-btns tr">
        <el-button type="primary" @click="hide">关闭</el-button>
      </div>
    </yu-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import * as homeApi from "@/api/home";

@Component({
  name: "RemindDetail",
  components: {},
})
export default class extends Vue {
  @Prop({ default: false }) visible!: boolean;
  @Prop() id!: string;
  private custInfo: any = {};

  private dialogVisible = false;

  @Watch("visible")
  onVisibleChange(visible: boolean) {
    this.dialogVisible = visible;
    if (visible) {
      (this as any).$lookup.reg("TRAN_CHNL", () => {
        this.largerAccountReason();
      });
    }
  }
  created() {
    this.dialogVisible = this.visible;
  }

  show() {
    this.$emit("update:visible", true);
  }

  hide() {
    this.$emit("update:visible", false);
    this.$emit("update");
  }

  customerViewFn() {
    let row = this.custInfo;
    this.$router.push({ path: "/custInfo/custView/" + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: "客户详情-" + row.custName } });
    this.hide();
  }

  largerAccountReason() {
    homeApi.largerAccountReason(this.id).then((res: any) => {
      if (res.code === 0) {
        this.custInfo = res.data[0];
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.remind-dialog {
  .el-timeline-item__node--normal {
    left: 1px;
    width: 8px;
    height: 8px;
  }
  .el-dialog__header {
    position: relative;
    &::before {
      content: "";
      display: inline-block;
      width: calc(100% - 40px);
      height: 1px;
      background: #e1e1e1;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .el-dialog__body {
    padding: 20px 20px 30px;
  }
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
  margin-top: 20px;
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
  margin-bottom: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  opacity: 1;
  border-radius: 10px;
  width: 100%;
  height: 200px;
  background-color: #fff;
  .blgMgrNm {
    border: 0;
  }
  div {
    margin-left: 10px;
    margin-right: 10px;
    line-height: 49px;
    width: 46%;
    height: 49px;
    text-align: left;
    font-weight: bold;
    border-bottom: 1px solid #d8d8d8;
    span {
      // font-size: 13px;
    }
    i {
      // font-size: 12px;
      font-weight: 400;
    }
  }
  .fenggexian {
    position: absolute;
    left: 47.5%;
    top: 20px;
    width: 1px;
    height: 170px;
    background: #d8d8d8;
  }
}
.footer {
  position: absolute;
  width: 100%;
  bottom: 10px;
  right: 0;
  text-align: right;
}
.el-divider--horizontal {
  margin: 11px 0;
}
.el-button--primary {
  margin-right: 20px;
}
.remark {
  padding: 8px 12px;
  margin-top: 10px;
  margin-bottom: 50px;
  width: 100%;
  min-height: 100px;
  // font-size: 13px;
  border: 1px solid #d8d8d8;
  border-radius: 2px;
  color: #333333;
}
</style>
