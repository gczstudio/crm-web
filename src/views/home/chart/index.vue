<template>
  <div :class="['chart-container', editClass, isDraging ? 'draging' : '']">
    <div :class="['chart-card', isDraging && dragType === 'card' ? 'card-draging' : '']">
      <div class="edit-chart" @click="showFn"><span>自定义设置</span><i class="iconfont icon-zidingyishezhi"></i></div>
      <div class="section-title"><i class="iconfont icon-zhibiao"></i><span>指标</span></div>
      <div class="chart-card__content" style="position: relative">
        <el-carousel
          ref="carouselRef"
          :indicator-position="cardGroupData.length > 1 ? 'outside' : 'none'"
          :key="1"
          :autoplay="false"
          arrow="never"
          :height="isMaxScreen ? (cardData.length > 6 ? '360px' : '375px') : cardData.length > 6 ? '300px' : '315px'"
          trigger="click"
          @change="carouselChangeFn"
        >
          <el-carousel-item v-for="(item, oIndex) in cardGroupData.length" :key="item">
            <el-row :gutter="isMaxScreen ? 16 : 12">
              <draggable v-model="cardGroupData[oIndex]" :options="{ disabled: chartStatus === 'closed' }" group="card" animation="300" @start="drag = true" @end="drag = false">
                <transition-group>
                  <el-col :span="8" v-for="(item, index) in cardGroupData[oIndex]" :key="item.chartId">
                    <QuotaCard :index="index" :data="item" @delete="deleteFn(item, oIndex * 6 + index, 'card')" />
                  </el-col>
                </transition-group>
              </draggable>
            </el-row>
          </el-carousel-item>
        </el-carousel>
        <Empty v-if="!cardData.length" description="暂无数据，请从自定义设置中配置" />
      </div>
    </div>
    <div class="chart-basic-and-rank">
      <el-tabs class="yu-tabs" v-model="activeFirstTab" @tab-click="firstTabChange">
        <el-tab-pane name="chart" lazy>
          <span slot="label"><i class="iconfont icon-tubiao"></i>趋势</span>
          <div :class="['chart-basic', isDraging && dragType === 'chart' ? 'chart-draging' : '']">
            <div class="chart-basic__content" style="position: relative">
              <el-row :gutter="isMaxScreen ? 16 : 12">
                <draggable v-model="chartData" :options="{ disabled: chartStatus === 'closed' }" group="chart" animation="300" @start="drag = true" @end="drag = false">
                  <transition-group>
                    <el-col :span="12" v-for="(item, index) in chartData" :key="item.chartId">
                      <TrendChart v-if="activeFirstTab === 'chart'" :options="item" @delete="deleteFn(item, index, 'chart')" />
                    </el-col>
                  </transition-group>
                </draggable>
                <Empty v-if="!chartData.length" description="暂无数据，请从自定义设置中配置" />
              </el-row>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="rank" lazy>
          <span slot="label"><i class="iconfont icon-paiming"></i>排名</span>
          <div v-if="!isMgr" :class="['chart-basic', isDraging && dragType === 'rank' ? 'rank-draging' : '']">
            <div class="chart-rank__content" style="position: relative">
              <el-row :gutter="isMaxScreen ? 16 : 12">
                <draggable v-model="rankData" :options="{ disabled: chartStatus === 'closed' }" group="rank" animation="300" @start="drag = true" @end="drag = false">
                  <transition-group>
                    <el-col :span="12" v-for="(item, index) in rankData" :key="item.chartId" style="position: relative">
                      <i v-if="chartStatus === 'opened'" class="el-icon-close" @click="deleteFn(item, index, 'rank')"></i>
                      <top-table
                        class="chart-rank__table"
                        :height="253"
                        border
                        showMore
                        rank-key="rankNo"
                        :tabs="['比上日', '比上月', '比上年']"
                        :data="item.data"
                        :title="item.name"
                        :columns="item.columns"
                        @change="smallChangeFn(item, $event)"
                        @view-more="viewMoreRankFn(item)"
                      ></top-table>
                    </el-col>
                  </transition-group>
                </draggable>
                <Empty v-if="!rankData.length" description="暂无数据，请从自定义设置中配置" />
              </el-row>
            </div>
          </div>
          <custom-tabs v-else class="cust-rank" v-model="activeTab" position="left" @tab-click="tabChangeFn">
            <custom-tab-pane v-for="item in custTas" :label="item.label" :name="item.key" :key="item.key">
              <div class="custom-tab-unit">单位：元</div>
              <top-table border showMore rank-key="rankNo" :key="item.key" :data="custData" :columns="custColumns" @view-more="viewMoreCustRankFn(item)"></top-table>
            </custom-tab-pane>
          </custom-tabs>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-drawer ref="drawerRef" title="自定义设置" :size="drawerSize" :with-header="false" :visible.sync="drawer" direction="rtl" append-to-body custom-class="custom-chart-drawer" :modal="false">
      <Tree ref="treeRef" @cancel="cancelFn" :data="treeData" @save="saveFn" />
    </el-drawer>
    <view-more :visible.sync="moreVisible" :options="viewMoreOptions" :width="custRankWidth"></view-more>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from "vue-property-decorator";
