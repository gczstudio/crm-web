<template>
  <div class="noticeBoard-container clearfix">
    <div class="notice-title fl">
      <i class="icon iconfont icon-laba"></i>
      <span>
        公告(
        <i class="num">{{ noticeTotal > 10 ? "10+" : noticeTotal }}</i> ) :
      </span>
    </div>
    <div class="notice-content" ref="listRef">
      <ul class="rowleft" ref="rowRef" @mouseenter="mouseenterFn" @mouseleave="mouseleaveFn">
        <li v-for="(item, index) in remindData" :key="index" @click="details(item)">
          <span class="notice-top">{{ item.isTop == "Y" ? "【置顶】" : "" }}</span>
          {{ item.noticeTitle }}
        </li>
      </ul>
    </div>
    <div
      class="more"
      @click="
        $router.push({
          name: 'NoticeMgt',
        })
      "
    >
      更多
      <i class="el-icon-arrow-right"></i>
    </div>
    <Details :Visible="dialogVisible" :noticeDetail="noticeDetail" @close="closeHandler"></Details>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import * as homeApi from "@/api/home";
import { getUserInfo, getCheckedRole } from "@/utils";
import { HomeModule } from "@/store/modules/home";
import Details from "./details.vue";
@Component({
  name: "NoticeBoard",
  components: {
    Details,
  },
})
export default class extends Vue {
  @Ref("rowRef") rowRef: any;
  @Ref("listRef") listRef: any;
  private roleInfo: any; // 定义登录后seesion中当前选中的数据
  private userInfo: any; // 定义登录后seesion中的数据
  private remindData: any = []; // 定义未读的总数据
  private noticeTotal = ""; // 定义未读的总数据条数
  private noticeDetail: object = {}; // 定义当前未读数据详情
  private dialogVisible = false;
  private timer: any = null;
  private disArr: any = null;
  private curPos: any = 0;
  private ulWidth: any = 0;
  beforeCreate() {
    this.userInfo = getUserInfo(); // 获取登录后seesion中的数据
    this.roleInfo = getCheckedRole();
  }
  created() {
    this.noticeList();
  }

  mouseenterFn() {
    this.clearTimer();
  }

  mouseleaveFn() {
    this.moveLeft();
  }

  moveLeft() {
    this.ulWidth = this.ulWidth || this.rowRef.clientWidth;
    var startDis = 0;
    if (this.curPos) {
      startDis = this.curPos;
      this.curPos = 0;
    }

    var boxWidth = this.listRef.clientWidth;
    this.timer = setInterval(() => {
      if (!this.rowRef) return;
      startDis -= 1;
      if (startDis === 0) {
        this.ulWidth = this.rowRef.clientWidth;
      }

      if (Math.abs(startDis) > this.ulWidth) {
        startDis = boxWidth;
        this.ulWidth = boxWidth;
      }
      this.curPos = startDis;
      this.rowRef.style = `transform: translateX(${startDis}px)`;
    }, 10);
  }

  clearTimer() {
    clearInterval(this.timer);
    this.timer = null;
  }

  noticeList() {
    // 定义查询未读数据的方法
    let initTableParams = {
      // 定义查询未读数据的请求参数
      condition: JSON.stringify({
        reciveOrg: [{ id: this.userInfo.org.code }, { id: this.roleInfo.orgCode }],
        userId: this.userInfo.userId,
        roles: [{ id: this.roleInfo.roleCode }],
        readSts: "未阅",
      }),
      size: 20,
    };
    homeApi.noticeList(initTableParams).then((res: any) => {
      if (res.code === 0) {
        this.remindData = res.data;
        this.noticeTotal = res.total;
        HomeModule.UPDATE_NOTICE_TOATL(this.noticeTotal); // 更新未读数据总条数
        this.$nextTick(() => {
          this.moveLeft();
        });
      }
    });
  }
  details(row: Object) {
    // 点击查询未读数据详情
    var _this = this;
    _this.dialogVisible = true;
    this.$set(row, "readUserId", _this.userInfo.userId);
    homeApi.noticeDetails(row).then((res: any) => {
      if (res.code === 0) {
        this.noticeDetail = res.data.list[0];
        let arr = [];
        arr.push(row);
        this.reads(arr); // 调用数据标为已读方法
        this.noticeList(); // 更新视图
      }
    });
  }
  reads(row: any) {
    // 定义点击数据标为已读方法
    homeApi.noticeReads(row).then((res: any) => {
      if (res.code === 0) {
        // console.log("已阅");
      }
    });
  }
  closeHandler(e: any) {
    var _this = this;
    _this.dialogVisible = e;
  }

  destroyed() {
    this.clearTimer();
  }
}
</script>

<style lang="scss">
.noticeBoard-container {
  .more {
    cursor: pointer;
    position: absolute;
    top: 0px;
    right: 0;
    // color: $blue;
    opacity: 1;
    transition: all 0.3s;
    &:hover {
      opacity: 0.8;
    }
  }
  .notice-content {
    li:hover {
      text-decoration: underline;
      // color: $blue;
    }
  }
}
</style>

<style lang="scss" scoped>
.noticeBoard-container {
  position: relative;
  margin-bottom: 10px;
  .notice-title {
    .iconfont {
      color: #f14922;
    }
    span {
      margin: 0 10px;
      line-height: 20px;
      font-weight: bold;
    }
  }
  .notice-content {
    line-height: 20px;
    color: #666;
    width: calc(100% - 170px);
    overflow: hidden;
    ul {
      white-space: nowrap;
      width: fit-content;
      &:hover {
        animation-play-state: paused;
      }
    }
    li {
      display: inline-block;
      cursor: pointer;
      & + li {
        margin-left: 23px;
      }
    }
  }
  .notice-top {
    color: #f14922;
  }

  // .rowleft {
  //   float: left;
  //   -webkit-animation: 15s rowleft linear infinite normal;
  //   animation: 15s rowleft linear infinite normal;
  //   position: relative;
  //   left: 0;
  // }
  .icon-laba:before {
    content: "\e636";
    position: relative;
    top: -1px;
  }
  // @keyframes rowleft {
  //   0% {
  //     left: 0;
  //   }
  //   100% {
  //     left: -100%;
  //   }
  // }
}
</style>
