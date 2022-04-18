<template>
  <div class="maintainGroup-container">
    <el-tabs class="yu-tabs is-header" v-model="activeName">
      <el-tab-pane label="基本信息" name="1" lazy>
        <edit-base-info />
      </el-tab-pane>
      <el-tab-pane label="成员维护" name="2" lazy>
        <edit-member-list />
      </el-tab-pane>
    </el-tabs>
    <el-button class="yu-button-text" icon="el-icon-close" @click="closeFn">关闭</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EditBaseInfo from './components/EditBaseInfo/index.vue';
import EditMemberList from './components/EditMemberList/index.vue';

@Component({
  name: 'CustDeposite',
  components: {
    EditBaseInfo,
    EditMemberList
  }
})
export default class extends Vue {
  @Prop() private instance!: any;
  @Prop() private row!: any;
  private activeName = '1'

  closeFn () {
    this.instance.hide();
  }
  
}
</script>

<style lang="scss" scoped>
  .maintainGroup-container {
    position: relative;
    height: calc(100vh - 128px);
    background: #FFFFFF;
    box-shadow: 0px 3px 6px  rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    .yu-button-text {
      position: absolute;
      top: 18px;
      right: 16px;
      z-index: 11;
    }
  }
  @media screen and (max-width: 1680px) { 
    .maintainGroup-container {
      .yu-button-text {
        top: 15px;
      }
    }
  }
</style>