import QuotaCard from "./quotaCard/index.vue";
import TrendChart from "./TrendChart/index.vue";
import Tree from "./tree/index.vue";
import { HomeModule } from "@/store/modules/home";
import draggable from "vuedraggable";
import * as homeApi from "@/api/home";
import config from "@/views/home/chart/quotaConfig";
import request from "@/utils/request";
import { backend } from "@/config";
import { formatMoney } from "@/utils";

@Component({
  name: "Chart",
  components: {
    QuotaCard,
    TrendChart,
    Tree,
    draggable,
  },
})
export default class extends Vue {
  @Ref("drawerRef") drawerRef: any;
  @Ref("treeRef") treeRef: any;
  @Ref("carouselRef") carouselRef: any;
  private isMgr: boolean = (this as any).$util.getCheckedRole().roleCode === "R300201";
  private drawer = false;
  private drawerSize = 300;
  private keyword = "";
  private editClass = "";
  private drag = false;
  // private originTreeData: Array<any> = [];
  private treeData: Array<any> = [];
  private configData: Array<any> = [];
  private allCardData: Array<any> = []; // 所有指标数据
  private cardData: Array<any> = []; // 指标数据
  private cardGroupData: Array<any> = [[]]; // 指标数据

  private chartData: Array<any> = []; // 图表数据
  private rankData: Array<any> = []; // 排名数据
  private activeFirstTab = "chart";
  private activeTab = "1";
  private moreVisible = false;
  private custRankWidth = 600;
  private viewMoreOptions = {};
  private custData: Array<any> = [];
  private custTas = [
    { label: "存款余额", key: "1" },
    { label: "存款日均", key: "2" },
    { label: "信贷余额", key: "7" },
    { label: "贷款余额", key: "3" },
    { label: "EVA", key: "8" },
    { label: "业务利润", key: "4" },
    { label: "FTP利润", key: "5" },
    { label: "中收", key: "6" },
  ];
  private custColumns = [];
  private carouselIndex = 0;

  @Watch("cardGroupData")
  onCardGroupDataChange() {
    this.cardData = this._.flatten(this.cardGroupData);
  }

