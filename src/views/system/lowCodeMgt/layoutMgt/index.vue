<template>
  <div class="LayoutMgt-container yu-main-wrapper">
    <el-row :gutter="16">
      <el-col :span="5">
        <MainLayout>
          <template v-slot:header>
            <el-button icon="el-icon-plus">新增</el-button>
          </template>
          <template v-slot:form>
            <yu-xform :model="searchForm">
              <yu-xform-item name="layoutName" ctype="input" placeholder="布局名称" @change="searchFn"></yu-xform-item>
            </yu-xform>
          </template>
          <template v-slot:table>
            <yu-xtable ref="refTable" :data-url="dataUrl" :dynamic-height="true" :border="false" layout="total, prev, pager, next">
              <yu-xtable-column label="布局名称" prop="acctNo"  :show-overflow-tooltip="true"></yu-xtable-column>
              <yu-xtable-column label="状态" prop="acctSubNo" :show-overflow-tooltip="true"></yu-xtable-column>
            </yu-xtable>
          </template>
        </MainLayout>
      </el-col>
      <el-col :span="19">
        <div class="layout-box">

        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { getUserInfo } from '@/api/common'
@Component({
  name: 'LayoutMgt',
  components: {
  }
})
export default class extends Vue {
  @Ref('refTable') refTable: any;

  private dataUrl = ''
  private searchForm = {}

  searchFn() {
    console.log(this.refTable, 111)
    this.refTable.remoteData({
      condition: JSON.stringify(this.searchForm)
    })
  }

  created() {
    this.getList()
  }

  private getList() {
    getUserInfo({}).then(res=> {
      console.log(1111)
    })
  }

}
</script>

<style lang="scss" scoped>
  
  
</style>
