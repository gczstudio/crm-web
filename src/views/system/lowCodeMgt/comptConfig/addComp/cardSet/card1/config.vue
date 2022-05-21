<!--
 * @Descripttion: 
 * @Author: gaocz
 * @Date: 2022-04-21 16:46:56
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-20 17:48:59
 * @FilePath: /edmp-web/src/views/system/lowCodeMgt/comptConfig/addComp/cardSet/card1/config.vue
-->

<template>
  <div class="config-container">
    <!--top配置项-->
    <yu-xform v-if="type === '0'" ref="searchForm" :model="formTopData" label-width="70px" key="1">
      <yu-xform-group :column="1">
        <yu-xform-item label="图标路径" ctype="input" name="iconUrl" placeholder="以@/assets/images/开头"></yu-xform-item>
        <yu-xform-item label="名称" ctype="input" name="name" :rules="globalRules.input50"></yu-xform-item>
        <yu-xform-item label="值格式" ctype="select" name="formatType" data-code="LC_FORMAT_TYPE"></yu-xform-item>
        <yu-xform-item v-if="formTopData.formatType === '1'" label="单位" ctype="select" name="unitType" data-code="LC_UNIT_TYPE" key="1"></yu-xform-item>
        <yu-xform-item v-else label="单位" ctype="input" name="unitType" :rules="globalRules.input50" key="2"></yu-xform-item>
      </yu-xform-group>
    </yu-xform>
    <!-- botton配置项 -->
    <yu-xform v-else ref="searchForm" :model="formBottomData" label-width="100px" key="2">
      <yu-xform-group :column="1">
        <yu-xform-item label="名称" ctype="input" name="name" :rules="globalRules.input50"></yu-xform-item>
        <yu-xform-item label="是否显示图标" ctype="radio" name="isShowIcon" data-code="YESNO"></yu-xform-item>
        <yu-xform-item label="值格式" ctype="select" name="formatType" data-code="LC_FORMAT_TYPE"></yu-xform-item>
        <yu-xform-item v-if="formBottomData.formatType === '1'" label="单位" ctype="select" name="unitType" data-code="LC_UNIT_TYPE" key="1"></yu-xform-item>
        <yu-xform-item v-else label="单位" ctype="input" name="unitType" :rules="globalRules.input50" key="2"></yu-xform-item>
      </yu-xform-group>
    </yu-xform>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";
import { LowCodeModule } from "@/store/modules/lowCode";
@Component({
  name: "Config",
})
export default class extends Vue {
  @Prop() type!: string;
  @Prop() data!: any;
  private formTopData = {};
  private formBottomData = {};

  @Watch("data", { immediate: true })
  onCardConfigChange(config: any) {
    if (this.type === "0") {
      this.formTopData = config || {};
    } else {
      this.formBottomData = config || {};
    }
  }
}
</script>

<style lang="scss" scoped>
.config-container {
  padding: 10px;
}
</style>
