import request from "@/utils/request";
import { backend } from "@/config";
import { AxiosRequestConfig } from "axios";

// 企业基本信息查询
export const getEnterpriseBaseInfo = (crmCustId: string) =>
  request({
    url: backend.custService + "/api/custoverview/enterprisebaseinfo/" + crmCustId,
    method: "get",
  });

// 指标展示层
export const getTargetInfo = (crmCustId: string) =>
  request({
    url: backend.custService + "/api/custoverview/targetinfo/" + crmCustId,
    method: "get",
  });

// 存款余额趋势图按日及利率值指标
export const getDepoistTrendByDay = (crmCustId: string) =>
  request({
    url: backend.custService + "/api/custoverview/depoisttrendbyday/" + crmCustId,
    method: "get",
  });

// 存款余额趋势图按月及利率值指标
export const getDepoistTrendByMonth = (crmCustId: string) =>
  request({
    url: backend.custService + "/api/custoverview/depoisttrendbymonth/" + crmCustId,
    method: "get",
  });

// 账户信息卡片式概况
export const getAccountInfoList = (params: any) =>
  request({
    url: backend.custService + "/api/custoverview/accountinfolist",
    method: "get",
    params,
  });

// 客户授信信息查询
export const getCustCreditInfo = (crmCustId: string) =>
  request({
    url: backend.custService + "/api/custoverview/custcreditinfo/" + crmCustId,
    method: "get",
  });

// 客户授信信息查询
export const getCustdetailinfo = (crmCustId: string) =>
  request({
    url: backend.custService + "/api/custinfo/custdetailinfo/" + crmCustId,
    method: "get",
  });

// 存款概况
export const getDepoistdetail = (crmCustId: string) =>
  request({
    url: backend.custService + "/api/depoistinfo/depoistdetail/" + crmCustId,
    method: "get",
  });

// 交易趋势图按日(包括交易金额和交易笔数)
export const getDealTrendByDay = (crmCustId: string) =>
  request({
    url: backend.custService + "/api/depoistinfo/dealtrendbyday/" + crmCustId,
    method: "get",
  });

// 交易趋势图按日(包括交易金额和交易笔数)
export const getDealTrendByMonth = (crmCustId: string) =>
  request({
    url: backend.custService + "/api/depoistinfo/dealtrendbymonth/" + crmCustId,
    method: "get",
  });

// 客户视图>>用户访问权限控制
export const checkCustViewAuth = (crmCustId: string) =>
  request({
    url: backend.custService + "/api/custviewauthority/check/" + crmCustId,
    method: "get",
  });

// 结算分析-流入流出
export const getDepoistInfoFlow = (params: any) =>
  request({
    url: backend.custService + "/api/depoistinfo/flow",
    method: "get",
    params,
  });

// 账户列表-实时余额查询
export const getBalanceInfo = (params: any) =>
  request({
    url: backend.custService + "/api/depoistinfo/balanceinfo",
    method: "post",
    params,
  });

// 分配机构/客户经理
export const saveCustDistribute = (data: any) =>
  request({
    url: backend.custService + "/api/custallocate/savecustdistribute",
    method: "post",
    data,
  });

// 回收校验是否存在营销标识
export const validaterecycleinfo = (params: any) =>
  request({
    url: backend.custService + "/api/custallocate/validaterecycleinfo",
    method: "get",
    params,
  });

// 按照客户回收客户经理
export const recycleByCust = (data: any) =>
  request({
    url: backend.custService + "/api/custallocate/recyclebycust",
    method: "post",
    data,
  });

// 按照客户回收客户经理
export const recycleByMgr = (data: any) =>
  request({
    url: backend.custService + "/api/custallocate/recyclebymgr",
    method: "post",
    data,
  });

// 新增标签信息
export const addtag = (data: any) =>
  request({
    url: backend.custService + "/api/ocrmftagtags/addtag",
    method: "post",
    data,
  });

// 修改标签信息
export const edittag = (data: any) =>
  request({
    url: backend.custService + "/api/ocrmftagtags/edittag",
    method: "post",
    data,
  });

// 修改标签状态(启用，停用，删除)
export const updatetagstatue = (data: any) =>
  request({
    url: backend.custService + "/api/ocrmftagtags/updatetagstatue",
    method: "post",
    data,
  });

// 新增灵活查询
export const addflexquery = (data: any) =>
  request({
    url: backend.custService + "/api/ocrmftagtags/addflexquery",
    method: "post",
    data,
  });

// 从灵活查询中删除
export const delflexquery = (data: any) =>
  request({
    url: backend.custService + "/api/ocrmftagtags/delflexquery",
    method: "post",
    data,
  });

