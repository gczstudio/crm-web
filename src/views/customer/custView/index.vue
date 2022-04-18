<template>
  <div class="custView-container">
    <div class="custView-left">
      <div class="title f3"><i class="iconfont icon-kehushitu vam"></i><span class="vam f3">客户视图</span></div>
      <ul class="nav">
        <li v-for="item in navList.filter(item => !item.hidden)" :key="item.id" :class="{active: item.key === activeNav, f3: true}" @click="navClickFn(item)">{{item.value}}</li>
      </ul>
    </div>
    <div class="custView-right">
      <component :is="componentId" :go="goNav" :activeChildTab="activeChildTab"></component>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CustProfile from './custProfile/index.vue'
import CustInfo from './custInfo/index.vue'
import CustDeposite from './custDeposite/index.vue'
import CustCredit from './custCredit/index.vue'
import CustBenefit from './custBenefit/index.vue'
import { checkCustViewAuth } from '@/api/customer'
import { Message } from 'element-ui'

interface INavItem {
  key: string,
  value: string,
  component: any,
  hidden?: boolean
}

@Component({
  name: 'CustView',
  components: {
    CustProfile,
    CustInfo,
    CustDeposite,
    CustCredit,
    CustBenefit
  }
})
export default class extends Vue {
  private authFlag = 1
  private navList: INavItem[] = []
  private activeNav = '1'
  private componentId: any = CustProfile
  private activeChildTab = ''

  beforeRouteEnter (to:any, from:any, next:any) {
    checkCustViewAuth(to.query.crmCustId).then(res => {
      if(res.data === 0) {
        Message.warning("您暂无权限查看客户视图，请联系管理员！")
      } else {
        next((vm:any) => {
          vm.authFlag = res.data; // 0 没有权限  // 1 查看所有的权限 2 只能客户概览和基本信息
        })
      }
    })
  }

  created() {
    (this as any).$lookup.reg('YESNO,NAT_STD_INDS_MIS')
  }

  mounted () {
     this.navList = [
      { key: '1', value: '客户概览', component: CustProfile },
      { key: '2', value: '基本信息', component: CustInfo },
      { key: '3', value: '存款信息', component: CustDeposite, hidden: this.authFlag === 2 },
      { key: '4', value: '授信信息', component: CustCredit, hidden: this.authFlag === 2 },
      { key: '5', value: '效益信息', component: CustBenefit, hidden: this.authFlag === 2 },
    ]
  }

  goNav (index: number, activeChildTab: string) {
    this.activeChildTab = activeChildTab;
    this.navClickFn(this.navList[index], true);
  }

  navClickFn(item:any, flag: boolean) {
    if(!flag) this.activeChildTab = '';
    this.activeNav = item.key
    this.componentId = item.component
  }
}
</script>
<style lang="scss" scoped>
  .custView-container {
    .custView-left {
      position: fixed;
      width: 108px;
      text-align: center;
      background: #fff;
      height: calc(100vh - 125px);
      box-shadow: 0px 3px 6px  rgba(0, 0, 0, 0.2);
      border-radius: 5px;
      .title {
        padding: 16px 0;
        border-bottom: 1px solid #A8A8A8;
        span{
          margin-left: 8px;
          font-weight: bold;
        }
      }
      .nav {
        margin-top: 10px;
        li {
          cursor: pointer;
          padding: 16px 0;
          color: #333;
          // &.active{
          //   background: rgba(0, 134, 179, 0.1);
          //   border-right: 4px solid $blue;
          //   color: $blue;
          // }
        }
      }
    }
    .custView-right {
      margin-left: 108px;
      width: calc(100% - 108px);
    }
  }
  @media screen and (max-width: 1680px) {
    .custView-container{
      .custView-left {
        height: calc(100vh - 102px);
      }
    }
  }
</style>
