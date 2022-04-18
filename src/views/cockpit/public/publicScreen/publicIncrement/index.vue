<template>
  <div class="publicIncrement-component">
    <ul class="tabs clearfix">
      <li :class="`tabs-item fl ${item.key === activeKey ? 'active' : ''}`" v-for="item in tabs" :key="item.key" @click="clickFn(item.key)">{{item.name}}</li>
    </ul>
    <div ref="chartRef" style="widht: 100%; height: 220px" @mouseenter="mouseenter" @mouseleave="mouseleave"></div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch, Inject } from "vue-property-decorator";
import * as echarts from 'echarts'
import * as screenApi  from '@/api/screen'
import { ScreenModule } from '@/store/modules/screen'
@Component({
  name: "PublicIncrement"
})
export default class extends Vue {
  @Inject() readonly screenInstance!: any;
  @Ref('chartRef') chartRef: any;
  private tabs = [
    { key: 1, name: '对公存款余额增量' },
    { key: 2, name: '对公存款日均增量' },
    { key: 3, name: '对公贷款余额增量' }
  ]
  private activeKey = 1
  private data = []
  private chart:any = null

  private timer:any = null

  private balIncrData = null
  private depBalAvgIncData = null
  private loanBalIncData = null

  get activeOrg() {
    return ScreenModule.activeOrg
  }

  get activeMap() {
    return ScreenModule.activeMap
  }

  get wuhanOrgNms():Array<string> {
    return ScreenModule.wuhanOrgNms
  }

  get uniqueKey() {
    return ScreenModule.uniqueKey
  }

  @Watch('uniqueKey')
  onChangeUniqueKey() {
    this.activeKey ++ 
    if(this.activeKey > 3) {
      this.activeKey = 1
    }
    this.clickFn(this.activeKey)
  }

  @Watch('activeOrg')
  onActiveOrgChange(val: any) {
    this.orgOrMapChange()
  }

  @Watch('activeMap')
  onActiveMapChange(val: any) {
    this.orgOrMapChange()
  }

  mounted() {
    this.queryDepBal()
  }

  mouseenter() {
    this.screenInstance.stopAutoSwitch()
  }

  mouseleave() {
    this.screenInstance.startAutoSwitch()
  }

  // 机构或者地图变化时
  orgOrMapChange() {
    let keys = ['balIncr', 'depBalAvgInc', 'loanBalInc']
    let curKey = keys[this.activeKey-1], data = (this as any)[`${curKey}Data`] || []
    this.updateChart(data, curKey)
  }

  // 对公存款余额增量
  queryDepBal() {
    if(this.balIncrData) {
      this.renderChart(this.balIncrData, 'balIncr')
      return
    }
    screenApi.queryDepBal({
      page: 1,
      size: 50,
      condition: JSON.stringify({
        busiType: this.screenInstance.busiLine,
        incrType:3,
        sortType:1
      })
    }).then((res: any) => {
      this.balIncrData = res.data;
      this.renderChart(res.data, 'balIncr')
    })
  }

  // 对公存款日均增量
  queryDepAvg() {
    if(this.depBalAvgIncData) {
      this.renderChart(this.depBalAvgIncData, 'depBalAvgInc')
      return
    }
    screenApi.queryDepAvg({
      page: 1,
      size: 50,
      condition: JSON.stringify({
        busiType: this.screenInstance.busiLine,
        incrType:3,
        sortType:1
      })
    }).then((res: any) => {
      this.depBalAvgIncData = res.data;
      this.renderChart(res.data, 'depBalAvgInc')
    })
  }

  // 对公贷款余额增量
  queryLoan() {
    if(this.loanBalIncData) {
      this.renderChart(this.loanBalIncData, 'loanBalInc')
      return
    }
    screenApi.queryLoan({
      page: 1,
      size: 50,
      condition: JSON.stringify({
        busiType: this.screenInstance.busiLine,
        incrType:3,
        sortType:1
      })
    }).then((res: any) => {
      this.loanBalIncData = res.data;
      this.renderChart(res.data, 'loanBalInc')
    })
  }

  clickFn(key: number) {
    this.activeKey = key;
    if(key === 1) {
      this.queryDepBal();
    } else if(key === 2) {
      this.queryDepAvg();
    } else {
      this.queryLoan();
    }
  }

