<template>
  <div class="quota">
    <div class="quota-item" v-for="item in quotaData" :key="item.icon">
      <img :src="require(`@/assets/images/screen/${item.icon}.png`)" alt="">
      <div class="quota-item__cont clearfix">
        <div class="quota-item__cont-l fl">
          <p class="title">{{item.name}}</p>
          <p class="total">{{$util.formatMoney(item.total / 100000000)}}<span class="unit">亿元</span></p>
        </div>
        <div class="fl line"></div>
        <div class="quota-item__cont-r fl">
          <p>比上日<span class="amount fr">{{(item.lastD > 0 ? '+' : '') + $util.formatMoney(item.lastD / 100000000)}}<span class="unit">亿元</span></span></p>
          <p>比上年<span class="amount fr">{{(item.lastY > 0 ? '+' : '') + $util.formatMoney(item.lastY / 100000000)}}<span class="unit">亿元</span></span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as homeApi from '@/api/home'

@Component({
  name: "PublicScreen"
})
export default class extends Vue {
  private quotaData = [
    { icon: 'depBal', name: '对公存款余额', total: 0, lastD: 0, lastY: 0 },
    { icon: 'depAvg', name: '对公存款日均', total: 0, lastD: 0, lastY: 0 },
    { icon: 'loanBal', name: '对公贷款余额', total: 0, lastD: 0, lastY: 0 }
  ]

  mounted() {
    this.queryOrgIndex();
  }

  queryOrgIndex() {
    homeApi.queryOrgIndex().then(res => {
      let data = res.data
      this.quotaData = [
        { icon: 'depBal', name: '对公存款余额', total: data.depBal, lastD: data.depBalLastD, lastY: data.depBalLastY },
        { icon: 'depAvg', name: '对公存款日均', total: data.depBalAvg, lastD: data.depBalAvgLastD, lastY: data.depBalAvgLastY },
        { icon: 'loanBal', name: '对公贷款余额', total: data.loanBal, lastD: data.loanBalLastD, lastY: data.loanBalLastY }
      ]
    })
  }

}
</script>

<style lang="scss" scoped>
.quota {
  color: #fff;
  .quota-item {
    padding: 4px 10px;
    background: rgba(8, 34, 47,.4);
    img {
      margin-top: 13px;
      float: left;
    }
    .quota-item__cont {
      margin-left: 60px;
      .quota-item__cont-l, .quota-item__cont-r {
        margin-top: 12px;
      }
      .quota-item__cont-r {
        p {
          margin-bottom: 12px;
          font-size: 12px;
          .amount {
            display: inline-block;
            text-align: right;
            width: 100px;
            margin-left: 10px;
            font-size: 14px;
            font-weight: bold;
            color: #44F0FF;
            font-family: 'Times New Roman', Times, serif!important;
            .unit {
              margin-left: 10px;
              font-size: 12px;
              font-weight: normal;
              color: #fff;
            }
          }
        }
      }
      .title {
        font-size: 16px;
        margin-bottom: 6px;
      }
      .total {
        color: #FFC801;
        font-size: 20px;
        font-weight: bold;
        font-family: 'Times New Roman', Times, serif!important;
        .unit {
          font-size: 12px;
          margin-left: 5px;
          color: #fff;
        }
      }
      .line {
        padding: 0 16px;
        width: 1px;
        height: 69px;
        background: url('~@/assets/images/screen/line.png') center no-repeat;
      }
    }
  }
}
</style>
