/*
 * @Descripttion:
 * @Author: gaocz
 * @Date: 2022-04-19 08:32:32
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-20 09:50:47
 * @FilePath: /edmp-web/src/api/lowCode.ts
 */
import request from "@/utils/request";
import { backend } from "@/config";

// 新建/编辑布局信息
export const saveLayoutInfo = (data: any) =>
  request({
    url: backend.comptMgrService + "/api/layoutinfo/save",
    method: "post",
    data,
  });

// 删除布局信息
export const deleteLayoutInfo = (params: any) =>
  request({
    url: backend.comptMgrService + "/api/layoutinfo/delete",
    method: "get",
    params,
  });

// 上/下架布局信息
export const updateLayoutSts = (params: any) =>
  request({
    url: backend.comptMgrService + "/api/layoutinfo/updatests",
    method: "get",
    params,
  });

// 获取系统组件信息
export const querySysModule = (params: any) =>
  request({
    url: backend.comptMgrService + "/api/sysmodule/list",
    method: "get",
    params,
  });

// 新建/编辑系统组件信息
export const saveSysModule = (data: any) =>
  request({
    url: backend.comptMgrService + "/api/sysmodule/save",
    method: "post",
    data,
  });

// 删除系统组件信息
export const deleteSysModule = (params: any) =>
  request({
    url: backend.comptMgrService + "/api/sysmodule/delete",
    method: "get",
    params,
  });

// 获取系统组件属性信息
export const querySysModuleProp = (params: any) =>
  request({
    url: backend.comptMgrService + "/api/sysmodule/property/list",
    method: "get",
    params,
  });

// 新建/编辑系统组件信息
export const saveSysModuleProp = (data: any) =>
  request({
    url: backend.comptMgrService + "/api/sysmodule/property/save",
    method: "post",
    data,
  });

// 删除系统组件信息
export const deleteSysModuleProp = (params: any) =>
  request({
    url: backend.comptMgrService + "/api/sysmodule/property/delete",
    method: "get",
    params,
  });

// 新建/编辑组件目录信息
export const saveBusiModuleCataLog = (data: any) =>
  request({
    url: backend.comptMgrService + "/api/busimodule/catalog/save",
    method: "post",
    data,
  });

// 删除组件目录信息
export const deleteBusiModuleCataLog = (params: any) =>
  request({
    url: backend.comptMgrService + "/api/busimodule/catalog/delete",
    method: "get",
    params,
  });

// 数据集列表
export const queryDsInfo = () =>
  request({
    url: backend.comptMgrService + "/api/busimodule/ds/info",
    method: "get",
  });

// 数据集字段信息
export const queryDsField = (params: any) =>
  request({
    url: backend.comptMgrService + "/api/busimodule/ds/field",
    method: "get",
    params,
  });

// 数据集结果信息
export const queryDsData = (params: any) =>
  request({
    url: backend.comptMgrService + "/api/busimodule/ds/data",
    method: "get",
    params,
  });

// 新建/编辑业务组件信息
export const saveBusiModule = (data: any) =>
  request({
    url: backend.comptMgrService + "/api/busimodule/save",
    method: "post",
    data,
  });

// 删除系统组件信息
export const deleteBusiModule = (params: any) =>
  request({
    url: backend.comptMgrService + "/api/busimodule/delete",
    method: "get",
    params,
  });

// 上/下架组件信息
export const updateStsBusiModule = (params: any) =>
  request({
    url: backend.comptMgrService + "/api/busimodule/updatests",
    method: "get",
    params,
  });

// 新建/编辑页面目录信息
export const savePageCataLog = (data: any) =>
  request({
    url: backend.comptMgrService + "/api/page/catalog/save",
    method: "post",
    data,
  });

// 删除组件目录信息
export const deletePageCataLog = (params: any) =>
  request({
    url: backend.comptMgrService + "/api/page/catalog/delete",
    method: "get",
    params,
  });

// 新建/编辑页面信息
export const savePage = (data: any) =>
  request({
    url: backend.comptMgrService + "/api/page/save",
    method: "post",
    data,
  });

// 删除页面信息
export const deletePage = (params: any) =>
  request({
    url: backend.comptMgrService + "/api/page/delete",
    method: "get",
    params,
  });

// 接口对应的字段信息
export const queryUrlField = (params: any) =>
  request({
    url: backend.comptMgrService + "/api/page/urlfield/info",
    method: "get",
    params,
  });

// 新建/编辑校验规则信息
export const saveRule = (data: any) =>
  request({
    url: backend.comptMgrService + "/api/verifyrule/save",
    method: "post",
    data,
  });

// 删除校验规则信息
export const deleteRule = (params: any) =>
  request({
    url: backend.comptMgrService + "/api/verifyrule/delete",
    method: "get",
    params,
  });