  @Watch("cardData")
  onCardDataChange(newData: any, oldData: any) {
    // 判断当前卡片拖入的位置是否正确，然后调整
    var oldChartIds = oldData.map((item: any) => item.chartId);
    var dragCard = null,
      dragIndex: any = null;
    newData.forEach((item: any, index: number) => {
      if (!oldChartIds.includes(item.chartId)) {
        dragCard = item;
        dragIndex = index;
      }
    });
    if (dragIndex && dragIndex + 1 < Math.floor(newData.length / 6) * 6) {
      newData.splice(dragIndex, 1);
      newData.push(dragCard);
      this.cardData = newData;
    }

    // 判断一下是否和cardGroup中的元素是否相同，如果相同就不需要更新
    var groupdIds = this._.flatten(this.cardGroupData).map((item: any) => item.chartId);
    var filters = this.cardData.filter((item) => !groupdIds.includes(item.chartId));
    var bool = this.cardGroupData.some((item) => item.length > 6);

    if (filters.length || groupdIds.length !== this.cardData.length || bool) {
      // 记录当前的index，this.cardGroupData改变后，整个组件会回到第一页
      var carouselIndex = this.carouselIndex;
      this.cardGroupData = this.cardData.length ? [] : [[]];
      for (var i = 0; i < Math.ceil(this.cardData.length / 6); i++) {
        this.cardGroupData.push(this.cardData.slice(6 * i, 6 * i + 6 > this.cardData.length ? this.cardData.length : 6 * i + 6));
      }
      this.$nextTick(() => {
        this.carouselRef.setActiveItem(carouselIndex);
      });
    }

    HomeModule.UPDATE_CARD_DATA(this.cardData);
    let chartIds = this.configData.map((item: any) => item.chartId);
    this.cardData.forEach((item) => {
      if (!chartIds.includes(item.chartId)) {
        this.configData.push({
          ...item,
          chartNm: item.name,
        });
      }
    });
    this.updateTreeData();
  }

  @Watch("chartData")
  onChartDataChange() {
    HomeModule.UPDATE_CHART_DATA(this.chartData);
    let chartIds = this.configData.map((item: any) => item.chartId);
    this.chartData.forEach((item) => {
      if (!chartIds.includes(item.chartId)) {
        this.configData.push({
          ...item,
          chartNm: item.name,
        });
      }
    });
    this.updateTreeData();
  }

  @Watch("rankData")
  onRankDataChange(newValue: any[], oldValue: any[]) {
    // 第一次进来时，不用请求, 如果当前是排名，才请求
    if (this.activeFirstTab !== "rank") {
      return;
    }
    HomeModule.UPDATE_RANK_DATA(this.rankData);
    let chartIds = oldValue.map((item) => item.chartId);
    // 对新加排行进行请求数据
    newValue.forEach((item, index) => {
      if (!chartIds.includes(item.chartId)) {
        this.smallChangeFn(item, 0);
      }
    });

    // 将新加的数据添加到configData中
    let chartIds1 = this.configData.map((item: any) => item.chartId);
    this.rankData.forEach((item) => {
      if (!chartIds1.includes(item.chartIds)) {
        this.configData.push({
          ...item,
          // columns: (this as any)._.cloneDeep(item.columns),
          chartNm: item.name,
        });
      }
    });

    this.updateTreeData();
  }

  get chartStatus() {
    return HomeModule.chartStatus;
  }

  get dragStatus() {
    return HomeModule.dragStatus;
  }

  get isDraging() {
    return HomeModule.dragStatus === "draging";
  }

  get dragType() {
    return HomeModule.dragType;
  }

  @Watch("dragStatus")
  onDragStatusChange(value: string) {
    if (this.dragType === "card") {
      var index = Math.ceil(this.cardData.length / 6) + (this.cardData.length % 6 === 0 ? 1 : 0);
      if (value === "draging") {
        if (this.cardData.length % 6 === 0 && this.cardGroupData.length < index) {
          this.cardGroupData.push([]);
        }
        this.$nextTick(() => {
          this.carouselRef.setActiveItem(index - 1);
        });
      } else {
        this.cardGroupData.forEach((item, index) => {
          if (!item.length) {
            this.cardGroupData.splice(index, 1);
            this.$nextTick(() => {
              this.carouselRef.setActiveItem(this.cardGroupData.length - 1);
            });
          }
        });
      }
    }
  }

