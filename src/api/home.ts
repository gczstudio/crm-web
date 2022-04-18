import request from '@/utils/request'
import { backend } from '@/config'

// 获取首页自定义配置树
export const queryChartTree = () =>
  request({
    url: backend.workService + '/api/homepageconfig/querycharttree',
    method: 'get',
  })


// 获取当前用户的首页配置信息
export const queryUserChart = () =>
  request({
    url: backend.workService + '/api/homepageconfig/queryuserchart',
    method: 'get'
  })


// 保存用户首页图表配置信息
export const saveUserChart = (data:any) =>
  request({
    url: backend.workService + '/api/homepageconfig/saveuserchart',
    method: 'post',
    data
  })


// 首页指标（七个指标）
export const queryOrgIndex = () =>
  request({
    url: backend.workService + '/api/acrmhmpgorgindex/queryIndex',
    method: 'get'
  })


// 首页机构ftp利润
export const queryFtpProf = () =>
  request({
    url: backend.workService + '/api/acrmhmpgorgindex/queryFtpProf',
    method: 'get'
  })

// 查询小企业中间业务收入
export const queryInterBusIncom = () =>
  request({
    url: backend.workService + '/api/acrmhmpgorgindex/queryInterBusIncom',
    method: 'get'
  })


// 管户客户排名
export const queryCustRankList = (params: any) =>
  request({
    url: backend.workService + '/api/acrmcustrank/queryList',
    method: 'get',
    params
  })

// 待办任务-客户级提醒
export const queryLargerCustFlow = (params: any) =>
  request({
    url: backend.workService + '/api/custremind/largercustomerflow',
    method: 'get',
    params
  })


// 提醒导出
export const remindExcelExport = (params: any) =>
  request({
    url: backend.workService + '/api/custremind/excelexport',
    method: 'get',
    params
  })

// 客户级提醒-详情
export const largerCustDetail = (id: string) =>
  request({
    url: backend.workService + '/api/custremind/largercustomerdetail/' + id,
    method: 'get'
  })

// 客户级动账原因填报
export const largerCustReason = (params: any) =>
  request({
    url: backend.workService + '/api/custremind/largercustreason/',
    method: 'post',
    params
  })

// 客户级动账原因查看
export const custReasonList = (id: string) =>
  request({
    url: backend.workService + '/api/custremind/custreasonlist/' + id,
    method: 'get'
  })


// 信息提醒-账户级提醒
export const queryLargerAccountFlow = (params: any) =>
request({
  url: backend.workService + '/api/accountremind/largeraccountflow',
  method: 'get',
  params
})

// 信息提醒-账户级提醒-详情
export const largerAccountReason = (id: string) =>
request({
  url: backend.workService + '/api/accountremind/largeraccountdetail/' + id,
  method: 'get'
})


// 获取用户的常用功能
export const getUserCommFuncList = () =>
request({
  url: backend.workService + '/api/homepageconfig/usercommfunclist',
  method: 'get'
})


// 导航栏logo模糊查询客户列表
export const queryAcrmSearch = (params: any) =>
  request({
    url: backend.workService + '/api/acrmsearch/query',
    method: 'get',
    params
  })

// 获取主题皮肤
export const getThemeInfo = () =>
  request({
    url: backend.workService + '/api/ocrmfsysusercfg/themeinfo',
    method: 'post'
  })


// 修改主题皮肤
export const switchTheme = (data: any) =>
  request({
    url: backend.workService + '/api/ocrmfsysusercfg/switchtheme',
    method: 'post',
    data
  })


// 获取公告管理列表
export const noticeList = (params: any) =>
  request({
    url: backend.noticeService + "/api/adminsmnotice/queryByCondition",
    method: 'get',
    params
  })

// 获取公告管理详情
export const noticeDetails = (data: any) =>
  request({
    url: backend.noticeService + "/api/adminsmnotice/noticeinfo",
    method: 'post',
    data : data
  })

// 获取公告管理已阅
export const noticeReads = (data: any) =>
  request({
    url: backend.noticeService + "/api/adminsmnotice/reads",
    method: 'post',
    data : data
  })

// 大额动账-账户级提醒设置已读
export const remindReads = (data: any) =>
  request({
    url: backend.workService + "/api/accountremind/read",
    method: 'post',
    data : data
  })



// 在线人数
export const userCount = () =>
  request({
    url: backend.workService + "/api/ocrmfsysusercfg/onlinenum",
    method: 'get',
  })






















