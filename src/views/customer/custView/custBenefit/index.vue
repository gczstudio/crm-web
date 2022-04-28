<template>
  <div class="CustBenefit-container">
    <el-tabs class="yu-tabs is-header" v-model="activeName">
      <el-tab-pane label="EVA" name="1" lazy>
        <eva-list v-if="activeName === '1'" />
      </el-tab-pane>
      <el-tab-pane label="FTP利润" name="2" lazy>
        <cust-ftp v-if="activeName === '2'" />
      </el-tab-pane>
      <el-tab-pane label="经济资本占用" name="3" lazy>
        <eco-capital-list v-if="activeName === '3'" />
      </el-tab-pane>
      <el-tab-pane label="中间业务收入" name="4" lazy>
        <cust-mIncome v-if="activeName === '4'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EvaList from "./evaList/index.vue";
import CustFtp from "./custFtp/index.vue";
import EcoCapitalList from "./ecoCapitalList/index.vue";
import CustMIncome from "./custMIncome/index.vue";

@Component({
  name: "CustBenefit",
  components: {
    EvaList,
    CustFtp,
    EcoCapitalList,
    CustMIncome,
  },
})
export default class extends Vue {
  @Prop() private instance!: any;
  @Prop() private row!: any;
  private activeName = "1";
}
</script>

<style lang="scss" scoped>
.CustBenefit-container {
  background: #fff;
  margin-left: 16px;
  height: calc(100vh - 125px);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}
</style>
