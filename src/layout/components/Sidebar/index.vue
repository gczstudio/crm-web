<template>
  <div>
    <!-- <img
      class="menu-logo"
      src="../../../assets/images/common/menu-logo1.png"
      alt=""
    /> -->
    <!-- <div class="logo">
      <img
        src="../../../assets/images/common/logo-icon.png"
        alt=""
        @click="toHomeFn"
        title="返回首页"
      />
    </div> -->
    <el-scrollbar wrap-class="scrollbar-wrapper scrollbar-wrapper-custom">
      <div :class="{ 'nav-item': true, active: route.path === selectNav.path }" v-for="route in routes" :key="route.path" @click="navClickFn(route, $event)">
        <img class="icon-img" :src="require(`@/assets/images/common/menu/${getIcon(route) || 'home'}.png`)" />
        <!-- <i :class="['iconfont', getIcon(route)]"></i> -->
        <p>{{ getTitle(route) }}</p>
      </div>
    </el-scrollbar>
    <div id="mask" class="mask" v-show="selectNav.children && selectNav.children.length && selectNav.path !== '/'"></div>
    <div ref="childRef" class="nav-item__children" v-if="selectNav.children && selectNav.children.length && selectNav.path !== '/'">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="nav-item__children-item" v-for="child in selectNav.children" :key="child.path">
          <div class="nav-item__title">{{ child.meta.title }}</div>
          <ul class="clearfix">
            <li v-for="ele in child.children.filter((item) => !(item.meta && item.meta.hidden === true))" :key="ele.path" @click="goPageFn(ele)" :class="{ 'menu-readonly': ele.menuTip === '建设中' }">
              <el-tooltip v-if="ele.menuTip === '建设中'" popper-class="menu_tool-tip" content="建设中..." placement="top">
                <div>{{ ele.meta.title }}</div>
              </el-tooltip>
              <span v-else>{{ ele.meta.title }}</span>
            </li>
          </ul>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from "vue-property-decorator";
import { PermissionModule } from "@/store/modules/permission";
import { SettingsModule } from "@/store/modules/settings";
import { RouteConfig } from "vue-router";
import { getUserInfo } from "@/utils";

@Component({
  name: "SideBar",
  components: {},
})
export default class extends Vue {
  selectNav: RouteConfig = {} as RouteConfig;

  @Ref("childRef") childRef: any;

  get routes() {
    return PermissionModule.routes
      .filter((item: RouteConfig) => {
        return !(item.meta && item.meta.hidden === true);
      })
      .map((item) => {
        return {
          ...item,
          meta: {
            ...item.meta,
            expanded: false,
          },
        };
      });
  }

  get activeMenu() {
    const route: any = this.$route;
    const { meta, path } = route;
    // if set path, the sidebar will highlight the path you set
    if (meta.activeMenu) {
      return meta.activeMenu;
    }
    return path;
  }

  mounted() {
    document.querySelector("#mask")?.addEventListener("click", this.resetSelectNav);
  }

  resetSelectNav() {
    this.selectNav = {} as RouteConfig;
  }

  getIcon(route: any) {
    if (route.meta && route.meta.icon) {
      return route.meta.icon;
    }
    if (route.children.length === 1) {
      return route.children[0].meta.icon;
    }
  }

  getTitle(route: any) {
    if (route.meta && route.meta.title) {
      return route.meta.title;
    }
    if (route.children.length === 1) {
      return route.children[0].meta.title;
    }
  }

  navClickFn(route: RouteConfig, event: any) {
    const ev = event || window.event;
    const eventPath = ev.path || (ev.composedPath && ev.composedPath());
    // 特殊判断：点击首页时，不弹出，直接跳转路由
    if (route.path === "/" && this.$route.path !== "/home") {
      this.$router.push("/");
    }
    this.selectNav = route;
  }

