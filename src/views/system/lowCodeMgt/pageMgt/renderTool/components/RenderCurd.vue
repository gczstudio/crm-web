<!--
 * @Descripttion: 渲染增删改查
 * @Author: gaocz
 * @Date: 2022-04-28 15:08:11
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-05 08:37:02
 * @FilePath: /edmp-web/src/views/system/lowCodeMgt/pageMgt/renderTool/components/RenderCurd.vue
-->
<template>
  <div class="curd-editor">
    <div class="curd-toolbar" v-editor="['delete', 'drag']">
      <div class="curd-title">1111</div>
      <div class="yu-button-group tr">
        <el-button class="yu-button-text" icon="el-icon-download">导出</el-button>
        <el-button class="yu-button-text" icon="el-icon-download">导出</el-button>
      </div>
    </div>
    <div class="curd-form" v-editor>
      <yu-xform ref="searchForm" class="search" :model="queryFormData" form-type="search">
        <yu-xform-group :column="4">
          <yu-xform-item label="客户名称" placeholder="客户名称" ctype="input" name="custNm" :rules="globalRules.input"></yu-xform-item>
          <yu-xform-item label="核心客户号" placeholder="核心客户号" ctype="input" name="custId" :rules="globalRules.input"></yu-xform-item>
          <yu-xform-item label="组织机构代码" placeholder="组织机构代码" ctype="input" name="insCredCode" :rules="globalRules.input"></yu-xform-item>
          <yu-xform-item label="含同业科目" ctype="checkbox" name="isTy"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
    </div>
    <div class="curd-table" v-editor>
      <yu-xtable ref="refTable" row-number border>
        <yu-xtable-column v-if="queryFormData.type === '1'" label="主管机构" prop="blgOrgNm" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
        <yu-xtable-column v-else label="考核机构" prop="orgNm" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
        <yu-xtable-column label="主管客户经理" prop="blgMgrNm" min-width="160" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
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
  },
  data() {
    return {
      queryFormData: {},
      dataUrl: backend.custService + "/api/custdepanalybycst/depchglist",
      curdConfig: {
        type: "curd",
        api: "/xx/xxx/xxx",
        columns: [
          { lable: "客户名称", prop: "custName" },
          { lable: "客户名称1", prop: "custName1" },
          {
            type: "action",
            label: "操作",
            buttons: [
              {
                label: "编辑",
                type: "button",
                actionType: "dialog",
              },
            ],
          },
        ],
        headerToolbar: [
          {
            label: "新增",
            type: "button",
            actionType: "dialog",
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    hoverFn(e) {
      console.log(e, 111);
    },
  },
};
</script>
<style lang="scss" scoped>
.curd-toolbar {
  position: relative;
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
