<!--
 * @Descripttion: 增删改查配置
 * @Author: gaocz
 * @Date: 2022-04-28 15:08:11
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-17 14:19:53
 * @FilePath: /edmp-web/src/views/system/lowCodeMgt/pageMgt/sideConfig/components/CurdActionConfig.vue
-->
<template>
  <div class="curd-action-config">
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="属性" name="1">
        <yu-xform-item-part label="标题" placeholder="标题" ctype="input" v-model="data.title" :rules="globalRules.input"></yu-xform-item-part>
        <el-collapse v-model="activeCollapse">
          <el-collapse-item title="按钮" name="1">
            <div class="action-btns">
              <div class="action-btn" v-for="item in actionBtns" :key="item.key">
                <yu-xform ref="searchForm" :model="item" label-width="100px">
                  <yu-xform-group :column="1">
                    <yu-xform-item label="名称" ctype="input" name="value" :rules="globalRules.requiredInput50"></yu-xform-item>
                    <yu-xform-item label="按钮标识" ctype="input" name="key" :rules="globalRules.requiredInput50"></yu-xform-item>
                    <yu-xform-item label="显示位置" ctype="radio" name="type" data-code="LC_ACTION_TYPE"></yu-xform-item>
                    <yu-xform-item label="是否控制权限" ctype="radio" name="isPermission" data-code="YESNO"></yu-xform-item>
                    <yu-xform-item
                      label="权限标识"
                      v-if="item.isPermission === '1'"
                      ctype="input"
                      name="permissionCode"
                      :rules="item.isPermission === '1' ? globalRules.requiredInput50 : null"
                    ></yu-xform-item>
                    <yu-xform-item label="按钮行为" ctype="select" name="actionType"></yu-xform-item>
                    <yu-xform-item label="自定义事件" ctype="input" type="textarea" name="eventFunc"></yu-xform-item>
                  </yu-xform-group>
                </yu-xform>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";
import { LowCodeModule } from "@/store/modules/lowCode";
import { setCompConfigById } from "@/utils/lowCode";
export interface IAction {
  key: string;
  value: string;
  type: string;
}

@Component({
  name: "CurdActionConfig",
})
export default class extends Vue {
  @Prop({
    default: () => ({
      title: "",
      bulkActions: [],
      itemActions: [],
    }),
  })
  data!: any;
  private activeTab = "1";
  private activeCollapse = "1";
  private queryFormData = {};
  private actionBtns: IAction[] = [];

  @Watch("data", { immediate: true })
  onDataChange() {
    const { bulkActions, itemActions } = this.data;
    this.actionBtns = [...bulkActions, ...itemActions];
  }

  mounted() {
    console.log(this.data, 888);
  }
}
</script>

<style lang="scss" scoped>
.curd-action-config {
  height: 100%;
  .action-btns {
    .action-btn {
      border: 1px solid #ccc;
      padding: 10px;
      & + .action-btn {
        border-top: none;
      }
    }
  }
}
</style>
