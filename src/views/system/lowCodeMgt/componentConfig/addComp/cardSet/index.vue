<template>
  <el-row>
    <el-col :span="4">
      <div class="data-section">
        <div style="padding: 0 16px;margin-bottom: 10px;">
          <div class="data-title">数据模型</div>
          <yu-xform-item-part placeholder="请选择" ctype="select" data-code="YES_NO"></yu-xform-item-part>
          <yu-xform-item-part placeholder="请输入维度/指标" ctype="input" suffix-icon="el-icon-search" ></yu-xform-item-part>
        </div>
        <CheckboxList :multiple="false" title="指标" v-model="quota" :data="quotaOptions" height="calc(100% - 102px)"/>
      </div>
    </el-col>
    <el-col :span="20">
      <div class="config-section">
        <el-row>
          <el-col :span="12">
            <div class="config-section__title">配置区域</div>
            <div class="center-section">
              <CenterSection />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="config-section__title">预览区域</div>
            <div class="preview-section">
              <PreviewSection />
            </div>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="tsx">
import { Component, Vue, Prop, Ref, Watch } from 'vue-property-decorator'
import { backend } from '@/config'
import { CreateElement } from 'vue';
import CheckboxList from '../components/CheckboxList.vue'
import CommonSection from '../components/CommonSection.vue'

export interface Options {
  key: string,
  value: any
}

/**区域组件 */
@Component
export class CenterSection extends Vue {
  @Prop() title!: string;

  private quotaConfigList = [
    { type: 1, key: 'key1', name: '对公贷款余额'},
    { type: 2, key: 'key2', name: '比上年'},
    { type: 2, key: 'key3', name: '比上月'},
    { type: 2, key: 'key4', name: '比上日'},
  ]

  private active = 0
  
  clickFn(index:number) {
    this.active = index
  }
  // 获取箭头
  getArrow(money: number) {
    return money >= 0 ? "icon-shangsheng" : "icon-xiajiang";
  }

  render(h: CreateElement) {
    return (
      <ul class="section-wrapper">
      {
        this.quotaConfigList.map((item, index) => {
          return (
            <li key={index} class={index===this.active? 'active': ''} onClick={() => this.clickFn(index)}>
              {
                item.type == 1 && <div class="top center">
                  <img src={require("@/assets/images/theme/custom/quota/icon-quota1.png")} alt=""/>
                  <div class="total">
                    <p>对公贷款余额</p>
                    <p>
                      <span class="num">1212</span>
                      <span class="unit">亿元</span>
                    </p>
                  </div>
                </div>
              }
              {
                item.type == 2 && <div class="bottom center">
                  <p class="label">比上日<i class={["iconfont", this.getArrow(111)]}></i></p>
                  <p class="value"><span class="num">11111</span><span class="unit">亿元</span></p>
                </div>
              }
              {
                !item.key && <div class="tip">请勾选指标</div>
              }
            </li>
          )
        })
      }
      </ul>
    )
  }
}

/**预览组件 */
@Component
export class PreviewSection extends Vue {
  @Prop() title!: string;

  // 获取箭头
  getArrow(money: number) {
    return money >= 0 ? "icon-shangsheng" : "icon-xiajiang";
  }

  render(h: CreateElement) {
    return (
      <div class="section-wrapper">
        <div class="top center">
          <img src={require("@/assets/images/theme/custom/quota/icon-quota1.png")} alt=""/>
          <div class="total">
            <p>对公贷款余额</p>
            <p>
              <span class="num">1212</span>
              <span class="unit">亿元</span>
            </p>
          </div>
          <div class="bottom center">
            <el-row>
              <el-col span={8}>
                <p class="label">比上日<i class={["iconfont", this.getArrow(111)]}></i></p>
                <p class="value"><span class="num">11111</span><span class="unit">亿元</span></p>
              </el-col>
              <el-col span={8}>
                <p class="label">比上日<i class={["iconfont", this.getArrow(111)]}></i></p>
                <p class="value"><span class="num">11111</span><span class="unit">亿元</span></p>
              </el-col>
              <el-col span={8}>
                <p class="label">比上日<i class={["iconfont", this.getArrow(111)]}></i></p>
                <p class="value"><span class="num">11111</span><span class="unit">亿元</span></p>
              </el-col>
            </el-row>
           
          </div>
        </div>
      </div> 
    )
  }
}


@Component({
  name: 'ChartSet',
  components: {
    CheckboxList,
    CommonSection,
    CenterSection,
    PreviewSection
  }
})
export default class extends Vue { 
  @Prop() private instance!: any;
  @Ref('compFormRef') compFormRef: any;
  private activeName = '1'
  private modelValue = ''

  private dimension = []
  private quota = []
  
  private dimensionOptions = [
    {
      key: 'eltDate',
      value: '数据日期'
    }
  ]

