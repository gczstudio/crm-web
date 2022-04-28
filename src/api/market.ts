import request from "@/utils/request";
import { backend } from "@/config";

// 大额异动潜在客户(汇总)
export const selectlong = () =>
  request({
    url: backend.mgrMkt + "/api/mkcust/selectlong",
    method: "get",
  });

// 供应链潜在客户(汇总)
export const selectsc = () =>
  request({
    url: backend.mgrMkt + "/api/mkcustsc/selectsc",
    method: "get",
  });

// 存款减少预警(汇总)
export const selectwrmb = () =>
  request({
    url: backend.mgrMkt + "/api/mkcustwrmb/selectwrmb",
    method: "get",
  });

// 交易减少预警(汇总)
export const selectmbse = () =>
  request({
    url: backend.mgrMkt + "/api/mkcustmbse/selectmbse",
    method: "get",
  });
