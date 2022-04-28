import { VuexModule, Module, Action, Mutation, getModule } from "vuex-module-decorators";
import { getWebList } from "@/api/common";
import store from "@/store";

export interface ILookupMgr {
  [key: string]: any;
}

export interface ICommonState {
  lookupMgr: any;
  treeMgr: any;
  treeOriginMgr: any;
  updateDownloadFile: number;
  keyword: string;
  globalSearch: boolean;
}

@Module({ dynamic: true, store, name: "common" })
class Common extends VuexModule implements ICommonState {
  lookupMgr: ILookupMgr = {};
  treeMgr = {};
  treeOriginMgr = {};
  updateDownloadFile = 0;
  keyword = "";
  globalSearch = false;

  @Mutation
  SET_LOOKUP_MGR(lookupMgr: any) {
    this.lookupMgr = lookupMgr;
  }

  @Mutation
  SET_TREE_MGR(treeMgr: any) {
    this.treeMgr = treeMgr;
  }

  @Mutation
  SET_TREE_ORIGIN_MGR(treeOriginMgr: any) {
    this.treeOriginMgr = treeOriginMgr;
  }

  @Mutation
  UPDATE_DOWNLOAD_FILE(status: number) {
    this.updateDownloadFile = status;
  }

  @Mutation
  SET_KEYWORD(keyword: string) {
    this.keyword = keyword;
  }

  @Mutation
  UPDATE_GLOBAL_SEARCH(bool: boolean) {
    this.globalSearch = bool;
  }

  @Action
  public async getWebList(payload: any) {
    const res = await getWebList(payload);
  }

  @Action
  public async resetCommonState() {
    this.SET_TREE_MGR({});
    this.SET_TREE_ORIGIN_MGR({});
    this.SET_KEYWORD("");
    this.UPDATE_GLOBAL_SEARCH(false);
  }
}

export const CommonModule = getModule(Common);
