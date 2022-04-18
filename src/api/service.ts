import request from '@/utils/request'
import { backend } from '@/config'

// 查询规则类型树（提醒大小类联动）
export const queryretype = (params: any) =>
  request({
    url: backend.workService + '/api/remindtype/queryretype',
    method: 'get',
    params
  })

// 新增类型规则
export const addruletype = (data: any) =>
  request({
    url: backend.workService + '/api/remindtype/addruletype',
    method: 'post',
    data
  })

// 修改类型规则
export const updateruletype = (data: any) =>
  request({
    url: backend.workService + '/api/remindtype/updateruletype',
    method: 'post',
    data
  })


// 首页提醒条数
export const querycount = () =>
  request({
    url: backend.workService + '/api/warntype/querycount',
    method: 'get'
  })




  




