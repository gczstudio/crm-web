<template>
  <div class="BaseInfo-component">
    <div class="base-form">
      <div class="title">{{ row.custGroupNm }}</div>
      <div class="quota">
        <el-row :gutter="16">
          <el-col :span="6" v-for="item in quotaList" :key="item.name">
            <div class="quota-item">
              <!-- <img src="~@/assets/images/customer/money.png" alt=""> -->
              <div class="quota-item__cont">
                <p>{{ item.name }}</p>
                <p>
                  <span class="num">{{ $util.formatMoney(row[item.key]) || "0.00" }}</span
                  >元
                </p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="other-info">
        <div class="other-row">
          <p><span>客户群成员数：</span>{{ row.custGroupMember }}</p>
          <p><span>创建日期：</span>{{ row.creatorTime }}</p>
        </div>
        <div class="other-row">
          <p><span>创建人名称：</span>{{ row.creatorName }}</p>
          <p><span>创建人机构：</span>{{ row.orgName }}</p>
        </div>
        <div class="other-row">
          <p><span>客户群类别：</span>{{ $lookup.convertKey("CUST_GROUP_TYPE", row.custGroupType) }}</p>
          <p><span>客户群状态：</span>{{ $lookup.convertKey("CUST_GROUP_STATUS", row.custGroupStatus) }}</p>
        </div>
      </div>
      <div class="desc">
        <div class="desc-title">客户群描述</div>
        <div class="desc-cont">{{ row.custGroupRemark }}</div>
      </div>
    </div>
    <div class="base-title">
      <img src="~@/assets/images/customer/cust-group-detail-title.png" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, InjectReactive } from "vue-property-decorator";

@Component({
  name: "BaseInfo",
})
export default class extends Vue {
  @InjectReactive() readonly row!: any;
  @Prop({ default: false }) private visible!: boolean;
  @Ref("form") form: any;
  private formData = {};
  private quotaList = [
    { name: "存款余额", key: "custBal" },
    { name: "存款日均", key: "custBalAvg" },
    { name: "信贷余额", key: "xdLoanBal" },
    { name: "贷款余额", key: "loanBal" },
    { name: "EVA", key: "eva" },
    { name: "业务利润", key: "profitContribution" },
    { name: "FTP利润", key: "ftpProfitBalnc" },
    { name: "中间业务收入", key: "midBizInc" },
    { name: "授信总额", key: "creditAmt" },
    { name: "已使用授信额度", key: "usedCreditAmt" },
    { name: "授信敞口额度", key: "creditExposureAmt" },
    { name: "已使用敞口额度", key: "userdCreditExposureAmt" },
  ];

  mounted() {
    console.log(this.row, 777);
  }

  sureFn() {
    this.$emit("success");
  }
}
</script>

<style lang="scss">
.BaseInfo-component {
  position: relative;
  background: #fff;
  min-height: calc(100vh - 182px);
  .base-form {
    margin-right: 553px;
    padding: 0 20px;
    .title {
      font-size: 18px;
      font-weight: bold;
      padding: 28px 0 10px;
      border-bottom: 1px solid #d8d8d8;
    }
    .quota {
      margin-top: 20px;
      .quota-item {
        margin-bottom: 20px;
        padding: 10px;
        background: #fff;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
        img {
          float: left;
        }
        .quota-item__cont {
          // margin-left: 50px;
          background: url("../../../../../../assets/images/customer/money.png") no-repeat center right;
          p {
            line-height: 18px;
          }
          p:nth-child(1) {
            font-size: 13px;
          }
          p:nth-child(2) {
            white-space: nowrap;
            margin-top: 5px;
            font-size: 12px;
            span {
              margin-top: 5px;
              font-size: 18px;
              font-weight: bold;
              margin-right: 5px;
            }
          }
        }
      }
    }
    .other-info {
      margin-top: 40px;
      .other-row {
        display: flex;
        background: #efefef;
        margin-bottom: 10px;
        padding: 10px 20px;
        & > p {
          flex: 1;
          span {
            font-size: 13px;
            font-weight: bold;
          }
        }
      }
    }
    .desc {
      .desc-title {
        margin: 20px 0 10px;
        font-size: 13px;
        font-weight: bold;
      }
      .desc-cont {
      }
    }
  }
  .base-title {
    position: absolute;
    top: 0;
    right: 0;
    width: 555px;
    height: 100%;
    background: url("../../../../../../assets/images/customer/group-detail-bg.png") no-repeat center right;
    background-size: 555px 100%;
    img {
      position: absolute;
      top: 82px;
      right: 262px;
    }
  }
}

@media screen and (max-width: 1680px) {
  .BaseInfo-component {
    min-height: calc(100vh - 155px);
  }
}
</style>
