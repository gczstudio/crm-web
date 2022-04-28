import { VuexModule, Module, Action, Mutation, getModule } from "vuex-module-decorators";
import { getWebList } from "@/api/common";
import store from "@/store";

export interface IScreenState {
  activeOrg: string;
  activeMap: string;
  wuhanOrgNms: Array<string>;
  incrementStatus: string;
  uniqueKey: number;
}

@Module({ dynamic: true, store, name: "screen" })
class Screen extends VuexModule implements IScreenState {
  activeOrg = "";
  activeMap = "";
  wuhanOrgNms = [];
  incrementStatus = "";
  uniqueKey = 0;

  @Mutation
  SET_ACTIVE_ORG(payload: any) {
    this.activeOrg = payload;
  }

  @Mutation
  SET_ACTIVE_MAP(payload: any) {
    this.activeMap = payload;
  }

  @Mutation
  SET_WUHAN_ORGNMS(payload: any) {
    this.wuhanOrgNms = payload;
  }

  @Mutation
  SET_INCREMENT_STATUS(payload: any) {
    this.incrementStatus = payload;
  }

  @Mutation
  SET_UNIQUE_KEY(payload: any) {
    this.uniqueKey = payload;
  }
}

export const ScreenModule = getModule(Screen);
