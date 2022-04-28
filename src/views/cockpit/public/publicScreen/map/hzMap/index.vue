<template>
  <div style="position: relative">
    <div class="mapChart animate-bounce" ref="mapChart"></div>
    <div class="dots animate-bounceDown">
      <div class="dots-item" v-for="item in mapData.pos" :key="item.orgNo" @mouseenter="mouseenter(item)" @mouseleave="mouseleave(item)">
        <img v-if="activeOrg === item.orgNo" :style="{ top: item.positionTop - 25 + 'px', left: item.positionLeft - 3 + 'px' }" class="dots-img" src="~@/assets/images/screen/dot.png" alt="" />
        <img v-else :style="{ top: item.positionTop + 'px', left: item.positionLeft + 'px' }" class="dots-img" src="~@/assets/images/screen/dot1.png" alt="" />
      </div>
    </div>
    <div v-if="activeOrg && Object.keys(modalData).length" id="modal" :key="activeOrg" :class="`modal ${modalClass}`" :style="mapStyle.modal">
      <div class="line" :style="mapStyle.line"></div>
      <div class="modal-cont">
        <div class="modal-title">{{ modalData.orgNm }}</div>
        <div class="modal-compare">
          <el-row>
            <el-col :span="8" class="modal-compare-item">
              <p>对公存款余额(亿元)</p>
              <p>{{ $util.formatMoney(modalData.deptBal / 100000000) }}</p>
              <p>
                比上年末<span class="updown-amount">{{ (modalData.deptBalLastYear > 0 ? "+" : "") + $util.formatMoney(modalData.deptBalLastYear / 100000000) }}</span>
              </p>
            </el-col>
            <el-col :span="8" class="modal-compare-item">
              <p>对公存款日均(亿元)</p>
              <p>{{ $util.formatMoney(modalData.deptBalAvgYear / 100000000) }}</p>
              <p>
                比上年末<span class="updown-amount">{{ (modalData.deptBalAvgLastYear > 0 ? "+" : "") + $util.formatMoney(modalData.deptBalAvgLastYear / 100000000) }}</span>
              </p>
            </el-col>
            <el-col :span="8" class="modal-compare-item">
              <p>对公贷款余额(亿元)</p>
              <p>{{ $util.formatMoney(modalData.loanBal / 100000000) }}</p>
              <p>
                比上年末<span class="updown-amount">{{ (modalData.loanBalLastYear > 0 ? "+" : "") + $util.formatMoney(modalData.loanBalLastYear / 100000000) }}</span>
              </p>
            </el-col>
          </el-row>
        </div>
        <div class="quota">
          <el-row :gutter="4">
            <el-col :span="12">
              <ul class="quota-item quota-item-2">
                <li>
                  对公有效客户数<span class="amount">{{ modalData.yxCustNum }}</span>
                </li>
                <li>
                  对公信贷客户数<span class="amount">{{ modalData.xdCustNum }}</span>
                </li>
              </ul>
            </el-col>
            <el-col :span="12">
              <ul class="quota-item">
                <li>
                  对公客户FTP利润({{ $util.formatMoneyAutoUnit(modalData.ftpProfitBalnc).unit }})<span class="amount">{{ $util.formatMoneyAutoUnit(modalData.ftpProfitBalnc).num }}</span>
                </li>
                <li>
                  对公客户中收({{ $util.formatMoneyAutoUnit(modalData.midBizInc).unit }})<span class="amount">{{ $util.formatMoneyAutoUnit(modalData.midBizInc).num }}</span>
                </li>
                <li>
                  对公客户EVA({{ $util.formatMoneyAutoUnit(modalData.eva).unit }})<span class="amount">{{ $util.formatMoneyAutoUnit(modalData.eva).num }}</span>
                </li>
              </ul>
            </el-col>
            <el-col :span="12">
              <ul class="quota-item">
                <li>
                  对公存款付息率(%)<span class="amount">{{ modalData.avgDpsRate }}</span>
                </li>
                <li>
                  对公贷款收息率(%)<span class="amount">{{ modalData.avgLneRate }}</span>
                </li>
                <li>
                  对公业务净利差(%)<span class="amount">{{ modalData.netMargin }}</span>
                </li>
              </ul>
            </el-col>
            <el-col :span="12">
              <ul class="quota-item">
                <li>
                  授信敞口额度({{ $util.formatMoneyAutoUnit(modalData.creditExposureAmt).unit }})<span class="amount">{{ $util.formatMoneyAutoUnit(modalData.creditExposureAmt).num }}</span>
                </li>
                <li>
                  已使用敞口额度({{ $util.formatMoneyAutoUnit(modalData.userdCreditExposureAmt).unit }})<span class="amount">{{
                    $util.formatMoneyAutoUnit(modalData.userdCreditExposureAmt).num
                  }}</span>
                </li>
                <li>
                  敞口额度使用率(%)<span class="amount">{{ $util.toFixed(modalData.creditExposureUseRate, 2) }}</span>
                </li>
              </ul>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import "echarts-gl";
