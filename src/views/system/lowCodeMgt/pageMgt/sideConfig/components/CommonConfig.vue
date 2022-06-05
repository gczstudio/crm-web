<template>
  <div class="common-config">
    <yu-xform ref="searchForm" :model="formData" label-width="100px">
      <yu-xform-group :column="1">
        <yu-xform-item
          v-for="(config, index) in propList"
          :key="config.id + index"
          :name="config.proName"
          :label="config.proId"
          :placeholder="config.proId"
          :ctype="config.ctype || 'input'"
          :options="config.options"
        ></yu-xform-item>
      </yu-xform-group>
    </yu-xform>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { querySysModule, querySysModuleProp } from "@/api/lowCode";
import { formatConfitItem } from "@/utils/lowCode";
import { Options } from "@/types/common";

export interface IProp {
  id: string;
  proId: string;
  proName: string;
  ctype: string;
  options: Options[];
}

@Component({
  name: "CurdActionConfig",
  components: {},
})
export default class extends Vue {
  @Prop() value!: any;
  @Prop() labelWidth!: any;
  @Prop() componentName!: any;
  formData = {};
  propList: IProp[] = [];

  created() {
    this.getConfig();
  }

  // 获取配置信息
  async getConfig() {
    let res = await querySysModule({
      condition: JSON.stringify({
        modRegName: this.componentName,
      }),
    });
    if (res.data[0]?.id) {
      querySysModuleProp({
        condition: JSON.stringify({
          moduleId: res.data[0]?.id,
        }),
      }).then((res) => {
        this.propList = res.data;
        formatConfitItem(res.data);
      });
    }
  }
}
</script>
<style lang="scss">
.common-config {
}
</style>
