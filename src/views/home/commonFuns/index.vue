<template>
  <div class="commonFuns-container">
    <el-tabs class="yu-tabs">
      <el-tab-pane>
        <span slot="label"
          ><i class="iconfont icon-changyonggongneng"></i>常用功能</span
        >
        <div class="func-container">
          <el-row>
            <el-col :span="6" v-for="(item, index) in commonFuncs" :key="item.menuId">
              <div class="func" @click="goPageFn(item)">
                <img
                  :src="require(`@/assets/images/theme/${themeType}/func/func${index}.png`)"
                  alt=""
                />
                <p :title="item.menuName">{{item.menuName}}</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="func" @click="addFunsFn">
                <img :src="require(`@/assets/images/theme/${themeType}/func/func-add.png`)" alt="" />
                <p>添加更多</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"
          ><i class="iconfont icon-menhudaohang"></i>门户导航</span
        >
        <div class="func-container">
          <el-row>
            <el-col :span="6" v-for="(item, index) in portalNav" :key="item.value">
              <div class="func" @click="openNewNavFn(item)">
                <img
                  :src="require(`@/assets/images/theme/${themeType}/nav/nav${index+1}.png`)"
                  alt=""
                />
                <p :title="item.value">{{item.value}}</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 常用功能 -->
    <content-modal :visible.sync="visible">
      <template slot-scope="scope">
         <add-func :instance="scope" @success="getUserCommFuncList" />
      </template>
    </content-modal>  
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from "vue-property-decorator";
import { getUserCommFuncList } from '@/api/home'
import AddFunc from './addFunc.vue'
import { SettingsModule } from '@/store/modules/settings';
import { getUserInfo } from "@/utils";

@Component({
  name: "CommonFuns",
  components: {
    AddFunc
  },
})
export default class extends Vue {

  private commonFuncs = []
  private visible = false;
  private loginInfo = JSON.parse((sessionStorage.getItem('loginInfo') as any));
  
  private portalNav = []
      // { name: '信用风险系统', icon: 'mis', url: `http://192.168.5.14:8081/crms-web/ssoservice` },
    // { name: 'OA', icon: 'oa', url: `http://oa.wucb.com/hkyh_oa/j_spring_security_check?j_username=${this.loginInfo.username}&j_password=${this.loginInfo.password}` },
    // { name: '征信查询系统', icon: 'zx', url: `http://192.168.5.144/eism/loginCheck.action?userID=${this.loginInfo.username}&pw=${this.loginInfo.password}` },
    // { name: '实物档案系统', icon: 'swda', url: `http://192.168.5.95:9080/dms/login.ered?reqCode=ADlogin&ADUserID=${this.loginInfo.username}&ADPassword=${this.loginInfo.password}` },
    // { name: '中收减免系统', icon: 'zsjm', url: 'http://192.168.5.120/eas/index.html' },
    // { name: '普惠系统', icon: 'ph', url: 'http://192.168.5.97:9080/mloan' },
    // { name: '投行系统', icon: 'th', url: 'http://itms.wucb.com/framework_platform/auth/login', manual: true },
    // { name: '报表系统', icon: 'bb', url: `http://ua.wucb.com/ridp/servlet/BipServiceServlet?j_systemid=418&type=2&outer=true&j_username=${this.loginInfo.username}&j_password=${this.loginInfo.password}`},
    // { name: '线上供应链系统', icon: 'xsgyl', url: `http://192.168.5.97:8090/oscf/login?reqCode=ADlogin?j_username=${this.loginInfo.username}&j_password=${this.loginInfo.password}` },
    // { name: '原对公CRM系统', icon: 'crm', url: `http://ecrm.wucb.com/ecrm/login.jsf?j_systemid=62&j_mark=62&j_username=${this.loginInfo.username}&j_password=${this.loginInfo.password}` },
    // { name: '投行', url: 'http://192.16.5.57:8181/platform_framework/auth/login', manual: true }, // 测试环境

  get themeType() {
    return SettingsModule.themeType
  }

  created() {
    this.getUserCommFuncList();
    (this as any).$lookup.bind('NAV_LINK', (lookup: any) => {
      this.portalNav = lookup;
    })
  }


  //打开第三方系统
  openNewNavFn(item: any){
    let path = item.key;
    let loginInfo = JSON.parse((sessionStorage.getItem('loginInfo') as any));
    if(item.value === '投行系统') {
      this.$util.formPost({
        path,
        loginInfo: {
          userName: loginInfo.username,
          password: loginInfo.password
        }
      })
      return;
    }
    
    if(path.includes("{{userName}}")) {
      path = path.replace('{{userName}}', loginInfo.username).replace('{{password}}', loginInfo.password);
    }
    window.open(path);
  }

  // 添加常用功能
  addFunsFn() {
    this.visible = true;
  }

  // 获取常用功能
  getUserCommFuncList() {
    getUserCommFuncList().then(res => {
      this.commonFuncs = res.data
    })
  }

  closeContentModalFn () {
    this.visible = false
  }

  goPageFn(data:any) {
    // 获取对应的路由
    var menu = (this as any).$util.getRouteByMenuId(data.menuId)
    this.$router.push({path: menu.funcUrl})
  }

}
</script>

<style lang="scss" scoped>
.commonFuns-container {
  height: 260px;
  background: #ffffff;
  box-shadow: 0px 3px 6px  rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  .func-container {
    padding: 0 10px;
  }
  .func {
    cursor: pointer;
    margin-top: 3px;
    padding: 12px 5px;
    text-align: center;
    img {
      width: 40px;
      height: 40px;
    }
    p {
      margin-top: 4px;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: all 0.3s;
    }
    &:hover {
      box-shadow: 0px 3px 6px rgba(0, 92, 187, 0.2);
      p {
        //  color: $blue;
      }
    }
  }
  ::v-deep.yu-tabs {
    // margin: auto 10px;
    .el-tabs__nav-scroll {
      padding: 16px 10px 10px;
      position: relative;
      &::before {
        position: absolute;
        left: 10px;
        bottom: 0;
        display: inline-block;
        content: '';
        width: calc(100% - 20px);
        height: 1px;
        background: #C0C0C0;
      }
    }
    .el-tabs__header {
      margin: 0;
    }
  }
}
</style>
