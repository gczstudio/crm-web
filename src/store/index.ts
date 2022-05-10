/*
 * @Descripttion:
 * @Author: gaocz
 * @Date: 2022-03-03 15:43:54
 * @LastEditors: gaocz
 * @LastEditTime: 2022-04-28 09:59:55
 * @FilePath: /edmp-web/src/store/index.ts
 */
import Vue from "vue";
import Vuex from "vuex";
import { IUserState } from "./modules/user";
import { ITagsViewState } from "./modules/tags-view";
import { IPermissionState } from "./modules/permission";
import { ISettingsState } from "./modules/settings";
import { IHomeState } from "./modules/home";
import { ICommonState } from "./modules/common";
import { ICustomerState } from "./modules/customer";
import { IServiceState } from "./modules/service";
import { IScreenState } from "./modules/screen";
import { ILowCodeState } from "./modules/lowCode";

Vue.use(Vuex);

export interface IRootState {
  user: IUserState;
  tagsView: ITagsViewState;
  permission: IPermissionState;
  settings: ISettingsState;
  home: IHomeState;
  common: ICommonState;
  customer: ICustomerState;
  service: IServiceState;
  screen: IScreenState;
  lowCode: ILowCodeState;
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({});
