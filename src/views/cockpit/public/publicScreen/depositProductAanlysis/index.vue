<template>
  <div class="depositProductAanlysis-component">
    <div ref="chartRef" style="width: 100%; height: 172px"></div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Inject, Watch } from "vue-property-decorator";
import * as echarts from 'echarts'
import * as screenApi  from '@/api/screen'
import { ScreenModule } from '@/store/modules/screen'
@Component({
  name: "DepositProductAanlysis"
})
export default class extends Vue {
  @Inject() readonly screenInstance!: any;
  @Ref('chartRef') chartRef: any;

  private timer:any = null
  private chart:any = null
  private prodData = null

  get uniqueKey() {
    return ScreenModule.uniqueKey
  }

  @Watch('uniqueKey')
  onChangeUniqueKey() {
    this.queryprod()
  }

  mounted() {
    this.queryprod()
  }

  queryprod() {
    if(this.prodData) {
      return this.renderChart(this.prodData)
    }
    screenApi.queryprod({
      condition: JSON.stringify({
        busiLine: this.screenInstance.busiLine
      })
    }).then((res: any) => {
      this.prodData = res.data[0]
      this.renderChart(res.data[0])
    })
  }

  renderChart(data: any) {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
    this.chart = echarts.init(this.chartRef)
    var options = [
      { name: '活期', key: 'hqBal'}, 
      { name: '定期', key: 'dqBal'}, 
      { name: '通知', key: 'tzBal'}, 
      { name: '保证金', key: 'bzjBal'}, 
      { name: '大额存单', key: 'daeCundBal'}, 
      { name: '其他', key: 'otherDpsBal'}
    ]
    let xData: any = [], yData: any = [], sum = 0
    options.forEach((item: any) => {
      xData.push(item.name)
      sum += data[item.key] / 100000000
      yData.push(this.$util.formatMoney(data[item.key] / 100000000))
    })

    var barWidth = 10;
    let option = {
        tooltip: {
          trigger: 'item',
          padding: 0,
          borderWidth: 0,
          backgroundColor: 'transparent',
          formatter: (data: any) => {
            if(data.color === "#01EDFB") {
              return ''
            }
            return `<div class="chart-tooltip">
              <p><span class="chart-dot" style="background:#127AE7"></span>${data.name}：<span class="amount num">${(this as any).$util.toFixed(data.value)}</span><span class="unit">亿元</span></p>
            </div>`
          }
        },
        grid: {
          top: 20,
          right: 10,
          bottom: 20,
          left: 40
        },
        xAxis: {
          data: xData,
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#034E90'
            }
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: 'rgba(255, 255, 255, .8)',
              fontSize: 12,
            }
          },
        },
        yAxis: [
          {
            splitLine: {
              show: true,
              lineStyle: {
                color: '#034E90'
              }
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#034E90'
              }
            },
            axisLabel: {
              textStyle: {
                color: 'rgba(68, 240, 255, 0.8)',
                fontSize: 10,
              }
            }
          },
          {
            splitLine: {
              show: true,
              lineStyle: {
                color: '#034E90'
              }
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#034E90'
              }
            },
            axisLabel: {
              textStyle: {
                color: 'rgba(68, 240, 255, 0.8)',
                fontSize: 10,
              }
            }
          }
        ],
        series: [
            { // 底部背景
              name: '',
              type: 'bar',
              barWidth: barWidth,
              z: 0,
              itemStyle: {
                color: '#01EDFB',
                opacity: .1,
                borderRadius: 5
              },
              animationDuration: 2000,
              animationEasing: 'cubicInOut',
              data: (new Array(yData.length)).fill(sum),
            },
            { //柱子
                name: '',
                type: 'bar',
                barWidth: barWidth,
                barGap: '-100%',
                itemStyle: { //lenged文本
                  opacity: .7,
                  color: function() {
                    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#44F0FF' // 0% 处的颜色
                    }, {
                      offset: 1,
                      color: '#127AE7' // 100% 处的颜色
                    }], false)
                  }
                },
                data: yData
            },
            { //柱子顶部圆片
                "name": "",
                "type": "pictorialBar",
                "symbolSize": [barWidth, 5],
                "symbolOffset": [0, -4],
                "z": 12,
                itemStyle: {
                    opacity: 1,
                    color: function() {
                      return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#127AE7' // 0% 处的颜色
                      }, {
                        offset: 1,
                        color: '#44F0FF' // 100% 处的颜色
                      }], false)
                    }
                },
                "symbolPosition": "end",
                animationDuration: 2000,
                animationEasing: 'cubicInOut',
                "data": yData
            },
            { //柱子底部圆片
                "name": "",
                "type": "pictorialBar",
                "symbolSize": [barWidth, 5],
                "symbolOffset": [0, 4],
                "z": 12,
                itemStyle: {
                  opacity: 1,
                  color: function() {
                    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#127AE7' // 0% 处的颜色
                    }, {
                      offset: 1,
                      color: '#44F0FF' // 100% 处的颜色
                    }], false)
                  }
                },
                animationDuration: 2000,
                animationEasing: 'cubicInOut',
                "data": yData
            }
        ]
    };
    this.chart.setOption(option)
  }

}
</script>

