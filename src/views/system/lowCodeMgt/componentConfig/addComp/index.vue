<template>
  <div class="addChartComp-container">
    <div class="comp-header">
      <el-tabs v-model="activeName">
        <el-tab-pane label="图表组件" name="1"></el-tab-pane>
        <el-tab-pane label="指标卡" name="2"></el-tab-pane>
      </el-tabs>
      <div class="comp-btns">
        <el-button class="yu-button-text" icon="el-icon-circle-close" @click="instance.hide()">取消</el-button>
        <el-button type="primary" @click="nextFn">下一步</el-button>
      </div>
    </div>
    <ChartSet v-if="activeName === '1'" />
    <CardSet v-else />
    
    <yu-dialog title="新增组件" :visible.sync="addChartCompVisible" width="500px">
      <yu-xform ref="compFormRef" :model="compForm" label-width="100px">
        <yu-xform-group :column="1">
          <yu-xform-item label="组件名称" placeholder="组件名称" name="name2" ctype="input" :rules="globalRules.requiredInput50"></yu-xform-item>
          <yu-xform-item label="目录" placeholder="目录" name="name2" ctype="yufp-org-tree" :rules="globalRules.required"></yu-xform-item>
          <yu-xform-item label="备注" placeholder="备注" name="name" ctype="input" type="textarea" :rules="globalRules.desc"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button type="primary"  @click="saveCompFn">保存</el-button>
        <el-button @click="addChartCompVisible=false">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>

<script lang="tsx">
import { Component, Vue, Prop, Ref, Watch } from 'vue-property-decorator'
import { backend } from '@/config'
import { CreateElement } from 'vue';
import ChartSet from './chartSet/index.vue'
import CardSet from './cardSet/index.vue'


export interface Options {
  key: string,
  value: any
}

@Component({
  name: 'AddChartComp',
  components: {
    ChartSet,
    CardSet
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
