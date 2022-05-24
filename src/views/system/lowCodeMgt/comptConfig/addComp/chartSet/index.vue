<template>
  <div class="chart-set-container">
    <div class="data-section">
      <div style="padding: 0 16px; margin-bottom: 10px">
        <div class="data-title">数据模型</div>
        <yu-xform-item-part placeholder="请选择" ctype="select" v-model="dsId" :options="dsList" @change="dsChangeFn"></yu-xform-item-part>
        <yu-xform-item-part
          placeholder="请输入维度/指标"
          ctype="input"
          v-model="fieldName"
          suffix-icon="el-icon-search"
          clearable
          @clear="dsChangeFn"
          v-debounce="[fieldNameChangeFn, 'input', 300]"
        ></yu-xform-item-part>
      </div>
      <CheckboxList title="维度项" v-model="dimension" :data="dimensionOptions" height="calc(50% - 51px)" @change="dimensionChange" />
      <CheckboxList title="指标" v-model="quota" :data="quotaOptions" height="calc(50% - 51px)" @change="quotaChange" />
    </div>
    <div class="config-section">
      <div class="config-section__title">配置区域</div>
      <div class="config-section__cont">
        <div class="center-section">
          <charts :type="activeChartType" :chart-data="chartData" :key="activeChartType" />
        </div>
        <div class="right-section">
          <common-section title="图表切换">
            <ul class="chart-type">
              <li class="chart-type__item" v-for="item in chartTypes" :key="item.name">
                <div :class="{ 'chart-type__boder': true, active: item.type === activeChartType }" @click="selectChartType(item)">
                  <i :class="`iconfont ${item.icon} ${item.disabled ? '' : 'light'}`"></i>
                </div>
              </li>
            </ul>
          </common-section>
          <common-section title="查询条件" style="height: 100px">222</common-section>
          <common-section title="图表数据过滤条件" style="height: calc(100% - 245px)">222</common-section>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";
import { backend } from "@/config";
import { CreateElement } from "vue";
import CheckboxList from "../components/CheckboxList.vue";
import CommonSection from "../components/CommonSection.vue";
import { queryDsInfo, queryDsField, queryDsData } from "@/api/lowCode";
export interface IDsInfo {
  id: string;
  dsName: any;
}

export interface Options {
  key: string;
  value: any;
}

@Component({
  name: "ChartSet",
  components: {
    CheckboxList,
    CommonSection,
  },
})
export default class extends Vue {
  @Prop() private instance!: any;
  @Prop() private data!: any;
  @Ref("compFormRef") compFormRef: any;
  private activeName = "1";
  // 数据模型
  private dsId = "";
  private dsList = [];
  private fieldName = "";
  // 数据集字段信息
  private dsField = [];
  // 数据集字段数据
  private dsData = [];
  // 维度项
  private dimension = [];
  private dimensionOptions = [];
  // 指标项
  private quota = [];
  private quotaOptions = [];

  // 图表类型
  private activeChartType = "TableChart";
  private chartTypes = [
    { name: "表格", type: "TableChart", icon: "icon-biaoge", disabled: true },
    { name: "基本折线图", type: "BasicLineChart", icon: "icon-zhexiantu", disabled: true },
    { name: "基础柱状图", type: "BasicBarChart", icon: "icon-zhuzhuangtu", disabled: true },
    { name: "基础饼图", type: "BasicPieChart", icon: "icon-bingtu", disabled: true },
    { name: "环形图", type: "DoughnutChart", icon: "icon-huanxingtusvg", disabled: true },
    { name: "雷达图", type: "BasicRadarChart", icon: "icon-leidatu", disabled: true },
    { name: "K线图", type: "BasicCandlestick", icon: "icon-kxiantu", disabled: true },
    { name: "漏斗图", type: "FunnelChart", icon: "icon-loudoutu", disabled: true },
    { name: "基础仪表盘", type: "BasicGaugechart", icon: "icon-yibiaopan", disabled: true },
  ];

  private chartData = {
    title: "",
    xAxis: [],
    yAxis: [],
    data: [],
  };

  private addChartCompVisible = false;
  private compForm = {};

