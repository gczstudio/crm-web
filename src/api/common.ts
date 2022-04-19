import request from '@/utils/request'
import { backend } from '@/config'

// 获取字典
export const getWebList = (params: any) =>
  request({
    url: backend.appCommonService + '/api/adminsmlookupitem/weblist',
    method: 'get',
    params
  })

// 获取数据日期
export const getSysDataDt = () =>
  request({
    url: backend.workService + '/api/homepageconfig/getsysdatadt',
    method: 'get'
  })

// 获取下载条数
export const getNumOfNDFile = (params: any) =>
  request({
    url: backend.fileService + '/api/downloadManage/getNumOfNDFile',
    method: 'get',
    params
  })

// 添加登录日志
export const addloginlog = (data: any) =>
  request({
    url: backend.appOcaService + '/api/loginlog/addloginlog',
    method: 'post',
    data
  })

// 记录用户退出登录时间
export const logoutrec = (data: any) =>
  request({
    url: backend.appOcaService + '/api/loginlog/logoutrec',
    method: 'post',
    data
  })

// 国标行业
export const getIndsTree = (params: any) =>
  request({
    url: backend.custService + '/api/ocrmfcifqdbcol/indstree',
    method: 'get',
    params
  })




  


  




