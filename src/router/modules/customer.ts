import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const  customerRoutes: RouteConfig =  {
    path: '/custInfo',
    component: Layout,
    name: 'CustInfo',
    meta: {
      title: '客户',
      icon: 'icon-kehu',
      hidden: true 
    },
    children: [
      {
        path: 'custView/:crmCustId',
        name: 'CustView',
        component: () => import('@/views/customer/custView/index.vue'),
        meta: { title: '客户详情', hidden: true },
      },
      {
        path: 'custRunAccount/:id',
        name: 'CustRunAccount',
        component: () => import('@/views/customer/custRunAccount/index.vue'),
        meta: { title: '交易流水', hidden: true, authUrl: '/customer/custSearch/custMgt' },
      },
      {
        path: 'tradeGather/:id',
        name: 'TradeGather',
        component: () => import('@/views/customer/custView/custDeposite/tradeGather/index.vue'),
        meta: { title: '交易汇总', hidden: true },
      },
      {
        path: 'accountList/:id',
        name: 'AccountList',
        component: () => import('@/views/customer/depositeAnalysis/accountList/index.vue'),
        meta: { title: '账户列表', hidden: true },
      }
    ]
}

export default customerRoutes
