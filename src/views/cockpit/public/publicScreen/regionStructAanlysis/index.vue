<template>
  <div class="regionStructAanlysis-component">
    <div class="tab">
      <ol class="clearfix">
        <li v-for="(item, index) in tabs" :key="index" :class="{ active: curTab === index }" @click="clickHandler(index)">{{ item }}</li>
      </ol>
    </div>
    <div class="legend clearfix">
      <div class="legend-item fl" v-for="item in legend" :key="item.name">
        <span class="legend-item__tag" :style="{ background: item.color }"></span>
        {{ item.name }}
      </div>
    </div>
    <!-- 结构图 -->
    <div class="pie-chart clearfix" @mouseenter="mouseenter" @mouseleave="mouseleave">
      <div class="pie-chart__item">
        <div class="pie-cont" id="pieRef1"></div>
        <div class="pie-label">对公存款余额</div>
      </div>
      <div class="pie-chart__item">
        <div class="pie-cont" id="pieRef2"></div>
        <div class="pie-label">对公贷款余额</div>
      </div>
      <div class="pie-chart__item">
        <div class="pie-cont" id="pieRef3"></div>
        <div class="pie-label">有效客户数</div>
      </div>
      <div class="pie-chart__item">
        <div class="pie-cont" id="pieRef4"></div>
        <div class="pie-label">信贷客户数</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Inject, Watch } from "vue-property-decorator";
import * as echarts from "echarts";
import * as screenApi from "@/api/screen";
import moment from "moment";
import { ScreenModule } from "@/store/modules/screen";
@Component({
  name: "RegionStructAanlysis",
})
export default class extends Vue {
  @Inject() readonly screenInstance!: any;

  private tabs = ["结构", "趋势"];
  private curTab = 0;
  private legend = [
    { name: "重庆地区", color: "#FD7289" },
    { name: "省内非武汉地区", color: "#08EACB" },
    { name: "武汉主城区", color: "#FFE012" },
    { name: "武汉开发区及新城区", color: "#027EEF" },
  ];

  private timer: any = null;

  private charts: any = {};
  private areaData = null;
  private areatrData = null;

  get uniqueKey() {
    return ScreenModule.uniqueKey;
  }

  @Watch("uniqueKey")
  onChangeUniqueKey() {
    this.curTab = this.curTab === 0 ? 1 : 0;
    this.clickHandler(this.curTab);
  }

  mounted() {
    this.queryarea();
  }

  mouseenter() {
    this.screenInstance.stopAutoSwitch();
  }

  mouseleave() {
    this.screenInstance.startAutoSwitch();
  }

  clickHandler(index: number) {
    this.curTab = index;
    this.$nextTick(() => {
      index === 0 ? this.queryarea() : this.queryareatr();
    });
  }

  // 查询区域结构分析-结构
  queryarea() {
    if (this.areaData) {
      return this.renderStruct(this.areaData);
    }
    screenApi
      .queryarea({
        condition: JSON.stringify({
          busiLine: this.screenInstance.busiLine,
        }),
      })
      .then((res: any) => {
        this.areaData = res.data;
        this.renderStruct(res.data);
      });
  }

  //查询区域结构分析-趋势
  queryareatr() {
    if (this.areatrData) {
      return this.renderTrend(this.areatrData);
    }
    screenApi
      .queryareatr({
        condition: JSON.stringify({
          busiLine: this.screenInstance.busiLine,
        }),
      })
      .then((res) => {
        this.areatrData = res.data;
        this.renderTrend(res.data);
      });
  }

  renderStruct(data: any) {
    this.renderRingChart("pieRef1", data, "deptBal");
    this.renderRingChart("pieRef2", data, "loanBal");
    this.renderPieChart("pieRef3", data, "yxCustNum");
    this.renderPieChart("pieRef4", data, "xdCustNum");
  }

  renderTrend(data: any) {
    let keys = ["deptBal", "loanBal", "yxCustNum", "xdCustNum"];
    keys.forEach((item, index) => {
      this.renderTrendChart(`pieRef${index + 1}`, data, item);
    });
  }

