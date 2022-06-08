<!--
 * @Descripttion: 渲染增删改查
 * @Author: gaocz
 * @Date: 2022-04-28 15:08:11
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-17 09:53:24
 * @FilePath: /edmp-web/src/views/system/lowCodeMgt/pageMgt/renderTool/components/RenderCurd.vue
-->
<template>
  <div class="curd-editor" v-editor.curd="{ action: ['delete'] }" :key="data.id">
    <MainLayout :title="data.title">
      <template v-slot:header>
        <el-button v-for="item in data.bulkActions" :key="item.key" class="yu-button-text" :icon="item.icon">{{ item.value }}</el-button>
      </template>
      <template v-slot:form>
        <yu-xform v-editor.curd-form ref="searchForm" class="search" :model="queryFormData" form-type="search">
          <yu-xform-group :column="4">
            <yu-xform-item v-for="item in data.formItems" :key="item.prop" :placeholder="item.label" v-bind="item"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </template>
      <template v-slot:table>
        <yu-xtable v-editor.curd-table ref="refTable" :data="testData" row-number border :key="JSON.stringify(data.columns)">
          <yu-xtable-column
            v-for="column in data.columns"
            v-bind="column"
            :key="column.prop"
            :label="column.label"
            :prop="column.prop"
            :min-width="column['min-width'] || column.label.length * 15 + 40"
            :show-overflow-tooltip="true"
            sortable="custom"
          ></yu-xtable-column>
          <yu-xtable-column v-if="data.itemActions && data.itemActions.length" label="操作" :width="getActionWidth(data.itemActions)" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button v-for="action in data.itemActions" :key="action.key" class="yu-action-btn" @click.native.prevent="customerViewFn(scope.row)" type="text">{{
                action.value.split("-")[0]
              }}</el-button>
            </template>
          </yu-xtable-column>
        </yu-xtable>
      </template>
    </MainLayout>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";
import { backend } from "@/config";
@Component({
  name: "RenderCurd",
})
export default class extends Vue {
  @Inject("type") type!: string;
  @Prop() data!: any;
  queryFormData = {};
  testData: any = [];

  @Watch("data", { immediate: true, deep: true })
  onDataChange() {
    let { url } = this.data;
    if (!url) {
      this.data.columns.map((item: any) => {
        this.testData[0] = this.testData[0] || {};
        this.testData[0][item.prop] = "测试数据";
      });
    } else {
      this.testData = null;
    }
  }

  getActionWidth(data: any[]) {
    let width = 0;
    data.map((item) => {
      width += item.value.split("-")[0].length * 15 + 10;
    });
    return width + 40;
  }
}
</script>

<style lang="scss" scoped>
.curd-editor {
  padding: 16px;
}
.curd-toolbar {
  position: relative;
  height: 36px;
  padding: 10px;
  margin-bottom: 16px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
  .yu-button-group {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }
}
</style>
