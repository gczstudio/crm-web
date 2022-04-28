import request from "@/utils/request";
import { backend } from "@/config";
import { AxiosRequestConfig } from "axios";

// 获取系统逻辑参数
export const queryLogicsyskv = (params: any) =>
  request({
    url: backend.appOcaService + "/api/adminsmlogicsys/logicsyskv",
    method: "get",
    params,
  });

// 校验验证码
export const verifyCodeImage = (data: any, options: AxiosRequestConfig) =>
  request({
    url: backend.uaaService + "/api/codeImage/verifyCodeImage",
    method: "post",
    ...options,
    data,
  });

// 登录
export const login = (data: any, options: AxiosRequestConfig) =>
  request({
    url: backend.uaaService + "/oauth/token",
    method: "post",
    ...options,
    data,
  });

// 获取用户信息
export const getSessionInfo = () =>
  request({
    url: backend.appOcaService + "/api/session/info?sysType=PC",
    method: "get",
  });

// 获取当前角色下的菜单和按钮权限
export const getMenuAndContr = () =>
  request({
    url: backend.appOcaService + "/api/usermenuinfo/menuandcontr",
    // url: backend.appOcaService + '/api/account/menuandcontr',
    method: "get",
  });

// 退出登录
export const logout = () =>
  request({
    url: backend.uaaService + "/api/logout",
    method: "post",
  });

// 切换角色
export const switchRoleOrg = (data: any) =>
  request({
    url: backend.appOcaService + "/api/account/switchroleorg",
    method: "post",
    data,
  });

// 获取所有的角色
export const getAllRoles = (params: any) =>
  request({
    url: backend.appOcaService + "/api/adminsmrole/querypage",
    method: "get",
    params,
  });
