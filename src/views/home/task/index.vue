<template>
  <div class="task-container">
    <div class="section-title">
      <div>
        <i class="iconfont icon-daibanrenwu"></i>
        <span>待办任务（<i class="num">{{ total }}</i>）</span>
      </div>
    </div>
    <div class="view-more" @click="moreFn">
      更多
      <i class="el-icon-arrow-right"></i>
    </div>
    <div class="task-content">
      <el-row :gutter="20">
        <el-col :span="12" v-for="item in taskData.slice(0, 4)" :key="item.id">
          <div class="task-card">
            <p class="name">{{ item.custName }}</p>
            <p class="desc">变动金额(万元)</p>
            <p class="amount num">{{ $util.formatMoney(item.chgAmt / 10000) }}</p>
            <div class="btns">
              <div class="btn" @click="showDetailFn(item.id, 1)">查看</div>
              <div class="btn" @click="showDetailFn(item.id, 2)" v-permission="'taskEdit'">填报</div>
            </div>
          </div>
        </el-col>
      </el-row>
      <Empty v-if="!total" />
    </div>
    <task-detail :visible.sync="visible" :id="curId" :type="type" @update="updateFn" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as homeApi from "@/api/home";
import TaskDetail from "./detail.vue";

@Component({
  name: "Task",
  components: {
    TaskDetail,
  },
})
export default class extends Vue {
  private taskData: any[] = [];
  private visible = false;
  private curId = "";
  private type = 1;
  private total = 0;
  private condition = {
    amt: 10000000,
  };

  mounted() {
    this.queryLargerCustFlow();
  }

  queryLargerCustFlow() {
    homeApi
      .queryLargerCustFlow({ page: 1, size: 4, condition: this.condition })
      .then((res: any) => {
        if (res.code === 0) {
          this.taskData = res.data;
          this.total = res.total;
        }
      });
  }

  showDetailFn(id: string, type: number) {
    this.visible = true;
    this.curId = id;
    this.type = type;
  }

  moreFn() {
    this.$router.push({
      name: "TaskMgt",
      params: { remindSType: "2" },
    });
  }

  updateFn() {
    this.queryLargerCustFlow();
  }
}
</script>

<style lang="scss" scoped>
.task-container {
  margin-top: 16px;
  padding: 20px 0;
  // max-height: 320px;
  position: relative;
  background: #ffffff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  .chart-empty {
    padding: 50px 0 30px;
  }
  .section-title {
    padding: 0 20px;
    & > div {
      padding-bottom: 10px;
      border-bottom: 1px solid #c0c0c0;
    }
  }
  .btns {
    position: absolute;
    bottom: 8px;
    right: 10px;
    z-index: 2;
    .btn {
      display: inline-block;
      padding: 0;
      padding: 0 10px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      background: #fff;
      color: #007eff;
      border-radius: 2px;
      box-shadow: 0px 2px 3px rgba(0, 126, 255, 0.4);
      cursor: pointer;
      &:nth-child(2) {
        color: #f14922;
        margin-left: 10px;
        box-shadow: 0px 2px 3px rgba(241, 73, 34, 0.4);
      }
    }
  }
  .task-content {
    padding: 0 20px;
    .task-card {
      position: relative;
      margin-top: 12px;
      height: 108px;
      padding: 10px;
      background: #ffffff;
      box-shadow: 0px 3px 7px 1px rgba(0, 92, 187, 0.2);
      .desc {
        color: #999;
        font-size: 12px;
        margin: 5px 0;
      }
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .amount {
        font-size: 16px;
        font-weight: bold;
      }
      .el-icon-edit {
        position: absolute;
        top: 16px;
        right: 10px;
        font-size: 20px;
        color: #0fcb51;
        display: none;
      }
      &:hover {
        // border-color: $blue;
        .el-icon-edit {
          display: block;
        }
      }
    }
  }
}
@media screen and (max-width: 1680px) {
  .task-container {
    margin-top: 12px;
    padding: 12px 0;
    .section-title {
      padding: 0 12px;
    }
    .view-more {
      right: 12px;
      top: 14px;
    }
  }
}
</style>
