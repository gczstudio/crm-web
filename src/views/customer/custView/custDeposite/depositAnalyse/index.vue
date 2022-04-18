<template>
  <div class="depositAnalyse-container">
    <div class="profile">
      <div class="title f3"><i class="iconfont icon-cunkuantongji vam"></i><span class="vam">存款概况</span></div>
      <el-row :gutter="isMaxScreen ? 16 : 12">
        <el-col :span="8">
          <div class="quota-card__item">
            <div class="top">
              <img :src="require(`@/assets/images/theme/${themeType}/customer/icon-quota1.png`)" alt="">
              <div class="total">
                <p>存款余额</p>
                <p><span class="num">{{formatMoney(depositeInfo.depBal, true)}}</span><span class="unit">{{getUnit(depositeInfo.depBal)}}</span></p>
              </div>
            </div>
            <div class="bottom">
              <el-row>
                <el-col :span="8">
                  <p class="f2">比上日<i :class="['iconfont', getArrow(depositeInfo.depBalLastD)]"></i></p>
                  <p class="f2"><span class="num">{{formatMoney(depositeInfo.depBalLastD)}}</span><span class="unit">{{getUnit(depositeInfo.depBalLastD)}}</span></p>
                </el-col>
                <el-col :span="8">
                  <p class="f2">比上月<i :class="['iconfont', getArrow(depositeInfo.depBalLastM)]"></i></p>
                  <p class="f2"><span class="num">{{formatMoney(depositeInfo.depBalLastM)}}</span><span class="unit">{{getUnit(depositeInfo.depBalLastM)}}</span></p>
                </el-col>
                <el-col :span="8">
                  <p class="f2">比上年<i :class="['iconfont', getArrow(depositeInfo.depBalLastY)]"></i></p>
                  <p class="f2"><span class="num">{{formatMoney(depositeInfo.depBalLastY)}}</span><span class="unit">{{getUnit(depositeInfo.depBalLastY)}}</span></p>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="quota-card__item">
            <div class="top">
              <img :src="require(`@/assets/images/theme/${themeType}/customer/icon-quota2.png`)" alt="">
              <div class="total">
                <p>存款日均</p>
                <p><span class="num">{{formatMoney(depositeInfo.depBalAvg, true)}}</span><span class="unit">{{getUnit(depositeInfo.depBalAvg)}}</span></p>
              </div>
            </div>
            <div class="bottom">
              <el-row>
                <el-col :span="8">
                  <p>比上日<i :class="['iconfont', getArrow(depositeInfo.depBalAvgLastD)]"></i></p>
                  <p><span class="num">{{formatMoney(depositeInfo.depBalAvgLastD)}}</span><span class="unit">{{getUnit(depositeInfo.depBalAvgLastD)}}</span></p>
                </el-col>
                <el-col :span="8">
                  <p>比上月<i :class="['iconfont', getArrow(depositeInfo.depBalAvgLastM)]"></i></p>
                  <p><span class="num">{{formatMoney(depositeInfo.depBalAvgLastM)}}</span><span class="unit">{{getUnit(depositeInfo.depBalAvgLastM)}}</span></p>
                </el-col>
                <el-col :span="8">
                  <p>比上年<i :class="['iconfont', getArrow(depositeInfo.depBalAvgLastY)]"></i></p>
                  <p><span class="num">{{formatMoney(depositeInfo.depBalAvgLastY)}}</span><span class="unit">{{getUnit(depositeInfo.depBalAvgLastY)}}</span></p>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="quota-card__item">
            <div class="top clearfix">
              <img :src="require(`@/assets/images/theme/${themeType}/customer/icon-quota3.png`)" alt="">
              <div class="total trans-info">
                <p>结算情况</p>
              </div>
            </div>
            <el-row class="trans-amount">
              <el-col :span="12">
                <p class="f3">年交易笔数(笔)</p>
                <p class="num">{{$util.formatMoney(depositeInfo.tranNumY, 0)}}</p>
              </el-col>
              <el-col :span="12">
                <p class="f3">年交易金额({{getUnit(depositeInfo.tranAmtY)}})</p>
                <p class="num">{{formatMoney(depositeInfo.tranAmtY, true)}}</p>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="analyse">
      <div class="analyse-title"><i class="iconfont icon-jiesuanfenxi vam"></i><span class="vam">结算趋势分析</span></div>
      <el-row :gutter="isMaxScreen ? 16 : 12">
        <el-col :span="12">
          <InOutTrendChart />
        </el-col>
        <el-col :span="12">
          <CountTrendChart />
        </el-col>
      </el-row>
      <div class="analyse-title"><i class="iconfont icon-jiaoyiduishoufenxi vam"></i><span class="vam">交易对手分析</span></div>
      <div class="analyse-table">
        <yu-xform :model="queryFormData" :search="analyseSearchFn" :reset="analyseResetFn" form-type="search">
          <yu-xform-group :column="4">
            <yu-xform-item label="开始日期" name="tranDateStart" ctype="date-picker" placeholder="开始日期" :picker-options="startPickerOptions"></yu-xform-item>
            <yu-xform-item label="结束日期" name="tranDateEnd" ctype="date-picker" placeholder="结束日期" :picker-options="endPickerOptions"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
        <el-row :gutter="isMaxScreen ? 16 : 12">
          <el-col :span="12">
            <div class="in-out-box">
              <div class="title"><i class="iconfont icon-liuru"></i>资金流入</div>
              <top-table ref="inRef"  border :data="inData" rank-key="rankNo" :columns="inColumns" :show-more="false" :show-rank="false"></top-table>
              <!-- <yu-xtable ref="inRef" :data-url="dataUrl" :base-params="inParams" :pageable="false" border>
                <yu-xtable-column label="对方账户" prop="opstAcctNm" :show-overflow-tooltip="true"></yu-xtable-column>
                <yu-xtable-column label="对方开户行" prop="opstBankNm" :show-overflow-tooltip="true"></yu-xtable-column>
                <yu-xtable-column label="流入金额（元）" align="right" format-money prop="totalTranAmt" :show-overflow-tooltip="true">
                </yu-xtable-column>
                <yu-xtable-column label="笔数" prop="tranNum" :show-overflow-tooltip="true"></yu-xtable-column>
              </yu-xtable> -->
            </div>
          
          </el-col>
          <el-col :span="12">
            <div class="in-out-box">
              <div class="title"><i class="iconfont icon-liuchu"></i>资金流出</div>
              <top-table ref="outRef" border :data="outData" rank-key="rankNo" :columns="outColumns" :show-more="false" :show-rank="false"></top-table>
              <!-- <yu-xtable ref="outRef" :data-url="dataUrl" :base-params="outParams" :pageable="false" border>
                <yu-xtable-column label="对方账户" prop="opstAcctNm" :show-overflow-tooltip="true"></yu-xtable-column>
                <yu-xtable-column label="对方开户行" prop="opstBankNm" :show-overflow-tooltip="true"></yu-xtable-column>
                <yu-xtable-column label="资金流出（元）" prop="totalTranAmt"  align="right" format-money :show-overflow-tooltip="true"></yu-xtable-column>
                <yu-xtable-column label="笔数" prop="tranNum" :show-overflow-tooltip="true"></yu-xtable-column>
              </yu-xtable> -->
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { formatMoney } from '@/utils'
import InOutTrendChart from './component/InOutTrendChart/index.vue'
import CountTrendChart from './component/CountTrendChart/index.vue'
import * as customerApi from "@/api/customer";
import { backend } from '@/config'
import moment from 'moment'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'DepositAnalyse',
  components: {
    InOutTrendChart,
    CountTrendChart
  }
})
export default class extends Vue {