  getParametricEquation(startRatio: any, endRatio: any, isSelected: any, isHovered: any, k: any, h: any) {
    // 计算
    const midRatio = (startRatio + endRatio) / 2;
    const startRadian = startRatio * Math.PI * 2;
    const endRadian = endRatio * Math.PI * 2;
    const midRadian = midRatio * Math.PI * 2;
    // 如果只有一个扇形，则不实现选中效果。
    if (startRatio === 0 && endRatio === 1) {
      isSelected = false;
    }
    // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
    // k = 1;
    k = typeof k !== "undefined" ? k : 1 / 3; //控制是饼图还是环形
    // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
    const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
    const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
    // 计算高亮效果的放大比例（未高亮，则比例为 1）
    const hoverRate = isHovered ? 1.05 : 1;
    // 返回曲面参数方程
    return {
      u: {
        min: -Math.PI,
        max: Math.PI * 3,
        step: Math.PI / 32,
      },
      v: {
        min: 0,
        max: Math.PI * 2,
        step: Math.PI / 20,
      },
      x: function (u: any, v: any) {
        if (u < startRadian) {
          return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
        }
        if (u > endRadian) {
          return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
        }
        return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
      },
      y: function (u: any, v: any) {
        if (u < startRadian) {
          return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
        }
        if (u > endRadian) {
          return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
        }
        return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
      },
      z: function (u: any, v: any) {
        if (u < -Math.PI * 0.5) {
          return Math.sin(u);
        }
        if (u > Math.PI * 2.5) {
          return Math.sin(u) * h * 0.1;
        }
        return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
      },
    };
  }

