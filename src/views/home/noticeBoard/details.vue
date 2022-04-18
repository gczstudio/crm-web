<template>
  <div class="detail-container">
    <yu-dialog
      :visible.sync="dialogVisible"
      @close="close"
      custom-class="home-notice-detail-dialog"
      top="10vh"
    >
      <template slot="title">
        <span class="el-dropdown-link">
          <img class="avatar" src="../../../assets/images/notice/man.png" alt />
          <div class="user-info">
            <div class="username f3">{{noticeDetail.pubUserName}}</div>
          </div>
        </span>
        <span class="bank" v-show="noticeDetail.isTop == 'Y' ">{{"置顶"}}</span>
        <span class="xinxin">{{noticeDetail.noticeLevel == 'I' ? "重要" :"一般"}}</span>
        <!-- <div class="fengexian"></div> -->
      </template>
      <div class="base-info f3">
        <div class="section-title">{{noticeDetail.noticeTitle}}</div>
        <div class="content" v-html="noticeDetail.detailcontent"></div>
      </div>
      <el-divider></el-divider>
      <div class="jigou f2">
        <div class="pubOrgName">
          <span class="left">发布机构</span>
          <span>&nbsp;: {{noticeDetail.pubOrgName}}</span>
        </div>
        <div>
          <img
            v-show="noticeDetail.pubTime"
            title="发布时间"
            class="pubtime"
            src="../../../assets/images/notice/pubtime1.png"
            alt
          />
          <span class="span">{{noticeDetail.pubTime}}</span>
          <img
            v-show="noticeDetail.activeDate"
            title="有效时间"
            class="activetime"
            src="../../../assets/images/notice/activetime1.png"
            alt
          />
          <span class="span">{{noticeDetail.activeDate}}</span>
        </div>
      </div>
      <!-- <el-divider style="margin-top : 20px"></el-divider> -->
    </yu-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: this.Visible,
    };
  },
  props: ["Visible", "noticeDetail"],
  watch: {
    Visible(val) {
      this.dialogVisible = val;
    },
  },
  methods: {
    close() {
      this.$emit("close", false);
    },
  },
};
</script>

<style lang="scss">
.home-notice-detail-dialog {
  &.el-dialog {
    width: 650px;
  }
  .el-dialog__title {
    font-weight: bold;
    font-size: 16px;
  }
  .el-button{
    font-size: 14px;
  }
  .section-title {
    font-size: 20px;
    font-weight: bold;
    padding-left: 8px;
    color: #333;
  }
  .base-info {
    margin-top: 10px;
    table,
    tbody,
    tr,
    td {
      border: 1px solid black;
    }
    a {
      color: #551a8b;
      text-decoration: underline;
    }
    ul {
      list-style: disc inside !important;
    }
    ol {
      list-style: decimal inside !important;
    }
    .base-content {
      margin-top: 12px;
      .el-col {
        line-height: 30px;
        .label {
          font-weight: bold;
        }
      }
    }
  }
  .edit-reason {
    margin-top: 30px;
    .reason-content {
      margin-top: 16px;
    }
    .reason-btn {
      margin-top: 12px;
      text-align: right;
    }
  }
  .history {
    margin-top: 20px;
    .history-content {
      margin-top: 20px;
      .history-timeline {
        .date {
          font-size: 12px;
          color: #999;
        }
        .info {
          margin-top: 12px;
          padding: 20px;
          background: #f7f7f7;
          border: 1px solid #e1e1e1;
        }
        .info-content {
          margin-left: 46px;
          .info-reason {
            margin-top: 10px;
            color: #666;
            line-height: 1.3;
          }
        }
        img {
          float: left;
          width: 36px;
          height: 36px;
          border-radius: 50%;
        }
      }
    }
  }
  .section-title {
    // font-size: 18px;
    font-weight: 700;
    // border-left: 4px solid $blue;
    padding-left: 10px;
    color: black;
  }
  // .title {
  //   font-size: 17px;
  //   font-weight: 700;
  // }
  .bank {
    display: inline-block;
    width: 40px;
    height: 20px;
    background-color: #feece8;
    color: #f14922;
    text-align: center;
    line-height: 21px;
    font-size: 12px;
  }
  .xinxin {
    display: inline-block;
    margin-left: 10px;
    width: 40px;
    height: 20px;
    background-color: #e5f2ff;
    color: #007eff;
    text-align: center;
    line-height: 21px;
    font-size: 12px;
  }
  .fengexian {
    position: relative;
    left: -13px;
    width: 596px;
    margin-top: 13px;
    box-shadow: 0px 0px 3px 1px #d8d8d8;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    vertical-align: middle;
  }
  .arrow-down {
    width: 12px;
    height: 8px;
    vertical-align: middle;
  }
  .user-info {
    display: inline-block;
    vertical-align: middle;
    margin: 0 20px 0 10px;
  }
  .user {
    margin-top: 35px;
    margin-bottom: 15px;
  }
  .jigou {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .left {
      font-weight: 700;
    }
  }
  .content {
    padding: 17px 13px;
    margin-top: 20px;
    // margin-bottom: 40px;
    width: 100%;
    height: 300px;
    overflow: auto;
    background-color: #f6fdff;
    border: 1px solid #b6edff;
    // font-size: 15px;
    letter-spacing: 1.5px;
  }
  .username {
    // font-size: 15px;
    font-weight: 700;
  }
  .pubtime {
    vertical-align: middle !important;
    margin-right: 10px;
  }
  .span {
    vertical-align: middle !important;
  }
  .activetime {
    vertical-align: middle !important;
    margin-left: 40px;
    margin-right: 10px;
  }
  // .el-divider{
  //   margin: 0;
  // }
  .el-dialog__header::before {
    height: 0;
  }
  .el-dialog__header {
    padding: 14px;
  }
  .el-dialog__body {
    padding: 12px 20px 10px;
  }
  .el-divider--horizontal {
    margin: 20px 0 15px 0;
  }
  .pubOrgName {
    margin-bottom: 15px;
  }
}
@media screen and (max-width: 1680px) {
  .home-notice-detail-dialog {
    &.el-dialog {
      width: 600px;
    }
    .el-dialog__title {
      font-weight: bold;
      font-size: 15px;
    }
    .el-button {
      font-size: 13px;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      padding-left: 8px;
      color: #333;
    }
  }
}
</style>