  @Ref('inRef') inRef: any;
  @Ref('outRef') outRef: any;

  private crmCustId = this.$route.query.crmCustId as string;
  private depositeInfo = {};
  private dataUrl = backend.custService + '/api/depoistinfo/flow'
  private queryFormData = {
    tranDateStart: moment().subtract(3, 'month').format('YYYY-MM-DD'),
    tranDateEnd: moment().format('YYYY-MM-DD')
  }
  private inParams = {
    condition: JSON.stringify({
      dcFlag: 'C',
      crmCustId: this.crmCustId
    })
  }

  private outParams = {
    condition: JSON.stringify({
      dcFlag: 'D',
      crmCustId: this.crmCustId
    })
  }

  private inData = []
  private inColumns = [
    { prop: "opstAcctNm", label: "对方户名", showOverflowTooltip: true, sortable: true },
    { prop: "opstBankNm", label: "对方行名", showOverflowTooltip: true, sortable: true  },
    { prop: "totalTranAmt", label: "流入金额（元）", width: 150, showOverflowTooltip: true, align: "right", formatMoney: true, sortable: true },
    { prop: "tranNum", label: "交易笔数", showOverflowTooltip: true, width: 100, align: "right", isNum: true, sortable: true }
  ];

  private outData = []
  private outColumns = [
    { prop: "opstAcctNm", label: "对方户名", showOverflowTooltip: true, sortable: true  },
    { prop: "opstBankNm", label: "对方行名", showOverflowTooltip: true, sortable: true  },
    { prop: "totalTranAmt", label: "流出金额（元）", width: 150, showOverflowTooltip: true, align: "right", formatMoney: true, sortable: true },
    { prop: "tranNum", label: "交易笔数", showOverflowTooltip: true, width: 100, align: "right", isNum: true, sortable: true }
  ];

