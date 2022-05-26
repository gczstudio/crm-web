/*
 * @Descripttion:
 * @Author: gaocz
 * @Date: 2022-04-28 09:56:56
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-20 17:09:18
 * @FilePath: /edmp-web/src/store/modules/lowCode.ts
 */
import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import store from "@/store";

export interface IPageConfig {
  type: string;
  body: any[];
  [propName: string]: any;
}

export interface IWidgets {
  width: string;
  height: string;
  top: string;
  left: string;
}

export interface ILowCodeState {
  layout: string;
  activeFixedLayoutItem: number; // 固定布局，当前选中的块
  pageConfig: IPageConfig;
  hoverWidgets: IWidgets;
  activeWidgets: IWidgets;
  hoverEditorId: string;
  activeEditorId: string;
  activeWidgetsAuth: string[];
  widgetsMap: Record<string, unknown>;
  showRightPanel: boolean;
  cardConfig: Record<string, unknown>[];
  selectCardQuota: Record<string, unknown>;
  cardQuotaConfig: Record<string, unknown>;
  hasSideConfig: boolean; // 是否有左侧配置信息
}

@Module({ dynamic: true, store, name: "lowCode" })
class LowCode extends VuexModule implements ILowCodeState {
  layout = "none";
  activeFixedLayoutItem = -1;
  pageConfig = {
    type: "page",
    body: [
      {
        layout: "none",
        body: [],
      },
    ],
  };
  hoverWidgets = { width: "0px", height: "0px", top: "0px", left: "0px" };
  activeWidgets = { width: "0px", height: "0px", top: "0px", left: "0px" };
  hoverEditorId = "";
  activeEditorId = "";
  activeWidgetsAuth = [];
  widgetsMap = {};
  showRightPanel = false;
  // 指标卡配置相关
  cardConfig = [];
  selectCardQuota = {};
  cardQuotaConfig = {};
  hasSideConfig = true;

  @Mutation
  SET_LAYOUT(payload: any) {
    this.layout = payload;
  }

  @Mutation
  SET_ACTIVE_FIXED_LAYOUT_ITEM(payload: any) {
    this.activeFixedLayoutItem = payload;
  }

  @Mutation
  SET_PAGE_CONFIG(payload: any) {
    this.pageConfig = payload;
  }

  @Mutation
  SET_HOVER_WIDGETS(payload: any) {
    this.hoverWidgets = payload;
  }

  @Mutation
  SET_ACTIVE_WIDGETS(payload: any) {
    this.activeWidgets = payload;
  }

  @Mutation
  SET_HOVER_EDITOR_ID(payload: any) {
    this.hoverEditorId = payload;
  }

  @Mutation
  SET_ACTIVE_EDITOR_ID(payload: any) {
    this.activeEditorId = payload;
  }

  @Mutation
  SET_ACTIVE_WIDGETS_AUTH(payload: any) {
    this.activeWidgetsAuth = payload || [];
  }

  @Mutation
  SET_WIDGETS_MAP(payload: any) {
    this.widgetsMap = { ...this.widgetsMap, ...payload };
  }

  @Mutation
  SET_SHOW_RIGHT_PANEL(payload: any) {
    this.showRightPanel = payload;
  }

  @Mutation
  SET_CARD_CONFIG(payload: any) {
    this.cardConfig = payload;
  }

  @Mutation
  SET_SELECT_CARD_QUATO(payload: any) {
    this.selectCardQuota = payload;
  }

  @Mutation
  SET_CARD_QUATO_CONFIG(payload: any) {
    this.cardQuotaConfig = payload;
  }

  @Mutation
  SET_HAS_SIDE_CONFIG(payload: any) {
    this.hasSideConfig = payload;
  }
}

export const LowCodeModule = getModule(LowCode);
