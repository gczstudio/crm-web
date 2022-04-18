import router from './router'
// import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { MessageBox } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'

// NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']


router.beforeEach(async(to: Route, _: Route, next: any) => {
  // Start progress bar
  // NProgress.start()
  
  // Determine whether the user has logged in
  if (UserModule.token && to.path !== '/login') {
    if(!PermissionModule.asyncRoutes.length) {
      UserModule.GetMenus(to)
    }
    // 缓存3级路由
    if (to.matched && to.matched.length>2) {
      to.matched.forEach((item, index) => {
        if((item.components.default as any)?.extendOptions?.name ==='Blank') {
          to.matched.splice(index, 1);
        }
      })
    }
    next()
  } else {
    // Has no token
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // Other pages that do not have permission to access are redirected to the login page.
      let authType = localStorage.getItem('authType');
      let path = authType === 'uaa' ? '/login?authType=uaa' : 'login';
      next(path)
      // NProgress.done()
    }
  }
})

router.afterEach((to: Route) => {
  // Finish progress bar
  // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
  // NProgress.done()
})

router.onError((err) => {
  MessageBox.confirm("已发布新版本，需手动刷新！", '提示', {
    confirmButtonText: '确认刷新',
    type: 'warning',
    showCancelButton: false,
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false
  }).then(() => {
    location.reload();
  })
})
