<template>
  <div id="screenFull" class="publicScreen-container" :style="{ transform: 'scale(' + scaleX + ',' + scaleY + ')' }">
    <div class="header">
      <img src="~@/assets/images/screen/title.png" alt="" />
    </div>
    <div class="content clearfix">
      <div class="left fl">
        <!-- 对公主要指标 -->
        <div class="section">
          <div class="section-title">
            <div class="title">对公主要指标</div>
            <img src="~@/assets/images/screen/small-title-bg.png" alt="" />
          </div>
          <Quota />
        </div>
        <!-- 对公存款趋势 -->
        <div class="section">
          <div class="section-title">
            <div class="title">对公存款趋势</div>
            <img src="~@/assets/images/screen/small-title-bg.png" alt="" />
          </div>
          <DepTrendChart />
        </div>
        <!-- 对公贷款趋势 -->
        <div class="section">
          <div class="section-title">
            <div class="title">对公贷款趋势</div>
            <img src="~@/assets/images/screen/small-title-bg.png" alt="" />
          </div>
          <LoanTrendChart />
        </div>
        <!-- 实时大额动账 -->
        <div class="section">
          <div class="section-title">
            <div class="title">实时大额动账</div>
            <img src="~@/assets/images/screen/small-title-bg.png" alt="" />
          </div>
          <RealTimeLargeAcct />
        </div>
      </div>
      <div class="center fl">
        <!-- 全行存款余额 -->
        <AllBankDeposite />
        <!-- 地图 -->
        <Map />
        <!-- 对公增量 -->
        <PublicIncrement />
      </div>
      <div class="right fr">
        <!-- 区域结构分析 -->
        <div class="section">
          <div class="section-title">
            <div class="title">区域结构分析</div>
            <img src="~@/assets/images/screen/small-title-bg.png" alt="" />
          </div>
          <RegionStructAanlysis />
        </div>
        <!-- 存款产品分析 -->
        <div class="section">
          <div class="section-title">
            <div class="title">存款产品分析</div>
            <img src="~@/assets/images/screen/small-title-bg.png" alt="" />
          </div>
          <DepositProductAanlysis />
        </div>
        <!-- 贷款行业分析 -->
        <div class="section">
          <div class="section-title">
            <div class="title">贷款行业分析</div>
            <img src="~@/assets/images/screen/small-title-bg.png" alt="" />
          </div>
          <LoanIndustryAanlysis />
        </div>
        <!-- 授信 -->
        <div class="section">
          <CreditExposure />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import Quota from "./quota/index.vue";
import DepTrendChart from "./depTrendChart/index.vue";
import LoanTrendChart from "./loanTrendChart/index.vue";
import RealTimeLargeAcct from "./realTimeLargeAcct/index.vue";
import RegionStructAanlysis from "./regionStructAanlysis/index.vue";
import DepositProductAanlysis from "./depositProductAanlysis/index.vue";
import LoanIndustryAanlysis from "./loanIndustryAanlysis/index.vue";
import CreditExposure from "./creditExposure/index.vue";
import AllBankDeposite from "./allBankDeposite/index.vue";
import Map from "./map/index.vue";
import PublicIncrement from "./publicIncrement/index.vue";
import { ScreenModule } from "@/store/modules/screen";
@Component({
  name: "PublicScreen",
  components: {
    Quota,
    DepTrendChart,
    LoanTrendChart,
    RealTimeLargeAcct,
    RegionStructAanlysis,
    DepositProductAanlysis,
    LoanIndustryAanlysis,
    CreditExposure,
    AllBankDeposite,
    Map,
    PublicIncrement,
  },
})
export default class extends Vue {
  @Provide("screenInstance") screenInstance = this;
  private quotaData = [
    { icon: "depBal", name: "对公存款余额", total: 0, lastD: 0, lastY: 0 },
    { icon: "depAvg", name: "对公存款日均", total: 0, lastD: 0, lastY: 0 },
    { icon: "loanBal", name: "对公贷款余额", total: 0, lastD: 0, lastY: 0 },
  ];

  private scaleX = 1;
  private scaleY = 1;
  private timer: any = null;
  private animateTime = 30000;
  private busiLine = "00";

  get uniqueKey() {
    return ScreenModule.uniqueKey;
  }

  mounted() {
    const originWidth = 1920;
    const originHight = 1080;
    const realWidth = document.documentElement.clientWidth;
    const realHeight = document.documentElement.clientHeight;
    this.scaleX = realWidth / originWidth;
    this.scaleY = realHeight / originHight;
    this.$nextTick(() => {
      window.addEventListener("resize", (e) => {
        //监听浏览器窗口大小改变
        //浏览器变化执行动作
        const { innerHeight, innerWidth } = e.currentTarget as any;
        this.scaleX = innerWidth / originWidth;
        this.scaleY = innerHeight / originHight;
      });
    });

    this.startAutoSwitch();

    // 2个小时刷新这个页面，清理一下内存
    let refreshTime = 2 * 60 * 60 * 1000;
    setInterval(() => {
      window.location.reload();
    }, refreshTime);
  }

  // 开启自动切换
  startAutoSwitch() {
    if (!this.timer) {
      this.timer = setInterval(() => {
        let key = this.uniqueKey + 1;
        ScreenModule.SET_UNIQUE_KEY(key);
      }, this.animateTime);
    }
  }

  // 停止自动切换
  stopAutoSwitch() {
    ScreenModule.SET_UNIQUE_KEY(0);
    clearInterval(this.timer);
    this.timer = null;
  }

  destroyed() {
    this.stopAutoSwitch();
  }

  fullScreen() {
    let el: any = document.documentElement;
    let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
    if (rfs) {
      rfs.call(el);
    } else if (typeof window.ActiveXObject !== "undefined") {
      let wsscript = new window.ActiveXObject("WScript.Shell");
      if (wsscript != null) {
        wsscript.SendKeys("{F11}");
      }
    }
  }
}
</script>
<style lang="scss">
.publicScreen-container {
  // 公用弹出框样式
  .chart-tooltip {
    background: url("~@/assets/images/screen/tooltip.png") center no-repeat;
    background-size: 100% 100%;
    padding: 8px;
    color: #fff;
    .unit {
      // font-size: 12px;
      margin-left: 5px;
    }
  }
}
</style>

<style lang="scss" scoped>
.publicScreen-container {
  width: 1920px;
  height: 1080px;
  color: #fff;
  font-family: SourceHanSansCN-Bold;
  background: url("~@/assets/images/screen/bg.png") center no-repeat;
  background-size: cover;
  transform-origin: 0px 0px;
  transform: scale(1, 1);
  .header {
    text-align: center;
    height: 80px;
    background: url("~@/assets/images/screen/title-bg.png") center no-repeat;
  }
  .section {
    padding: 10px 12px 12px;
    margin-bottom: 10px;
    background: rgba(0, 84, 112, 0.2);
  }
  .section-title {
    border-bottom: 1px solid rgba(0, 207, 255, 0.5);
    .title {
      display: inline-block;
      padding: 0 34px 10px 0;
      position: relative;
      font-weight: bold;
      color: #fff;
      font-size: 20px;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        bottom: -2px;
        width: 100%;
        height: 3px;
        border-radius: 1.5px;
        background-color: #00cfff;
      }
    }
    img {
      position: relative;
      top: 2px;
      left: -20px;
    }
  }
  .content {
    padding: 0 16px 20px;
    .left {
      width: 383px;
      position: relative;
      top: -20px;
    }
    .center {
      width: 1120px;
    }
    .right {
      width: 383px;
      position: relative;
      top: -20px;
    }
  }
}
</style>
