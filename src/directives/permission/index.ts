import { DirectiveOptions } from "vue";

export const permission: DirectiveOptions = {
  inserted(el, binding, vnode) {
    const val = binding.value;
    const contrMgr = JSON.parse(sessionStorage.getItem("contrMgr") as any);
    const contr = contrMgr?.contr || [];
    const menu = contrMgr?.menu || [];
    // 获取当前的路由信息
    const _this: any = vnode.context;
    const path = _this.$route.meta.authUrl ? _this.$route.meta.authUrl : _this.$route.path;
    const curRoute = menu.find((item: any) => item.funcUrl === path);
    const bool = contr.find((item: any) => {
      return item.funcId === curRoute.funcId && item.contrCode === val;
    });
    if (!bool) {
      el.parentNode?.removeChild(el);
    }
  },
};
