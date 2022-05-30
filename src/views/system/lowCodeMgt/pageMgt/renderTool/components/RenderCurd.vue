<!--
 * @Descripttion: 渲染增删改查
 * @Author: gaocz
 * @Date: 2022-04-28 15:08:11
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-17 09:53:24
 * @FilePath: /edmp-web/src/views/system/lowCodeMgt/pageMgt/renderTool/components/RenderCurd.vue
-->
<template>
  <div class="curd-editor" v-editor.curd="{ id: data.id, action: ['delete', 'drag'] }" :key="data.id">
    <div class="curd-toolbar" v-editor.curd-action="{ id: data.id }">
      <div class="curd-title">{{ data.title }}</div>
      <div class="yu-button-group tr">
        <el-button v-for="item in data.bulkActions" :key="item.key" class="yu-button-text" :icon="item.icon">{{ item.value }}</el-button>
      </div>
    </div>
    <div class="curd-form" v-editor.curd-form="{ id: data.id }">
      <yu-xform ref="searchForm" class="search" :model="queryFormData" form-type="search">
        <yu-xform-group :column="4">
          <yu-xform-item v-for="item in data.formItems" :key="item.prop" :placeholder="item.label" v-bind="item"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
    </div>
    <div class="curd-table" v-editor.curd-table="{ id: data.id }">
      <yu-xtable ref="refTable" :data="testData" row-number border :key="JSON.stringify(data.columns)">
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
    </div>
  </div>
</template>

<script>
import { backend } from "@/config";
export default {
  name: "RenderCurd",
  props: {
    id: String,
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      queryFormData: {},
      testData: [],
      dataUrl: backend.custService + "/api/custdepanalybycst/depchglist",
    };
  },
  watch: {
    data: {
      handler() {
        console.log("zxl");
        this.data.columns.map((item) => {
          this.testData[0] = this.testData[0] || {};
          this.testData[0][item.prop] = "测试数据";
        });
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getActionWidth(data) {
      let width = 0;
      data.map((item) => {
        width += item.value.split("-")[0].length * 15 + 10;
      });
      return width + 40;
    },
  },
};
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