  @Watch("dragType")
  onDragTypeChange(value: string) {
    if (value !== "card" && value !== this.activeFirstTab) {
      this.activeFirstTab = value;
      this.$nextTick(() => {
        this.firstTabChange();
      });
    }
  }

  get originTreeData() {
    return HomeModule.customTreeData;
  }

  @Watch("originTreeData")
  onOriginTreeDataChange(value: any) {
    this.updateTreeData();
  }

  created() {
    this.queryUserChart();
    this.setCustColumns();
  }

  mounted() {
    // 自定义设置的宽度和右侧保持一致
    let rightBox: HTMLElement | null = document.querySelector("#rightBox");
    if (rightBox) {
      this.drawerSize = rightBox.clientWidth;
      this.drawerRef.$el.style.width = rightBox.clientWidth + "px";
      this.drawerRef.$el.style.left = "auto";
    }
  }

  private setChartStatus(value: string) {
    HomeModule.UPDATE_CHART_STATUS(value);
  }

  carouselChangeFn(index: number) {
    this.carouselIndex = index;
  }

  firstTabChange() {
    // 切换时，让滚动条向上滚动一段距离
    HomeModule.UPDATE_DRAG_TYPE(this.activeFirstTab);
    HomeModule.UPDATE_NEED_ALIGN_UPDATE(true);
    if (this.activeFirstTab === "rank") {
      this.tabChangeFn();
      this.rankData.forEach((item, index) => {
        this.smallChangeFn(item, 0);
      });
    } else {
    }
  }

