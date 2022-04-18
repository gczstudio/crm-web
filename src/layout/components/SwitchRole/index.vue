<template>
  <el-dialog :width="width" custom-class="yufp-switch-role" append-to-body :visible.sync="visible" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" @close="hide">
    <div class="switch-role-modal__content">
      <i class="iconfont icon-guanbixuanjiao" @click="hide"></i>
      <div class="switch-role-title">请选择角色</div>
      <div class="switch-role-wrapper clearfix">
        <div class="switch-role-item" v-for="(item, index) in data" :key="item.roleId" @click="switchRole(item)">
          <div class="switch-role-item-content">
            <img :src="getAvatar(index)" />
            <p class="sitch-role-name">{{item.roleName}}</p>
            <p class="sitch-role-org-name">{{item.orgName}}</p>
            <i class="iconfont icon-a-xuanzhongdangqian" v-if="(curRole.roleId + curRole.orgCode) === (item.roleId + item.orgCode)"></i>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getCheckedRole } from '@/utils'
import { switchRoleOrg } from '@/api/users'
import { UserModule } from '@/store/modules/user'
import { TagsViewModule } from '@/store/modules/tags-view'
import { CommonModule } from '@/store/modules/common'

@Component({
  name: 'SwitchRole'
})
export default class extends Vue {
  private data: Array<any> = [];
  private visible: boolean = false
  private curRole: any = {}

  get width() {
   return (this.data.length * 160) + ((this.data.length - 1) * 24) + 64 + 'px';
  }

  getAvatar(index: number) {
    index = index > 3 ? 0 : index;
    return require('@/assets/images/common/role-icon' + (index + 1) + '.png');
  }

  show () {
    this.data = JSON.parse((sessionStorage.getItem('userInfo') as string)).userRoles;
    this.curRole = getCheckedRole();
    this.visible = true;
  }

  hide () {
    this.visible = false;
  }

  switchRole (data: any) {
    // 调用外部接口
    this.hide();
    let params = {
      userRoleRelId: data.roleId,
      authOrg: data.orgCode
    }
    sessionStorage.setItem('currentRole', JSON.stringify(params));
    switchRoleOrg(params).then(res => {
      CommonModule.resetCommonState();
      UserModule.SET_IS_RENDER_TAG(true);
      UserModule.GetUserInfo();
    })
  }
}
</script>

<style lang="scss">
.yufp-switch-role .el-dialog__header { display: none; }
.yufp-switch-role .el-dialog__body { padding-bottom: 30px!important;}
.yufp-switch-role .switch-role-title { color: rgba(0, 0, 0, .85); font-weight: bold; font-size: 16px; }
.yufp-switch-role .switch-role-wrapper { margin-top: 24px; }
.yufp-switch-role .switch-role-item { box-sizing: border-box; cursor: pointer; float: left; margin-left: 24px; width: 160px; height: 200px; border: 1px solid #E9E9E9; border-radius: 2px; text-align: center; transition: all .3s; }
.yufp-switch-role .switch-role-item:hover { box-shadow: 0px 2px 8px 0px rgba(200, 201, 204, .5);}
.yufp-switch-role .switch-role-item:nth-child(1) { margin: 0;}
.yufp-switch-role .switch-role-item img{ width: 48px; height: 48px; border-radius: 50%; margin-top: 25px; }
.yufp-switch-role .switch-role-item .sitch-role-name{  margin: 8px 0; line-height: 24px; color: rgba(0, 0, 0, .85); font-weight: bold; }
.yufp-switch-role .switch-role-item-content .icon-a-xuanzhongdangqian{color: #32d8a0; font-size: 24px; }
.yufp-switch-role .sitch-role-org-name { margin-bottom: 16px; }
.yufp-switch-role .icon-guanbixuanjiao { position: absolute; top: 024px; right: 32px; font-size: 24px; cursor: pointer; }
</style>
