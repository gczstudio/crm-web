<template>
  <div class="custDeposite-container ml16">
    <el-tabs class="yu-tabs is-header" v-model="activeName">
      <el-tab-pane label="存款分析" name="1" lazy>
        <deposit-analyse />
      </el-tab-pane>
      <el-tab-pane label="账户列表" name="2" lazy>
        <account-list />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import DepositAnalyse from './depositAnalyse/index.vue'
import AccountList from './accountList/index.vue'

@Component({
  name: 'CustDeposite',
  components: {
    DepositAnalyse,
    AccountList
  }
})
export default class extends Vue {
  @Prop() private activeChildTab!: string;
  private activeName = '1'

  created() {
    this.activeName = this.activeChildTab || '1';
  }
}
</script>

<style lang="scss" scoped>
  .custDeposite-container {
    min-height: calc(100vh - 125px);
    background: #FFFFFF;
    box-shadow: 0px 3px 6px  rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }
</style>