  /**
   * 绘制3d图
   * @param pieData 总数据
   * @param internalDiameterRatio:透明的空心占比
   * @param distance 视角到主体的距离
   * @param alpha 旋转角度
   * @param pieHeight 立体的高度
   * @param opacity 饼或者环的透明度
   */
  getPie3D(pieData: any, internalDiameterRatio: any) {
    const series = [];
    let sumValue = 0;
    let startValue = 0;
    let endValue = 0;
    const legendData = [];
    const k = typeof internalDiameterRatio !== "undefined" ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio) : 1 / 3;
    // 为每一个饼图数据，生成一个 series-surface 配置
    for (let i = 0; i < pieData.length; i += 1) {
      sumValue += pieData[i].value;
      const seriesItem: any = {
        name: typeof pieData[i].name === "undefined" ? `series${i}` : pieData[i].name,
        type: "surface",
        parametric: true,
        wireframe: {
          show: false,
        },
        pieData: pieData[i],
        pieStatus: {
          selected: false,
          hovered: false,
          k: k,
        },
      };
      if (typeof pieData[i].itemStyle !== "undefined") {
        const itemStyle: any = {};
        if (typeof pieData[i].itemStyle.color !== "undefined") {
          itemStyle.color = pieData[i].itemStyle.color;
        }
        if (typeof pieData[i].itemStyle.opacity !== "undefined") {
          itemStyle.opacity = pieData[i].itemStyle.opacity;
        }
        seriesItem.itemStyle = itemStyle;
      }
      series.push(seriesItem);
    }
    // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
    // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
    for (let i = 0; i < series.length; i += 1) {
      endValue = startValue + series[i].pieData.value;
      series[i].pieData.startRatio = startValue / sumValue;
      series[i].pieData.endRatio = endValue / sumValue;
      series[i].parametricEquation = this.getParametricEquation(
        series[i].pieData.startRatio,
        series[i].pieData.endRatio,
        false,
        false,
        k,
        1
        // series[i].pieData.value
      );
      startValue = endValue;
      legendData.push(series[i].name);
    }
    return series;
  }

  // 计算百分比
  calcPercent(data: any, value: any, key: string) {
    let sum = data.reduce((total: number, currentValue: any) => {
      return total + currentValue[key];
    }, 0);

    return this.$util.toFixed((value / sum) * 100, 1) + "%";
  }

  // 绘制3D环形图
  renderRingChart(ref: any, data: any, key: string) {
    let optionsData = data.map((item: any) => {
      return {
        name: item.areaName,
        value: item[key],
        itemStyle: {
          color: this.legend.find((ele) => ele.name === item.areaName)?.color,
        },
      };
    });

    const series = this.getPie3D(optionsData, 0.7);
    series.push({
      name: "pie2d",
      type: "pie",
      label: {
        opacity: 1,
        fontSize: 12,
        color: "#fff",
      },
      labelLine: {
        showAbove: true,
        length: 10,
        length2: 10,
        lineStyle: {
          color: "#FED273",
        },
      },
      startAngle: -20, //起始角度，支持范围[0, 360]。
      clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
      radius: ["20%", "50%"],
      center: ["50%", "55%"],
      data: optionsData,
      itemStyle: {
        opacity: 0,
      },
    });

    let option = {
      tooltip: {
        padding: 0,
        borderWidth: 0,
        backgroundColor: "transparent",
        formatter: (params: any) => {
          if (params.seriesName !== "mouseoutSeries" && params.seriesName !== "pie2d") {
            let bfb = ((option.series[params.seriesIndex].pieData.endRatio - option.series[params.seriesIndex].pieData.startRatio) * 100).toFixed(2);
            let value = this.$util.formatMoney(option.series[params.seriesIndex].pieData.value / 100000000);
            return `<div class="chart-tooltip">
                    <p><span class="chart-dot" style="background:${params.color}"></span>${params.seriesName}：<span class="amount num">${value}</span><span class="unit">亿元</span></p>
                  </div>`;
          }
        },
      },
      labelLine: {
        show: true,
        lineStyle: {
          color: "#7BC0CB",
        },
      },
      label: {
        show: true,
        position: "outside",
        formatter: (params: any) => {
          return this.calcPercent(data, params.value, key);
        },
      },
      xAxis3D: {
        min: -1,
        max: 1,
      },
      yAxis3D: {
        min: -1,
        max: 1,
      },
      zAxis3D: {
        min: -1,
        max: 1,
      },
      grid3D: {
        show: false,
        boxHeight: 20, // 三维笛卡尔坐标系在三维场景中的高度
        viewControl: {
          alpha: 40,
          beta: 40,
          distance: 170, //调整视角到主体的距离，类似调整zoom
          rotateSensitivity: 0, // 设置为0无法旋转
          zoomSensitivity: 0, // 设置为0无法缩放
          panSensitivity: 0, // 设置为0无法平移
          autoRotate: false, // 自动旋转
        },
      },
      series: series,
    };
    if (this.charts[ref]) {
      this.charts[ref].dispose();
    }
    let myChart = echarts.init(document.getElementById(ref) as any);
    this.charts[ref] = myChart;
    myChart.setOption(option, true);
  }

  // 绘制3D饼图
  renderPieChart(ref: any, data: any, key: string) {
    let optionsData = data.map((item: any) => {
      return {
        name: item.areaName,
        value: item[key],
        itemStyle: {
          color: this.legend.find((ele) => ele.name === item.areaName)?.color,
        },
      };
    });
    const series = this.getPie3D(optionsData, 0);
    series.push({
      name: "pie2d",
      type: "pie",
      label: {
        opacity: 1,
        fontSize: 12,
        color: "#fff",
      },
      labelLine: {
        showAbove: true,
        length: 10,
        length2: 10,
        lineStyle: {
          color: "#FED273",
        },
      },
      startAngle: -20, //起始角度，支持范围[0, 360]。
      clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
      radius: ["20%", "38%"],
      center: ["50%", "55%"],
      data: optionsData,
      itemStyle: {
        opacity: 0,
      },
    });

    let option = {
      tooltip: {
        padding: 0,
        borderWidth: 0,
        backgroundColor: "transparent",
        formatter: (params: any) => {
          if (params.seriesName !== "mouseoutSeries" && params.seriesName !== "pie2d") {
            let bfb = ((option.series[params.seriesIndex].pieData.endRatio - option.series[params.seriesIndex].pieData.startRatio) * 100).toFixed(2);
            let value = this.$util.formatMoney(option.series[params.seriesIndex].pieData.value, 0);
            return `<div class="chart-tooltip">
                    <p><span class="chart-dot" style="background:${params.color}"></span>${params.seriesName}：<span class="amount num">${value}</span></p>
                  </div>`;
          }
        },
      },
      labelLine: {
        show: true,
        lineStyle: {
          color: "#7BC0CB",
        },
      },
      label: {
        show: true,
        position: "outside",
        formatter: (params: any) => {
          return this.calcPercent(data, params.value, key);
        },
      },
      xAxis3D: {
        min: -1,
        max: 1,
      },
      yAxis3D: {
        min: -1,
        max: 1,
      },
      zAxis3D: {
        min: -1,
        max: 1,
      },
      grid3D: {
        show: false,
        boxHeight: 40, // 三维笛卡尔坐标系在三维场景中的高度
        viewControl: {
          alpha: 40,
          beta: 40,
          distance: 300, //调整视角到主体的距离，类似调整zoom
          rotateSensitivity: 0, // 设置为0无法旋转
          zoomSensitivity: 0, // 设置为0无法缩放
          panSensitivity: 0, // 设置为0无法平移
          autoRotate: false, // 自动旋转
        },
      },
      series: series,
    };
    if (this.charts[ref]) {
      this.charts[ref].dispose();
    }
    let myChart = echarts.init(document.getElementById(ref) as any);
    this.charts[ref] = myChart;
    myChart.setOption(option, true);
  }

  // 绘制趋势图
  renderTrendChart(ref: any, data: any, key: string) {
    var isCust = ["yxCustNum", "xdCustNum"].includes(key);
    let xData: any = [],
      series = [],
      allData: any = [];
    series = this.legend.map((item: any) => {
      let datas = data.filter((ele: any) => ele.areaName === item.name);
      xData = datas.map((ele: any) => moment(ele.etlDate).format("YYYY-MM-DD").slice(0, 7));
      let curData = datas.map((ele: any) => (isCust ? ele[key] : ele[key] / 100000000));
      allData = allData.concat(curData);
      return {
        name: item.name,
        smooth: true,
        symbol: "none",
        type: "line",
        data: curData,
      };
    });

    let option = {
      color: ["#FD7289", "#08EACB", "#FFE012", "#027EEF"],
      grid: {
        left: 20,
        right: 20,
        bottom: 15,
        top: 20,
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            precision: isCust ? 0 : 2,
          },
        },
        padding: 0,
        borderWidth: 0,
        backgroundColor: "transparent",
        position: [-250, -120],
        formatter: (data: any) => {
          var params = data[0];
          var str = "";
          data.forEach((item: any) => {
            str += `<p style="height: 25px">
              <span class="chart-dot" style="background:${item.color}"></span>
              ${item.seriesName}：
              <span class="fr">
                <span class="amount num">${(this as any).$util.formatMoney(item.value, isCust ? 0 : 2)}</span>
                <span class="unit">${isCust ? "" : "亿元"}</span>
              </span>
            </p>`;
          });
          return `<div class="chart-tooltip" style="width: 320px">
            <p class="num">${params.axisValue}</p>
            ${str}
          </div>`;
        },
      },
      xAxis: {
        data: xData,
        boundaryGap: false,
        axisLabel: {
          show: true,
          interval: 0,
          color: "#44F0FF",
          fontFamily: "Times New Roman",
          formatter: (data: any) => {
            return parseInt(data.substring(5, 7)) + "M";
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#034E90",
          },
        },
      },
      yAxis: {
        // name: '亿元',
        // nameTextStyle: {
        //   color: '#44F0FF',
        //   fontSize: 12
        // },
        splitNumber: 3,
        // interval: parseInt((Math.max.apply(null, allData) / 3) as any),
        splitLine: {
          show: true,
          lineStyle: {
            color: "#034E90",
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#034E90",
          },
        },
        axisLabel: {
          textStyle: {
            color: "rgba(68, 240, 255, 0.8)",
            fontSize: 10,
          },
        },
      },
      series: series,
    };
    if (this.charts[ref]) {
      this.charts[ref].dispose();
    }
    let myChart = echarts.init(document.getElementById(ref) as any);
    this.charts[ref] = myChart;
    myChart.setOption(option, true);
  }
}
</script>

