import request from '@/utils/request'
import { backend } from '@/config'


// 查询实时余额-全行存款余额
export const querybalence = (params: any) =>
  request({
    url: backend.mgrCockpit + '/api/cockpitbal/querybalence',
    method: 'get',
    params
  }) 

// 查询机构地图信息
export const queryareabranch = (params: any) =>
  request({
    url: backend.mgrCockpit + '/api/cockpitareabranch/queryareabranch',
    method: 'get',
    params
  }) 

// 查询分支行看板
export const querybrnch = (params: any) =>
request({
  url: backend.mgrCockpit + '/api/cockpitbrnch/querybrnch',
  method: 'get',
  params
})


// 查询区域结构分析
export const queryarea = (params: any) =>
  request({
    url: backend.mgrCockpit + '/api/cockpitarea/queryarea',
    method: 'get',
    params
  })

// 查询区域结构分析趋势
export const queryareatr = (params: any) =>
  request({
    url: backend.mgrCockpit + '/api/cockpitareatr/queryareatr',
    method: 'get',
    params
  })

// 查询存款产品分析
export const queryprod = (params: any) =>
request({
  url: backend.mgrCockpit + '/api/cockpitprod/queryprod',
  method: 'get',
  params
})

// 查询贷款行业分析
export const queryloan = (params: any) =>
request({
  url: backend.mgrCockpit + '/api/cockpitloan/queryloan',
  method: 'get',
  params
})

// 授信敞口额度
export const queryhead = (params: any) =>
request({
  url: backend.mgrCockpit + '/api/cockpithead/queryhead',
  method: 'get',
  params
})

// 存款趋势图-日
export const queryOrgDepD = (params: any) =>
request({
  url: backend.workService + '/api/acrmtrend/queryOrgDepD',
  method: 'get',
  params
})

// 存款趋势图-月
export const queryOrgDepM = (params: any) =>
request({
  url: backend.workService + '/api/acrmtrend/queryOrgDepM',
  method: 'get',
  params
})


// 贷款趋势图-日
export const queryOrgLoanD = (params: any) =>
request({
  url: backend.workService + '/api/acrmtrend/queryOrgLoanD',
  method: 'get',
  params
})

// 贷款趋势图-月
export const queryOrgLoanM = (params: any) =>
request({
  url: backend.workService + '/api/acrmtrend/queryOrgLoanM',
  method: 'get',
  params
})


// 对公存款余额增量
export const queryDepBal = (params: any) =>
request({
  url: backend.workService + '/api/acrmincrank/queryDepBal',
  method: 'get',
  params
})

// 对公存款日均增量
export const queryDepAvg = (params: any) =>
request({
  url: backend.workService + '/api/acrmincrank/queryDepAvg',
  method: 'get',
  params
})

// 对公贷款余额增量
export const queryLoan = (params: any) =>
request({
  url: backend.workService + '/api/acrmincrank/queryLoan',
  method: 'get',
  params
})






















  



  


  




