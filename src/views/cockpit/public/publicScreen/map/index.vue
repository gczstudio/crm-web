<template>
  <div class="map-component">
    <div class="map">
      <HzMap v-if="hubei.data.length && activeMap === 'wuhan'" :map-data="hubei" />
      <WuhanMap v-if="wuhan.data.length && activeMap === 'hubei'" :map-data="wuhan" />
    </div>
    <div class="map-switch" @click="clickFn">
      <img :src="require(`@/assets/images/screen/${activeMap}-s.png`)" alt="" />
    </div>
  </div>
</template>

<script>
import HzMap from "./hzMap/index.vue";
import WuhanMap from "./wuhanMap/index.vue";
import * as screenApi from "@/api/screen";
import { ScreenModule } from "@/store/modules/screen";
export default {
  name: "Map",
  inject: ["screenInstance"],
  components: {
    HzMap,
    WuhanMap,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      activeMap: "wuhan",
      // busiLine: '00',
      hubei: {
        pos: [],
        data: [],
        orgNms: [],
      },
      wuhan: {
        pos: [],
        data: [],
        orgNms: [],
      },
    };
  },
  computed: {
    curActiveMap() {
      return ScreenModule.activeMap;
    },
  },
  watch: {
    curActiveMap(val) {
      this.activeMap = val === "hubei" ? "wuhan" : "hubei";
    },
  },
  mounted() {
    this.queryareabranch();
  },
  methods: {
    clickFn() {
      ScreenModule.SET_ACTIVE_ORG("");
      this.activeMap = this.activeMap === "hubei" ? "wuhan" : "hubei";
    },
    queryareabranch() {
      screenApi
        .queryareabranch({
          condition: JSON.stringify({
            busiLine: this.screenInstance.busiLine,
          }),
        })
        .then((res) => {
          res.data.forEach((item) => {
            item = {
              ...item,
              positionTop: parseFloat(item.positionTop),
              positionLeft: parseFloat(item.positionLeft),
            };
            if (item.ifWuhan === "1") {
              this.wuhan.pos.push(item);
              this.wuhan.orgNms.push(item.orgNo);
            } else {
              this.hubei.pos.push(item);
              this.hubei.orgNms.push(item.orgNo);
            }
          });
          ScreenModule.SET_WUHAN_ORGNMS(this.wuhan.orgNms);
          this.querybrnch();
        });
    },
    querybrnch() {
      screenApi
        .querybrnch({
          condition: JSON.stringify({
            busiLine: this.screenInstance.busiLine,
          }),
        })
        .then((res) => {
          let hubeiData = [],
            wuhanData = [];
          res.data.forEach((item) => {
            if (this.hubei.orgNms.includes(item.orgNo)) {
              hubeiData.push(item);
            } else if (this.wuhan.orgNms.includes(item.orgNo)) {
              wuhanData.push(item);
            }
          });
          this.hubei = {
            ...this.hubei,
            data: hubeiData,
          };

          this.wuhan = {
            ...this.wuhan,
            data: wuhanData,
          };
        });
    },
  },
};
</script>

<style scoped lang="scss">
.map-component {
  position: relative;
  height: 600px;
  .map {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .map-switch {
    position: absolute;
    right: 20px;
    bottom: 10px;
    cursor: pointer;
    width: 100px;
    height: 80px;
    border: 1px solid #00abec;
    background-color: #0d1a3f;
    text-align: center;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
