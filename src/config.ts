// 服务端地址
export const baseUrl = 'http://192.168.46.2:8080'; // 金融云  107075/123456
// export const baseUrl = 'http://192.16.68.153:8080'; // 测试
// export const baseUrl = 'http://192.16.77.161:8080'; // 压测环境  
// export const baseUrl = 'http://192.16.71.153:8080'; // 回归环境
// export const baseUrl = 'http://192.168.5.97:9099'; // 生产环境

// 微服务前缀
export const backend = {
  appOcaService: '/yusp-app-oca',   // 组织机构、菜单权限微服务-kqf-lyq
  uaaService: '/yusp-uaa',    // 用户认证微服务
  appCommonService: '/yusp-app-common', // 基础服务
  workService: '/yscrm-mgr-workplatfrom', // 工作平台
  custService: '/yscrm-entity-cust', // 客户管理
  fileService: '/yusp-file', // 文件上传
  noticeService : '/yusp-app-notice', //公告管理微服务
  dataSupplement: '/yscrm-business-center', // 业务中心
  teamCenter: '/yscrm-team-center', // 团队中心
  mgrMkt: '/yscrm-mgr-mkt', // 营销中心
  mgrCockpit: '/yscrm-mgr-cockpit' // 营销中心
}

