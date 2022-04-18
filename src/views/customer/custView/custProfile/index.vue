<template>
  <div class="custProfile-container clearfix">
    <div class="custProfile-left fl">
      <div class="custProfile-left-c">
        <div class="title">
          <img src="~@/assets/images/customer/enterprise.png" alt="">
          <span class="vam f3" :title="baseInfo.custNm">{{ baseInfo.custNm }}</span>
        </div>
        <div class="customer-tags-container">
          <div class="customer-tag-fixed">
            <div class="customer-tags">
              <div class="customer-tag" v-for="(item, index) in tagList" :key="index">{{item.itemCodeNm}}</div>
            </div>
            <div class="customer-arrow" v-if="showToggleTag" @click="toggleTagFn"><i :class="['iconfont', showMoreTag ? 'icon-shouqi' : 'icon-zhankai']"></i></div>
          </div>
        </div>
        <div class="custProfile-left-b">
          <div class="base-info">
            <p><span class="label">核心客户号：</span><span class="num">{{ baseInfo.custId }}</span></p>
            <p>
              <span class="label">法定代表人：</span>{{ baseInfo.legalName }}
            </p>
            <p><span class="label">证件号码：</span>{{ baseInfo.socialCode }}</p>
          </div>
          <div class="date-card">
            <el-row :gutter="isMaxScreen? 16 : 12">
              <el-col :span="12">
                <div class="date-card__item">
                  <el-row :gutter="10">
                    <el-col :span="6"><i class="iconfont icon-kaihuriqi" style="font-size: 30px"></i></el-col>
                    <el-col :span="18">
                      <p>首次开户日期</p>
                      <p class="num">{{ baseInfo.firstOpenDate }}</p>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="date-card__item">
                  <el-row :gutter="10">
                    <el-col :span="6"><i class="iconfont icon-daikuanriqi" style="font-size: 30px"></i></el-col>
                    <el-col :span="18">
                      <p>首次贷款日期</p>
                      <p class="num">{{ baseInfo.firstLoanDate }}</p>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </div>
          <ul class="rela-person">
            <li>
              <i class="iconfont icon-lianxiren vam"></i>
              <span class="vam" v-if="baseInfo.contNm">{{ baseInfo.contNm }}</span>
              <span class="vam c3 f1" v-else>暂无联系人</span>
              <i class="iconfont icon-dianhua vam"></i><span class="vam">{{baseInfo.contTel}}</span>
            </li>
          </ul>
          <div class="address">
            <div class="address-title">
              <i class="iconfont icon-dizhi"></i>
              <div>地址：<span v-if="baseInfo.contAddr">{{ baseInfo.contAddr}}</span> <span v-else class="c3">暂无地址</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="cust-credit">
        <div class="cust-credit__title">
          <i class="iconfont icon-shouxinjine1 vam f3"></i
          ><span class="vam f3">客户授信金额及使用情况</span>
        </div>
        <div class="cust-credit__content">
            <div class="credit-card clearfix">
              <div class="credit-card-l fl">
                <p class="subtitle">授信总额</p>
                <p class="total"><span class="num">{{$util.formatMoney(creditInfo.crdtAmt / 10000)}}</span><span class="unit">万元</span></p>
                <p class="subtitle" style="margin-top: 8px">已使用授信额度</p>
                <p class="total"><span class="num">{{$util.formatMoney(creditInfo.usedCrdtAmt / 10000)}}</span><span class="unit">万元</span></p>
              </div>
              <div class="credit-card-r">
                <div id="creditLine" style="height: 160px"></div>
              </div>
            </div>
            <div class="credit-card clearfix">
              <div class="credit-card-l fl">
                <p class="subtitle">授信敞口额度</p>
                <p class="total"><span  class="num">{{$util.formatMoney(creditInfo.crdtExpoAmt / 10000)}}</span><span class="unit">万元</span></p>
                <p class="subtitle" style="margin-top: 8px">已使用敞口额度</p>
                <p class="total"><span  class="num">{{$util.formatMoney(creditInfo.uCrdtExpoAmt / 10000)}}</span><span class="unit">万元</span></p>
              </div>
              <div class="credit-card-r">
                <div id="exposureLine" style="height: 160px"></div>
              </div>
            </div>
        </div>
      </div>
    </div>
    <div class="custProfile-right fl">
      <el-row :gutter="isMaxScreen? 16 : 12">
        <el-col
          :span="8"
          v-for="(item, index) in cardData"
          :key="item.chartId"
          class="mb16"
        >
          <quota-card :data="item" :index="index" />
        </el-col>
      </el-row>
      <div class="seciton">
        <el-row :gutter="isMaxScreen? 16 : 12">
          <el-col :span="16">
            <div class="seciton-left">
              <trend-chart :options="trendOptions" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="seciton-right">
              <div class="rate-card">
                <img
                  :src="require('@/assets/images/customer/cun.png')"
                  alt=""
                />
                <div class="rate-card__content">
                  <p class="desc f3">存款付息率</p>
                  <p class="percent num">{{rateInfo.avgDepRate}}%</p>
               </div>
              </div>
              <div class="rate-card">
                <img
                  :src="require('@/assets/images/customer/dai.png')"
                  alt=""
                />
               <div class="rate-card__content">
                  <p class="desc f3">平均贷款利率</p>
                  <p class="percent num">{{rateInfo.avgLoanRate}}%</p>
               </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="cust-account mt16">
        <div class="cust-account__title">
          <i class="iconfont icon-kehuxinxi1 vam f3"></i><span class="vam f3">客户在我行的账户信息（<span class="num">{{accountTotal}}</span>）</span>
          <div class="view-more" @click="moreFn">
            更多
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="cust-account__content">
          
          <el-carousel
            arrow="always"
            :autoplay="false"
            height="218px"
            indicator-position="none"
            v-if="accountList.length"
          >
            <el-carousel-item v-for="(item, index) in Math.ceil(accountList.length / (width < 1920 ? 2 : 3))" :key="item">
              <div v-if="!isMaxScreen">
                <el-row :gutter="16" style="padding:10px;">
                  <el-col :span="12" v-if="accountList[index*2]">
                    <div class="account-card">
                      <div class="account-index num">{{(formatIndex(index*2 + 1))}}</div>
                      <div :class="['account-status', accountList[index*2].acctStat !== '00' ? 'error' : '']">{{$lookup.convertKey('ACCT_STAT', accountList[index*2].acctStat)}}</div>
                      <p class="account-num num">{{formatAccountNum(accountList[index*2].acctNo)}}</p>
                      <p class="account-name f3">{{accountList[index*2].openOrgNm}}</p>
                      <p class="account-total f5">余额：￥<span class="num">{{$util.formatMoney(accountList[index*2].depBal)}}</span>元</p>
                      <!-- <p class="account-type">{{$lookup.convertKey('ACCT_CD',accountList[index*2].acctPropCd)}}</p> -->
                      <div class="account-btn" @click="custRunAccountFn(accountList[index*2].acctNo)">查看交易记录</div>
                    </div>
                  </el-col>
                  <el-col :span="12" v-if="accountList[index*2 + 1]">
                    <div class="account-card">
                      <div class="account-index num">{{formatIndex(index*2 + 2)}}</div>
                      <div :class="['account-status', accountList[index*2 + 1].acctStat !== '00' ? 'error' : '']">{{$lookup.convertKey('ACCT_STAT',accountList[index*2 + 1].acctStat)}}</div>
                      <p class="account-num num">{{formatAccountNum(accountList[index*2 + 1].acctNo)}}</p>
                      <p class="account-name f3">{{accountList[index*2 + 1].openOrgNm}}</p>
                      <p class="account-total f5">余额：￥<span class="num">{{$util.formatMoney(accountList[index*2 + 1].depBal)}}</span>元</p>
                      <!-- <p class="account-type">{{$lookup.convertKey('ACCT_CD',accountList[index*2 + 1].acctPropCd)}}</p> -->
                      <div class="account-btn" @click="custRunAccountFn(accountList[index*2 + 1].acctNo)">查看交易记录</div>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div>
                <el-row :gutter="16" style="padding:10px;">
                  <el-col :span="8" v-if="accountList[index*3]">
                    <div class="account-card">
                      <div class="account-index num">{{formatIndex(index*3 + 1)}}</div>
                      <div :class="['account-status', accountList[index*3].acctStat !== '00' ? 'error' : '']">{{$lookup.convertKey('ACCT_STAT',accountList[index*3].acctStat)}}</div>
                      <p class="account-num num">{{formatAccountNum(accountList[index*3].acctNo)}}</p>
                      <p class="account-name f3">{{accountList[index*3].openOrgNm}}</p>
                      <p class="account-total f5">余额：￥<span class="num">{{$util.formatMoney(accountList[index*3].depBal)}}</span>元</p>
                      <!-- <p class="account-type">{{$lookup.convertKey('ACCT_CD',accountList[index*3].acctPropCd)}}</p> -->
                      <div class="account-btn" @click="custRunAccountFn(accountList[index*3].acctNo)">查看交易记录</div>
                    </div>
                  </el-col>
                  <el-col :span="8" v-if="accountList[index*3 + 1]">
                    <div class="account-card">
                      <div class="account-index num">{{formatIndex(index*3 + 2)}}</div>
                      <div :class="['account-status', accountList[index*3 + 1].acctStat !== '00' ? 'error' : '']">{{$lookup.convertKey('ACCT_STAT',accountList[index*3 + 1].acctStat)}}</div>
                      <p class="account-num num">{{formatAccountNum(accountList[index*3 + 1].acctNo)}}</p>
                      <p class="account-name f3">{{accountList[index*3 + 1].openOrgNm}}</p>
                      <p class="account-total f5">余额：￥<span class="num">{{$util.formatMoney(accountList[index*3 + 1].depBal)}}</span>元</p>
                      <!-- <p class="account-type">{{$lookup.convertKey('ACCT_CD',accountList[index*3 + 1].acctPropCd)}}</p> -->
                      <div class="account-btn" @click="custRunAccountFn(accountList[index*3 + 1].acctNo)">查看交易记录</div>
                    </div>
                  </el-col>
                  <el-col :span="8" v-if="accountList[index*3 + 2]">
                    <div class="account-card">
                      <div class="account-index num">{{formatIndex(index*3 + 3)}}</div>
                      <div :class="['account-status', accountList[index*3 + 2].acctStat !== '00' ? 'error' : '']">{{$lookup.convertKey('ACCT_STAT',accountList[index*3 + 2].acctStat)}}</div>
                      <p class="account-num num">{{formatAccountNum(accountList[index*3 + 2].acctNo)}}</p>
                      <p class="account-name f3">{{accountList[index*3 + 2].openOrgNm}}</p>
                      <p class="account-total f5">余额：￥<span class="num">{{$util.formatMoney(accountList[index*3 + 2].depBal)}}</span>元</p>
                      <!-- <p class="account-type">{{$lookup.convertKey('ACCT_CD',accountList[index*3 + 2].acctPropCd)}}</p> -->
                      <div class="account-btn" @click="custRunAccountFn(accountList[index*3 + 2].acctNo)">查看交易记录</div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-carousel-item>
          </el-carousel>
          <Empty v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as echarts from "echarts";
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import QuotaCard from "./components/QuotaCard/index.vue";
import TrendChart from "./components/TrendChart/index.vue";
import * as customerApi from "@/api/customer";
import { CustomerModule } from '@/store/modules/customer'
import moment from 'moment'

