<template>
  <div style="position: relative;" >
     <div class="mapChart animate-bounce" ref="mapChart"></div>
     <div class="dots animate-bounceDown">
        <div class="dots-item" v-for="item in mapData.pos" :key="item.orgNo" @mouseenter="mouseenter(item)" @mouseleave="mouseleave(item)">
         <img v-if="activeOrg===item.orgNo" :style="{'top': item.positionTop - 11 + 'px', 'left': item.positionLeft +'px'}" class="dots-img dots-img1" src="~@/assets/images/screen/dot.png" alt="">
         <img v-else :style="{'top': item.positionTop + 'px', 'left': item.positionLeft +'px'}" class="dots-img dots-img2" src="~@/assets/images/screen/dot1.png" alt="">
        </div>
     </div>
     <div v-if="activeOrg && Object.keys(modalData).length" id="modal" :key="activeOrg" :class="`modal ${modalClass}`" :style="mapStyle.modal">
      <div class="line" :style="mapStyle.line"></div>
      <div class="modal-cont">
        <div class="modal-title">{{modalData.orgNm === '经济技术开发区支行' ? ('武汉' + modalData.orgNm) : modalData.orgNm}}</div>
        <div class="modal-compare">
          <el-row>
            <el-col :span="8" class="modal-compare-item">
              <p>对公存款余额(亿元)</p>
              <p>{{$util.formatMoney(modalData.deptBal / 100000000)}}</p>
              <p>比上年末<span class="updown-amount">{{(modalData.deptBalLastYear > 0 ? '+' : '') + $util.formatMoney(modalData.deptBalLastYear / 100000000)}}</span></p>
            </el-col>
            <el-col :span="8" class="modal-compare-item">
              <p>对公存款日均(亿元)</p>
              <p>{{$util.formatMoney(modalData.deptBalAvgYear / 100000000)}}</p>
              <p>比上年末<span class="updown-amount">{{(modalData.deptBalAvgLastYear > 0 ? '+' : '') + $util.formatMoney(modalData.deptBalAvgLastYear / 100000000)}}</span></p>
            </el-col>
            <el-col :span="8" class="modal-compare-item">
              <p>对公贷款余额(亿元)</p>
              <p>{{$util.formatMoney(modalData.loanBal / 100000000)}}</p>
              <p>比上年末<span class="updown-amount">{{(modalData.loanBalLastYear > 0 ? '+' : '') + $util.formatMoney(modalData.loanBalLastYear / 100000000)}}</span></p>
            </el-col>
          </el-row>
        </div>
        <div class="quota">
          <el-row :gutter="4">
            <el-col :span="12">
              <ul class="quota-item quota-item-2">
                <li>对公有效客户数<span class="amount">{{modalData.yxCustNum}}</span></li>
                <li>对公信贷客户数<span class="amount">{{modalData.xdCustNum}}</span></li>
              </ul>
            </el-col>
            <el-col :span="12">
              <ul class="quota-item">
                <li>对公客户FTP利润({{$util.formatMoneyAutoUnit(modalData.ftpProfitBalnc).unit}})<span class="amount">{{$util.formatMoneyAutoUnit(modalData.ftpProfitBalnc).num}}</span></li>
                <li>对公客户中收({{$util.formatMoneyAutoUnit(modalData.midBizInc).unit}})<span class="amount">{{$util.formatMoneyAutoUnit(modalData.midBizInc).num}}</span></li>
                <li>对公客户EVA({{$util.formatMoneyAutoUnit(modalData.eva).unit}})<span class="amount">{{$util.formatMoneyAutoUnit(modalData.eva).num}}</span></li>
              </ul>
            </el-col>
            <el-col :span="12">
              <ul class="quota-item">
                <li>对公存款付息率(%)<span class="amount">{{modalData.avgDpsRate}}</span></li>
                <li>对公贷款收息率(%)<span class="amount">{{modalData.avgLneRate}}</span></li>
                <li>对公业务净利差(%)<span class="amount">{{modalData.netMargin}}</span></li>
              </ul>
            </el-col>
            <el-col :span="12">
              <ul class="quota-item">
                <li>授信敞口额度({{$util.formatMoneyAutoUnit(modalData.creditExposureAmt).unit}})<span class="amount">{{$util.formatMoneyAutoUnit(modalData.creditExposureAmt).num}}</span></li>
                <li>已使用敞口额度({{$util.formatMoneyAutoUnit(modalData.userdCreditExposureAmt).unit}})<span class="amount">{{$util.formatMoneyAutoUnit(modalData.userdCreditExposureAmt).num}}</span></li>
                <li>敞口额度使用率(%)<span class="amount">{{$util.toFixed(modalData.creditExposureUseRate, 2)}}</span></li>
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
import { ScreenModule } from '@/store/modules/screen'
export default {
  name: 'Map',
  props: {
    mapData: Object
  },
  data() {
    return {
      data: [],
      activeOrg: '',
      result: [
        {
          orgNm: '光谷分行',
          city: '武汉市',
          area: '江夏区',
          address: '武汉市东湖新技术开发区民族大道1号',
          locationLng: 114.40271635550005,
          locationLat: 114.40271635550005,
          positionTop: 340,
          positionLeft: 310
        },
        {
          orgNm: '科技金融服务中心',
          city: '武汉市',
          area: '江夏区',
          address: '武汉市东湖新技术开发区关山大道特1号光谷软件园A5栋',
          locationLng: 114.41393125063938,
          locationLat: 30.479852522383474,
          positionTop: 345,
          positionLeft: 324
        },
        {
          orgNm: '总行营业部',
          city: '武汉市',
          area: '江汉区',
          address: '武汉市江汉区建设大道933号',
          locationLng: 114.27709228247389,
          locationLat: 30.601877713000025,
          positionTop: 295,
          positionLeft: 265
        },
        {
          orgNm: '武汉经济技术开发区支行',
          city: '武汉市',
          area: '蔡甸区',
          address: '武汉市武汉经济技术开发区创业路12号嘉昱建银商务公馆',
          locationLng: 114.16872223286951,
          locationLat: 30.498254183282615,
          positionTop: 335,
          positionLeft: 222
        },
        {
          orgNm: '江岸支行',
          city: '武汉市',
          area: '江岸区',
          address: '武汉市江岸区中山大道1541号三阳金城B栋1层',
          locationLng: 114.30970526401363,
          locationLat: 30.604427881376736,
          positionTop: 295,
          positionLeft: 278
        },
        {
          orgNm: '江汉支行',
          city: '武汉市',
          area: '江汉区',
          address: '武汉市江汉区新华下路特8号1-2层 ',
          locationLng: 114.27143700013582,
          locationLat: 30.634193866973884,
          positionTop: 278,
          positionLeft: 250
        },
        {
          orgNm: '硚口支行',
          city: '武汉市',
          area: '硚口区',
          address: '武汉市硚口区硚口路160号',
          locationLng: 114.2592869689606,
          locationLat: 30.582476200865088,
          positionTop: 306,
          positionLeft: 243
        },
        {
          orgNm: '汉正街支行',
          city: '武汉市',
          area: '硚口区',
          address: '武汉市硚口区利济南路107-109号',
          locationLng: 114.27888628840785,
          locationLat: 30.573373879171257,
          positionTop: 310,
          positionLeft: 255
        },
        {
          orgNm: '汉阳支行',
          city: '武汉市',
          area: '汉阳区',
          address: '武汉市汉阳区翠微路1号宏阳大厦1层',
          locationLng: 114.27224188187274,
          locationLat: 30.551625955571033,
          positionTop: 320,
          positionLeft: 235
        },
        {
          orgNm: '武昌支行',
          city: '武汉市',
          area: '武昌区',
          address: '武汉市武昌区中山路440号',
          locationLng: 114.32431171160587,
          locationLat: 30.544813217235955,
          positionTop: 320,
          positionLeft: 284
        },
        {
          orgNm: '水果湖支行',
          city: '武汉市',
          area: '洪山区',
          address: '武汉市洪山区洪山路33号',
          locationLng: 114.35069817833376,
          locationLat: 30.551922728687526,
          positionTop: 318,
          positionLeft: 296
        },
        {
          orgNm: '青山支行',
          city: '武汉市',
          area: '青山区',
          address: '武汉市青山区沿港路5号',
          locationLng: 114.4103815964167,
          locationLat: 30.64376027962228,
          positionTop: 278,
          positionLeft: 325
        },
        {
          orgNm: '洪山支行',
          city: '武汉市',
          area: '洪山区',
          address: '武汉市洪山区珞瑜路745号',
          locationLng: 114.35234746725007,
          locationLat: 30.598584859414313,
          positionTop: 300,
          positionLeft: 304
        },
        {
          orgNm: '蔡甸支行',
          city: '武汉市',
          area: '蔡甸区',
          address: '武汉市蔡甸区蔡甸大街208号',
          locationLng: 114.03641539566296,
          locationLat: 30.577376883465757,
          positionTop: 305,
          positionLeft: 165
        },
        {
          orgNm: '江夏支行',
          city: '武汉市',
          area: '江夏区',
          address: '武汉市江夏区文华路中百江夏购物中心',
          locationLng: 114.31998466379486,
          locationLat: 30.35421397592687,
          positionTop: 390,
          positionLeft: 285
        },
        {
          orgNm: '东西湖支行',
          city: '武汉市',
          area: '东西湖区',
          address: '武汉市东西湖区吴家山吴中路288号',
          locationLng: 114.15766481068609,
          locationLat: 30.634934654896696,
          positionTop: 280,
          positionLeft: 202
        },
        {
          orgNm: '黄陂支行',
          city: '武汉市',
          area: '黄陂区',
          address: '武汉市黄陂区黄陂大道387号',
          locationLng: 114.38220579494347,
          locationLat: 30.886248254352076,
          positionTop: 185,
          positionLeft: 315
        },
        {
          orgNm: '阳逻开发区支行',
          city: '武汉市',
          area: '新洲区',
          address: '武汉市武汉阳逻经济开发区汉施路特1号',
          locationLng: 114.57624454611792,
          locationLat: 30.709622560400312,
          positionTop: 255,
          positionLeft: 395
        },
        {
          orgNm: '小微企业金融服务中心',
          city: '武汉市',
          area: '江汉区',
          address: '武汉市江汉区建设大道933号',
          locationLng: 114.27709228247389,
          locationLat: 30.601877713000025,
          positionTop: 290,
          positionLeft: 230
        }
      ],
      timer: null,
      modalClass: 'animate-bounce-modal-delay',
      chart: null
    };
  },
  computed: {
    mapStyle() {
      let curMap = this.mapData.pos.find(item => item.orgNo === this.activeOrg)
      if(!curMap) return {}
      let top  = curMap.positionTop, left = curMap.positionLeft
      let modalWidth = 467, modalHeight = 299  // 弹出框宽高
      let mapHalfWidth = 320, mapHalfHeight = 200  // map一半的宽高
      // 左下角
      if(top > mapHalfHeight && left < mapHalfWidth) {
        return {
          modal: {
            top: top - modalHeight + 'px',
            left: left + 62 + 'px',
            transformOrigin: 'bottom left'
          },
          line: {
            top: modalHeight - 8 + 'px',
            left: 0,
            transform: 'rotate(150deg)'
          }
        }
      }

      // 左上角
      if(top <= mapHalfHeight && left <= mapHalfWidth) {
        // 特殊处理，黄陂支行
        if(this.activeOrg === '1103699') { //黄陂支行
          return {
            modal: {
              top: top + 76 + 'px',
              left: left - 50 + 'px',
              transformOrigin: 'top left'
            },
            line: {
              top: 0,
              left: 0,
              transform: 'rotate(-45deg)'
            }
          }
        }
        return {
          modal: {
            top: top + 74 + 'px',
            left: left + 52 + 'px',
            transformOrigin: 'top left'
          },
          line: {
            top: 0,
            left: 0,
            transform: 'rotate(-135deg)'
          }
        }
      }


      // 右下角
      if(top > mapHalfHeight && left  > mapHalfWidth) {
        // 超出边界时
        let beyond = top - modalHeight
        if (beyond < 0) {
          let rotate = 45 + (1.2 * beyond)
          top = 0;
          if(beyond + 43 >0) {
            top = -10
            left =  left - modalWidth - 57
          } else {
            left =  left - modalWidth - 58
          }

          return {
            modal: {
              top: top + 'px',
              left: left + 'px',
              transformOrigin: 'bottom right'
            },
            line: {
              top: modalHeight - 10 + 'px',
              left: modalWidth - 10 + 'px',
              transform: `rotate(${rotate}deg)`
            }
          }
        }
       
        return {
          modal: {
            top: top - modalHeight - 12 +  'px',
            left: left - modalWidth - 40 + 'px',
            transformOrigin: 'bottom right'
          },
          line: {
            top: modalHeight - 10 + 'px',
            left: modalWidth - 10 + 'px',
            transform: 'rotate(45deg)'
          }
        }
      }

      // 右上角
      if(top <= mapHalfHeight && left >= mapHalfWidth) {
        return {
          modal: {
            top: top +  72 + 'px',
            left: left -modalWidth - 44+ 'px',
            transformOrigin: 'top right'
          },
          line: {
            top: 0,
            left: modalWidth - 7 + 'px',
            transform: 'rotate(315deg)'
          }
        }
      }
    },
    modalData() {
      return this.mapData.data.find(item => item.orgNo === this.activeOrg) || {}
    },
    curActiveOrg() {
      return ScreenModule.activeOrg
    },
    incrementStatus() {
      return ScreenModule.incrementStatus
    }
  },
  watch: {
    activeOrg(val) {
      // val = val === '经济技术开发区支行' ? ('武汉' + val) : val
      ScreenModule.SET_ACTIVE_ORG(val)
      this.execAnimate();
    },
    curActiveOrg(val) {
      this.activeOrg = val
    },
    incrementStatus(val) {
      if(val) {
        // 点击增量时，清除定时器
        this.stopAnimate()
        setTimeout(() => {
          this.startAnimate()
        }, 5000)
      }
    }
  },
  mounted() {
    this.renderChart();
    setTimeout(() => {
      this.activeOrg = this.curActiveOrg || '1102899';
      this.modalClass = 'animate-bounce-modal';
      this.$nextTick(() => {
        this.updateChart();
        this.startAnimate();
      });
    }, 6000)
  },
  methods: {
    mouseenter(item) {
      this.stopAnimate()
      this.activeOrg = item.orgNo;
    },
    mouseleave(item) {
      this.startAnimate();
    },
    execAnimate() {
      this.$nextTick(() => {
        this.updateChart()
      });
    },
    startAnimate() {
      let i = 0;
      this.mapData.pos.forEach((item, index) =>{
        if(item.orgNo === this.activeOrg) {
          i = index;
        }
      });
      if(!this.timer) {
        this.timer = setInterval(() => {
          i++;
          if(!this.mapData.pos[i]) {
            // 执行完了跳转到湖北地图
            ScreenModule.SET_ACTIVE_ORG('')
            ScreenModule.SET_ACTIVE_MAP('hubei')
            // i = 0;
            this.stopAnimate();
            return;
          }
          
          this.activeOrg = this.mapData.pos[i]?.orgNo
          this.execAnimate();
          this.stopAnimate();
          this.startAnimate();
        }, 5000)
      }
    },
    stopAnimate() {
      clearInterval(this.timer)
      this.timer = null
    },
    renderChart() {
      this.chart = echarts.init(this.$refs.mapChart);
      var chinaGeoCoordMap = {}
      var chinaDatas = []
      this.mapData.pos.forEach(item => {
        chinaGeoCoordMap[item.orgNo] = [item.locationLng, item.locationLat]
        chinaDatas.push([{name: item.orgNo, value: 0}])
      })
      
      var series = [];
      // 显示具体的经纬度的点
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
      axios.get(window.location.origin + window.location.pathname + "static/map/wuhan.json").then((res)=> {
        var geoJson = res.data;
        var mapName = "hubei";
        echarts.registerMap(mapName, geoJson);
        var option = {
          animation: false,
          selectedMode: "multiple", // 选中效果固话
          grid: {
            top: 100,
            right: 0, 
            bottom: 0,
            left: 0
          },
          geo: {
            top:0,
            right: 0,
            bottom: 0,
            left: 0,
            show: true,
            map: mapName,
            // aspectScale: 0.75, //长宽比
            zoom: 0.9,
            zlevel: 1,
            roam: false,  //是否开启鼠标缩放和平移漫
            itemStyle: {
              areaColor: "#19437d",   // 底图颜色
              borderColor: "#45a1db", // 分割线颜色
              borderWidth: 1,
            },
            emphasis: { // 高亮
              label: {
                color: '#fff',
              },
              itemStyle: {
                color: "#77cbf4"
              }
            },
            regions: []
          },
          series: [
            {
              type: "map",
              top:0,
              right: 0,
              bottom: 0,
              left: 0,
              map: mapName,
              zoom: 0.9,
              geoIndex: 1,
              roam: false,
              emphasis: {
                label:{
                  show:false
                }
              },
              itemStyle: {
                shadowColor: "#67d0ff",
                shadowOffsetX: 0,
                shadowOffsetY: 8,
              }
            },
            ...series
            
          ]
        };
        this.chart.setOption(option);
      });
    },
    updateChart() {
      let area = ''
      this.mapData.pos.forEach(item => {
        if (item.orgNo === this.activeOrg){
          area = item.area
        }
      })
      let userOptions = this.chart.getOption()
      userOptions.geo[0].regions = [
        {
          name: area,
          label: {
            show: true,
            color: '#fff',
          },
          itemStyle: {
            areaColor: '#77cbf4'
          }
        }
      ]
      this.chart.clear()
      this.chart.setOption(userOptions)
    }
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
  }
};
</script>

