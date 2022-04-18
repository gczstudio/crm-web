import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface ICustomerState {
  rateInfo: Object
}

@Module({ dynamic: true, store, name: 'customer' })
class Customer extends VuexModule implements ICustomerState {
  public rateInfo = {}

  @Mutation
  SET_RATE_INFO(payload: object) {
    this.rateInfo = payload
  }
}

export const CustomerModule = getModule(Customer)
