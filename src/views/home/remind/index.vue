<template>
  <div class="remind-container">
    <div class="section-title">
      <i class="iconfont icon-xinxitixing"></i>
      <span>
        信息提醒（
        <i class="num">{{ total }}</i
        >）
      </span>
    </div>
    <div class="view-more" @click="moreFn">
      更多
      <i class="el-icon-arrow-right"></i>
    </div>
    <div class="remind-content">
      <ul>
        <li v-for="item in remindData" :key="item.id" @click.prevent="showDetailFn(item.id)">
          <span class="tag">【动账】</span>
          <span class="box">
            <span class="content roll" :title="item.custName + `${item.dcFlag == 'C' ? '来款' : '走款'}` + $util.formatMoney(item.tranAmt / 10000) + '万元'">
              <span v-for="(data, index) in 10" :key="index">
                &emsp;&emsp;
                {{ item.custName }}{{ item.dcFlag == "C" ? "来款" : "走款" }}
                <i :class="item.dcFlag == 'C' ? 'red' : 'green'">
                  <span class="num">
                    {{ $util.formatMoney(item.tranAmt / 10000) }}
                  </span>
                </i>
                万元 &emsp;&emsp;&emsp;
              </span>
            </span>
          </span>
          <span class="date num">{{ item.tranTime }}</span>
        </li>
      </ul>
      <Empty v-if="!total" />
    </div>
    <detail :visible.sync="visible" :id="curId" @update="updateFn" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as homeApi from "@/api/home";
import Detail from "./detail.vue";

@Component({
  name: "Remind",
  components: {
    Detail,
  },
})
export default class extends Vue {
  private remindData: any[] = [];
  private visible = false;
  private curId = "";
  private total = 0;
  private ids: any[] = [];
  private condition = {
    amt: 10000000,
  };

  mounted() {
    this.queryLargerAccountFlow();
  }

  queryLargerAccountFlow() {
    homeApi.queryLargerAccountFlow({ page: 1, size: 10, condition: this.condition }).then((res: any) => {
      if (res.code === 0) {
        this.remindData = res.data;
        this.total = res.total;
      }
    });
  }

  showDetailFn(id: string) {
    this.visible = true;
    this.curId = id;
    this.remindRead(id);
  }

  remindRead(id: string) {
    this.ids.push(id);
    homeApi.remindReads(this.ids).then((res: any) => {
      if (res.code === 0) {
        this.ids = [];
      }
    });
  }
  updateFn() {
    this.queryLargerAccountFlow();
  }
  moreFn() {
    this.$router.push({
      name: "RemindMgt",
      params: {
        remindcategoryid: "01",
        remindsubclassid: "0101",
        isflag: "2",
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.remind-container {
  margin-top: 16px;
  padding: 20px;
  min-height: 441px;
  position: relative;
  background: #ffffff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  .chart-empty {
    margin-top: 60px;
  }
  .section-title {
    padding-bottom: 10px;
    border-bottom: 1px solid #c0c0c0;
  }
  .remind-content {
    li {
      cursor: pointer;
      margin-top: 17px;
      transition: all 0.3s;
      &:nth-child(1) {
        margin-top: 11px;
      }
      &:hover {
        // color: $blue;
        animation-play-state: paused;
      }
    }
    .tag {
      vertical-align: middle;
      line-height: 18px;
      color: #007eff;
      &.tag-top {
        color: #f14922;
      }
    }
    .content {
      line-height: 18px;
      vertical-align: middle;
      display: inline-block;
      // width: calc(100% - 200px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .date {
      position: relative;
      top: 2px;
      float: right;
      color: #999;
    }
    .box {
      position: absolute;
      left: 0;
      overflow: hidden;
      // border: 1px solid red;
      margin-left: 70px;
      width: calc(100% - 212px);
    }
    .roll {
      position: relative;
      overflow: hidden;
      -webkit-animation: mymove 45s linear 2s infinite normal;
      animation: mymove 45s linear 2s infinite normal;
      &:hover {
        animation-play-state: paused;
      }
    }

    @keyframes mymove {
      from {
        left: 0%;
      }
      to {
        left: -1000%;
      }
    }
    .red {
      color: red;
    }
    .green {
      color: green;
    }
  }
}
</style>