@Component({
  name: "CustView",
  components: {
    QuotaCard,
    TrendChart,
  },
})
export default class extends Vue {
  @Prop() private go!: Function;
  private width: number = window.screen.width;
  private crmCustId = this.$route.query.crmCustId as string;
  private baseInfo = {};
  private accountList = [];
  private accountTotal = 0;
  private creditInfo = {};
  private showMoreTag = false;
  private showToggleTag = false;
  private originTagsHeight = 0;
  private tagList = [];
  private rateInfo = {};

  private navList = [
    { key: "1", value: "客户概况" },
    { key: "2", value: "基本信息" },
    { key: "3", value: "存款信息" },
    { key: "4", value: "授信信息" },
    { key: "5", value: "FTP利润" },
    { key: "6", value: "中收信息" },
  ];
  private activeNav = "1";

  private cardData = [
    {
      name: "存款余额",
      total: "depBal",
      lastD: "depBalLastD",
      lastM: "depBalLastM",
      lastY: "depBalLastY",
      isAmount: true,
    },
    {
      name: "存款日均",
      total: "depBalAvg",
      lastD: "depBalAvgLastD",
      lastM: "depBalAvgLastM",
      lastY: "depBalAvgLastY",
      isAmount: true,
    },
    {
      name: "信贷余额",
      total: "xdLoanBal",
      lastD: "xdLoanBalLastDGr",
      lastM: "xdLoanBalLastMGr",
      lastY: "xdLoanBalLastYGr",
      isAmount: true,
    },
    {
      name: "贷款余额",
      total: "loanBal",
      lastD: "loanBalLastD",
      lastM: "loanBalLastM",
      lastY: "loanBalLastY",
      isAmount: true,
    },
    { name: "EVA", total: "eva", hideLast: true, isAmount: true, height: '120px' },
    { name: "RAROC", total: "raroc", hideLast: true, isAmount: false, height: '120px', unit: '%' },
    { name: "业务利润", total: "profCtr", hideLast: true, isAmount: true },
    { name: "FTP利润", total: "ftpProf", hideLast: true, isAmount: true },
    { name: "中间业务收入", total: "imdeIncom", hideLast: true, isAmount: true },
  ];

