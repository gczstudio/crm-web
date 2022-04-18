import { DirectiveOptions } from 'vue'


export const permission: DirectiveOptions = {
  inserted(el, binding, vnode) {
    let val = binding.value;
    let contrMgr = JSON.parse(sessionStorage.getItem('contrMgr') as any)
    let contr = contrMgr?.contr || []
    let menu = contrMgr?.menu || []
    // 获取当前的路由信息
    let _this: any = vnode.context
    let path = _this.$route.meta.authUrl ? _this.$route.meta.authUrl : _this.$route.path
    let curRoute = menu.find((item : any) => item.funcUrl === path)
    let bool = contr.find((item : any) => {
      return item.funcId === curRoute.funcId && item.contrCode === val
    })
    if(!bool) {
      el.parentNode?.removeChild(el);
    }
  }
}
