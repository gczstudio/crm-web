<template>
  <div class="creditExposure-component">
    <el-row>
      <el-col :span="14">
        <ul class="panels">
          <li class="panels-item" v-for="item in creditData" :key="item.icon">
            <img :src="require(`@/assets/images/screen/${item.icon}.png`)" alt="">
            <div class="panels-cont">
              <p class="panels-title">{{item.name}}</p>
              <p><span class="panels-amount">{{item.value}}</span><span class="panels-unit">亿元</span></p>
            </div>
          </li>
        </ul>
      </el-col>
      <el-col :span="8" class="right-cont">
        <div ref="chartRef" style="widht: 100%; height: 130px"></div>
        <div class="title">敞口额度使用率</div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Inject, Watch } from "vue-property-decorator";
import * as echarts from 'echarts'
import * as screenApi  from '@/api/screen'
import { ScreenModule } from '@/store/modules/screen'
@Component({
  name: "CreditExposure"
})
export default class extends Vue {
  @Inject() readonly screenInstance!: any;
  @Ref('chartRef') chartRef: any;
  private creditData = [
    {icon: 'credit', name: '授信敞口额度', value: '54354'},
    {icon: 'used-credit', name: '已使用敞口额度', value: '54354'}
  ]

  private timer:any = null
  private chart:any = null
  private creditExposureData:any = null

  get uniqueKey() {
    return ScreenModule.uniqueKey
  }

  @Watch('uniqueKey')
  onChangeUniqueKey() {
    this.queryhead()
  }

  mounted() {
    this.queryhead()
  }

  queryhead() {
    if(this.creditExposureData) {
      return  this.renderChart(this.creditExposureData.creditExposureUseRate)
    }
    screenApi.queryhead({
      condition: JSON.stringify({
        busiLine: this.screenInstance.busiLine
      })
    }).then((res: any) => {
      this.creditExposureData = res.data[0]
      this.creditData[0].value = this.$util.formatMoney(this.creditExposureData.creditExposureAmt / 100000000)
      this.creditData[1].value = this.$util.formatMoney(this.creditExposureData.userdCreditExposureAmt / 100000000)
      this.renderChart(this.creditExposureData.creditExposureUseRate)
    })
  }

  renderChart(data: any) {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
    this.chart = echarts.init(this.chartRef)
    let value = this.$util.toFixed(data, 2);
    let option = {
        title: {
          text: '{a|' + value + '%' + '}',
          x: 'center',
          y: 'center',
          textStyle: {
            rich: {
              a: {
                fontSize: 16,
                color: '#fff',
                fontWeight:'600',
              }
            }
          }
        },
        series: [
            {
              type: 'gauge',
              radius: '80%',
              clockwise: false,
              startAngle: '90',
              endAngle: '-269.9999',
              splitNumber: 80,
              detail: {
                offsetCenter: [0, -10],
                formatter: ' '
              },
              pointer: {
                show: false
              },
              axisLine: {
                show: true,
                lineStyle: {
                    color: [
                      [0, '#2CFAFC'],
                      [ 1 - value / 100, '#67cdf4'],
                      [1, '#13355b']
                    ],
                    width: 10
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: true,
                distance: -10,
                length: 10,
                lineStyle: {
                  color: '#0B273E',
                  width: 2
                }
              },
              axisLabel: {
                show: false
              }
            },
            {
                type: 'pie',
                radius: [0, '50%'],
                // hoverAnimation: false,
                clockWise: false,
                animationDuration: 2000,
                itemStyle: {
                  normal: {
                    shadowBlur: 20,
                    shadowColor: '#000',
                    color: {
                      type: 'linear',
                      x:0,
                      y:0,
                      x2:0,
                      y2:1,
                      colorStops: [{
                        offset: 0, color: 'rgba(68, 240, 255, .6)'
                      },{
                        offset: 1, color: 'rgba(18, 122, 231, .6)'
                      }],
                      global: false
                    }
                  }
                },
                label: {
                    show: false
                },
                data: [100]
            }
        ]
    };
    this.chart.setOption(option)
  }

}
</script>

<style lang="scss" scoped>
  .creditExposure-component {
    .right-cont {
      position: relative;
      margin-left: 20px;
      top: -10px;
      .title {
        position: absolute;
        bottom: -10px;
        left: 12px;
        font-size: 14px;
        color: #fff;
      }
    }
   .panels {
     .panels-item {
       margin-top: 8px;
       padding: 8px 10px;
       background-color: rgba(8, 34, 47, .4);
        img {
          float: left;
        }
        .panels-cont {
          margin: 2px 0 0 60px;
          .panels-title {
            font-size: 14px;
            color: #fff;
            margin-bottom: 5px;
          }
          .panels-amount {
            font-size: 16px;
            color: #FFC801;
          }
          .panels-unit {
            font-size: 12px;
            color: #fff;
            margin-left: 10px;
          }
        }

     }
     
   }
  }
</style>
