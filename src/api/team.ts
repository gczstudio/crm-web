import request from "@/utils/request";
import { backend } from "@/config";

// 查询团队列表
export const queryteam = (params: any) =>
  request({
    url: backend.teamCenter + "/api/custteam/queryteam",
    method: "get",
    params,
  });

// 新增团队
export const addteam = (data: any) =>
  request({
    url: backend.teamCenter + "/api/custteam/addteam",
    method: "post",
    data,
  });

// 修改团队
export const updateteam = (data: any) =>
  request({
    url: backend.teamCenter + "/api/custteam/updateteam",
    method: "post",
    data,
  });

// 删除团队
export const deleteteam = (data: any) =>
  request({
    url: backend.teamCenter + "/api/custteam/deleteteam",
    method: "post",
    data,
  });

// 新增团队成员
export const addteammem = (data: any) =>
  request({
    url: backend.teamCenter + "/api/teammember/addteammem",
    method: "post",
    data,
  });

// 删除团队成员
export const delteamdmem = (data: any) =>
  request({
    url: backend.teamCenter + "/api/teammember/delteamdmem",
    method: "post",
    data,
  });

// 设置团队长
export const setteamleader = (data: any) =>
  request({
    url: backend.teamCenter + "/api/teammember/setteamleader",
    method: "post",
    data,
  });

// 取消团队长
export const cnlteamleader = (data: any) =>
  request({
    url: backend.teamCenter + "/api/teammember/cnlteamleader",
    method: "post",
    data,
  });

// 校验团队成员是否存在团队长
export const queryifleader = (params: any) =>
  request({
    url: backend.teamCenter + "/api/teammember/queryifleader",
    method: "get",
    params,
  });

// 查询要添加的用户是否存在于其他团队
export const querybfadd = (data: any) =>
  request({
    url: backend.teamCenter + "/api/teammember/querybfadd",
    method: "post",
    data,
  });
