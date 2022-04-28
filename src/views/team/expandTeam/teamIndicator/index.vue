<template>
  <div class="teamIndicator-container">
    <el-tabs class="yu-tabs is-header" v-model="activeName">
      <el-tab-pane label="团队列表" name="1">
        <team-list v-if="activeName === '1'" />
      </el-tab-pane>
      <el-tab-pane label="成员列表" name="2">
        <member-list v-if="activeName === '2'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import TeamList from "./teamList/index.vue";
import MemberList from "./memberList/index.vue";

@Component({
  name: "TeamIndicator",
  components: {
    TeamList,
    MemberList,
  },
})
export default class extends Vue {
  @Prop() private instance!: any;
  @Prop() private row!: any;
  private activeName = "1";
}
</script>

<style lang="scss" scoped>
.teamIndicator-container {
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
  .teamIndicator-container {
    .yu-button-text {
      top: 15px;
    }
  }
}
</style>