  private startPickerOptions = {
    disabledDate: (time: Date) => {
      if (this.queryFormData.tranDateEnd) {
        return time.getTime() >= new Date(this.queryFormData.tranDateEnd).getTime();
      }
    }
  }

  private endPickerOptions = {
    disabledDate: (time: Date) => {
      if (this.queryFormData.tranDateStart) {
        return time.getTime() <= new Date(this.queryFormData.tranDateStart).getTime() - 86400000;
      }
    }
  }

  get themeType() {
    return SettingsModule.themeType
  }

  created() {
    this.getDepoistdetail()
    this.analyseSearchFn()
  }

  getDepoistdetail() {
    customerApi.getDepoistdetail(this.crmCustId).then(res => {
      this.depositeInfo = res.data?.[0] || {}
    })
  }

  analyseResetFn () {
    this.queryFormData = {
      tranDateStart: '',
      tranDateEnd: ''
    }
  }

  analyseSearchFn() {
    this.getDepoistInfoFlow('C');
    this.getDepoistInfoFlow('D');
    this.inRef && this.inRef.clearSort();
    this.outRef && this.outRef.clearSort();
  }

  // 获取流入流出
  getDepoistInfoFlow(dcFlag: string) {
    const { tranDateStart, tranDateEnd } = (this.queryFormData as any)
    let params = {
      condition: JSON.stringify({
        dcFlag,    // C 流入 D流出
        crmCustId: this.crmCustId,
        tranDateStart: tranDateStart ? moment(tranDateStart).format('YYYY-MM-DD') : null,
        tranDateEnd: tranDateEnd ? moment(tranDateEnd).format('YYYY-MM-DD') : null
      })
    }
    customerApi.getDepoistInfoFlow(params).then(res => {
      if(dcFlag === 'C') {
        this.inData = res.data;
      } else {
         this.outData = res.data;
      }
    })
  }