  private trendOptions = {
    name: "存款趋势图",
    xKey: "etlDate",
    yKey: "depBal",
    color: "#39A9FF",
    url: ["/api/acrmtrend/queryOrgDepD", "/api/acrmtrend/queryOrgDepM"],
  };


  @Watch('theme')
  onThemeChange() {
    this.renderPieChart("exposureLine", ["#EFEFEF", (this as any).theme], { total: 'crdtExpoAmt', usedAmt: 'uCrdtExpoAmt' });
  }

  created() {
    this.getEnterpriseBaseInfo();
    this.getTargetInfo();
    (this as any).$lookup.reg('ACCT_STAT,ACCT_CD', () => {
      this.getAccountInfoList();
    })
  }

  async mounted() {
    let res = await this.getCustCreditInfo();
    this.creditInfo = res.data?.[0] || {};
    this.$nextTick(() => {
      this.renderPieChart("creditLine", ["#EFEFEF", "#007EFF"], { total: 'crdtAmt', usedAmt: 'usedCrdtAmt' });
      this.renderPieChart("exposureLine", ["#EFEFEF", (this as any).theme], { total: 'crdtExpoAmt', usedAmt: 'uCrdtExpoAmt' });
    });
    this.getCustTag();
    this.getDepoistTrendByDay();
  }

