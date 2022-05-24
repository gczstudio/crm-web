<!--
 * @Descripttion: 
 * @Author: gaocz
 * @Date: 2022-04-21 16:46:56
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-20 17:44:53
 * @FilePath: /edmp-web/src/views/system/lowCodeMgt/comptConfig/addComp/cardSet/card1/index.vue
-->

<template>
  <div class="card-config card1" v-if="lookuped">
    <div :class="{ top: true, active: active === '0' }" @click="clickFn('0')">
      <div class="drag-box">
        <template v-if="configData[0]">
          <img v-if="configData[0].iconUrl" :src="require(`@/assets/images/${configData[0].iconUrl.slice(16)}`)" alt="" />
          <div class="total">
            <p>{{ configData[0].name }}</p>
            <p>
              <span class="num">{{ formatMoney(configData[0]) }}</span>
              <span class="unit">{{ getUnit(configData[0]) }}</span>
            </p>
          </div>
        </template>
      </div>
    </div>
    <div class="bottom">
      <el-row>
        <el-col :span="8" v-for="(item, index) in cardConfig.slice(1)" :key="index" :class="{ active: String(index + 1) === active }">
          <div class="drag-box" @click="clickFn(String(index + 1))">
            <template v-if="item">
              <p>{{ item.name }}<i v-if="item.isShowIcon === '1'" :class="['iconfont', getArrow(item.value)]"></i></p>
              <p>
                <span class="num">{{ formatMoney(item) }}</span
                ><span class="unit">{{ getUnit(item) }}</span>
              </p>
            </template>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";
import { LowCodeModule } from "@/store/modules/lowCode";

export interface Options {
  key: string;
  value: any;
}

@Component({
  name: "Card1",
})
export default class extends Vue {
  @Prop() data!: any;
  active = "0";
  configData: Record<string, unknown>[] = [];
  lookuped = false;

  get cardConfig() {
    return LowCodeModule.cardConfig;
  }

  @Watch("cardConfig", { immediate: true, deep: true })
  onCardConfigChange(config: any) {
    this.configData = config;
    if (config.length < 4) {
      for (var i = 0; i < 4 - config.length; i++) {
        this.configData.push({});
      }
    }
  }

  created() {
    // 加载码值
    this.$lookup.reg("LC_FORMAT_TYPE,LC_UNIT_TYPE", () => {
      this.lookuped = true;
    });
  }

  clickFn(type: string) {
    this.active = type;
    this.$emit("change", type);
  }

  // 获取箭头
  getArrow(money: number) {
    return money >= 0 ? "icon-shangsheng" : "icon-xiajiang";
  }

  // 格式化数据
  formatMoney(data: any) {
    let { value, isShowSymbol, formatType } = data;
    if (typeof value !== "number") return value;

    // 1 金额  2 数字
    if (formatType === "1") {
      value = this.transformUnit(data);
    }
    let handleVal = this.$util.formatMoney(value, formatType === "1" ? 2 : 0);
    if (isShowSymbol === "1") {
      handleVal = value > 0 ? "+" + handleVal : handleVal;
    }
    return handleVal;
  }

  // 单位转换
  transformUnit(data: any) {
    const { value, unitType } = data;
    switch (unitType) {
      case "2": // 万元
        return value / 10000;
      case "3": // 亿元
        return value / 100000000;
      case "4": // 自适应
        return this.autoUnit(value).num;
      default:
        return value;
    }
  }

  // 自适应单位
  autoUnit(num: number) {
    let unit = "元",
      handleNum = num;
    if (num >= 10000) {
      unit = "万元";
      handleNum = num / 10000;
    }

    if (num >= 100000000) {
      unit = "亿元";
      handleNum = num / 100000000;
    }

    return {
      num: handleNum,
      unit,
    };
  }

  // 获取单位
  getUnit(data: any) {
    const { value, unitType } = data;
    if (unitType === "4") {
      return this.autoUnit(value).unit;
    }
    return this.$lookup.convertKey("LC_UNIT_TYPE", unitType);
  }
}
</script>

<style lang="scss" scoped>
.card-config {
  margin: 100px auto 0;
  width: 400px;
  .top {
    cursor: pointer;
    height: 115px;
    border: 1px dashed #d8d8d8;
    &:hover,
    &.active {
      border-color: #007eff;
    }
    .drag-box {
      padding: 30px;
    }
  }
  .el-col {
    cursor: pointer;
    position: relative;
    height: 60px;
    border: 1px dashed #d8d8d8;
    border-top: none;
    & + .el-col {
      border-left: none;
    }
    .drag-box {
      padding: 10px;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    &:hover,
    &.active {
      .drag-box {
        border: 1px dashed #007eff;
      }
    }
  }
  .top {
    img {
      width: 62px;
      height: 54px;
      float: left;
    }
    .total {
      // margin-left: 70px;
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
</style>
