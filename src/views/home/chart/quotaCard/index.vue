<template>
  <div class="quotaCard-container">
    <i v-if="chartStatus === 'opened'" class="el-icon-close" @click="deleteFn"></i>
    <div class="top">
      <img :src="require(`@/assets/images/theme/${themeType}/quota/icon-quota${(index + 1) % 8 || 8}.png`)" alt="" />
      <div class="total">
        <p :title="data.name">{{ data.name }}</p>
        <p>
          <span class="num">{{ formatMoney(data.total, data.isAmount, true) }}</span>
          <span class="unit">{{ data.isAmount ? getUnit(data.total) : "" }}</span>
        </p>
      </div>
    </div>
    <div class="bottom" v-if="!data.hideLast">
      <el-row>
        <el-col :span="8">
          <p>比上日<i :class="['iconfont', getArrow(data.lastD)]"></i></p>
          <p>
            <span class="num">{{ formatMoney(data.lastD, data.isAmount) }}</span
            ><span class="unit" v-if="data.isAmount">{{ getUnit(data.lastD) }}</span>
          </p>
        </el-col>
        <el-col :span="8">
          <p>比上月<i :class="['iconfont', getArrow(data.lastM)]"></i></p>
          <p>
            <span class="num">{{ formatMoney(data.lastM, data.isAmount) }}</span
            ><span class="unit" v-if="data.isAmount">{{ getUnit(data.lastM) }}</span>
          </p>
        </el-col>
        <el-col :span="8">
          <p>比上年<i :class="['iconfont', getArrow(data.lastY)]"></i></p>
          <p>
            <span class="num">{{ formatMoney(data.lastY, data.isAmount) }}</span
            ><span class="unit" v-if="data.isAmount">{{ getUnit(data.lastY) }}</span>
          </p>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { HomeModule } from "@/store/modules/home";
import { SettingsModule } from "@/store/modules/settings";
import { formatMoney } from "@/utils";

@Component({
  name: "QuotaCard",
  components: {},
})
export default class extends Vue {
  @Prop({ default: 0 }) index: number | undefined;
  @Prop({ required: true }) data!: Array<any>;

  private width: number = window.screen.width;

  get chartStatus() {
    return HomeModule.chartStatus;
  }

  get themeType() {
    return SettingsModule.themeType;
  }

  // 格式化金额
  formatMoney(money: number, isAmount: boolean, noSymbol: boolean) {
    let symbol = !money ? "" : money > 0 ? "+" : "-";
    if (noSymbol) {
      symbol = money < 0 ? "-" : "";
    }
    money = money ? Math.abs(money) : money;
    let m = money;
    if (isAmount) {
      if (money >= 10000) {
        m = money / 10000;
      }

      if (money >= 100000000) {
        m = money / 100000000;
      }
    }
    return symbol + formatMoney(m, isAmount ? 2 : 0);
  }

  // 获取单位
  getUnit(money: number) {
    money = Math.abs(money);
    let unit = "元";
    if (money >= 10000) {
      unit = "万元";
    }
    if (money >= 100000000) {
      unit = "亿元";
    }
    return unit;
  }

  // 获取箭头
  getArrow(money: number) {
    return money >= 0 ? "icon-shangsheng" : "icon-xiajiang";
  }

  deleteFn() {
    this.$emit("delete");
  }
}
</script>

<style lang="scss" scoped>
.quotaCard-container {
  overflow: hidden;
  position: relative;
  padding: 16px 16px 20px;
  height: 160px;
  background: #ffffff;
  box-shadow: 0px 2px 10px rgba(0, 92, 187, 0.3);
  border-radius: 5px;
  .el-icon-close {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
    // color: $blue;
    font-weight: bold;
    transform: rotate(0);
    transition: all 0.3s;
    &:hover {
      transform: rotate(90deg);
    }
  }
  .top {
    img {
      margin-top: 8px;
      float: left;
    }
    .total {
      margin-left: 70px;
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 16px;
        line-height: 21px;
        &:nth-child(2) {
          line-height: 31px;
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        .unit {
          font-weight: normal;
          margin-left: 6px;
          font-size: 12px;
          color: rgba(51, 51, 51, 0.8);
        }
      }
    }
  }
  .bottom {
    color: #333;
    margin-top: 26px;
    font-size: 14px;
    .iconfont {
      margin-left: 10px;
      font-size: 14px;
    }
    .icon-shangsheng {
      color: #f14922;
    }
    .icon-xiajiang {
      color: #0fcb51;
    }
    .el-col {
      p {
        line-height: 16px;
      }
      p:nth-child(2) {
        white-space: nowrap;
        margin-top: 8px;
      }
    }
    .up {
      p:nth-child(2) {
        color: #f14922;
      }
    }
    .down {
      p:nth-child(2) {
        color: #0fcb51;
      }
    }
  }
}
@media screen and (max-width: 1680px) {
  .quotaCard-container {
    padding: 12px;
    height: 135px;
    .top {
      .total {
        p {
          font-size: 15px;
        }
      }
    }
    .bottom {
      margin-top: 16px;
      font-size: 12px;
    }
  }
}
</style>