// 标签客户新增
export const addtagcust = (data: any) =>
  request({
    url: backend.custService + "/api/ocrmftagcust/addtagcust",
    method: "post",
    data,
  });

// 标签客户删除
export const deltagcust = (data: any) =>
  request({
    url: backend.custService + `/api/ocrmftagcust/deltagcust/${data.ids}`,
    method: "post",
  });

// 根据标签查询标签值
export const querytagvalue = (params: any) =>
  request({
    url: backend.custService + "/api/ocrmftagvalue/querytagvalue",
    method: "get",
    params,
  });

// 客户灵活查询获取标签名
export const showtab = () =>
  request({
    url: backend.custService + "/api/ocrmfcifqdbcol/showtab",
    method: "get",
  });

// 条件字段拖拽
export const showcoltype = (params: any) =>
  request({
    url: backend.custService + "/api/ocrmfcifqdbcol/showcoltype",
    method: "get",
    params,
  });

// 校验方案名称是否存在
export const checkssolution = (params: any) =>
  request({
    url: backend.custService + "/api/ocrmfcifqssolution/checkssolution",
    method: "get",
    params,
  });

// 保存方案
export const savescol = (data: any) =>
  request({
    url: backend.custService + "/api/ocrmfcifqssolution/savescol",
    method: "post",
    data,
  });

// 更新方案
export const updatescol = (data: any) =>
  request({
    url: backend.custService + "/api/ocrmfcifqssolution/updatescol",
    method: "post",
    data,
  });

// 删除方案
export const deletescol = (data: any) =>
  request({
    url: backend.custService + "/api/ocrmfcifqssolution/deletes/" + data.ids,
    method: "post",
  });

// 查询方案列表
export const getColList = (params: any) =>
  request({
    url: backend.custService + "/api/ocrmfcifqssolution/list",
    method: "get",
    params,
  });

// 方案列表查询结果
export const queryresult = (params: any) =>
  request({
    url: backend.custService + "/api/ocrmfcifqdbcol/queryresult",
    method: "get",
    params,
  });

// 查询方案明细
export const getscol = (params: any) =>
  request({
    url: backend.custService + "/api/ocrmfcifqscol/getscol",
    method: "get",
    params,
  });

// 客户视图查询标签
export const crmquerycust = (params: any) =>
  request({
    url: backend.custService + "/api/ocrmftagcust/crmquerycust",
    method: "get",
    params,
  });

// 灵活查询根据标签获取标签值
export const gettagitem = (params: any) =>
  request({
    url: backend.custService + "/api/ocrmfcifqdbcol/tagitem",
    method: "get",
    params,
  });

// 获取方案列表详情
export const getSsolutiondetail = (params: any) =>
  request({
    url: backend.custService + "/api/ocrmfcifqssolution/ssolutiondetail",
    method: "get",
    params,
  });

// 新增客户群
export const addcrowd = (data: any) =>
  request({
    url: backend.custService + "/api/custcrowd/addcrowd",
    method: "post",
    data,
  });

// 修改客户群
export const updatecrowd = (data: any) =>
  request({
    url: backend.custService + "/api/custcrowd/updatecrowd",
    method: "post",
    data,
  });

// 删除客户群
export const deletecrowd = (data: any) =>
  request({
    url: backend.custService + "/api/custcrowd/deletecrowd",
    method: "post",
    data,
  });

// 发起审批
export const addnewappro = (data: any, options: any) =>
  request({
    url: backend.custService + "/api/custcrowd/addnewappro",
    method: "post",
    data,
    ...options,
  });

// 客户群审核
export const updateappro = (data: any) =>
  request({
    url: backend.custService + "/api/custcrowd/updateappro",
    method: "post",
    data,
  });

// 新增群成员
export const addcrowdmem = (data: any) =>
  request({
    url: backend.custService + "/api/crowdmember/addcrowdmem",
    method: "post",
    data,
  });

// 新增群成员
export const delcrowdmem = (data: any) =>
  request({
    url: backend.custService + "/api/crowdmember/delcrowdmem",
    method: "post",
    data,
  });

// 将灵活查询结果集中的所有客户加入指定客户群
export const addalltocustgroup = (data: any) =>
  request({
    url: backend.custService + "/api/ocrmfcifqdbcol/addalltocustgroup",
    method: "post",
    data,
  });

// 查询客户EVA信息
export const getevalist = (params: any) =>
  request({
    url: backend.custService + "/api/acrmfcievainfo/evalist",
    method: "get",
    params,
  });

// 获取eva参数值
export const getevapro = () =>
  request({
    url: backend.custService + "/api/acrmfcievainfo/evapro",
    method: "get",
  });
