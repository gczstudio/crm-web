import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import { RouteConfig } from "vue-router";
import { constantRoutes } from "@/router";
import store from "@/store";
import { arrayToTree, getCheckedRole } from "@/utils";
import Layout from "@/layout/index.vue";
import Blank from "@/layout/components/Blank.vue";
import router from "@/router";
import RenderPage from "@/views/system/lowCodeMgt/pageMgt/renderTool/show.vue";

const addAsyncRoutes = (menu: any) => {
  // 讲menu转换成route结构
  const menuRoute = menu.map((item: any) => {
    const urls = item.funcUrl.split("/");
    const urlsLen = urls.length;
    const name = urls.slice(-1)[0];
    let component = urlsLen === 2 ? Layout : urlsLen === 3 ? Blank : () => import(`@/views${item.funcUrl}/index.vue`);

    // 如果关联组件存在时
    if (item.pageId) {
      component = RenderPage;
    }
    // 大屏驾驶舱特殊处理
    if (urls.includes("cockpit") && urlsLen === 2) {
      component = Blank;
    }
    return {
      ...item,
      path: item.funcUrl,
      component,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      meta: {
        pageId: item.pageId,
        title: item.menuName,
        icon: item.menuIcon,
        hidden: item.funcUrl === "/customer/custSearch/custBank" && getCheckedRole().orgCode === "T", // 总行看不到全行客户的菜单，可以通过顶部栏搜索
      },
    };
  });

  const asyncRoutes = arrayToTree(menuRoute, "menuId", "upMenuId");
  // 处理第一个路由
  if (!asyncRoutes[0].children) {
    const firstChild = asyncRoutes[0];
    asyncRoutes[0] = {
      path: "/",
      component: Layout,
      redirect: firstChild.path,
      children: [
        {
          ...firstChild,
          component: () => import(`@/views${firstChild.path}/index.vue`),
          meta: {
            ...firstChild.meta,
            affix: true,
          },
        },
      ],
    };
  }
  console.log(asyncRoutes, 888);
  router.addRoutes(asyncRoutes);
  return asyncRoutes;
};

export interface IPermissionState {
  routes: RouteConfig[];
  asyncRoutes: RouteConfig[];
}

@Module({ dynamic: true, store, name: "permission" })
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = [];
  public asyncRoutes: RouteConfig[] = [];

  @Mutation
  private SET_ROUTES(asyncRoutes: RouteConfig[]) {
    this.asyncRoutes = asyncRoutes;
    this.routes = constantRoutes.concat(asyncRoutes);
  }

  @Action
  public GenerateRoutes(menu: any) {
    // 添加动态路由
    const asyncRoutes = addAsyncRoutes(menu);
    this.SET_ROUTES(asyncRoutes);
  }
}

export const PermissionModule = getModule(Permission);