  getColor(data: any) {
    return (params:any) => {
      const { dataIndex, name } = params;
      let curOrgNm = data.find((item: any) => item.orgId === this.activeOrg)?.orgNm;
      if(name === curOrgNm) {
          return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#FFEE7E',
            },
            {
              offset: 1,
              color: '#FFBA19',
            },
          ])
      }

      if(dataIndex<3) {
          return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(247, 82, 82, 1)',
            },
            {
              offset: 1,
              color: 'rgba(255, 195, 198, 1)',
            },
          ])
      }
      if(dataIndex>=31) {
        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(30, 255, 141, 1)',
          },
          {
            offset: 1,
            color: 'rgba(201, 255, 228, 1)',
          },
        ])
      }

      return  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
            offset: 0,
            color: 'rgba(25, 149, 255, 1)',
        },
        {
            offset: 1,
            color: 'rgba(145, 202, 255, 1)',
        },
      ])
    }
  }
 
  renderChart(data: any, key: string) {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
    this.chart = echarts.init(this.chartRef)
    let xData:any = [], data1:any = []
    let curIndex = -1;
    data.forEach((item: any, index: number) => {
      if(item.orgId === this.activeOrg) {
        curIndex = index
      }
      xData.push(item.orgNm)
      data1.push(this.$util.formatMoney(item[key] / 100000000))
    })

    let option = {
        tooltip: {
          padding: 0,
          borderWidth: 0,
          backgroundColor: 'transparent',
          formatter: (data: any) => {
            return `<div class="chart-tooltip">
              <p>${data.seriesName}</p>
              <p>${data.name}：<span class="amount num">${(this as any).$util.toFixed(data.value)}</span><span class="unit">亿元</span></p>
            </div>`
          }
        },
        grid: {
          top: 20,
          right: 20,
          bottom: 80,
          left: 40
        },
        xAxis: {
          triggerEvent: true,
          data: xData,
          axisLine: {
            show: true, //隐藏X轴轴线
            lineStyle: {
              color: '#162B5F',
            },
          },
          axisTick: {
            show: false, //隐藏X轴刻度
          },
          axisLabel: {
            show: true,
            fontSize: 12,
            rotate: 30,
            interval: 0,
            textStyle: {
              color: '#FFF', //X轴文字颜色
            },
          },
        },
        yAxis: [
          {
            type: 'value',
            gridIndex: 0,
            min: parseInt((Math.min.apply(null, data1 as any)) as any),
            max: parseInt((Math.max.apply(null, data1 as any)) as any),
            splitLine: {
              show: true,
              lineStyle: {
                color: '#162B5F',
                width: 1,
              },
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              fontSize: 12,
              textStyle: {
                color: 'rgba(68, 240, 255, .8)'
              },
            },
          },
        ],
        series: [
          {
            // 值
            name: this.tabs.find((item: any)=> item.key === this.activeKey)?.name,
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              color: this.getColor(data)
            },
            data: data1,
            z: 10,
            zlevel: 2
          },
          {
            // 值分隔
            name: this.tabs.find((item: any)=> item.key === this.activeKey)?.name,
            type: 'pictorialBar',
            itemStyle: {
              normal: {
                color: '#0F375F',
              },
            },
            symbolRepeat: 'fixed',
            symbolMargin: 3,
            symbol: 'rect',
            symbolClip: true,
            symbolSize: [10, 3],
            symbolPosition: 'start',
            symbolOffset: [0, -1],
            // symbolBoundingData: this.total,
            data: data1,
            width: 25,
            z: 0,
            zlevel: 3
          }
        ],
    };
    this.chart.setOption(option)

    //监听点击
    this.chart.on('click', (params: any) => {
      if(params.name) return;
      let curOrgId = '';
      data.forEach((item: any, index: number) => {
        if(item.orgNm ===  params.value) {
          curOrgId = item.orgId;
          this.chart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,  // 第几条series
            dataIndex: index    //第几条tooltip
          })
        }
      })

      ScreenModule.SET_INCREMENT_STATUS('click')
      ScreenModule.SET_ACTIVE_ORG(curOrgId)
      if(this.wuhanOrgNms.includes(curOrgId)) {
        ScreenModule.SET_ACTIVE_MAP('wuhan')
      } else {
        ScreenModule.SET_ACTIVE_MAP('hubei')
      }
    })

    setTimeout(() =>{
      this.chart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,  // 第几条series
        dataIndex: curIndex    //第几条tooltip
      })
    })

  }

  updateChart(data: any, key: string) {
    let xData:any = [], data1:any = []
    let curIndex = -1;
    data.forEach((item: any, index: number) => {
      if(item.orgId === this.activeOrg) {
        curIndex = index
      }
      xData.push(item.orgNm)
      data1.push(this.$util.formatMoney(item[key] / 100000000))
    })
    let userOptions = this.chart.getOption()
    let name = this.tabs.find((item: any)=> item.key === this.activeKey)?.name
    userOptions.xAxis.data = xData
    userOptions.yAxis[0].min = parseInt((Math.min.apply(null, data1 as any)) as any)
    userOptions.yAxis[0].max = parseInt((Math.max.apply(null, data1 as any)) as any)
    userOptions.series[0].itemStyle.color = this.getColor(data)
    userOptions.series[0].data = data1
    userOptions.series[0].name = name
    userOptions.series[1].data = data1
    userOptions.series[1].name = name
    this.chart.clear()
    this.chart.setOption(userOptions)
    setTimeout(() =>{
      this.chart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,  // 第几条series
        dataIndex: curIndex    //第几条tooltip
      })
    })
  }



}
</script>

<style lang="scss" scoped>
  .publicIncrement-component {
    margin: 0 auto;
    padding: 16px;
    width: 1100px;
    height: 284px;
    background-color: rgba(0, 84, 112, 0.2);
    .tabs {
      .tabs-item {
        cursor: pointer;
        margin-right: 10px;
        width: 202px;
        height: 40px;
        line-height: 40px;
        background: url('../../../../../assets/images/screen/btn.png') center no-repeat;
        color: #00B7EE;
        text-align: center;
        letter-spacing: 3px;
        &.active {
          color: #fff;
        }
      }
    }
  }
</style>
