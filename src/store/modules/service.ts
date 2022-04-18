import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IServiceState {
  remindType: string
  remindSType: string
  remindOptions: Array<any>
  isMark: string
}

@Module({ dynamic: true, store, name: 'service' })
class Service extends VuexModule implements IServiceState{
  remindType = '01'
  remindSType = '0101'
  remindOptions = []
  isMark = '1'

  @Mutation
  SET_REMIND_TYPE(payload:any) {
    this.remindType = payload
  }

  @Mutation
  SET_REMIND_S_TYPE(payload:any) {
    this.remindSType = payload
  }

  @Mutation
  SET_REMIND_OPTIONS(payload:any) {
    this.remindOptions = payload
  }

  @Mutation
  SET_IS_MARK(payload:any) {
    this.isMark = payload
  }
  
}
export const ServiceModule = getModule(Service)
