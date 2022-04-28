<template>
  <div class="TrendChart-container">
    <i v-if="chartStatus === 'opened'" class="el-icon-close" @click="deleteFn"></i>
    <div class="chart-title">{{ options.name }}<small-tab class="chart-tabs" type="top" v-model="curTab" :data="['日', '月']" @change="tabChange"></small-tab></div>
    <LineChart :chart-data="lineChartData" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import LineChart, { ILineChartData } from "@/components/LineChart/index.vue";
import { HomeModule } from "@/store/modules/home";
import request from "@/utils/request";
import { backend } from "@/config";

@Component({
  name: "TrendChart",
  components: {
    LineChart,
  },
})
export default class extends Vue {
  @Prop({ default: () => null }) private options!: any;

  private lineChartData: ILineChartData = {
    xData: [],
    yData: [],
    title: "",
  };
  private curTab = 0;

  get chartStatus() {
    return HomeModule.chartStatus;
  }

  mounted() {
    this.queryChartData();
  }

  tabChange() {
    this.queryChartData();
  }

  queryChartData() {
    let { url, xKey, yKey, name, color, busiType, shadowColor } = this.options as any;
    let params = {
      condition: JSON.stringify({
        busiType,
      }),
    };

    request({
      url: backend.workService + url[this.curTab],
      method: "get",
      params,
    }).then((res: any) => {
      if (res.code == 0) {
        this.lineChartData = {
          title: name,
          xData: res.data.map((item: any) => {
            if (this.curTab) {
              return item[xKey].slice(0, 6);
            }
            return item[xKey];
          }),
          yData: res.data.map((item: any) => item[yKey] || 0),
        };
      }
    });
  }

  deleteFn() {
    this.$emit("delete");
  }
}
</script>

<style lang="scss" scoped>
.TrendChart-container {
  position: relative;
  padding: 20px 20px 0;
  box-shadow: 0px 2px 10px rgba(0, 92, 187, 0.3);
  border-radius: 5px;
  .el-icon-close {
    cursor: pointer;
    position: absolute;
    top: 3px;
    right: 3px;
    // color: $blue;
    font-weight: bold;
    transform: rotate(0);
    transition: all 0.3s;
    &:hover {
      transform: rotate(90deg);
    }
  }
  .chart-title {
    position: relative;
    font-size: 16px;
    padding-left: 10px;
    // border-left: 4px solid $blue;
    font-weight: bold;
    margin-bottom: 5px;
  }
  .chart-tabs {
    position: absolute;
    top: -5px;
    right: 0;
  }
  #basicChart {
    height: 220px;
  }
}
@media screen and (max-width: 1680px) {
  .TrendChart-container {
    padding: 12px 12px 0;
    .chart-title {
      font-size: 15px;
    }
    .el-icon-close {
      top: 1px;
      right: 1px;
    }
    .chart-tabs {
      top: 0;
    }
  }
}
</style>