<style lang="scss" scoped>
.regionStructAanlysis-component {
  padding-top: 5px;
  position: relative;
  .tab {
    font-size: 12px;
    position: absolute;
    top: 10px;
    right: 0;
    border: 1px solid rgba(64, 214, 246, 0.6);
    border-radius: 3px;
    li {
      cursor: pointer;
      float: left;
      padding: 0 8px;
      height: 20px;
      line-height: 20px;
      color: #40d5f5;
      &.active {
        background: rgba(64, 214, 246, 0.2);
      }
    }
  }

  .legend {
    width: 300px;
    .legend-item {
      margin-top: 6px;
      &:nth-child(2n-1) {
        width: 100px;
      }
      .legend-item__tag {
        display: inline-block;
        width: 13px;
        height: 7px;
      }
    }
  }

  .pie-chart {
    .pie-chart__item {
      float: left;
      width: 170px;
      height: 120px;
      background: rgba(8, 34, 47, 0.4);
      margin-top: 6px;
      &:nth-child(2n) {
        margin-left: 10px;
      }
      .pie-cont {
        width: 200px;
        height: 120px;
        margin: -15px 0 0 -20px;
      }
      .pie-label {
        position: relative;
        top: -10px;
        font-size: 16px;
        color: #44f0ff;
        text-align: center;
        font-family: SourceHanSansCN-Regular;
      }
    }
  }
}
</style>
