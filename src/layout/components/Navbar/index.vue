<template>
  <div class="navbar">
    <div class="navbar-title" @click="toHomeFn" title="返回首页"><img :src="require(`@/assets/images/theme/${themeType}/logo.png`)" alt="" /></div>
    <!-- <div class="logo-tip"><img :src="require(`@/assets/images/theme/${themeType}/logo-tip.png`)" alt=""></div> -->
    <div class="right-search">
      <el-input placeholder="核心客户号/企业名称/统一社会信用代码/组织机构代码" v-model="keyword" clearable @keyup.enter.native="searchFn">
        <template slot="append"
          ><div class="search-box" @click="searchFn"><i class="el-icon-search"></i></div
        ></template>
      </el-input>
    </div>
    <div class="right-menu">
      <div class="dv">
        <div class="right-date dv">
          数据日期：<span class="num">{{ dataDt }}</span>
        </div>
        <ul class="right-funcs dv">
          <li v-if="$util.getCheckedRole().roleCode === 'R100001'">
            <span>在线人数</span><i class="iconfont icon-zaixianrenshu"></i><span class="num">{{ userCount }}</span
            >人
          </li>
          <li>
            <el-popover popper-class="remind-popper" placement="top-start" width="220" trigger="hover">
              <span slot="reference">
                <div ref="msgRef">
                  <i class="iconfont icon-gonggao"></i
                  ><span
                    >消息（<span class="num">{{ remindNum }}</span
                    >）</span
                  >
                </div>
              </span>
              <div class="remind-list">
                <ul>
                  <li v-for="item in remindData" :key="item.opprname" @click="remindChangeFn(item)">
                    {{ item.opprname }}<span>{{ item.opprcstnum }}</span>
                  </li>
                </ul>
              </div>
            </el-popover>
          </li>
          <li @click="downFileFn">
            <i class="iconfont icon-xiazai"></i
            ><span
              >下载（<span class="num">{{ downFileNum }}</span
              >）</span
            >
          </li>
        </ul>
        <div class="right-theme dv">
          <el-popover popper-class="theme-popper" placement="top-start" width="200" trigger="hover">
            <span slot="reference"><i class="iconfont icon-zhuti"></i><span class="c2" style="position: relative; top: -1px">主题</span></span>
            <div class="theme-color">
              <ul>
                <li v-for="item in themeColors" :key="item.name" :style="{ background: item.color }" @click="themeChangeFn(item)"><i class="el-icon-check" v-if="activeTheme === item.type"></i></li>
              </ul>
            </div>
          </el-popover>
        </div>
      </div>
      <div class="right-user dv">
        <el-dropdown placement="bottom" @command="handleCommand" trigger="click">
          <span class="el-dropdown-link">
            <img class="avatar" :src="require(`@/assets/images/common/avatar-${userInfo.details.userSex || 'F'}.png`)" alt="" />
            <div class="user-info">
              <p>{{ checkRole.userName }}</p>
              <p>{{ checkRole.roleName }}</p>
            </div>
            <img class="arrow-down" src="../../../assets/images/common/arrow-down.png" alt="" />
          </span>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <el-dropdown-item command="role"><i class="iconfont icon-qiehuanjiaose"></i>切换角色</el-dropdown-item>
            <el-dropdown-item command="logout"><i class="iconfont icon-icon"></i>退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <SwitchRole ref="roleRef" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";
import { SettingsModule } from "@/store/modules/settings";
import SwitchRole from "../SwitchRole/index.vue";
import * as commonApi from "@/api/common";
import * as homeApi from "@/api/home";
import { queryAcrmSearch } from "@/api/home";
import { querycount } from "@/api/service";
import { getUserInfo } from "@/utils";
import { TagsViewModule } from "@/store/modules/tags-view";
import { CommonModule } from "@/store/modules/common";

@Component({
  name: "Navbar",
  components: {
    SwitchRole,
  },
})
export default class extends Vue {
  @Ref("roleRef") roleRef: any;
  @Ref("msgRef") msgRef: any;

  keyword = "";
  themeColors: Array<any> = [
    { name: "custom-theme", type: "custom", color: "#00A4DB" },
    { name: "red-theme", type: "red", color: "#F25A5A" },
  ];
  dataDt = "";
  checkRole: any = (this as any).$util.getCheckedRole();
  activeTheme = "custom";
  downFileNum: any = "0";
  userInfo = getUserInfo();
  userCount: any = "";
  remindData = [];
  remindNum = 0;

  get theme() {
    return SettingsModule.theme;
  }

  get themeType() {
    return SettingsModule.themeType;
  }

  get switchRole() {
    return UserModule.switchRole;
  }

  get updateDownloadFile() {
    return CommonModule.updateDownloadFile;
  }