  goPageFn(ele: any) {
    if (ele.menuTip === "建设中") return;
    let path = ele.path;
    if (path.includes("http")) {
      // 学习首页跳转到wiki
      if (path.includes("xwiki")) {
        let loginInfo = JSON.parse(sessionStorage.getItem("loginInfo") as any);
        this.$util.formPost({
          path,
          loginInfo: {
            xredirect: "/xwiki/bin/view/Main/",
            form_token: "qYu88x5YVkQAm2KLxrlNSw",
            j_username: loginInfo.username,
            j_password: "admin@123",
          },
        });
        return;
      }
      let loginInfo = JSON.parse(sessionStorage.getItem("loginInfo") as any);
      // 需要用户名和密码的连接
      if (path.includes("{{userName}}")) {
        path = path.replace("{{userName}}", loginInfo.username).replace("{{password}}", loginInfo.password);
      }
      window.open(path);
      return;
    }
    // 点击大屏驾驶舱时，新开窗口
    if (path.includes("cockpit") && path.split("/").length > 3) {
      window.open(window.location.origin + window.location.pathname + "#" + path);
      return;
    }
    // let path = Array.from(arguments).join("/");
    this.$router.push(path);
    this.resetSelectNav();
  }

  toHomeFn() {
    this.$router.replace("/home");
  }
}
</script>

<style lang="scss">
.menu_tool-tip {
  z-index: 100002 !important;
}
.scrollbar-wrapper-custom {
  position: relative;
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }

  .el-scrollbar__view {
    height: 100%;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
.menu-logo {
  position: absolute;
  left: 20px;
  bottom: 24px;
  // z-index: 1;
}
.el-scrollbar {
  height: 100%;
}

.logo {
  cursor: pointer;
  width: 72px;
  height: 60px;
  text-align: center;
  padding-top: 10px;
}
.nav-item {
  position: relative;
  cursor: pointer;
  padding: 16px 0;
  // height: 72px;
  color: #fff;
  font-size: 16px;
  text-align: center;
  transition: all 0.3s;
  .icon-img {
    // width: 20px;
  }
  .iconfont {
    color: #fff;
  }
  p {
    margin-top: 7px;
    font-weight: bold;
  }
  &:hover {
    // background: $blue;
  }
  &.active {
    // background: $blue;
  }
}
.mask {
  position: fixed;
  top: 0;
  left: 60px;
  z-index: 10000;
  background: transparent;
  width: 100%;
  height: 100%;
}
.nav-item__children {
  width: 550px;
  height: calc(100% - 60px);
  background: #fff;
  position: fixed;
  top: 60px;
  left: 60px;
  z-index: 10001;
  color: #333;
  box-shadow: 0px 3px 7px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
  .nav-item__children-item {
    padding: 0 16px;
    margin-top: 30px;
    font-size: 16px;

    & + .nav-item__children-item {
      margin-top: 20px;
    }
    .nav-item__title {
      border-left: 4px solid $blue;
      font-weight: bold;
      padding-left: 10px;
      margin-bottom: 20px;
    }
    i {
      margin-left: 5px;
    }
    ul {
      padding-bottom: 4px;
      padding-left: 13px;
      border-bottom: 1px solid #e1e1e1;
      li {
        float: left;
        line-height: 1;
        margin: 0 16px 16px 0;
        padding-right: 16px;
        border-right: 1px solid #333;
        font-size: 16px;
        color: #333;
        transition: all 0.3s;
        cursor: pointer;
        &:hover {
          // color: $blue;
        }
        &:last-child {
          border: 0;
        }
      }
      .menu-readonly {
        cursor: default;
        color: #999;
        &:hover {
          color: #999 !important;
        }
      }
    }
  }
}

@media screen and (max-width: 1680px) {
  .menu-logo {
    left: 17px;
  }
  .nav-item {
    font-size: 15px;
    padding: 12px 0;
  }
  .mask {
    left: 56px;
  }
  .nav-item__children {
    width: 500px;
    top: 50px;
    left: 56px;
    height: calc(100% - 50px);
    .nav-item__children-item {
      & + .nav-item__children-item {
        margin-top: 16px;
      }
      padding: 0 8px;
      font-size: 15px;
      .nav-item__title {
        margin-bottom: 16px;
        padding-left: 8px;
      }
      ul {
        padding-bottom: 2px;
        padding-left: 13px;
        li {
          margin: 0 14px 14px 0;
          padding-right: 14px;
          font-size: 15px;
        }
      }
    }
  }
}
</style>