  // 编辑时的回显逻辑
  @Watch("data", { immediate: true })
  onDataChange(data: any) {
    const { title, xAxis, yAxis, dsId, compName } = data;
    this.chartData = {
      title,
      xAxis,
      yAxis,
      data: [],
    };
    this.dsId = dsId;
    this.activeChartType = compName;
    this.dimension = xAxis ? xAxis.map((item: Options) => item.key) : [];
    this.quota = yAxis ? yAxis.map((item: Options) => item.key) : [];
    dsId && this.dsChangeFn();
  }

  mounted() {
    this.getDsInfo();
  }

  getConfig() {
    const { title, xAxis, yAxis } = this.chartData;
    return {
      dsId: this.dsId,
      title,
      xAxis,
      yAxis,
      compName: this.activeChartType,
    };
  }

  // 查询数据模型列表
  getDsInfo() {
    queryDsInfo().then((res) => {
      this.dsList = res.data.map((item: IDsInfo) => {
        return {
          key: item.id,
          value: item.dsName,
        };
      });
    });
  }

  // 数据模型变化
  dsChangeFn() {
    this.getDsField();
    this.getDsData();
  }

  // 维度/指标名称搜索
  fieldNameChangeFn(val: string) {
    this.getDsField();
  }

  // 请求数据模型信息
  getDsField() {
    queryDsField({
      condition: JSON.stringify({
        dsId: this.dsId,
        fieldName: this.fieldName,
      }),
    }).then((res) => {
      this.dsField = res.data.map((item: any) => {
        return {
          ...item,
          key: this.$util.dashToCamel(item.fieldKey),
          value: item.fieldName,
        };
      });
      this.dimensionOptions = this.dsField.filter((item: any) => item.fieldType === "01");
      this.quotaOptions = this.dsField.filter((item: any) => item.fieldType !== "01");
    });
  }

  // 请求数据模型数据
  getDsData() {
    queryDsData({
      condition: JSON.stringify({
        dsId: this.dsId,
      }),
    }).then((res) => {
      this.dsData = res.data;
      this.chartData.data = res.data;
    });
  }

  // 维度变化
  dimensionChange(data: any) {
    let selectDimension = this.dimensionOptions.filter((item: Options) => data.includes(item.key));
    this.chartData.xAxis = selectDimension;
  }

  // 指标变化
  quotaChange(data: any) {
    let selectQuota = this.quotaOptions.filter((item: Options) => data.includes(item.key));
    this.chartData.yAxis = selectQuota;
  }

  // 选择图表
  selectChartType(chart: any) {
    this.activeChartType = chart.type;
  }
}
</script>

<style lang="scss" scoped>
.chart-set-container {
  height: calc(100% - 55px);
  display: flex;
  .data-section {
    flex: 0 0 230px;
    height: 100%;
    border-right: 1px solid #d8d8d8;
    .data-title {
      font-weight: bold;
    }
    .el-select,
    .el-input {
      margin-top: 10px;
    }
  }
  .config-section {
    flex: 1;
    height: 100%;
    .config-section__title {
      padding: 0 10px;
      height: 36px;
      line-height: 36px;
      background: #f7f8fa;
      color: #007eff;
    }
    .config-section__cont {
      height: calc(100% - 36px);
      display: flex;
      .center-section {
        box-sizing: border-box;
        padding: 10px;
        flex: 1;
        height: 100%;
        border: 1px solid #d8d8d8;
        border-bottom: none;
        border-left: none;
      }
      .right-section {
        flex: 0 0 200px;
        .chart-type {
          height: 100px;
          overflow-y: auto;
          background: #fbfdff;
          .chart-type__item {
            cursor: pointer;
            padding: 5px 0;
            display: inline-block;
            width: 25%;
            text-align: center;
            .chart-type__boder {
              display: inline-block;
              width: 20px;
              width: 20px;
              box-sizing: border-box;
              border: 2px solid #f7f8fa;
              &.active {
                border-color: #007eff;
              }
            }
            .iconfont {
              color: #007eff;
              &.light {
                color: #007eff;
              }
            }
          }
        }
      }
    }
  }
}
</style>
