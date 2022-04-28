import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import store from "@/store";
// import elementVariables from '@/styles/element-variables.scss'

export interface ISettingsState {
  theme: string;
  themeType: string;
}

@Module({ dynamic: true, store, name: "settings" })
class Settings extends VuexModule implements ISettingsState {
  public theme = "#0086B3";
  public themeType = "custom";

  @Mutation
  private CHANGE_SETTING(payload: { key: string; value: any }) {
    const { key, value } = payload;
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      (this as any)[key] = value;
    }
  }

  @Action
  public ChangeSetting(payload: { key: string; value: any }) {
    this.CHANGE_SETTING(payload);
  }
}

export const SettingsModule = getModule(Settings);
