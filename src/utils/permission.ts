import router from "@/router";

const checkCtr = (value: string | string[]): boolean => {
  const val = Array.isArray(value) ? value : [value];
  const contrMgr = JSON.parse(sessionStorage.getItem("contrMgr") as any);
  const contr = contrMgr?.contr || [];
  const menu = contrMgr?.menu || [];
  // 获取当前的路由信息
  const current = (router as any).history.current;
  const path = current.meta.authUrl ? current.meta.authUrl : current.path;
  const curRoute = menu.find((item: any) => item.funcUrl === path);
  const bool = contr.find((item: any) => {
    return item.funcId === curRoute.funcId && val.includes(item.contrCode);
  });
  return bool;
};

export default checkCtr;