<style scoped lang="scss">
.mapChart {
  width: 645px;
  height: 600px;
}
.tooltip {
  position: relative;
  .line{
    width: 4px;
    height: 20px;
    background: red;
  }
  
}

.dots {
  transform: translateY(-2000px);
  .dots-item {
    .dots-img {
      cursor: pointer;
      position: absolute;
      top:0;
      left: 0;
      z-index: 9;
    }
    .dots-img1 {
      width: 12px;
      height: 48px;
    }
    .dots-img2 {
      width: 12px;
      height: 36px;
    }
  }
}

.modal {
  position: absolute;
  width: 467px;
  height: 299px;
  background: url("../../../../../../assets/images/screen/map-modal.png") center no-repeat;
  z-index: 100;
  transition: all .3s;
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
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #FFC801;
      border-radius: 50%;
    }
    &::after {
      content: '';
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      display: inline-block;
      width: 60px;
      height: 2px;
      background: #FFC801;
    }
  }
  .modal-cont {
    padding: 19px 10px 8px;
    .modal-title{
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      color: #FFC801;
    }
    .modal-compare{
      background-color: rgba(8, 34, 47, .4);
      padding: 10px 0;
      margin-bottom: 4px;
      font-size: 14px;
      color: #fff;
      text-align: center;
      .modal-compare-item {
        p:nth-child(2) {
          color: #FFC801;
          font-size: 18px;
          line-height: 1;
          margin: 8px 0 6px;
        }
        .updown-amount {
          color: #44F0FF;
        }
      }
    }
    .quota {
      .quota-item {
        margin-bottom: 4px;
        font-size: 13px;
        background: rgba(8, 34, 47, .4);
        padding: 10px;
        height: 80px;
        li {
          line-height: 1.6;
          &::before {
            content: '';
            display: inline-block;
            width: 5px;
            height: 5px;
            background-color: #44F0FF;
            border-radius: 50%;
            margin-right: 5px;
            position: relative;
            top: -2px;
            
          }
        }
        .amount {
          float: right;
          color: #44F0FF;
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
