<template>
  <div class="quotaCard-container" :style="{ height: data.height || (data.hideLast ? '80px' : '120px') }">
    <div class="top">
      <img :src="require(`@/assets/images/theme/${themeType}/quota/icon-quota${index + 1}.png`)" alt="" />
      <div class="total">
        <p class="f3" :title="data.name">{{ data.name }}</p>
        <p>
          <span class="num">{{ data.unit ? $util.formatMoney(data.total) : formatMoney(data.total, data.isAmount, true) }}</span
          ><span class="unit">{{ data.unit || (data.isAmount ? getUnit(data.total) : "") }}</span>
        </p>
      </div>
    </div>
    <div class="bottom f4" v-if="!data.hideLast">
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
import { formatMoney } from "@/utils";
import { SettingsModule } from "@/store/modules/settings";

@Component({
  name: "QuotaCard",
  components: {},
})
export default class extends Vue {
  @Prop({ default: 0 }) index: number | undefined;
  @Prop({ required: true }) data!: Array<any>;

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
}
</script>

<style lang="scss" scoped>
.quotaCard-container {
  overflow: hidden;
  position: relative;
  padding: 16px;
  height: 140px;
  background: #ffffff;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.2);
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
      float: left;
    }
    .total {
      margin-left: 60px;
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:nth-child(2) {
          font-size: 24px;
          font-weight: bold;
        }
        .unit {
          margin-left: 6px;
          font-size: 12px;
          color: #666;
          font-weight: normal;
        }
      }
    }
  }
  .bottom {
    color: #666;
    margin-top: 10px;
    .iconfont {
      margin-left: 4px;
      font-size: 12px;
    }
    .icon-shangsheng {
      color: #f14922;
    }
    .icon-xiajiang {
      color: #0fcb51;
    }
    .el-col {
      p:nth-child(2) {
        white-space: nowrap;
        margin-top: 5px;
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
</style>