  private quotaOptions = [
    {
      key: 'depBal',
      value: '对公存款余额'
    },
    {
      key: 'depBalAvg',
      value: '对公存款日均'
    },
    {
      key: 'loanBal',
      value: '对公贷款余额'
    }
  ] 



  private chartTypes = [
    { name: '基本折线图', icon: 'chart1', greyIcon: 'chart-grey1', disabled: true },
    { name: '柱线混合图', icon: 'chart2', greyIcon: 'chart-grey2', disabled: true },
    { name: '堆叠面积图', icon: 'chart3', greyIcon: 'chart-grey3', disabled: true },
    { name: '基础面积图', icon: 'chart4', greyIcon: 'chart-grey4', disabled: true },
    { name: '区间柱状图', icon: 'chart5', greyIcon: 'chart-grey5', disabled: true },
    { name: '分组柱状图', icon: 'chart6', greyIcon: 'chart-grey6', disabled: true },
    { name: '省份填充地图', icon: 'chart7', greyIcon: 'chart-grey7', disabled: true },
    { name: '环图', icon: 'chart8', greyIcon: 'chart-grey8', disabled: true },
    { name: '基础条形图', icon: 'chart9', greyIcon: 'chart-grey9', disabled: true },
    { name: '多折线条图', icon: 'chart10', greyIcon: 'chart-grey10', disabled: true },
    { name: '气泡图', icon: 'chart11', greyIcon: 'chart-grey11', disabled: true },
    { name: '表格', icon: 'chart12', greyIcon: 'chart-grey12', disabled: true },
    { name: '散点图', icon: 'chart13', greyIcon: 'chart-grey13', disabled: true },
    { name: '基础饼图', icon: 'chart14', greyIcon: 'chart-grey14', disabled: true },
    { name: '堆叠柱状图', icon: 'chart15', greyIcon: 'chart-grey15', disabled: true },
    { name: '镜像分组条形图', icon: 'chart16', greyIcon: 'chart-grey16', disabled: true },
    { name: '雷达图', icon: 'chart17', greyIcon: 'chart-grey17', disabled: true },
    { name: '基础柱状图', icon: 'chart18', greyIcon: 'chart-grey18', disabled: true },
  ]

  private chartData = {
    title: 'xxx',
    xData: [1,12,321,12,43],
    yData: [1,32,43,45,6]
  }

  private addChartCompVisible = false;
  private compForm = {}

  createFn() {
    console.log(1)
  }

  nextFn() {
    this.addChartCompVisible = true;
    this.compFormRef && this.compFormRef.resetFields()
  }

  saveCompFn() {
    console.log(1)
  }



}


</script>

<style lang="scss" scoped>
  .addChartComp-container{
    &>.el-row {
      height: calc(100% - 55px);
      &>.el-col {
        height: 100%;
      }
    }
    position: relative;
    height: calc(100vh - 100px);
    background: #FFFFFF;
    box-shadow: 0px 3px 6px  rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    .comp-btns {
      position: absolute;
      top: 10px;
      right: 16px;
    }
    .data-section {
      height: 100%;
      border-right: 1px solid #D8D8D8;
      .data-title {
        font-weight: bold;
      }
      .el-select, .el-input {
        margin-top: 10px;
      }
    }
  }

  .config-section {
    height: 100%;
    .config-section__title {
      padding: 0 10px;
      height: 36px;
      line-height: 36px;
      background: #F7F8FA;
      color: #007EFF;
    }
    &>.el-row{
      height: 100%;
      &>.el-col{
        height: 100%;
      }
    }
  }

  .center-section {
    height: calc(100% - 36px);
    overflow-y: auto;
    ::v-deep .section-wrapper{
      margin: 0 auto;
      width: 4rem;
      li {
        cursor: pointer;
        margin-top: 10px;
        position: relative;
        width: 4rem;
        height: 1.5rem;
        border: 1px solid #D8D8D8;
        .tip {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #999;
        }
        &:hover,&.active {
          border: 1px dashed #007EFF;
        }
        
      }
      .top {
        &.center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        img {
          margin-top: 8px;
          float: left;
        }
        .total {
          margin-left: 70px;
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
              color: rgba(51, 51, 51, .8);
            }
          }
        }
      }
      .bottom {
        &.center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          margin-top: 0;
        }
        color: #333;
        margin-top: 26px;
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
        .label {
          line-height: 16px;
        }
        .value {
          white-space: nowrap;
          margin-top: 8px;
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
  }

  .chart-type {
    background: #fbfdff;
    .chart-type__item {
      display: inline-block;
      width: 25%;
      text-align: center;
      img{
        width: 0.3rem
      }
    }
  }

  .preview-section {
    ::v-deep .section-wrapper {
      margin: 1rem auto 0;
      width: 5rem;
      height: 3rem;
      box-shadow: 0px 2px 10px rgba(0, 92, 187, 0.3);
      border-radius: 5px;
    }
  }



  
</style>
