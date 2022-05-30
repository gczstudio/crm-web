<!--
 * @Descripttion: 渲染弹出框
 * @Author: gaocz
 * @Date: 2022-04-28 15:08:11
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-17 10:37:41
 * @FilePath: /edmp-web/src/views/system/lowCodeMgt/pageMgt/renderTool/components/RenderForm.vue
-->
<template>
  <div class="render-form" v-editor.form="{ id: data.id, action: ['delete'] }">
    <yu-xform ref="searchForm" :model="formData" label-width="80px">
      <yu-xform-group v-for="(item, index) in groupData" :key="index" :column="parseFloat(groupData[index][0].column)">
        <yu-xform-item v-editor.form="{ id: data.id }" v-for="child in item" :key="child.name" :placeholder="child.label" v-bind="item"></yu-xform-item>
      </yu-xform-group>
    </yu-xform>
  </div>
</template>

<script>
import { backend } from "@/config";
export default {
  name: "RenderForm",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      formData: {},
      groupData: [],
    };
  },
  watch: {
    data: {
      handler(val) {
        this.groupData = this.formatData(val.items);
      },
      immediate: true,
    },
  },
  methods: {
    formatData(data) {
      let groupData = [[]];
      console.log(data, 999);
      data.map((item, index) => {
        if (index === 0) {
          groupData[0].push(item);
        } else {
          if (item.column === data[index - 1].column) {
            groupData[groupData.length - 1].push(item);
          } else {
            let len = groupData.length;
            groupData[len] = groupData[len] || [];
            groupData[len].push(item);
          }
        }
      });
      console.log(groupData, 7777);
      return groupData;
    },
  },
};
</script>
<style lang="scss" scoped>
.render-form {
}
</style>