  // 格式化金额
  formatMoney(money: number, noSymbol: boolean) {
    let symbol = !money ? '' : (money > 0 ? '+' : '-')
    money = money ? Math.abs(money) : money;
    let m = money;
    if(money >= 10000) {
      m = money / 10000;
    }

    if(money >= 100000000) {
      m = money / 100000000
    }
    return (noSymbol ? '' : symbol) + formatMoney(m)
  }

  // 获取单位
  getUnit(money: number) {
    money = Math.abs(money)
    let unit = '元'
    if(money >= 10000) {
      unit = '万元'
    }
    if(money >= 100000000) {
      unit = '亿元'
    }
    return unit;
  }

  // 获取箭头
  getArrow(money: number) {
    return money >=0 ? 'icon-shangsheng' : 'icon-xiajiang'
  }


}
</script>

<style lang="scss" scoped>
  .depositAnalyse-container {
    .profile {
      padding: 0 20px;
      .title {
        margin: 26px 0 16px;
        font-weight: bold;
        .iconfont {
          margin-right: 8px;
        }
      }
    }
    .quota-card__item {
      overflow: hidden;
      position: relative;
      padding: 25px 24px;
      height: 178px;
      background: #FFFFFF;
      box-shadow: 0px 3px 10px 1px rgba(0, 92, 187, 0.3);
      border-radius: 5px;
      .top {
        img {
          float: left;
         
        }
        .total {
          margin-left: 60px;
          p {
            white-space: nowrap;
            font-size: 20px;
            &:nth-child(2) {
              font-size: 30px;
              // font-weight: bold;
            }
            .unit {
              margin-left: 6px;
              font-size: 12px;
              color: #333;
              font-weight: normal;
            }
          }
        }
        .trans-info {
          padding-top: 11px;
        }
      }
      .trans-amount {
        p:nth-child(1) {
          font-size: 16px;
        }
        p:nth-child(2) {
          margin-top: 10px;
          font-size: 36px;
          // font-weight: bold;
        }
      }
      .bottom {
        color: #333;
        margin-top: 20px;
        .iconfont {
          margin-left: 4px;
          font-size: 14px;
        }
        .icon-shangsheng {
          color: #F14922;
        }
        .icon-xiajiang {
          color: #0FCB51;
        }
        .el-col {
          p:nth-child(2) {
            margin-top: 6px;
            white-space: nowrap;
          }
        }
        .up {
          p:nth-child(2) {
            color: #F14922;
          }
        }
        .down {
          p:nth-child(2) {
            color: #0FCB51;
          }
        }

      }
    }
    .analyse {
      padding: 0 20px 20px;
      .analyse-title {
        font-weight: bold;
        font-size: 16px;
        margin: 26px 0 16px;
        .iconfont {
          margin-right: 8px;
        }
      }
      .analyse-table {
        margin-top: 16px;
        .in-out-box {
          margin-top: 2px;
          background: #FFFFFF;
          box-shadow: 0px 3px 10px 1px rgba(0, 92, 187, 0.3);
          border-radius: 5px;
          padding: 16px;
          .title {
            font-size: 16px;
            margin-bottom: 16px;
            // padding-left: 10px;
            // border-left: 4px solid #007EFF;
            .iconfont {
              margin-right: 10px;
            }
          }
        }
      }
    }
  }


  @media screen and (max-width: 1680px) {
    .depositAnalyse-container { 
      .profile {
        padding: 0 12px;
        .title {
          margin: 16px 0 12px;
        }
      }
      .analyse {
        padding: 0 12px 12px;
        .analyse-title {
          font-size: 15px;
          margin: 16px 0 12px;
        }
      }
      .quota-card__item {
        height: 160px;
        padding: 20px;
        .top {
          .total {
            p {
              font-size: 18px;
              &:nth-child(2) {
                font-size: 28px;
                height: 37px;
                line-height: 37px;
              }
            }
          }
        }
        .bottom {
          margin-bottom: 16px;
        }
        .trans-amount {
          p:nth-child(2) {
            font-size: 28px;
          }
        }
      }
    }
  }

</style>
