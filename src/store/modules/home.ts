import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import { Route } from 'vue-router'
import store from '@/store'

export interface ITagView extends Partial<Route> {
  title?: string
}

export interface IHomeState {
  chartStatus: string
  chartConfig: Array<any>
  dragStatus: string
  dragType: string
  customTreeData:  Array<any>
  cardData:  Array<any>
  chartData:  Array<any>
  rankData:  Array<any>
  needAlignUpdate: boolean
}

@Module({ dynamic: true, store, name: 'home' })
class Home extends VuexModule implements IHomeState {
  chartStatus: string = 'closed';
  chartConfig: Array<any> = [];
  dragStatus: string = '';
  dragType: string = '';
  customTreeData: Array<any> = [];
  cardData: Array<any> = [];
  chartData: Array<any> = [];
  rankData: Array<any> = [];
  noticeTotal: string = '';
  needAlignUpdate = false

  @Mutation
  UPDATE_CHART_STATUS(status: string) {
    this.chartStatus = status
  }

  @Mutation
  UPDATE_CHART_CONFIG(data: Array<any>) {
    this.chartConfig = data;
  }

  @Mutation
  UPDATE_DRAG_STATUS(status: string) {
    this.dragStatus = status;
  }

  @Mutation
  UPDATE_DRAG_TYPE(type: string) {
    this.dragType = type;
  }

  @Mutation
  UPDATE_CUSTOM_TREE_DATA(data: Array<any>) {
    this.customTreeData = data;
  }


  @Mutation
  UPDATE_CARD_DATA(data: Array<any>) {
    this.cardData = data;
  }

  @Mutation
  UPDATE_CHART_DATA(data: Array<any>) {
    this.chartData = data;
  }

  @Mutation
  UPDATE_RANK_DATA(data: Array<any>) {
    this.rankData = data;
  }

  @Mutation
  UPDATE_NOTICE_TOATL(status: any) {
    this.noticeTotal = status;
  }

  @Mutation
  UPDATE_NEED_ALIGN_UPDATE(bool: boolean) {
    this.needAlignUpdate = bool;
  }

}

export const HomeModule = getModule(Home)
