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
    <yu-xform ref="searchForm" :model="formData" :key="type">
      <!--top配置项-->
      <yu-xform-group :column="1" v-if="type === '0'">
        <yu-xform-item label="图标路径" ctype="input" name="iconUrl" placeholder="以@/assets/images/开头"></yu-xform-item>
        <yu-xform-item label="名称" ctype="input" name="name" :rules="globalRules.input50"></yu-xform-item>
        <yu-xform-item label="值格式" ctype="select" name="formatType" data-code="LC_FORMAT_TYPE"></yu-xform-item>
        <yu-xform-item v-if="formData.formatType === '1'" label="单位" ctype="select" name="unitType" data-code="LC_UNIT_TYPE" key="1"></yu-xform-item>
        <yu-xform-item v-else label="单位" ctype="input" name="unitType" :rules="globalRules.input50" key="2"></yu-xform-item>
        <yu-xform-item label="是否显示正负号" ctype="radio" name="isShowSymbol" data-code="YESNO"></yu-xform-item>
      </yu-xform-group>
      <!-- botton配置项 -->
      <yu-xform-group :column="1" v-else>
        <yu-xform-item label="名称" ctype="input" name="name" :rules="globalRules.input50"></yu-xform-item>
        <yu-xform-item label="是否显示图标" ctype="radio" name="isShowIcon" data-code="YESNO"></yu-xform-item>
        <yu-xform-item label="值格式" ctype="select" name="formatType" data-code="LC_FORMAT_TYPE"></yu-xform-item>
        <yu-xform-item v-if="formData.formatType === '1'" label="单位" ctype="select" name="unitType" data-code="LC_UNIT_TYPE" key="3"></yu-xform-item>
        <yu-xform-item v-else label="单位" ctype="input" name="unitType" :rules="globalRules.input50" key="4"></yu-xform-item>
        <yu-xform-item label="是否显示正负号" ctype="radio" name="isShowSymbol" data-code="YESNO"></yu-xform-item>
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
  formData = {
    name: "",
    value: "",
  };

  get selectCardQuota() {
    return LowCodeModule.selectCardQuota;
  }

  get cardConfig() {
    return LowCodeModule.cardConfig;
  }

  @Watch("type", { immediate: true })
  onTypeChange() {
    this.formData = {
      ...(this.cardConfig as any)[Number(this.type)],
    };
  }

  @Watch("selectCardQuota")
  onSelectCardQuotaChange(data: any) {
    console.log(3);
    this.formData.name = data.value;
    this.formData.value = data.data;
  }

  @Watch("formData", { immediate: true, deep: true })
  onFormDataChange(data: any) {
    console.log(4);
    LowCodeModule.SET_CARD_QUATO_CONFIG(data);
    let cardConfig: Record<string, unknown>[] = [...this.cardConfig];
    cardConfig[Number(this.type)] = {
      ...cardConfig[Number(this.type)],
      ...this.formData,
    };
    LowCodeModule.SET_CARD_CONFIG(cardConfig);
  }
}
</script>

<style lang="scss" scoped>
.config-container {
  padding: 10px;
}
</style>
