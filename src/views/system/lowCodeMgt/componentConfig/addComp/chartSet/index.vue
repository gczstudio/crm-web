<template>
  <el-row>
    <el-col :span="4">
      <div class="data-section">
        <div style="padding: 0 16px;margin-bottom: 10px;">
          <div class="data-title">数据模型</div>
          <yu-xform-item-part placeholder="请选择" ctype="select" data-code="YES_NO"></yu-xform-item-part>
          <yu-xform-item-part placeholder="请输入维度/指标" ctype="input" suffix-icon="el-icon-search" ></yu-xform-item-part>
        </div>
        <CheckboxList title="维度项" v-model="dimension" :data="dimensionOptions" height="calc(50% - 51px)" />
        <CheckboxList title="指标" v-model="quota" :data="quotaOptions" height="calc(50% - 51px)" />
      </div>
    </el-col>
    <el-col :span="20">
      <div class="config-section">
        <div class="config-section__title">配置区域</div>
        <el-row>
          <el-col :span="20">
            <div class="center-section">
              <charts type="BasicLineChart" :chart-data="chartData" height="5rem"/>
            </div>
          </el-col>
          <el-col :span="4">
              <common-section title="图表切换" style="height: 1.6rem">
                <ul class="chart-type">
                  <li class="chart-type__item" v-for="item in chartTypes" :key="item.name"><img :title="item.name" :src="require(`@/assets/images/lowCode/chartType/${item.disabled ? item.greyIcon : item.icon}.png`)" alt=""></li>
                </ul>
              </common-section>
              <common-section title="查询条件" style="height: 1.8rem">222</common-section>
              <common-section title="图表数据过滤条件" style="height: calc(100% - 3.4rem)">222</common-section>
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


@Component({
  name: 'ChartSet',
  components: {
    CheckboxList,
    CommonSection
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
      height: calc(100% - 36px);
      &>.el-col{
        height: 100%;
      }
    }
  }

  .center-section {
    height: 100%;
    border: 1px solid #D8D8D8;
    border-bottom: none;
    border-left: none;
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
  
</style>
