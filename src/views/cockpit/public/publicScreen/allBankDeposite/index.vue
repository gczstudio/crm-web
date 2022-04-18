<template>
  <div class="allBankDeposite-component">
    <div class="content clearfix">
      <div class="title fl">全行对公存款余额</div>
      <ul class="block fl">
        <li :class="`block-item ${isNaN(item) ? 'comma' : 'num'} fl`" v-for="(item, index) in numberArr" :key="index">
          <span v-if="isNaN(item)">{{item}}</span>
          <div v-else class="scroll-num" :id="`scrollnum${index}`">0123456789</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Inject, Watch } from "vue-property-decorator";
import * as screenApi  from '@/api/screen'
import { ScreenModule } from '@/store/modules/screen'
@Component({
  name: "AllBankDeposite"
})
export default class extends Vue {
  @Inject() readonly screenInstance!: any;
  @Ref('chartRef') chartRef: any;

  private numberArr:any = []
  private num = 0
  private curNum = 0

  private timer:any = null
  private timer1:any = null

  get uniqueKey() {
    return ScreenModule.uniqueKey
  }

  @Watch('uniqueKey')
  onChangeUniqueKey() {
    this.startAnimate()
  }

  mounted() {
    this.querybalence()
    this.startQueryTimer();
  }

  startQueryTimer() {
    // 两分钟刷新一次-调接口
    if(this.timer) return
    this.timer = setInterval(() => {
      this.querybalence()
      this.stopQueryTimer()
      this.startQueryTimer()
    }, 120000)
  }

  stopQueryTimer() {
    clearInterval(this.timer)
    this.timer = null
  }

  startAnimate() {
    // 15s刷新一次-不调接口， 只有滚动效果
    this.curNum = this.num
    this.numberArr = {
      ...this.numberArr.map((item: any) => {
        return isNaN(item) ? ',' : 0
      })
    }
    this.$nextTick(() => {
      this.toOrderNum(this.curNum)
    });
  }
  
  destroyed() {
    this.stopQueryTimer()
  }

  querybalence() {
    screenApi.querybalence({
      condition: JSON.stringify({
        busiLine: this.screenInstance.busiLine
      })
    }).then((res: any) => {
      this.num = res.data[0].realTimeBal
      this.toOrderNum(res.data[0].realTimeBal)
    })
  }

  // 设置文字滚动
  setNumberTransform () {
    for (let index = 0; index < this.numberArr.length; index++) {
      let item = this.numberArr[index]
      if(!isNaN(item)) {
        const elem:any = document.getElementById(`scrollnum${index}`)
        elem.style.transform = `translate(-50%, -${parseInt(item * 10 as any)}%)`
      }
    }
  }

  toOrderNum(num: number) {
    let orderNum = this.$util.formatMoney(num, 0).split('')
    this.numberArr = orderNum.map((item: any) => {
      return isNaN(item) ? item : 0
    })
    setTimeout(() => {
      this.numberArr = orderNum;
      this.setNumberTransform();
    }, 1000)
  }

}
</script>

<style lang="scss" scoped>
  .allBankDeposite-component {
    margin: 14px 0 26px;
    width: 100%;
    text-align: center;
    .content {
      display: inline-block;
    }
    .title {
      
      padding: 0 10px;
      height: 50px;
      line-height: 50px;
      background-color: rgba(0, 179, 247, .1);
      border-radius: 2px;
      border: 1px solid #00B3F7;
      color: #44F0FF;
      font-size: 30px;
    }
    .block {
      margin-left: 13px;
      
      .block-item{
        position: relative;
        margin-left: 10px;
        width: 40px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        background-color: rgba(0, 179, 247, .1);
        border-radius: 2px;
        border: 1px solid #00B3F7;
        color: #FFC801;
        font-size: 48px;
        font-weight: bold;
        overflow: hidden;
      }
      .comma {
        font-family: AdobelHeitiStd-Regular;
        border: 0;
        background-color: transparent;
        width: 15px;
      }
      .scroll-num {
        display: inline-block;
        writing-mode: vertical-rl;
        text-orientation: upright;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%,0);
        transition: transform 1s ease-in-out;
        letter-spacing: 10px;
      }
    }
  }
</style>
