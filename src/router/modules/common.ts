import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const commonRoutes: RouteConfig =  {
    path: '/common',
    component: Layout,
    name: 'Common',
    meta: {
      title: '公共路由',
      hidden: true 
    },
    children: [
      {
        path: 'addFunc',
        name: 'AddFunc',
        component: () => import('@/views/home/commonFuns/addFunc.vue'),
        meta: { title: '添加常用功能', hidden: true },
      }
    ]
}

export default commonRoutes