  getDepoistTrendByDay() {
    customerApi.getDepoistTrendByDay(this.crmCustId).then(res => {
      this.rateInfo = res?.data?.rateInfo?.[0] || {}
    })
  }

  calcTagHeight () {
    let tagContainer:any = document.querySelector('.customer-tags-container');
    let tagFixed:any = document.querySelector('.customer-tag-fixed');
    let tags:any = document.querySelector('.customer-tags');
    this.originTagsHeight = tags?.clientHeight;
    if(tags?.clientHeight > tagContainer?.clientHeight ) {
      this.showToggleTag = true;
      tagContainer.style.height = '65px';
      tagFixed.style.height = '65px';
      tags.style.height = '56px';
    } else {
      this.showToggleTag = false;
      tagFixed.style.height = tags?.clientHeight + 10 + 'px';
      tagContainer.style.height =  tags?.clientHeight + 10 + 'px';
    }
  }

  toggleTagFn () {
    this.showMoreTag = !this.showMoreTag;
    let tagFixed:any = document.querySelector('.customer-tag-fixed');
    let tags:any = document.querySelector('.customer-tags');
    if(this.showMoreTag) {
      tagFixed.style.height = this.originTagsHeight + 12 + 'px';
      tagFixed.style.boxShadow = '0px 3px 6px rgba(0, 0, 0, 0.16)';
      tags.style.height = this.originTagsHeight + 'px';
    } else {
      tagFixed.style.height = '68px';
      tags.style.height = '56px';
      tagFixed.style.boxShadow = 'none';
    }
  }

  // 查询客户标签
  getCustTag () {
    let params = {
      condition: JSON.stringify({
        crmCustId: this.$route.query.crmCustId
      }),
      page: 1,
      size: 100
    }
    customerApi.crmquerycust(params).then(res => {
      this.tagList = res.data;
      this.$nextTick(() => {
        this.calcTagHeight();
      });
    })
  }

  formatIndex(index: number) {
    if(index < 10) {
      return '0' + index;
    }
    return index;
  }

  formatAccountNum(num: any) {
    return (num + '').replace(/\s/g,"").replace(/(.{4})/g, "$1 ");
  }

  navClickFn(item: any) {
    this.activeNav = item.key;
  }

  //企业基本信息查询
  getEnterpriseBaseInfo() {
    customerApi.getEnterpriseBaseInfo(this.crmCustId).then((res) => {
      this.baseInfo = res.data?.[0] || {};
    });
  }

