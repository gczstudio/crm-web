<template>
  <div class="realTimeLargeAcct-component">
    <ul>
      <li v-for="item in data" :key="item.id">
        <img src="~@/assets/images/screen/arrow.png" alt="">
        <scroll-line class="scroll">
          <p>{{`${item.custName}${item.dcFlag === 'C' ? '来款':'走款'}`}}<span>{{$util.formatMoney(item.tranAmt / 10000)}}</span>万元</p>
        </scroll-line>
        <span class="time">{{item.tranTime.slice(11, 16)}}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ScrollLine from './scrollLine/index.vue'
import * as homeApi  from '@/api/home'
@Component({
  name: "RealTimeLargeAcct",
  components: {
    ScrollLine
  }
})
export default class extends Vue {
 
 private data = []

 mounted() {
  this.queryLargerAccountFlow()
 }

 queryLargerAccountFlow() {
   let params = {
      page: 1,
      size: 10,
      condition: JSON.stringify({"amt":10000000})
   }
   homeApi.queryLargerAccountFlow(params).then(res => {
     this.data = res.data.slice(0, 4)
   })
 }

}
</script>

<style lang="scss" scoped>
.realTimeLargeAcct-component {
  height: 142px;
  li {
    font-size: 14px;
    position: relative;
    background: rgba(0, 183, 238, .1);
    height: 32px;
    line-height: 32px;
    padding: 0 5px 0 3px;
    margin-top: 6px;
    img {
      display: inline-block;
      vertical-align: middle;
    }
    .scroll {
      margin-left: 5px;
      display: inline-block;
      vertical-align: middle;
      width: calc(100% - 55px);
      overflow: hidden;
      p{
        white-space: nowrap;
      }
    }
    .time {
      position: absolute;
      top: 4px;
      right: 5px;
      color:#44F0FF;
      font-size: 12px;
    }
  }
}
</style>