import axios from "axios";
import { ScreenModule } from "@/store/modules/screen";

export default {
  name: "Map",
  props: {
    mapData: Object,
  },
  data() {
    return {
      data: [],
      activeOrg: "",
      // result: [
      //   {
      //     orgNm: '重庆分行',
      //     city: '重庆市',
      //     address: '重庆市渝北区洪湖东路11号1栋财富中心C座',
      //     location: { lng: 106.5170485917318, lat: 29.61387517494344 },
      //     position: { top: 370, left: 205 }
      //   },
      //   {
      //     orgNm: '襄阳分行',
      //     city: '襄阳市',
      //     address: '湖北省襄阳市高新区春园路8号',
      //     location: { lng: 112.14367697257596, lat: 32.058796051805324 },
      //     position: { top: 140, left: 670 }
      //   },
      //   {
      //     orgNm: '宜昌分行',
      //     city: '宜昌市',
      //     address: '湖北省宜昌市云集路25号旅游广场',
      //     location: { lng: 111.2978671789734, lat: 30.703801171803384 },
      //     position: { top: 265, left: 600 }
      //   },
      //   {
      //     orgNm: '黄石分行',
      //     city: '黄石市',
      //     address: '湖北省黄石市黄石港区黄石大道861号',
      //     location: { lng: 115.09071498117896, lat: 30.225857055123452 },
      //     position: { top: 320, left: 910 }
      //   },
      //   {
      //     orgNm: '十堰分行',
      //     city: '十堰市',
      //     address: '湖北省十堰市茅箭区朝阳中路9号万隆广场',
      //     location: { lng: 110.78897593977374, lat: 32.65842439548321 },
      //     position: { top: 75, left: 555 }
      //   },
      //   {
      //     orgNm: '荆州分行',
      //     city: '荆州市',
      //     address: '湖北省荆州市江津西路280号（恒源大酒店）',
      //     location: { lng: 112.23891433460777, lat: 30.348227051622782 },
      //     position: { top: 300, left: 678 }
      //   },
      //   {
      //     orgNm: '荆门分行',
      //     city: '荆门市',
      //     address: '湖北省荆门市长宁大道21号',
      //     location: { lng: 112.21493999783527, lat: 31.04726464331512 },
      //     position: { top: 228, left: 675 }
      //   },
      //   {
      //     orgNm: '鄂州分行',
      //     city: '鄂州市',
      //     address: '湖北省鄂州市鄂城区文星大道59号',
      //     location: { lng: 114.89860201735681, lat: 30.403760995385873 },
      //     position: { top: 290, left: 890 }
      //   },
      //   {
      //     orgNm: '孝感分行',
      //     city: '孝感市',
      //     address: '湖北省孝感市孝南区北京路51号',
      //     location: { lng: 113.9449233387939, lat: 30.92274426289778 },
      //     position: { top: 240, left: 815 }
      //   },
      //   {
      //     orgNm: '黄冈分行',
      //     city: '黄冈市',
      //     address: '湖北省黄冈市黄州区赤壁大道76号翡翠一品55号楼',
      //     location: { lng: 114.91050438570292, lat: 30.463810268429416 },
      //     position: { top: 285, left: 905 }
      //   },
      //   {
      //     orgNm: '咸宁分行',
      //     city: '咸宁市',
      //     address: '湖北省咸宁市淦河大道25号阳光威娜国际名仕广场',
      //     location: { lng: 114.32812769855786, lat: 29.83667425209612 },
      //     position: { top: 345, left: 850 }
      //   },
      //   {
      //     orgNm: '随州分行',
      //     city: '随州市',
      //     address: '湖北省随州市曾都区交通大道与迎宾大道交叉口西北角',
      //     location: { lng: 113.39787131797068, lat: 31.707021287068763 },
      //     position: { top: 170, left: 774 }
      //   },
      //   {
      //     orgNm: '恩施分行',
      //     city: '恩施土家族苗族自治州',
      //     address: '湖北省恩施市施州大道67号（金鳞大厦）',
      //     location: { lng: 109.49128236277076, lat: 30.290887046074 },
      //     position: { top: 300, left: 450 }
      //   },
      //   {
      //     orgNm: '仙桃支行',
      //     address: '湖北省仙桃市仙桃大道11-6号',
      //     city: '仙桃市',
      //     location: { lng: 113.44448308834045, lat: 30.366926840397728 },
      //     position: { top: 300, left: 775 }
      //   },
      //   {
      //     orgNm: '潜江支行',
      //     city: '潜江市',
      //     address: '湖北省潜江市潜阳中路32号',
      //     location: { lng: 112.8973957191954, lat: 30.42331018956979 },
      //     position: { top: 288, left: 732 }
      //   }
      // ],
      timer: null,
      modalClass: "animate-bounce-modal-delay",
      chart: null,
    };
  },
  computed: {
    mapStyle() {
      let curMap = this.mapData.pos.find((item) => item.orgNo === this.activeOrg);
      if (!curMap) return {};
      let top = curMap.positionTop,
        left = curMap.positionLeft;
      let modalWidth = 467,
        modalHeight = 299; // 弹出框宽高
      let mapHalfWidth = 560,
        mapHalfHeight = 200; // map一半的宽高
      // 左下角
      if (top > mapHalfHeight && left < mapHalfWidth) {
        return {
          modal: {
            top: top - modalHeight - 10 + "px",
            left: left + 55 + "px",
            transformOrigin: "bottom left",
          },
          line: {
            top: modalHeight - 8 + "px",
            left: 0,
            transform: "rotate(135deg)",
          },
        };
      }

      // 左上角
      if (top <= mapHalfHeight && left <= mapHalfWidth) {
        return {
          modal: {
            top: top + 80 + "px",
            left: left + 56 + "px",
            transformOrigin: "top left",
          },
          line: {
            top: 0,
            left: 0,
            transform: "rotate(-135deg)",
          },
        };
      }

      // 右下角
      if (top > mapHalfHeight && left > mapHalfWidth) {
        // 超出边界时
        let beyond = top - modalHeight;
        if (beyond < 0) {
          let rotate = beyond * 1.02 + 45;
          top = 0;
          if (beyond + 43 > 0) {
            left = left - modalWidth - 50;
          } else {
            left = left - modalWidth - 55;
          }

          return {
            modal: {
              top: 0,
              left: left + "px",
              transformOrigin: "bottom right",
            },
            line: {
              top: modalHeight - 10 + "px",
              left: modalWidth - 10 + "px",
              transform: `rotate(${rotate}deg)`,
            },
          };
        }

        return {
          modal: {
            top: top - modalHeight - 6 + "px",
            left: left - modalWidth - 43 + "px",
            transformOrigin: "bottom right",
          },
          line: {
            top: modalHeight - 10 + "px",
            left: modalWidth - 10 + "px",
            transform: "rotate(45deg)",
          },
        };
      }

      // 右上角
      if (top <= mapHalfHeight && left >= mapHalfWidth) {
        return {
          modal: {
            top: top + 80 + "px",
            left: left - modalWidth - 46 + "px",
            transformOrigin: "top right",
          },
          line: {
            top: 0,
            left: modalWidth - 7 + "px",
            transform: "rotate(315deg)",
          },
        };
      }
    },
    modalData() {
      return this.mapData.data.find((item) => item.orgNo === this.activeOrg) || {};
    },
    curActiveOrg() {
      return ScreenModule.activeOrg;
    },
    incrementStatus() {
      return ScreenModule.incrementStatus;
    },
  },
  watch: {
    activeOrg(val) {
      ScreenModule.SET_ACTIVE_ORG(val);
      this.execAnimate();
    },
    curActiveOrg(val) {
      this.activeOrg = val;
    },
    incrementStatus(val) {
      if (val) {
        // 点击增量时，清除定时器
        this.stopAnimate();
        setTimeout(() => {
          this.startAnimate();
        }, 5000);
      }
    },
  },
  mounted() {
    this.renderChart();
    setTimeout(() => {
      this.activeOrg = this.curActiveOrg || "1309999";
      this.modalClass = "animate-bounce-modal";
      this.$nextTick(() => {
        this.updateChart();
        this.startAnimate();
      });
    }, 6000);
  },
  methods: {
    mouseenter(item) {
      this.stopAnimate();
      this.activeOrg = item.orgNo;
    },
    mouseleave(item) {
      this.startAnimate();
    },
    execAnimate() {
      this.$nextTick(() => {
        this.updateChart();
      });
    },
    startAnimate() {
      let i = 0;
      this.mapData.pos.forEach((item, index) => {
        if (item.orgNo === this.activeOrg) {
          i = index;
        }
      });
      if (!this.timer) {
        this.timer = setInterval(() => {
          i++;
          if (!this.mapData.pos[i]) {
            // 执行完了跳转到武汉地图
            ScreenModule.SET_ACTIVE_ORG("");
            ScreenModule.SET_ACTIVE_MAP("wuhan");
            // i = 0;
            this.stopAnimate();
            return;
          }
          this.activeOrg = this.mapData.pos[i]?.orgNo;
          this.execAnimate();
          this.stopAnimate();
          this.startAnimate();
        }, 5000);
      }
    },
    stopAnimate() {
      clearInterval(this.timer);
      this.timer = null;
    },
    renderChart() {
      this.chart = echarts.init(this.$refs.mapChart);
      var chinaGeoCoordMap = {};
      var chinaDatas = [];
      this.mapData.pos.forEach((item) => {
        chinaGeoCoordMap[item.orgNo] = [item.locationLng, item.locationLat];
        chinaDatas.push([{ name: item.orgNo, value: 0 }]);
      });

      var series = [];
      // [["武汉市", chinaDatas]].forEach(function(item) {
      //   series.push(
      //     {
      //       type: "scatter",
      //       coordinateSystem: "geo",
      //       zlevel: 11,
      //       symbol: (value, params) => {
      //         console.log(value, params)
      //         return 'image://data:image/png;base64,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'
      //         // return 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAA5CAYAAAAyTtvYAAAABHNCSVQICAgIfAhkiAAABKJJREFUWEetmFtoHFUYx3dm9pJ0Yy5rk2zV1LRWpGlQrGAtiJL2QRS1qBT1RbQvVfTBF9G3Ij6J4IOIIvhgLYIYBCuI1wQkaEVblGosYmxjU9skbXNpbnvJzPj/DWfCNk02K56BP2cyO/Obb77znf85J04YhomVDvf9K646uuJKfvxL8MSKj0YXnf8ATup+TyraBtcJCHzWNrjBgKdsg5sFTEnnbYPXC5iWztoG5w34tG3wdQLSgUO2wZ0C1ksnbIO3CLhOOm4bvNWAj9kG3yxgVjpiG7xdwKukb22DdwjYKH1tG3yngE3SZ7bBu0zEn6oNgNuyzXtMHX+uNrJOW+AHxMKEvpIi67QFflgsZpB+acIWGIN/yHTagNpRW2DM50ED/kFt5HA2UsHAuM+AGdKRw9kA58ShKjgwoUFbYEyeOmYJ8Lv0sy3wRoHuMuA/1ZJnK6nAi3ca8N9qIyOykeNt4txmwOfUMkisgG8V5xYDvqgWv7ACvkOcLgO+pLbXFrhHIPLMUZAO2QJTw1QG5YZlvmsLvEcgahkw6973pGLVqnAOrrw+Np8dN4/qpEXC3Yj4A2lm2T2X/enUCH5ST7GmiCP+SOcXbID3C4LJx8cnOjnzf8BEyCr+WRNtzGJCxeFWzeNqqSCXCChT/j5zDpgcfyP9KrEfQVe8YDk43sDw2RkJg2+XHjcvAgzoe+kniZpmYi2bFy69oBIcfzaLa5ZSRIqulzB5oudBIv5FYqnFKERzUqky+kowDxIls8XVEit4DP5G6X6JPQgHZfajRNRMqlQH/sF1oo+2azGYaGNoq843SKQAIINj2ohnWA2xH/lYYo0xJuF47E1ieBiDmYX5fCJl5Y6e1tvavSD4wnXCvJcI6UyF44S+4xaChLNDeRnXpbclSu8fiehJyyJgoiWvRHGNRE4f0cXbm/zCq6nA3+qGQWedTwoTYcFLu0UvxRd8N+3VvSj4UZ3jdkwAbHzYrpUAEwlbAHKK0WyW3siE/iubihOT2dJC96jXcPdUel0n5ObS/HA2UT7ueu7AqUyupeh4B3T5OemkNGKingdMp9Ex5HSTtFu6t82fe23n5ElnMN26b6gxz3y3dHTMXTy6feHsm0daNofjXvYF/UCu+6RTEjmfjcGUFR0G+DEp11Ga7t1zfig42Nb1+kyqntwvHdlyYfKp8cHnD7ducUfSTXv1A9XxoTQskY5La4J7cze8PFbf3FkJbl+YGt478deBWsCrpmKm7Ozq39B92T8Qes4NHmpMBX0VqfhSL2alT8Ss66JUVO283ROn/RNOpue3lo4oz9smzwx0hYX+vtxGb63Oq1pu+fKMc9Ps6GJHsRT5wEgm7fzRkE+OJRuCqWT9S9XKjfvjAULJXSsxQJ7RG9vSof9OU1C4kPEXowFS9JLBtFu3vuR4+wVltL0lrThAuL/akGYlT+7izTm1ziA6LK05pIGvZkLMdd1Sm6kMOofVJiNsTROKowa+3DZxO0ZmPDXhvfMS+5CabDOGk8tKoweK89EPHICxR0y+JqM3z0VN5dTES/iSqPN0YPSLRjVPTZXw+AvoWFR5UHqxlj8T/f0vvPk0wx0Hh/EAAAAASUVORK5CYII='
      //       },
      //       symbolSize: [5, 5],
      //       data: item[1].map(function(dataItem) {
      //         return {
      //           name: dataItem[0].name,
      //           value: chinaGeoCoordMap[dataItem[0].name].concat([
      //             dataItem[0].value
      //           ])
      //         };
      //       })
      //     }
      //   );
      // });

      axios.get(window.location.origin + window.location.pathname + "static/map/hz.json").then((res) => {
        var geoJson = res.data;
        var mapName = "hubei";
        echarts.registerMap(mapName, geoJson);
        var option = {
          animation: false,
          selectedMode: "multiple",
          grid: {
            top: 100,
            right: 0,
            bottom: 0,
            left: 0,
          },
          geo: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            show: true,
            map: mapName,
            aspectScale: 0.75, //长宽比
            zoom: 0.8,
            zlevel: 1,
            roam: false, //是否开启鼠标缩放和平移漫
            itemStyle: {
              areaColor: "#19437d", // 底图颜色
              borderColor: "#45a1db", // 分割线颜色
              borderWidth: 1,
            },
            emphasis: {
              // 高亮
              label: {
                color: "#fff",
              },
              itemStyle: {
                color: "#77cbf4",
              },
            },
            regions: [],
          },
          series: [
            {
              type: "map",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              map: mapName,
              zoom: 0.8,
              geoIndex: 1,
              aspectScale: 0.75, //长宽比
              roam: false,
              emphasis: {
                label: {
                  show: false,
                },
              },
              itemStyle: {
                shadowColor: "#67d0ff",
                shadowOffsetX: 0,
                shadowOffsetY: 8,
              },
            },
            ...series,
          ],
        };
        this.chart.setOption(option);
      });
    },
    updateChart() {
      let city = "";
      this.mapData.pos.forEach((item) => {
        if (item.orgNo === this.activeOrg) {
          city = item.city;
        }
      });
      let userOptions = this.chart.getOption();
      userOptions.geo[0].regions = [
        {
          name: city,
          label: {
            show: true,
            color: "#fff",
          },
          itemStyle: {
            areaColor: "#77cbf4",
          },
        },
      ];
      this.chart.clear();
      this.chart.setOption(userOptions);
    },
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>

<style scoped lang="scss">
.mapChart {
  width: 1120px;
  height: 600px;
}

.dots {
  transform: translateY(-2000px);
  .dots-item {
    .dots-img {
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9;
    }
  }
}

.modal {
  position: absolute;
  width: 467px;
  height: 299px;
  background: url("../../../../../../assets/images/screen/map-modal.png") center no-repeat;
  z-index: 100;
  transition: all 0.3s;
  transform: scale(0);
  .line {
    position: absolute;
    top: 289px;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
    transform: rotate(135deg);
    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #ffc801;
      border-radius: 50%;
    }
    &::after {
      content: "";
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      display: inline-block;
      width: 60px;
      height: 2px;
      background: #ffc801;
    }
  }
  .modal-cont {
    padding: 19px 10px 8px;
    .modal-title {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      color: #ffc801;
    }
    .modal-compare {
      background-color: rgba(8, 34, 47, 0.4);
      padding: 10px 0;
      margin-bottom: 4px;
      font-size: 14px;
      color: #fff;
      text-align: center;
      .modal-compare-item {
        p:nth-child(2) {
          color: #ffc801;
          font-size: 18px;
          line-height: 1;
          margin: 8px 0 6px;
        }
        .updown-amount {
          color: #44f0ff;
        }
      }
    }
    .quota {
      .quota-item {
        margin-bottom: 4px;
        font-size: 13px;
        background: rgba(8, 34, 47, 0.4);
        padding: 10px;
        height: 80px;
        li {
          line-height: 1.6;
          &::before {
            content: "";
            display: inline-block;
            width: 5px;
            height: 5px;
            background-color: #44f0ff;
            border-radius: 50%;
            margin-right: 5px;
            position: relative;
            top: -2px;
          }
        }
        .amount {
          float: right;
          color: #44f0ff;
        }
      }
      .quota-item-2 {
        li {
          line-height: 2.5;
        }
      }
    }
  }
}

// 添加动画
@keyframes bounce {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
.animate-bounce {
  animation: bounce 3s;
  transform-origin: center;
}

.animate-bounce-modal-delay {
  animation: bounce 1s;
  transform-origin: center;
  animation-delay: 4s;
  animation-fill-mode: forwards;
}

@keyframes bounceDown {
  0% {
    transform: translateY(-1000px);
  }
  100% {
    transform: translateY(-600px);
  }
}

.animate-bounceDown {
  animation: bounceDown 1s;
  animation-delay: 3s;
  animation-fill-mode: forwards;
}

.animate-bounce-modal {
  animation: bounce 1s;
  transform-origin: center;
  animation-fill-mode: forwards;
}
</style>