  @Watch("switchRole")
  private onSwitchRoleChange(value: boolean) {
    this.getRemindNum();
    if (value) {
      this.keyword = "";
      this.$nextTick(() => {
        this.setSeachLeft();
      });
      this.checkRole = (this as any).$util.getCheckedRole();
    }
  }

  @Watch("updateDownloadFile")
  private onUpdateDownloadFileChange() {
    this.getNumOfNDFile();
  }

  @Watch("keyword")
  private onKeywordChange() {
    CommonModule.SET_KEYWORD(this.keyword);
  }

  created() {
    this.getSysDataDt();
    this.getThemeInfo();
    this.getNumOfNDFile();
    this.getUserCount();
    this.getRemindNum();
  }

  mounted() {
    this.setSeachLeft();
  }

  setSeachLeft() {
    // 设置right-search居中
    var rightMenuWidth = document.querySelector(".right-menu")?.clientWidth || 0;
    var leftLogoWidth = document.querySelector(".navbar-title")?.clientWidth || 0;
    var searchWidth = document.querySelector(".right-search")?.clientWidth || 0;
    var left = (document.body.clientWidth - rightMenuWidth - leftLogoWidth) / 2 - searchWidth / 2 + leftLogoWidth;
    (document.querySelector(".right-search") as any).style.left = left + "px";
  }

  getSysDataDt() {
    commonApi.getSysDataDt().then((res: any) => {
      if (res.code === 0) {
        this.dataDt = res.data.etlDate;
        sessionStorage.setItem("dataDt", res.data.etlDate);
        sessionStorage.setItem("ftpDate", res.data.ftpDate);
        this.$nextTick(() => {
          this.setSeachLeft();
        });
      }
    });
  }

  remindChangeFn(item: any) {
    // 1 营销  2 提醒
    if (item.isflag === 1) {
      this.$router.push({
        name: "MakertBusOpt",
        params: {
          ...item,
          isMark: "2", // 1：不带参数，2：带参数
        },
      });
    } else if (item.isflag === 2) {
      this.$router.push({
        name: "RemindMgt",
        params: {
          ...item,
          isMark: "2", // 1：不带参数，2：带参数
        },
      });
    }
  }

  themeChangeFn(item: any) {
    this.activeTheme = item.type;
    SettingsModule.ChangeSetting({ key: "theme", value: item.color });
    SettingsModule.ChangeSetting({ key: "themeType", value: item.type });
    document.body.className = "main-theme " + item.name;
    let params = {
      userId: getUserInfo().userId,
      themes: item.type,
    };
    homeApi.switchTheme(params);
  }

  getThemeInfo() {
    homeApi.getThemeInfo().then((res) => {
      let activeTheme = !res.data || res.data.themes === "default" ? "custom" : res.data.themes;
      this.activeTheme = activeTheme;
      SettingsModule.ChangeSetting({ key: "theme", value: this.themeColors.find((item) => item.type === activeTheme).color });
      SettingsModule.ChangeSetting({ key: "themeType", value: activeTheme });
      document.body.className = "main-theme " + (activeTheme + "-theme");
    });
  }

  // 获取消息条数
  getRemindNum() {
    let num = 0;
    querycount().then((res) => {
      this.remindData = res.data.map((item: any) => {
        if (item) {
          num += item.opprcstnum;
        }
        return {
          ...item,
          opprname: item.isflag === 1 ? item.opprname : item.remindsubclassnm,
        };
      });
      this.remindNum = num;
      if (num) {
        this.msgRef.className = "animate__animated animate__pulse";
      }
      this.$nextTick(() => {
        this.setSeachLeft();
      });
    });
  }

  // 获取下载条数
  getNumOfNDFile() {
    commonApi
      .getNumOfNDFile({
        user: getUserInfo().userId,
      })
      .then((res) => {
        let data = parseFloat(res.data);
        this.downFileNum = data > 10 ? "10+" : data;
      });
  }

  downFileFn() {
    this.$router.replace("/system/downloadMgt/downloadFile");
  }

  handleCommand(command: string) {
    if (command === "logout") {
      UserModule.LogOut();
    } else if (command === "role") {
      this.roleRef.show();
    }
  }

  toHomeFn() {
    this.$router.replace("/home");
  }

  searchFn() {
    if (!this.keyword) return;
    this.$router.push({
      name: "CustBank",
      params: { keyword: this.keyword },
    });
  }
  // 获取在线人数
  getUserCount() {
    homeApi.userCount().then((res) => {
      this.userCount = res.data.onlineNumPC;
    });
  }
}
</script>

