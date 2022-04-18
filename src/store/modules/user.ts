import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, getSessionInfo, getMenuAndContr } from '@/api/users'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import router, { resetRouter } from '@/router'
import { TagsViewModule } from './tags-view'
import store from '@/store'
import qs from 'qs'
import { PermissionModule } from './permission'
import { CommonModule } from './common'
import { HomeModule } from './home'
import { Message } from 'element-ui'
import { logoutrec } from '@/api/common'

export interface IUserState {
  token: string,
  userInfo: object,
  loading: boolean,
  switchRole: boolean,
  isRenderTag: boolean,
  isRefresh: boolean
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = sessionStorage.getItem('access_token') || ''
  userInfo:any = {}
  loading = false
  switchRole = false
  isRenderTag = false
  isRefresh = false

  @Mutation
  SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_USER_INFO(userInfo: any) {
    this.userInfo = userInfo
  }


  @Mutation
  SET_LOADING(loading: boolean) {
    this.loading = loading
  }

  @Mutation
  SET_SWITCH_ROLE(switchRole: boolean) {
    this.switchRole = switchRole
  }

  @Mutation
  SET_IS_RENDER_TAG(isRenderTag: boolean) {
    this.isRenderTag = isRenderTag
  }

  @Mutation
  SET_IS_REFRESH(isRefresh: boolean) {
    this.isRefresh = isRefresh
  }



  @Action
  public async Login(payload: any) {
    let res: any = await login(qs.stringify(payload.data), { headers: payload.headers });
    setToken((res as any)['access_token'])
    sessionStorage.setItem('access_token', (res as any)['access_token'])

    res.loginTime = Date.now();
    sessionStorage.setItem('tokenInfo', JSON.stringify(res));
    this.SET_TOKEN((res as any)['access_token'])
    this.GetUserInfo()
    return res;
  }

  @Action
  public async refreshLogin(payload: any) {
    let res: any = await login(qs.stringify(payload.data), { headers: payload.headers });
    setToken((res as any)['access_token'])
    sessionStorage.setItem('access_token', (res as any)['access_token'])
    res.loginTime = Date.now();
    sessionStorage.setItem('tokenInfo', JSON.stringify(res));
    this.SET_TOKEN((res as any)['access_token'])
    UserModule.SET_IS_REFRESH(false);
  }


  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
  }

  @Action
  public async GetUserInfo(flag?: boolean) {
    let res:any = await getSessionInfo()
    if(!Object.keys(res.roles[0]).length) {
      Message.error('该用户没有设置角色，请联系管理员！');
      this.Reset();
      return
    }
    this.SET_USER_INFO(res)
    sessionStorage.setItem('userInfo', JSON.stringify(res));
    !flag && this.GetMenus()
  }


  @Action
  public async GetMenus(route?: any) {
    let res:any = await getMenuAndContr();
    sessionStorage.setItem('contrMgr', JSON.stringify(res.data));
    PermissionModule.GenerateRoutes(res?.data?.menu);
    this.SET_SWITCH_ROLE(true)
    TagsViewModule.delAllViews();
    let realPath = (route?.path || PermissionModule.asyncRoutes[0].path)
    // 切换角色时，重定向一下
    if (this.isRenderTag) {
      router.replace({
        path: '/redirect' +realPath,
      }).catch(err => {
        console.warn(err)
      })
    } else {
      router.push({path: realPath, query: route?.query})
    }

    setTimeout(() => {
      this.SET_SWITCH_ROLE(false)
      this.SET_IS_RENDER_TAG(false)
    }, 1000);
  }

  @Action
  public Reset() {
    this.ResetToken()
    resetRouter()
    // 不清除authType
    let authType: any = localStorage.getItem('authType');
    localStorage.clear()
    sessionStorage.clear()
    localStorage.setItem("authType", authType);
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
    CommonModule.resetCommonState()
    HomeModule.UPDATE_CHART_STATUS('closed')
  }

  @Action
  public async LogOut() {
    let authType = localStorage.getItem('authType');
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    let tokenInfo = JSON.parse((sessionStorage.getItem('tokenInfo') as any));
    await logoutrec({tokenId: tokenInfo.refresh_token});
    await logout()
    this.Reset()
    router.push({ path: authType === 'uaa' ? '/login?authType=uaa' : 'login' });
    setTimeout(() => {
      location.reload();
    })
  }
}

export const UserModule = getModule(User)
