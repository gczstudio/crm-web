<template>
  <div class="common-config">
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="属性" name="1">
        <yu-xform ref="searchForm" :model="formData" label-width="100px">
          <yu-xform-group :column="1">
            <yu-xform-item
              v-for="(config, index) in propList"
              :key="config.id + index"
              :name="config.proId"
              :label="config.proName"
              :placeholder="config.proId"
              :ctype="config.ctype || 'input'"
              :options="config.options"
            ></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { querySysModule, querySysModuleProp } from "@/api/lowCode";
import { formatConfitItem, setCompConfigById } from "@/utils/lowCode";
import { Options } from "@/types/common";

export interface IProp {
  id: string;
  proId: string;
  proName: string;
  ctype: string;
  options: Options[];
}

@Component({
  name: "CommonSearchConfig",
  components: {},
})
export default class extends Vue {
  @Prop() data!: any;
  formData = {};
  propList: IProp[] = [];
  activeTab = "1";

  @Watch("data", { immediate: true })
  onDataChange() {
    this.formData = { ...this.data };
  }

  @Watch("formData", { deep: true })
  onFormColumnsChange() {
    this.updateConfig();
  }

  created() {
    this.getConfig();
  }

  updateConfig() {
    let config = {
      ...this.data,
      ...this.formData,
    };
    setCompConfigById(this.data.id, config);
  }

  // 获取配置信息
  async getConfig() {
    let res = await querySysModule({
      condition: JSON.stringify({
        modRegName: "common-search",
      }),
    });
    if (res.data[0]?.id) {
      querySysModuleProp({
        condition: JSON.stringify({
          moduleId: res.data[0]?.id,
        }),
      }).then((res) => {
        formatConfitItem(res.data, () => {
          this.propList = res.data;
        });
      });
    }
  }
}
</script>
<style lang="scss">
.common-config {
}
</style>