  customerViewFn(scope: any) {
    this.moreVisible = false;
    var row = scope.row;
    this.$router.push({ path: "/custInfo/custView/" + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: "客户详情-" + row.custNm } });
  }

  setCustColumns() {
    var columns = [
      {
        prop: "custNm",
        label: "客户名称",
        minWidth: 130,
        showOverflowTooltip: true,
        render: (scope: any) => {
          return `<div class="yu-table__company"><i class="iconfont icon-qiyelogo"></i>${scope.row.custNm}</div>`;
        },
        onClick: this.customerViewFn,
      },
      {
        prop: "depBal",
        label: "存款余额",
        align: "right",
        minWidth: 90,
        showOverflowTooltip: true,
        isNum: true,
        tabId: "1",
        render: (scope: any) => {
          return formatMoney(scope.row.depBal);
        },
      },
      {
        prop: "depBalAvg",
        label: "存款日均",
        align: "right",
        minWidth: 90,
        showOverflowTooltip: true,
        isNum: true,
        tabId: "2",
        render: (scope: any) => {
          return formatMoney(scope.row.depBalAvg);
        },
      },
      {
        prop: "xdLoanBal",
        label: "信贷余额",
        align: "right",
        minWidth: 88,
        showOverflowTooltip: true,
        isNum: true,
        tabId: "7",
        render: (scope: any) => {
          return formatMoney(scope.row.xdLoanBal);
        },
      },
      {
        prop: "loanBal",
        label: "贷款余额",
        align: "right",
        minWidth: 90,
        showOverflowTooltip: true,
        isNum: true,
        tabId: "3",
        render: (scope: any) => {
          return formatMoney(scope.row.loanBal);
        },
      },
      {
        prop: "eva",
        label: "EVA",
        align: "right",
        minWidth: 70,
        showOverflowTooltip: true,
        isNum: true,
        tabId: "8",
        render: (scope: any) => {
          return formatMoney(scope.row.eva);
        },
      },
      {
        prop: "profCtr",
        label: "业务利润",
        align: "right",
        minWidth: 88,
        showOverflowTooltip: true,
        isNum: true,
        tabId: "4",
        render: (scope: any) => {
          return formatMoney(scope.row.profCtr);
        },
      },
      {
        prop: "ftpProf",
        label: "FTP利润",
        align: "right",
        minWidth: 70,
        showOverflowTooltip: true,
        isNum: true,
        tabId: "5",
        render: (scope: any) => {
          return formatMoney(scope.row.ftpProf);
        },
      },
      {
        prop: "imdeIncom",
        label: "中收",
        align: "right",
        minWidth: 70,
        showOverflowTooltip: true,
        isNum: true,
        tabId: "6",
        render: (scope: any) => {
          return formatMoney(scope.row.imdeIncom);
        },
      },
    ];
    var copyColumns = (this as any)._.cloneDeep(columns);

    columns.forEach((item: any, index: number) => {
      if (item.tabId === this.activeTab) {
        copyColumns.splice(index, 1);
        copyColumns.splice(1, 0, item);
      }
    });
    this.custColumns = copyColumns;
  }

  tabChangeFn() {
    // 客户经理角色才执行
    if ((this as any).$util.getCheckedRole().roleCode !== "R300201") {
      return;
    }
    this.setCustColumns();
    let params = {
      condition: JSON.stringify({
        rankType: this.activeTab,
      }),
      page: 1,
      size: 10,
    };
    homeApi.queryCustRankList(params).then((res: any) => {
      if (res.code === 0) {
        this.custData = res.data;
      }
    });
  }

  smallChangeFn(item: any, value: number) {
    let { url, busiType } = item;
    let params = {
      condition: JSON.stringify({
        incrType: value + 1,
        sortType: 1,
        busiType,
      }),
      page: 1,
      size: 5,
    };
    request({
      url: backend.workService + url,
      method: "get",
      params,
    }).then((res: any) => {
      if (res.code == 0) {
        let rankData = [...this.rankData];
        for (var i = 0; i < this.rankData.length; i++) {
          let ele = this.rankData[i];
          if (ele.chartId === item.chartId) {
            ele.data = res.data;
            ele.activeTab = value;
            return;
          }
        }
        this.rankData = rankData;
      }
    });
  }

  // 增量排名查看更多
  viewMoreRankFn(item: any) {
    this.treeRef && this.cancelFn(true);
    var options = {
      title: item.name,
      tabs: ["比上日", "比上月", "比上年"],
      tabValue: item.activeTab,
      size: 50,
      url: item.url,
      typeName: "incrType",
      typeLookup: [1, 2, 3],
      baseParams: { incrType: item.activeTab + 1, sortType: 1, busiType: item.busiType },
      columns: item.columns,
      rankKey: "rankNo",
    };
    this.moreVisible = true;
    this.custRankWidth = 700;
    this.viewMoreOptions = options;
  }

  // 客户排名查看更多
  viewMoreCustRankFn(item: any) {
    var options = {
      title: item.label,
      size: 50,
      unit: "元",
      url: "/api/acrmcustrank/queryList",
      baseParams: { rankType: this.activeTab },
      columns: this.custColumns,
      rankKey: "rankNo",
    };
    this.moreVisible = true;
    this.custRankWidth = 1000;
    this.viewMoreOptions = options;
  }

  // 获取指标树
  queryChartTree() {
    homeApi.queryChartTree().then((res: any) => {
      if (res.code === 0) {
        // 根据用户的配置，过滤掉已经配置的
        // this.originTreeData = res.data;
        HomeModule.UPDATE_CUSTOM_TREE_DATA(res.data);
        this.updateTreeData();
      }
    });
  }

  updateTreeData() {
    this.$nextTick(() => {
      let chartIds = this.configData.map((item) => item.chartId);
      let treeData = (this as any)._.cloneDeep(this.originTreeData);
      this.recursion(treeData, chartIds);
      this.treeData = treeData;
    });
  }

  // 把config中配置的数据合并到treeData中
  recursion(data: any[], chartIds: string[]) {
    let curData = config.chart[(this as any).$util.getCheckedRole().roleCode === "R300201" ? "mgr" : "org"];
    let result = [...this.allCardData, ...curData, ...config.rank];
    data.forEach((item) => {
      if (item.chartLevel === "3") {
        item.selected = chartIds.includes(item.chartId);
        let curChart = result.find((ele) => ele.chartId === item.chartId);
        item = Object.assign(item, curChart);
      }
      if (item.childList?.length) {
        this.recursion(item.childList, chartIds);
      }
    });
  }

  // 获取用户的配置
  async queryUserChart() {
    homeApi.queryUserChart().then((res: any) => {
      if (res.code === 0) {
        let configData = res.data;
        this.configData = configData;
        HomeModule.UPDATE_CHART_CONFIG(res.data);
        // 获取用户自定义的配置
        let chartIds = configData.map((item: any) => item.chartId);
        let curData = config.chart[(this as any).$util.getCheckedRole().roleCode === "R300201" ? "mgr" : "org"]; // 客户经理和机构进行判断

        // 趋势数据
        this.chartData = curData
          .filter((item: any) => chartIds.includes(item.chartId))
          .map((ele: any) => {
            return {
              ...ele,
              ...this.getConfigItemById(configData, ele.chartId),
            };
          })
          .sort((a: any, b: any) => {
            return a.chartOrder - b.chartOrder;
          });

        // 排名数据
        this.rankData = config.rank
          .filter((item: any) => chartIds.includes(item.chartId))
          .map((ele: any) => {
            return {
              ...ele,
              ...this.getConfigItemById(configData, ele.chartId),
            };
          })
          .sort((a: any, b: any) => {
            return a.chartOrder - b.chartOrder;
          });

        this.$nextTick(() => {
          this.queryOrgIndex(chartIds);
          // 如果现在是排名标签, 请求排名数据
          if (this.activeFirstTab === "rank") {
            this.rankData.forEach((item, index) => {
              this.smallChangeFn(item, 0);
            });
          }
        });
      }
    });
  }

  getConfigItemById(configData: any[], id: string) {
    return (
      configData.find((item) => {
        return item.chartId === id;
      }) || {}
    );
  }

  // 查询指标数据
  async queryOrgIndex(chartIds: string[]) {
    homeApi.queryOrgIndex().then((res: any) => {
      const { data } = res;
      this.allCardData = config.card.map((ele: any) => {
        return {
          ...this.getConfigItemById(this.configData, ele.chartId),
          ...ele,
          total: data?.[ele.total],
          lastD: data?.[ele.lastD],
          lastM: data?.[ele.lastM],
          lastY: data?.[ele.lastY],
        };
      });

      this.queryFtpProf();
      this.queryInterBusIncom();
    });
  }

  // 查询ftp利润数据
  queryFtpProf() {
    homeApi.queryFtpProf().then((res: any) => {
      if (res.code === 0) {
        let cardData = [...this.allCardData];
        cardData.forEach((item) => {
          if (item.chartId === "KPI10104") {
            item.total = res.data?.ftpProf;
          }
        });
        this.allCardData = cardData;
        let chartIds = this.configData.map((item: any) => item.chartId);
        this.cardData = cardData
          .filter((item) => chartIds.includes(item.chartId))
          .sort((a: any, b: any) => {
            return a.chartOrder - b.chartOrder;
          });
      }
    });
  }

  // 查询小企业中间业务收入

  queryInterBusIncom() {
    homeApi.queryInterBusIncom().then((res: any) => {
      if (res.code === 0) {
        let cardData = [...this.allCardData];
        cardData.forEach((item) => {
          if (item.chartId === "KPI10305") {
            item.total = res.data?.interBusIncom;
          }
        });
        this.allCardData = cardData;
        let chartIds = this.configData.map((item: any) => item.chartId);
        this.cardData = cardData
          .filter((item) => chartIds.includes(item.chartId))
          .sort((a: any, b: any) => {
            return a.chartOrder - b.chartOrder;
          });
      }
    });
  }

  showFn() {
    this.drawer = true;
    this.editClass = "edit-class";
    this.setChartStatus("opened");
    this.queryChartTree();
  }

  // 指标卡删除
  deleteFn(item: any, index: number, type: string) {
    if (type === "card") {
      this.cardData.splice(index, 1);
    } else if (type === "chart") {
      this.chartData.splice(index, 1);
    } else if (type === "rank") {
      this.rankData.splice(index, 1);
    }

    // 将删除的回退到tree中
    this.configData = this.configData.filter((ele) => ele.chartId !== item.chartId);
    this.updateTreeData();
  }

  // 保存
  saveFn() {
    let cardData = this.formatChartData(this.cardData);
    let chartData = this.formatChartData(this.chartData);
    let rankData = this.formatChartData(this.rankData);
    let data = [...cardData, ...chartData, ...rankData];
    homeApi.saveUserChart(data).then((res: any) => {
      if (res.code === 0) {
        this.$message.success("保存成功");
        this.treeRef && this.treeRef.cancelFn();
      }
    });
  }

  formatChartData(data: any[]) {
    return data.map((item: any, index: number) => {
      return {
        chartId: item.chartId,
        chartNm: item.name,
        chartOrder: index + 1,
        busiType: item.busiType,
      };
    });
  }

  cancelFn(flag: boolean) {
    this.drawer = false;
    this.editClass = "";
    this.setChartStatus("closed");
    !flag && this.queryUserChart();
  }
}
</script>

