import router from "@/router";

const checkCtr = (value: string | string[]): boolean => {
  let val = Array.isArray(value) ? value : [value];
  let contrMgr = JSON.parse(sessionStorage.getItem('contrMgr') as any)
  let contr = contrMgr?.contr || []
  let menu = contrMgr?.menu || []
  // 获取当前的路由信息
  let current = (router as any).history.current
  let path = current.meta.authUrl ? current.meta.authUrl : current.path
  let curRoute = menu.find((item : any) => item.funcUrl === path)
  let bool = contr.find((item : any) => {
    return item.funcId === curRoute.funcId && val.includes(item.contrCode)
  })
  return bool
}

export default checkCtr;
