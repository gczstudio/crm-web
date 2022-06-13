import { VuexModule, Module, Action, Mutation, getModule } from "vuex-module-decorators";
import store from "@/store";

export interface IProductState {
  activeEle: string;
}

@Module({ dynamic: true, store, name: "product" })
class Product extends VuexModule implements IProductState {
  activeEle = ""; // 当前选中的元素
  @Mutation
  SET_ACTIVE_Ele(payload: any) {
    this.activeEle = payload;
  }
}

export const ProductModule = getModule(Product);