<style lang="scss">
// 设置拖拽过来tree-node__wrapper的样式
.tree-node__wrapper {
  list-style: none;
  .iconfont {
    margin-right: 5px;
  }
}
</style>

<style lang="scss" scoped>
.chart-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.chart-container {
  position: relative;
  min-height: calc(100vh - 154px);
  background: #fff;
  box-shadow: 0px 3px 7px rgba(0, 0, 0, 0.2);
  &.edit-class {
    // border: 1px dashed $blue;
  }
  ::v-deep.el-carousel__item {
    .el-row > div > span {
      display: inline-block;
      width: 100%;
      height: 352px;
      .tree-node__wrapper {
        float: left;
        width: calc(33.33333% - 16px);
        margin: 0 8px 16px;
        overflow: hidden;
        position: relative;
        padding: 16px 16px 20px;
        height: 160px;
        background: #ffffff;
        box-shadow: 0px 2px 10px rgba(0, 92, 187, 0.3);
        border-radius: 5px;
      }
    }
  }
  ::v-deep.el-carousel__indicators--outside {
    button {
      width: 30px;
      height: 4px;
      //background: $blue;
    }
    .el-carousel__indicator:first-child {
      button {
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
      }
    }
    .el-carousel__indicator:last-child {
      button {
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
      }
    }
  }
  &.draging {
    &::before {
      content: "";
      display: inline-block;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
    }
  }
  .chart-basic-and-rank {
    margin-top: 4px;
    background: #fff;
    // box-shadow: 0px 3px 7px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }
  .chart-card {
    padding: 0;
    // box-shadow: 0px 3px 7px rgba(0, 0, 0, 0.2);
    background: #fff;
    border-radius: 5px;
    position: relative;
    &::after {
      content: "";
      display: inline-block;
      width: calc(100% - 40px);
      height: 1px;
      background: #d8d8d8;
      position: absolute;
      left: 20px;
      bottom: 0;
    }

    .section-title {
      padding: 16px 20px 0;
    }
    .el-carousel__item {
      padding: 16px 20px;
    }
    .chart-card__content {
      .el-col {
        margin-bottom: 16px;
      }
    }
  }
  .chart-basic__content {
    .el-row > div > span {
      display: inline-block;
      width: 100%;
      min-height: 258px;
    }
  }
  .chart-rank__table {
    box-shadow: 0px 2px 10px rgba(0, 92, 187, 0.3);
    padding: 14px 10px 10px;
    border-radius: 5px;
  }
  .chart-rank__content {
    .el-row > div > span {
      display: inline-block;
      width: 100%;
      min-height: 346px;
    }
  }

  .chart-basic__content {
    ::v-deep.el-row > div > span {
      .tree-node__wrapper {
        float: left;
        width: calc(50% - 16px);
        margin: 0 8px 16px;
        height: 263px;
        position: relative;
        padding: 20px 20px 0;
        box-shadow: 0px 2px 10px rgba(0, 92, 187, 0.3);
        border-radius: 5px;
      }
    }
  }
  .chart-rank__content {
    ::v-deep.el-row > div > span {
      .tree-node__wrapper {
        float: left;
        width: calc(50% - 16px);
        margin: 0 8px 16px;
        height: 319px;
        position: relative;
        padding: 20px 20px 0;
        box-shadow: 0px 2px 10px rgba(0, 92, 187, 0.3);
        border-radius: 5px;
      }
    }
  }

  .chart-basic,
  .chart-rank {
    padding: 0 20px;
    .chart-basic__content,
    .chart-rank__content {
      .el-col {
        margin-bottom: 16px;
      }
    }
  }

  .card-draging,
  .chart-draging,
  .rank-draging {
    position: relative;
    z-index: 200;
    background: #fff;
    border-radius: 5px;
    padding: 10px;
  }

  .el-icon-close {
    cursor: pointer;
    position: absolute;
    top: 5px;
    right: 10px;
    // color: $blue;
    font-weight: bold;
    transform: rotate(0);
    transition: all 0.3s;
    &:hover {
      transform: rotate(90deg);
    }
  }
}
.line {
  margin: 16px 0 32px;
  height: 0;
  border-bottom: 1px dashed #d5d5d5;
}
.edit-chart {
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 20px;
  // color: $blue;
  opacity: 1;
  transition: all 0.3s;
  .iconfont {
    display: inline-block;
    vertical-align: middle;
  }
  span {
    font-size: 16px;
    margin-right: 10px;
    vertical-align: middle;
    font-weight: bold;
  }
  &:hover {
    opacity: 0.8;
  }
}
.cust-rank {
  padding: 0 20px 16px;
  position: relative;
  ::v-deep .top10-table__header {
    position: absolute;
    top: -22px;
    right: 20px;
    width: 100px;
    .view-more {
      top: -8px;
    }
  }
  .custom-tab-unit {
    position: absolute;
    top: 11px;
    right: 20px;
    color: #666;
    font-size: 12px;
  }
}

@media screen and (max-width: 1680px) {
  .chart-container {
    .chart-card {
      padding: 0;
      .section-title {
        padding: 12px 12px 0;
      }
      ::v-deep.el-carousel__item {
        padding: 12px;
        .el-row > div > span {
          height: 294px;
          .tree-node__wrapper {
            width: calc(33.33333% - 12px);
            margin: 0 6px 12px;
            padding: 12px;
            height: 135px;
          }
        }
      }
      .chart-card__content {
        .el-col {
          margin-bottom: 12px;
        }
      }
    }
    .edit-chart {
      top: 12px;
      right: 12px;
      span {
        font-size: 15px;
      }
    }
    .chart-basic {
      padding: 0 12px;
    }
    .chart-basic__content {
      ::v-deep.el-row > div > span {
        .tree-node__wrapper {
          width: calc(50% - 12px);
          margin: 0 6px 12px;
        }
      }
    }
    .chart-rank__content {
      ::v-deep.el-row > div > span {
        .tree-node__wrapper {
          width: calc(50% - 12px);
          height: 315px;
          margin: 0 6px 16px;
        }
      }
    }
  }
}
</style>