  // 指标展示层
  getTargetInfo() {
    customerApi.getTargetInfo(this.crmCustId).then(res => {
      if(res.data && res.data.length) {
        let data = res.data[0]
         this.cardData = this.cardData.map((item: any) => {
          return {
            ...item,
            total: data[item.total] || 0,
            lastD: data[item.lastD] || 0,
            lastM: data[item.lastM] || 0,
            lastY: data[item.lastY] || 0,
          }
        });
      }
    });
  }

  //账户信息卡片式概况
  getAccountInfoList() {
    customerApi.getAccountInfoList({
      page: 1,
      size: 50,
      condition: JSON.stringify({
        crmCustId: this.crmCustId
      })
    }).then((res: any) => {
      this.accountList = res.data;
      this.accountTotal = res.total;
    });
  }

  moreFn () {
    this.go(2, '2');
  }

  //客户授信信息查询
  async getCustCreditInfo() {
    return customerApi.getCustCreditInfo(this.crmCustId)
  }


  // 查看交易流水
  custRunAccountFn(acctNo: string) {
    this.$router.push({ path: '/custInfo/custRunAccount/' + acctNo , query: { 
      acctNo, 
      crmCustId: this.crmCustId, 
      title: '交易流水-' + acctNo
    }})
  }

  renderPieChart(id: string, color: string[], keyObj: any) {
    let chart = echarts.init(
      document.getElementById(id) as HTMLElement);
    chart.setOption({
      color: color,
      tooltip: {
        trigger: "item",
        formatter: (data:any) => {
          return data.name + '：' + (this as any).$util.formatMoney( data.value / 10000 ) + '万元'
        }
      },
      legend: {
        icon: "rect",
        bottom: 20,
        left: "center",
        data: ["已使用"],
      },
      series: [
        {
          type: "pie",
          center: ["50%", "45%"],
          radius: ["30%", "45%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "center",
            formatter: (data: any) => {
              return (this as any).$util.toFixed((((this.creditInfo as any)[keyObj.usedAmt] / (this.creditInfo as any)[keyObj.total]) || 0) * 100) + '%'
            },
            fontSize: 14,
            backgroundColor: "#fff",
            fontFamily: 'Times New Roman'
          },
          data: [
            { value: ((this.creditInfo as any)[keyObj.total] || 0) - ((this.creditInfo as any)[keyObj.usedAmt] || 0), name: "未使用" },
            { value: (this.creditInfo as any)[keyObj.usedAmt] || '', name: "已使用" },
          ],
        },
      ],
    });
  }
}
</script>

