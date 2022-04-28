<template>
  <div class="groupDetail-container">
    <el-tabs class="yu-tabs is-header" v-model="activeName">
      <el-tab-pane label="客户群详情" name="1" lazy>
        <base-info />
      </el-tab-pane>
      <el-tab-pane label="成员列表" name="2" lazy>
        <member-list :instance="instance" />
      </el-tab-pane>
    </el-tabs>
    <el-button v-if="activeName == 1" class="yu-button-text" icon="el-icon-close" @click="closeFn">关闭</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import BaseInfo from "./components/BaseInfo/index.vue";
import MemberList from "./components/MemberList/index.vue";

@Component({
  name: "GroupDetail",
  components: {
    BaseInfo,
    MemberList,
  },
})
export default class extends Vue {
  @Prop() private instance!: any;
  @Prop() private row!: any;
  private activeName = "1";

  closeFn() {
    this.instance.hide();
  }
}
</script>

<style lang="scss" scoped>
.groupDetail-container {
  position: relative;
  height: calc(100vh - 128px);
  background: #ffffff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  .yu-button-text {
    position: absolute;
    top: 18px;
    right: 16px;
    z-index: 11;
  }
}
@media screen and (max-width: 1680px) {
  .groupDetail-container {
    .yu-button-text {
      top: 15px;
    }
  }
}
</style>
