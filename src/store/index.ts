import Vue from 'vue'
import Vuex from 'vuex'
import { IUserState } from './modules/user'
import { ITagsViewState } from './modules/tags-view'
import { IPermissionState } from './modules/permission'
import { ISettingsState } from './modules/settings'
import { IHomeState } from './modules/home'
import { ICommonState } from './modules/common'
import { ICustomerState } from './modules/customer'
import { IServiceState } from './modules/service'
import { IScreenState } from './modules/screen'

Vue.use(Vuex)

export interface IRootState {
  user: IUserState
  tagsView: ITagsViewState
  permission: IPermissionState
  settings: ISettingsState,
  home: IHomeState,
  common: ICommonState,
  customer: ICustomerState,
  service: IServiceState,
  screen: IScreenState
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({})
