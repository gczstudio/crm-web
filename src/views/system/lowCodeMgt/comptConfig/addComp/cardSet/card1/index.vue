<!--
 * @Descripttion: 
 * @Author: gaocz
 * @Date: 2022-04-21 16:46:56
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-20 17:44:53
 * @FilePath: /edmp-web/src/views/system/lowCodeMgt/comptConfig/addComp/cardSet/card1/index.vue
-->

<template>
  <div class="card-config card1">
    <div :class="{ top: true, active: active === '0' }" @click="clickFn('0')">
      <div class="drag-box">
        <template v-if="cardConfig[0]"> </template>
      </div>
    </div>
    <div class="bottom">
      <el-row>
        <el-col :span="8" v-for="(item, index) in cardConfig.slice(1)" :key="index" :class="{ active: index + 1 == active }">
          <div class="drag-box" @click="clickFn(String(index + 1))"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";
import { LowCodeModule } from "@/store/modules/lowCode";

export interface Options {
  key: string;
  value: any;
}

@Component({
  name: "Card1",
})
export default class extends Vue {
  @Prop() data!: any;
  private active = "";
  private cardConfig: object[] = [];

  @Watch("data", { immediate: true, deep: true })
  onCardConfigChange(config: any) {
    this.cardConfig = config;
    if (config.length < 4) {
      for (var i = 0; i < 4 - config.length; i++) {
        this.cardConfig.push({});
      }
    }
  }

  clickFn(type: string) {
    this.active = type;
    this.$emit("change", type);
  }
}
</script>

<style lang="scss" scoped>
.card-config {
  margin: 100px auto 0;
  width: 400px;
  .top {
    cursor: pointer;
    height: 115px;
    border: 1px dashed #d8d8d8;
    &:hover,
    &.active {
      border-color: #007eff;
    }
  }
  .el-col {
    cursor: pointer;
    position: relative;
    height: 60px;
    border: 1px dashed #d8d8d8;
    border-top: none;
    & + .el-col {
      border-left: none;
    }
    .drag-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    &:hover,
    &.active {
      .drag-box {
        border: 1px dashed #007eff;
      }
    }
  }
}
</style>