<style lang="scss" scoped>
  .custProfile-container {
    .custProfile-left {
      .custProfile-left-c {
        margin-left: 16px;
        width: 360px;
        height: 480px;
        background: #fff;
        box-shadow: 0px 3px 6px  rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        .title{
          padding: 16px;
          border-bottom: 1px solid #A8A8A8;
          span{
            display: inline-block;
            width: 280px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 20px;
            margin-left: 8px;
            font-weight: bold;
          }
          span, img {
            display: inline-block;
            vertical-align: middle;
          }
        }
        .customer-tags-container {
          height: 56px;
          position: relative;
          .customer-tag-fixed {
            width: 100%;
            overflow: hidden;
            background: #fff;
            position: absolute;
            top: 0;
            right: 0;
            transition: all .3s;
          }
          .customer-tags {
            transition: all .3s;
            padding: 0 16px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            .customer-tag {
              margin: 10px 10px 0 0;
              background: rgba(244, 122, 40, 0.1);
              border-radius: 2px;
              color:#F47A28;
              font-size: 12px;
              padding: 2px 5px;
            }
          }
        }

        .customer-arrow {
          height: 10px;
          text-align: center;
          cursor: pointer;
          .iconfont {
            position: relative;
            top: -3px;
            transform: scale(0.5);
            display: inline-block;
          }
        }
        
        .custProfile-left-b {
          padding: 0px 16px 32px;
        }
        .base-info {
          padding: 10px;
          border: 1px solid #D8D8D8;
          background: #F4F4F4;
          p {
            line-height: 1.8;
          }
        }
        .date-card {
          margin-top: 10px;
          .date-card__item{
            background: #F4F4F4;
            border: 1px solid #D8D8D8;
            padding: 10px;
            text-align: center;
            p:nth-child(1) {
              color: #333;
              margin-bottom: 10px;
            }
            p:nth-child(2) {
              font-size: 18px;
            }
          }
        }
        .rela-person {
          li{
            margin-top: 10px;
            padding: 10px 16px;
            background: #F4F4F4;
            border: 1px solid #D8D8D8;
            .iconfont {
              margin-right: 5px;
            }
            .iconfont:nth-of-type(2) {
              margin-left: 40px;
            }
          }
        }
        .address {
          margin-top: 10px;
          .address-title {
            margin-bottom: 10px;
            .iconfont {
              float: left;
              margin-top: 2px;
            }
            div {
              line-height: 1.5;
              color: #333;
              margin-left: 27px;
            }
          }
        }
      }
    }
    .custProfile-right {
      margin-left: 16px;
      width: calc(100% - 392px);
      .seciton-right {
        .rate-card{
          padding: 34px 16px 0;
          height: 116px;
          background: #fff;
          box-shadow: 0px 3px 6px  rgba(0, 0, 0, 0.2);
          border-radius: 5px;
          img {
            float: left;
            width: 38px;
            height: 40px;
          }
          .rate-card__content {
            margin-left: 56px;
          }
          .percent{
            line-height: 1;
            font-size: 20px;
            margin-top: 10px;
          }
          .desc {
            line-height: 1;
            font-weight: bold;
          }
          &+.rate-card {
            margin-top: 16px;
          }

        }
      }
      .cust-account {
        padding: 0 0 16px;
        background: #FFFFFF;
        box-shadow: 0px 3px 6px  rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        .cust-account__title {
          position: relative;
          padding: 16px 16px 12px;
          border-bottom: 1px solid #A8A8A8;
          .iconfont { margin-right: 8px;}
          span{
            font-weight: bold;
          }
          .view-more {
            top: 20px;
          }
        }
        .cust-account__content {
          // padding: 0 16px;
          margin-top: 16px;
          .account-card {
            // width: 392px;
            padding: 36px 20px 30px 37px;
            height: 200px;
            border-radius: 5px;
            box-shadow: 0px 3px 10px 1px rgba(0, 92, 187, 0.3);
            // background: url("../../../../assets/images/common/log3.png") no-repeat 95% center  / 57px 57px;
            position: relative;
            .account-index {
              position: absolute;
              top: 0;
              left: 0px;
              width: 35px;
              height: 35px;
              line-height: 24px;
              color: #fff;
              padding-left: 3px;
              font-size: 12px;
              background: url('../../../../assets/images/customer/arrow.png') no-repeat center;
            }
            .account-status {
              position: absolute;
              top: 9px;
              right: 20px;
              padding: 4px 8px;
              color: #0FCB51;
                background: rgba(15, 203, 81, .1);
              &.error {
                color: #F14922;
                background: rgba(241, 73, 34, .1);
                border-radius: 2px;
              }
            }
            .account-total {
              margin-bottom: 30px;
            }
            .account-num {
              font-weight: bold;
              letter-spacing: 4px;
              font-size: 20px;
            }
            .account-name {
              margin: 21px 0 4px;
            }
            .account-btn {
              cursor: pointer;
              position: absolute;
              bottom: 20px;
              right: 20px;
              padding: 8px 14px;
              background: #007EFF;
              color: #fff;
              border-radius: 5px;
            }
          }
        }
      }
    }
    .cust-credit {
      height: 438px;
      margin: 16px 0 0 16px;
      padding: 0 0 16px;
      background: #FFFFFF;
      box-shadow: 0px 3px 6px  rgba(0, 0, 0, 0.2);
      border-radius: 5px;
      .cust-credit__title {
        padding: 16px 16px 12px;
        border-bottom: 1px solid #A8A8A8;
        span{
          margin-left: 8px;
          font-weight: bold;
        }
      }
      .cust-credit__content {
        padding: 0 16px;
        .credit-card {
          margin-top: 16px;
          position: relative;
          border: 1px solid #BFBFBF;
          height: 130px;
          .credit-card-l {
            padding: 10px 0 0 16px;
            .subtitle {
              margin-bottom: 2px;
            }
            .total {
              font-size: 20px;
              .unit {
                font-size: 12px;
                margin-left: 10px;
              }
            }
          }
          .credit-card-r {
            width: 200px;
            position: absolute;
            top: -25px;
            right: -40px;
          }
        }

      }
    }
  }

  @media screen and (max-width: 1680px) {
    .custProfile-container {
      .custProfile-left {
        .custProfile-left-c {
          margin-left: 12px;
          height: 450px;
        }
      }
      .cust-credit {
        height: 452px;
        margin: 12px 0 0 12px;
      }
      .custProfile-right {
        margin-left: 12px;
        width: calc(100% - 384px);
      }
    }
  }



</style>