<style lang="scss">
.user-dropdown {
  .el-dropdown-menu__item {
    line-height: 40px !important;
    .iconfont {
      font-weight: bold;
      margin-right: 5px;
    }
  }
}
.remind-popper {
  padding: 12px 0 !important;
  .remind-list {
    li {
      padding: 0 18px;
      cursor: pointer;
      height: 37px;
      line-height: 37px;
      font-size: 15px;
      span {
        float: right;
        margin-top: 8px;
        padding: 0 6px;
        text-align: center;
        height: 20px;
        line-height: 20px;
        border-radius: 10px;
        background-color: $blue;
        color: #fff;
        font-size: 12px;
      }
      &:hover {
        background-color: #efefef;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.animate__animated {
  animation-delay: 1s;
}
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  // background: url('../../../assets/images/common/header.png') no-repeat;
  background-size: 100% 60px;
  .dv {
    display: inline-block;
    vertical-align: middle;
  }
  .navbar-title {
    cursor: pointer;
    float: left;
    margin: 10px 0 0 16px;
    font-size: 24px;
    img {
      width: 187px;
      height: 38px;
    }
  }
  .logo-tip {
    position: absolute;
    top: 0;
    left: 275px;
    width: 53px;
    height: 33px;
    img {
      width: 100%;
    }
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .search-box {
    width: 40px;
    height: 32px;
    line-height: 32px;
    text-align: center;
  }
  .right-search {
    position: absolute;
    top: 50%;
    left: 400px;
    transform: translateY(-50%);
    ::v-deep {
      .el-input {
        width: 410px;
        input {
          // border-color: $blue;
          background: transparent;
        }
        .el-input-group__append {
          padding: 0;
          cursor: pointer;
          // background: $blue;
          // border-color: $blue;
          border: 0;
          color: #fff;
          font-size: 18px;
          transition: all 0.3s;
          .el-icon-search {
            font-weight: bold;
          }
          &:hover {
            opacity: 0.8;
          }
        }
      }
      .el-input__inner {
        padding: 0 10px;
        height: 32px;
        line-height: 32px;
        border-color: #a6a6a6 !important;
      }
      .el-input__suffix {
        top: -3px;
      }
    }
  }

  .right-menu {
    padding-top: 10px;
    float: right;
    height: 100%;
    .right-date {
      margin: 0 30px 0 0;
      color: #333;
      line-height: 20px;
    }
    .right-funcs {
      line-height: 20px;
      li {
        float: left;
        margin-right: 20px;
        cursor: pointer;
        transition: all 0.3s;
        &:nth-child(1) {
          cursor: default;
          .iconfont {
            margin: 0 10px;
          }
        }
        & + li {
          &:hover {
            opacity: 0.8;
          }
        }
        span {
          color: #333;
        }
        .iconfont {
          margin-right: 10px;
        }
        .icon-zhuti {
          position: relative;
          top: -1px;
        }
      }
    }

    .right-theme {
      cursor: pointer;
      margin: 0 20px 0 0;
      .iconfont {
        margin-right: 10px;
      }
    }

    .right-user {
      cursor: pointer;
      padding-right: 28px;
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
        p:nth-child(1) {
          font-size: 16px;
        }
        p:nth-child(2) {
          font-size: 12px;
        }
      }
    }
  }
}
.theme-popper {
  .theme-color {
    padding: 0 30px;
    ul {
      display: inline-block;
      li {
        cursor: pointer;
        position: relative;
        display: inline-block;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        & + li {
          margin-left: 28px;
        }
        .el-icon-check {
          color: #fff;
          font-size: 20px;
          font-weight: bold;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
}

@media screen and (max-width: 1680px) {
  .navbar {
    height: 50px;
    .logo-tip {
      left: 255px;
    }
    .right-search {
      ::v-deep {
        .el-input {
          width: 380px;
        }
        .el-input__suffix {
          top: 1px;
        }
      }
    }
    .navbar-title {
      margin: 6px 16px;
      img {
        width: 220px;
      }
    }
    .right-menu {
      padding-top: 5px;
      .right-user {
        cursor: pointer;
        padding-right: 28px;
        .user-info {
          p:nth-child(1) {
            font-size: 15px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1440px) {
  .navbar {
    .right-menu {
      .right-search {
        margin-right: 20px;
        ::v-deep {
          .el-input {
            width: 400px;
            .el-input-group__append {
              padding: 0;
            }
          }
        }
      }
      .right-date {
        margin-right: 20px;
      }
      .right-funcs {
        li {
          margin-right: 10px;
          .iconfont {
            margin-right: 5px;
          }
        }
        &:nth-child(1) {
          cursor: default;
          .iconfont {
            margin: 0 5px;
          }
        }
      }
      .right-user {
        padding-right: 10px;
      }
      .right-theme {
        .iconfont {
          margin-right: 5px;
        }
      }
    }
  }
}

@media screen and (max-width: 1280px) {
  .navbar {
    .right-menu {
      .right-search {
        ::v-deep {
          .el-input {
            width: 240px;
          }
        }
      }
    }
  }
}
</style>
