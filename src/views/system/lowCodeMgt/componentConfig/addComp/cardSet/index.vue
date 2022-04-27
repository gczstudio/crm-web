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
    <el-col :span="16">
      <div class="config-section">
        <div class="config-section__title">配置区域</div>
          <div class="center-section">
            <!--卡片一-->
            <Card1 />
          </div>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="switch-section">
        <div class="switch-section__title">指标卡切换</div>
        <div class="card-box">
            <div class="card-item active" v-for="(item, index) in cardTypes" :key="item.type"><img :src="require(`@/assets/images/lowCode/card/card${index+1}.png`)" alt=""></div>
        </div>
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
import Card1 from './ components/Card1.vue'

export interface Options {
  key: string,
  value: any
}

@Component({
  name: 'ChartSet',
  components: {
    CheckboxList,
    CommonSection,
    Card1
  }
})
export default class extends Vue { 
  @Prop() private instance!: any;
  @Ref('compFormRef') compFormRef: any;
  private activeName = '1'
  private modelValue = ''

  private cardTypes = [
    { type: '1', name: '卡片一' }
  ]

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

 .switch-section {
    height: 100%;
    border-left: 1px solid #D8D8D8;
    .switch-section__title {
      padding: 0 10px;
      height: 36px;
      line-height: 36px;
      background: #fff;
      font-weight: bold;
    }
    .card-box {
      height: calc(100% - 36px);
      overflow-y: auto;
      .card-item {
        margin: 10px 10px 0;
        padding: 10px;
        border: 1px solid #ccc;
        img {
          text-align: center;
          width: 100%;
        }
        &.active{
          border: 1px solid #007EFF;
        }
      }
    }
  }


  
</style>
