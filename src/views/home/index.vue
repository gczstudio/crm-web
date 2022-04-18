<template>
  <div id="scrollAlignBox" class="home-container">
    <el-row :gutter="isMaxScreen ? 16 : 12">
      <el-col :span="17">
        <div v-scrollalign="needAlignUpdate">
          <!-- 公告栏 -->
          <NoticeBoard />
          <!-- 图表 -->
          <Chart />
        </div>
      </el-col>
      <el-col :span="7" id="rightBox">
        <div v-scrollalign>
          <!-- 常用功能 -->
          <CommonFuns />
          <!-- 待办任务 -->
          <Task v-permission="'taskView'" />
          <!-- 信息提醒 -->
          <Remind v-permission="'remindView'" />
        </div>
      </el-col>
    </el-row>
    <fixed-right-tool />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NoticeBoard from "./noticeBoard/index.vue";
import Chart from "./chart/index.vue";
import CommonFuns from "./commonFuns/index.vue";
import Task from "./task/index.vue";
import Remind from "./remind/index.vue";
import { HomeModule } from "@/store/modules/home";
import FixedRightTool from '@/layout/components/FixedRightTool/index.vue'

@Component({
  name: "Home",
  components: {
    NoticeBoard,
    Chart,
    CommonFuns,
    Task,
    Remind,
    FixedRightTool
  },
})
export default class extends Vue {
  get needAlignUpdate(): boolean {
    return HomeModule.needAlignUpdate;
  }

}
</script>

<style lang="scss" scoped>
.home-container {
  .section-title {
    .iconfont {
      margin-right: 10px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
    }
  }
}
</style>
