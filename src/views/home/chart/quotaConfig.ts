import { formatMoney } from "@/utils";
import { SettingsModule } from '@/store/modules/settings'

const formmatIncrement = (val: any) => {
  let classStr = !val ? '' : (val > 0 ? 'up' : 'down')
  return `<div class="${classStr} num">${formatMoney(val / 10000)}</div>`
}

// 配置图表信息
const config: any = {
  card: [
    // 对公类
    { chartId: "KPI10101",name: "对公存款余额",total: "depBal",lastD: "depBalLastD",lastM: "depBalLastM",lastY: "depBalLastY",isAmount: true },
    { chartId: "KPI10102", name: "对公存款日均", total: "depBalAvg", lastD: "depBalAvgLastD", lastM: "depBalAvgLastM", lastY: "depBalAvgLastY", isAmount: true },
    { chartId: "KPI10103", name: "对公贷款余额", total: "loanBal", lastD: "loanBalLastD", lastM: "loanBalLastM", lastY: "loanBalLastY", isAmount: true },
    { chartId: "KPI10104", name: "FTP利润", total: "ftpProf", hideLast: true, isAmount: true },
    { chartId: "KPI10105", name: "对公客户数", total: "cstNum", lastD: "cstNumLastD", lastM: "cstNumLastM", lastY: "cstNumLastY" },
    { chartId: "KPI10106", name: "结算客户数", total: "settCstNum", lastD: "settCstNumLastD", lastM: "settCstNumLastM", lastY: "settCstNumLastY" },
    { chartId: "KPI10107", name: "有效客户数", total: "vldCstNum", lastD: "vldCstNumLastD", lastM: "vldCstNumLastM", lastY: "vldCstNumLastY" },
    { chartId: "KPI10108", name: "信贷客户数", total: "crdtCstNum", lastD: "crdtCstNumLastD", lastM: "crdtCstNumLastM", lastY: "crdtCstNumLastY" },
    // 科技金融类
    { chartId: "KPI10201",name: "科技金融存款余额",total: "tfDepBal",lastD: "tfDepBalLastD",lastM: "tfDepBalLastM",lastY: "tfDepBalLastY",isAmount: true },
    { chartId: "KPI10202", name: "科技金融存款日均", total: "tfDepBalAvg", lastD: "tfDepBalAvgLastD", lastM: "tfDepBalAvgLastM", lastY: "tfDepBalAvgLastY", isAmount: true },
    { chartId: "KPI10203", name: "科技金融贷款余额", total: "tfLoanBal", lastD: "tfLoanBalLastD", lastM: "tfLoanBalLastM", lastY: "tfLoanBalLastY", isAmount: true },
    { chartId: "KPI10204", name: "科技型企业客户数", total: "stCstNum", lastD: "stCstNumLastD", lastM: "stCstNumLastM", lastY: "stCstNumLastY" },
    // 小微类
    { chartId: "KPI10301",name: "普惠贷款余额",total: "icLoanBal",lastD: "icLoanBalLastD",lastM: "icLoanBalLastM",lastY: "icLoanBalLastY",isAmount: true },
    { chartId: "KPI10302", name: "小微贷款余额", total: "meLoanBal", lastD: "meLoanBalLastD", lastM: "meLoanBalLastM", lastY: "meLoanBalLastY", isAmount: true },
    { chartId: "KPI10303", name: "小企业存款余额", total: "meDepBal", lastD: "meDepBalLastD", lastM: "meDepBalLastM", lastY: "meDepBalLastY", isAmount: true },
    { chartId: "KPI10304", name: "小企业存款日均", total: "meDepBalAvg", lastD: "meDepBalAvgLastD", lastM: "meDepBalAvgLastM", lastY: "meDepBalAvgLastY", isAmount: true },
    { chartId: "KPI10305", name: "小企业中间业务收入", total: "interBusIncom", hideLast: true, isAmount: true },
    // 公司类
    { chartId: "KPI10401",name: "公司存款余额",total: "corDepBal",lastD: "corDepBalLastD",lastM: "corDepBalLastM",lastY: "corDepBalLastY",isAmount: true },
    { chartId: "KPI10402", name: "公司存款日均", total: "corDepBalAvg", lastD: "corDepBalAvgLastD", lastM: "corDepBalAvgLastM", lastY: "corDepBalAvgLastY", isAmount: true },
    { chartId: "KPI10403", name: "公司贷款余额", total: "corLoanBal", lastD: "corLoanBalLastD", lastM: "corLoanBalLastM", lastY: "corLoanBalLastY", isAmount: true },
    // 机构类
    { chartId: "KPI10501",name: "机构客户贷款余额",total: "insLoanBal",lastD: "insLoanBalLastD",lastM: "insLoanBalLastM",lastY: "insLoanBalLastY",isAmount: true },
    /** 分支行才能看到*/
    { chartId: "KPI10502", name: "机构客户存款余额", total: "insDepBalBrch", lastD: "insDepBalBrchLastD", lastM: "insDepBalBrchLastM", lastY: "insDepBalBrchLastY", isAmount: true },
    { chartId: "KPI10503", name: "机构客户存款日均", total: "insDepBalAvgBrch", lastD: "insDepBalAvgBrchLastD", lastM: "insDepBalAvgBrchLastM", lastY: "insDepBalAvgBrchLastY", isAmount: true },
    /** 分支行才能看到*/
    { chartId: "KPI10504", name: "中央国库定期存款余额", total: "crtTimeDepBal", lastD: "crtTimeDepBalLastD", lastM: "crtTimeDepBalLastM", lastY: "crtTimeDepBalLastY", isAmount: true  },
    { chartId: "KPI10505", name: "中央国库定期存款日均", total: "crtTimeDepBalAvg", lastD: "crtTimeDepBalAvgLastD", lastM: "crtTimeDepBalAvgLastM", lastY: "crtTimeDepBalAvgLastY", isAmount: true },
    { chartId: "KPI10506", name: "省级国库定期存款余额", total: "pvtTimeDepBal", lastD: "pvtTimeDepBalLastD", lastM: "pvtTimeDepBalLastM", lastY: "pvtTimeDepBalLastY", isAmount: true },
    { chartId: "KPI10507", name: "省级国库定期存款日均", total: "pvtTimeDepBalAvg", lastD: "pvtTimeDepBalAvgLastD", lastM: "pvtTimeDepBalAvgLastM", lastY: "pvtTimeDepBalAvgLastY", isAmount: true },
    /** 总行才能看到*/
    { chartId: "KPI10508", name: "机构客户存款余额（分支行）", total: "insDepBalBrch", lastD: "insDepBalBrchLastD", lastM: "insDepBalBrchLastM", lastY: "insDepBalBrchLastY", isAmount: true },
    { chartId: "KPI10509", name: "机构客户存款日均（分支行）", total: "insDepBalAvgBrch", lastD: "insDepBalAvgBrchLastD", lastM: "insDepBalAvgBrchLastM", lastY: "insDepBalAvgBrchLastY", isAmount: true },
    /** 总行才能看到*/
  ],
  chart: {
    // 机构
    org: [
      // 对公类
      { chartId: "KPI20101", name: "对公存款余额", xKey: "etlDate", yKey: "depBal", url: ["/api/acrmtrend/queryOrgDepD", "/api/acrmtrend/queryOrgDepM"]},
      { chartId: "KPI20102", name: "对公存款日均", xKey: "etlDate", yKey: "depBalAvg", url: ["/api/acrmtrend/queryOrgDepD", "/api/acrmtrend/queryOrgDepM"]},
      { chartId: "KPI20103", name: "对公贷款余额", xKey: "etlDate", yKey: "loanBal", url: ["/api/acrmtrend/queryOrgLoanD", "/api/acrmtrend/queryOrgLoanM"]},
      // 科技金融类
      { chartId: "KPI20201", name: "科技金融存款余额", xKey: "etlDate", yKey: "depBal", url: ["/api/acrmtrend/queryOrgDepD", "/api/acrmtrend/queryOrgDepM"]},
      { chartId: "KPI20202", name: "科技金融存款日均", xKey: "etlDate", yKey: "depBalAvg", url: ["/api/acrmtrend/queryOrgDepD", "/api/acrmtrend/queryOrgDepM"]},
      { chartId: "KPI20203", name: "科技金融贷款余额", xKey: "etlDate", yKey: "loanBal", url: ["/api/acrmtrend/queryOrgLoanD", "/api/acrmtrend/queryOrgLoanM"]},
      // 机构类
      { chartId: "KPI20501", name: "机构客户存款余额", xKey: "etlDate", yKey: "depBal", url: ["/api/acrmtrend/queryOrgDepD", "/api/acrmtrend/queryOrgDepM"]},
      { chartId: "KPI20502", name: "机构客户存款日均", xKey: "etlDate", yKey: "depBalAvg", url: ["/api/acrmtrend/queryOrgDepD", "/api/acrmtrend/queryOrgDepM"]},
      { chartId: "KPI20503", name: "机构客户贷款余额", xKey: "etlDate", yKey: "loanBal", url: ["/api/acrmtrend/queryOrgLoanD", "/api/acrmtrend/queryOrgLoanM"]},
      { chartId: "KPI20504", name: "机构客户存款余额（分支行）", xKey: "etlDate", yKey: "depBal", url: ["/api/acrmtrend/queryOrgDepD", "/api/acrmtrend/queryOrgDepM"]},
      { chartId: "KPI20505", name: "机构客户存款日均（分支行）", xKey: "etlDate", yKey: "depBalAvg", url: ["/api/acrmtrend/queryOrgDepD", "/api/acrmtrend/queryOrgDepM"]},
      // 小微类
      { chartId: "KPI20301", name: "普惠贷款余额", xKey: "etlDate", yKey: "loanBal", url: ["/api/acrmtrend/queryOrgLoanD", "/api/acrmtrend/queryOrgLoanM"]},
      { chartId: "KPI20302", name: "小微贷款余额", xKey: "etlDate", yKey: "loanBal", url: ["/api/acrmtrend/queryOrgLoanD", "/api/acrmtrend/queryOrgLoanM"]},
      { chartId: "KPI20303", name: "小企业存款余额", xKey: "etlDate", yKey: "depBal", url: ["/api/acrmtrend/queryOrgDepD", "/api/acrmtrend/queryOrgDepM"]},
      { chartId: "KPI20304", name: "小企业存款日均", xKey: "etlDate", yKey: "depBalAvg", url: ["/api/acrmtrend/queryOrgDepD", "/api/acrmtrend/queryOrgDepM"]},
      // 公司类
      { chartId: "KPI20401", name: "公司存款余额", xKey: "etlDate", yKey: "depBal", url: ["/api/acrmtrend/queryOrgDepD", "/api/acrmtrend/queryOrgDepM"]},
      { chartId: "KPI20402", name: "公司存款日均", xKey: "etlDate", yKey: "depBalAvg", url: ["/api/acrmtrend/queryOrgDepD", "/api/acrmtrend/queryOrgDepM"]},
      { chartId: "KPI20403", name: "公司贷款余额", xKey: "etlDate", yKey: "loanBal", url: ["/api/acrmtrend/queryOrgLoanD", "/api/acrmtrend/queryOrgLoanM"]},
    ],
    // 客户经理
    mgr: [
      // 对公类
      { chartId: "KPI20101", name: "对公存款余额", xKey: "etlDate", yKey: "depBal", url: ["/api/acrmtrend/queryMgrDepD", "/api/acrmtrend/queryMgrDepM"]},
      { chartId: "KPI20102", name: "对公存款日均", xKey: "etlDate", yKey: "depBalAvg", url: ["/api/acrmtrend/queryMgrDepD", "/api/acrmtrend/queryMgrDepM"]},
      { chartId: "KPI20103", name: "对公贷款余额", xKey: "etlDate", yKey: "loanBal", url: ["/api/acrmtrend/queryMgrLoanD", "/api/acrmtrend/queryMgrLoanM"]},
      // 科技金融类
      { chartId: "KPI20201", name: "科技金融存款余额", xKey: "etlDate", yKey: "depBal", url: ["/api/acrmtrend/queryMgrDepD", "/api/acrmtrend/queryMgrDepM"]},
      { chartId: "KPI20202", name: "科技金融存款日均", xKey: "etlDate", yKey: "depBalAvg", url: ["/api/acrmtrend/queryMgrDepD", "/api/acrmtrend/queryMgrDepM"]},
      { chartId: "KPI20203", name: "科技金融贷款余额", xKey: "etlDate", yKey: "loanBal", url: ["/api/acrmtrend/queryMgrLoanD", "/api/acrmtrend/queryMgrLoanM"]},
      // 机构类
      { chartId: "KPI20501", name: "机构客户存款余额", xKey: "etlDate", yKey: "depBal", url: ["/api/acrmtrend/queryMgrDepD", "/api/acrmtrend/queryMgrDepM"]},
      { chartId: "KPI20502", name: "机构客户存款日均", xKey: "etlDate", yKey: "depBalAvg", url: ["/api/acrmtrend/queryMgrDepD", "/api/acrmtrend/queryMgrDepM"]},
      { chartId: "KPI20503", name: "机构客户贷款余额", xKey: "etlDate", yKey: "loanBal", url: ["/api/acrmtrend/queryMgrLoanD", "/api/acrmtrend/queryMgrLoanM"]},
      // 小微类
      { chartId: "KPI20301", name: "普惠贷款余额", xKey: "etlDate", yKey: "loanBal", url: ["/api/acrmtrend/queryMgrLoanD", "/api/acrmtrend/queryMgrLoanM"]},
      { chartId: "KPI20302", name: "小微贷款余额", xKey: "etlDate", yKey: "loanBal", url: ["/api/acrmtrend/queryMgrLoanD", "/api/acrmtrend/queryMgrLoanM"]},
      { chartId: "KPI20303", name: "小企业存款余额", xKey: "etlDate", yKey: "depBal", url: ["/api/acrmtrend/queryMgrDepD", "/api/acrmtrend/queryMgrDepM"]},
      { chartId: "KPI20304", name: "小企业存款日均", xKey: "etlDate", yKey: "depBalAvg", url: ["/api/acrmtrend/queryMgrDepD", "/api/acrmtrend/queryMgrDepM"]},
      // 公司类
      { chartId: "KPI20401", name: "公司存款余额", xKey: "etlDate", yKey: "depBal", url: ["/api/acrmtrend/queryMgrDepD", "/api/acrmtrend/queryMgrDepM"]},
      { chartId: "KPI20402", name: "公司存款日均", xKey: "etlDate", yKey: "depBalAvg", url: ["/api/acrmtrend/queryMgrDepD", "/api/acrmtrend/queryMgrDepM"]},
      { chartId: "KPI20403", name: "公司贷款余额", xKey: "etlDate", yKey: "loanBal", url: ["/api/acrmtrend/queryMgrLoanD", "/api/acrmtrend/queryMgrLoanM"]},
    ],
  },
  rank: [
    // 对公类
    {
      chartId: "KPI30101",
      name: "对公存款余额增量",
      url: "/api/acrmincrank/queryDepBal",
      activeTab: 0,
      data: [],
      columns: [
        { prop: "orgNm", label: "机构名称", showOverflowTooltip: true },
        { prop: "depBal", label: "存款余额(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formatMoney(scope.row.depBal / 10000);
          },
        },
        { prop: "balIncr", label: "余额增量(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formmatIncrement(scope.row.balIncr)
          },
        },
      ],
    },
    {
      chartId: "KPI30102",
      name: "对公存款日均增量",
      url: "/api/acrmincrank/queryDepAvg",
      activeTab: 0,
      data: [],
      columns: [
        { prop: "orgNm", label: "机构名称", showOverflowTooltip: true },
        { prop: "depBalAvg", label: "存款日均(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formatMoney(scope.row.depBalAvg / 10000);
          },
        },
        { prop: "depBalAvgInc", label: "日均增量(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formmatIncrement(scope.row.depBalAvgInc);
          },
        },
      ],
    },
    {
      chartId: "KPI30103",
      name: "对公贷款余额增量",
      url: "/api/acrmincrank/queryLoan",
      activeTab: 0,
      data: [],
      columns: [
        { prop: "orgNm", label: "机构名称", showOverflowTooltip: true },
        { prop: "loanBal", label: "贷款余额(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formatMoney(scope.row.loanBal / 10000);
          },
        },
        { prop: "loanBalInc", label: "余额增量(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formmatIncrement(scope.row.loanBalInc);
          },
        },
      ],
    },
    // 科技金融类
    {
      chartId: "KPI30201",
      name: "科技金融存款余额增量",
      url: "/api/acrmincrank/queryDepBal",
      activeTab: 0,
      data: [],
      columns: [
        { prop: "orgNm", label: "机构名称", showOverflowTooltip: true },
        { prop: "depBal", label: "存款余额(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formatMoney(scope.row.depBal / 10000);
          },
        },
        { prop: "balIncr", label: "余额增量(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formmatIncrement(scope.row.balIncr);
          },
        },
      ],
    },
    {
      chartId: "KPI30202",
      name: "科技金融存款日均增量",
      url: "/api/acrmincrank/queryDepAvg",
      activeTab: 0,
      data: [],
      columns: [
        { prop: "orgNm", label: "机构名称", showOverflowTooltip: true },
        { prop: "depBalAvg", label: "存款日均(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formatMoney(scope.row.depBalAvg / 10000);
          },
        },
        { prop: "depBalAvgInc", label: "日均增量(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formmatIncrement(scope.row.depBalAvgInc);
          },
        },
      ],
    },
    {
      chartId: "KPI30203",
      name: "科技金融贷款余额增量",
      url: "/api/acrmincrank/queryLoan",
      activeTab: 0,
      data: [],
      columns: [
        { prop: "orgNm", label: "机构名称", showOverflowTooltip: true },
        { prop: "loanBal", label: "贷款余额(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formatMoney(scope.row.loanBal / 10000);
          },
        },
        { prop: "loanBalInc", label: "余额增量(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formmatIncrement(scope.row.loanBalInc);
          },
        },
      ],
    },
    // 小微类
    {
      chartId: "KPI30301",
      name: "普惠贷款余额增量",
      url: "/api/acrmincrank/queryLoan",
      activeTab: 0,
      data: [],
      columns: [
        { prop: "orgNm", label: "机构名称", showOverflowTooltip: true },
        { prop: "loanBal", label: "贷款余额(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formatMoney(scope.row.loanBal / 10000);
          },
        },
        { prop: "loanBalInc", label: "余额增量(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formmatIncrement(scope.row.loanBalInc);
          },
        },
      ],
    },
    {
      chartId: "KPI30302",
      name: "小微贷款余额增量",
      url: "/api/acrmincrank/queryLoan",
      activeTab: 0,
      data: [],
      columns: [
        { prop: "orgNm", label: "机构名称", showOverflowTooltip: true },
        { prop: "loanBal", label: "贷款余额(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formatMoney(scope.row.loanBal / 10000);
          },
        },
        { prop: "loanBalInc", label: "余额增量(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formmatIncrement(scope.row.loanBalInc);
          },
        },
      ],
    },
    {
      chartId: "KPI30303",
      name: "小企业存款余额增量",
      url: "/api/acrmincrank/queryDepBal",
      activeTab: 0,
      data: [],
      columns: [
        { prop: "orgNm", label: "机构名称", showOverflowTooltip: true },
        { prop: "depBal", label: "存款余额(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formatMoney(scope.row.depBal / 10000);
          },
        },
        { prop: "balIncr", label: "余额增量(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formmatIncrement(scope.row.balIncr);
          },
        },
      ],
    },
    {
      chartId: "KPI30304",
      name: "小企业存款日均增量",
      url: "/api/acrmincrank/queryDepAvg",
      activeTab: 0,
      data: [],
      columns: [
        { prop: "orgNm", label: "机构名称", showOverflowTooltip: true },
        { prop: "depBalAvg", label: "存款日均(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formatMoney(scope.row.depBalAvg / 10000);
          },
        },
        { prop: "depBalAvgInc", label: "日均增量(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formmatIncrement(scope.row.depBalAvgInc);
          },
        },
      ],
    },
    // 公司类
    {
      chartId: "KPI30401",
      name: "公司存款余额增量",
      url: "/api/acrmincrank/queryDepBal",
      activeTab: 0,
      data: [],
      columns: [
        { prop: "orgNm", label: "机构名称", showOverflowTooltip: true },
        { prop: "depBal", label: "存款余额(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formatMoney(scope.row.depBal / 10000);
          },
        },
        { prop: "balIncr", label: "余额增量(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formmatIncrement(scope.row.balIncr);
          },
        },
      ],
    },
    {
      chartId: "KPI30402",
      name: "公司存款日均增量",
      url: "/api/acrmincrank/queryDepAvg",
      activeTab: 0,
      data: [],
      columns: [
        { prop: "orgNm", label: "机构名称", showOverflowTooltip: true },
        { prop: "depBalAvg", label: "存款日均(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formatMoney(scope.row.depBalAvg / 10000);
          },
        },
        { prop: "depBalAvgInc", label: "日均增量(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formmatIncrement(scope.row.depBalAvgInc);
          },
        },
      ],
    },
    {
      chartId: "KPI30403",
      name: "公司贷款余额增量",
      url: "/api/acrmincrank/queryLoan",
      activeTab: 0,
      data: [],
      columns: [
        { prop: "orgNm", label: "机构名称", showOverflowTooltip: true },
        { prop: "loanBal", label: "贷款余额(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formatMoney(scope.row.loanBal / 10000);
          },
        },
        { prop: "loanBalInc", label: "余额增量(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formmatIncrement(scope.row.loanBalInc);
          },
        },
      ],
    },
    // 机构类
    {
      chartId: "KPI30501",
      name: "机构存款余额增量",
      url: "/api/acrmincrank/queryDepBal",
      activeTab: 0,
      data: [],
      columns: [
        { prop: "orgNm", label: "机构名称", showOverflowTooltip: true },
        { prop: "depBal", label: "存款余额(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formatMoney(scope.row.depBal / 10000);
          },
        },
        { prop: "balIncr", label: "余额增量(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formmatIncrement(scope.row.balIncr);
          },
        },
      ],
    },
    {
      chartId: "KPI30502",
      name: "机构存款日均增量",
      url: "/api/acrmincrank/queryDepAvg",
      activeTab: 0,
      data: [],
      columns: [
        { prop: "orgNm", label: "机构名称", showOverflowTooltip: true },
        { prop: "depBalAvg", label: "存款日均(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formatMoney(scope.row.depBalAvg / 10000);
          },
        },
        { prop: "depBalAvgInc", label: "日均增量(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formmatIncrement(scope.row.depBalAvgInc);
          },
        },
      ],
    },
    {
      chartId: "KPI30503",
      name: "机构贷款余额增量",
      url: "/api/acrmincrank/queryLoan",
      activeTab: 0,
      data: [],
      columns: [
        { prop: "orgNm", label: "机构名称", showOverflowTooltip: true },
        { prop: "loanBal", label: "贷款余额(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formatMoney(scope.row.loanBal / 10000);
          },
        },
        { prop: "loanBalInc", label: "余额增量(万元)", align: "right", isNum: true,
          render: (scope: any) => {
            return formmatIncrement(scope.row.loanBalInc);
          },
        },
      ],
    },
  ],
};

export default config;
