<template>
  <div class="makertBusOpt-container yu-main-wrapper" :style="{height: cHeight + 'px'}">
    <div class="market-title">营销商机</div>
    <div class="market-card">
      <el-row :gutter="16">
        <el-col :span="6" v-for="(item, index) in cardData" :key="item.type">
          <div class="market-card__item" :style="{color: `rgba(${item.color},1)`, backgroundImage: `url(${require(`@/assets/images/market/market${index+1}.png`)})`}">
            <el-popover
              placement="right-start"
              trigger="hover"
              popper-class="popover-makertBusOpt"
            >
              <div class="popover-cont">
                <div class="popover-cont__title">
                  <i :class="`iconfont icon-${item.icon}`" :style="{color: `rgba(${item.color},1)`}"></i> 
                  <span>{{item.name}}</span>
                </div>
                {{item.desc}}
              </div>
              <div slot="reference" class="help"><i class="iconfont icon-bangzhu"></i></div>
            </el-popover>
            <i :class="`iconfont icon-${item.icon}`" :style="{color: `rgba(${item.color},1)`}"></i>
            <div class="title">{{item.name}}</div>
            <div class="bottom" :style="{'background': `rgba(${item.color},0.1)`}">
              <span class="cust">客户数：<span class="num">{{item.num}}</span></span>
              <div class="btn" @click="viewFn(item)">查看</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 大额异动潜在客户 -->
    <content-modal :visible.sync="largeVisible">
      <template slot-scope="scope">
        <large-change-cust :instance="scope" :title="title" :is-mark="isMark" />
      </template>
    </content-modal>
    <!-- 供应链潜在客户 -->
    <content-modal :visible.sync="supplyVisible">
      <template slot-scope="scope">
        <supply-chain-potential-cust :instance="scope" :title="title" :is-mark="isMark" />
      </template>
    </content-modal>
    <!-- 存款减少预警 -->
    <content-modal :visible.sync="depositVisible">
      <template slot-scope="scope">
        <deposit-reduce-warn :instance="scope" :title="title" :is-mark="isMark" @mark-change="markChangeFn" />
      </template>
    </content-modal>
    <!-- 交易减少预警 -->
    <content-modal :visible.sync="tradeVisible">
      <template slot-scope="scope">
        <trade-reduce-warn :instance="scope" :title="title" :is-mark="isMark" />
      </template>
    </content-modal>
    
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import LargeChangeCust from './largeChangeCust/index.vue'
import SupplyChainPotentialCust from './supplyChainPotentialCust/index.vue'
import DepositReduceWarn from './depositReduceWarn/index.vue'
import TradeReduceWarn from './tradeReduceWarn/index.vue'
import * as marketeApi from '@/api/market'
@Component({
  name: 'MakertBusOpt',
  components: {
    LargeChangeCust,
    SupplyChainPotentialCust,
    DepositReduceWarn,
    TradeReduceWarn
  }
})
export default class extends Vue {
  private cardData:any = [
    { type: 'large', name: '大额异动潜在客户', icon: 'daeyidongqianzaikehu', color: '0, 164, 219', num: 0 },
    { type: 'supply', name: '供应链潜在客户', icon: 'gongyinglianqianzaikehu', color: '21, 102, 241', num: 0 },
    { type: 'deposit', name: '存款减少预警', icon: 'cunkuanjianshaoyujing', color: '255, 142, 18', num: 0 },
    { type: 'trade', name: '交易减少预警', icon: 'jiaoyijianshaoyujing', color: '235, 44, 44', num: 0 },
  ]

  private largeVisible = false;
  private supplyVisible = false;
  private depositVisible = false;
  private tradeVisible = false;
  private title = {};
  private isMark = '1'

  @Watch('$route', { immediate: true})
  private onRouteChange() {
    const { opprname, opprno, isflag, isMark } = this.$route.params
    if(isflag) {
      this.isMark = '2'
      let item = {
        name: opprname,
        type: this.cardData.find((item:any)=>item.name === opprname)?.type
      }
      this.viewFn(item)
    }
  }

  created() {
    this.getCustNum()
  }

  markChangeFn(isMark: string) {
    this.isMark = isMark
  }

  // 查看
  viewFn(item: any) {
    this.largeVisible = false;
    this.supplyVisible = false;
    this.depositVisible = false;
    this.tradeVisible = false;
    (this as any)[item.type + 'Visible'] = true;
    this.title = item.name;
  }

  // 获取客户数
  getCustNum() {
    marketeApi.selectlong().then(res => {
      console.log(res.data)
      const {  opprName,opprCstNum, opprDesc, } = res.data[0];
      this.$set(this.cardData, 0, {
        ...this.cardData[0],
        name: opprName,
        num: this.$util.formatMoney(opprCstNum, 0),
        desc: opprDesc
      })
    })
    marketeApi.selectsc().then(res => {
      console.log(res.data)
      const {  opprCstNum, opprDesc, opprName} = res.data[0];
      this.$set(this.cardData, 1, {
        ...this.cardData[1],
        name: opprName,
        num: this.$util.formatMoney(opprCstNum, 0),
        desc: opprDesc
      })
    })
    marketeApi.selectwrmb().then(res => {
      console.log(res.data)
      const {  opprCstNum, opprDesc, opprName} = res.data[0];
      this.$set(this.cardData, 2, {
        ...this.cardData[2],
        name: opprName,
        num: this.$util.formatMoney(opprCstNum, 0),
        desc: opprDesc
      })
    })
    marketeApi.selectmbse().then(res => {
      console.log(res.data)
      const {  opprCstNum, opprDesc, opprName} = res.data[0];
      this.$set(this.cardData, 3, {
        ...this.cardData[3],
        name: opprName,
        num: this.$util.formatMoney(opprCstNum, 0),
        desc: opprDesc
      })
    })
  }
 
}
</script>
<style lang="scss">
.popover-makertBusOpt {
  .popover-cont {
    width: 280px;
    .popover-cont__title {
      margin-bottom: 8px;
      span{
        margin-left: 10px;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.makertBusOpt-container {
  background: #fff;
  padding: 35px 50px;
  .market-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 12px;
  }
  .market-card {
    .market-card__item {
      position: relative;
      height: 172px;
      padding-top: 30px;
      color: #00A4DB;
      text-align: center;
      box-shadow: 0px 3px 6px  rgba(0, 0, 0, 0.2);
      .help {
        position: absolute;
        top: 10px;
        right: 10px;
        .iconfont {
          cursor: pointer;
          color: #333;
          font-size: 15px;
        }
      }
      .iconfont {
        font-size: 40px;
      }
      .title {
        font-size: 20px;
        font-weight: bold;
        line-height: 1;
        margin: 12px 0 24px;
      }
      .bottom {
        text-align: left;
        height: 40px;
        padding: 0 10px;
        line-height: 40px;
        background: rgba(0, 164, 219, 0.1);
        .btn {
          cursor: pointer;
          margin-top: 8px;
          float: right;
          width: 60px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          background: #00A4DB;
          color: #fff;
          border-radius: 15px;
        }
      }
    } 
  }
}
</style>
