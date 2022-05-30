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
        <yu-xform-item-part label="标题" placeholder="标题" ctype="input" v-model="title" :rules="globalRules.input" @input="titleChangeFn" clearable></yu-xform-item-part>
        <div class="action-btn__add" @click="addFn"><i class="el-icon-plus">添加功能</i></div>
        <el-collapse v-model="activeCollapse" accordion>
          <draggable v-model="actionBtns" animation="300" handle=".mover" @start="drag = true" @end="drag = false">
            <el-collapse-item v-for="(item, index) in actionBtns" :key="item.key" :name="item.key">
              <template slot="title"
                >{{ item.value }}
                <div class="action-operator">
                  <i class="el-icon-rank mover"></i>
                  <i class="el-icon-delete" @click="deleteFn(index)"></i>
                </div>
              </template>
              <div class="action-btns">
                <div class="action-btn">
                  <yu-xform ref="searchForm" :model="item" label-width="100px">
                    <div class="action-btn__type">
                      <span :class="{ custom: item.type === '2' }">{{ item.type === "1" ? "内置" : "自定义" }}</span>
                    </div>
                    <yu-xform-group :column="1">
                      <yu-xform-item label="名称" ctype="input" name="value" :rules="globalRules.requiredInput50"></yu-xform-item>
                      <yu-xform-item label="按钮标识" ctype="input" name="key" :rules="globalRules.requiredInput50" :disabled="item.type === '1'"></yu-xform-item>
                      <yu-xform-item label="显示位置" ctype="radio" name="showPos" data-code="LC_ACTION_TYPE"></yu-xform-item>
                      <yu-xform-item label="是否控制权限" ctype="radio" name="isPermission" data-code="YESNO"></yu-xform-item>
                      <yu-xform-item
                        label="权限标识"
                        v-if="item.isPermission === '1'"
                        ctype="input"
                        name="permissionCode"
                        :rules="item.isPermission === '1' ? globalRules.requiredInput50 : null"
                      ></yu-xform-item>
                      <template v-if="diffConfig[item.key] && diffConfig[item.key].length">
                        <yu-xform-item v-for="(config, index) in diffConfig[item.key]" :key="item.key + index" v-bind="config"></yu-xform-item>
                      </template>
                      <yu-xform-item label="自定义事件" ctype="button" type="text" name="eventFunc" icon="el-icon-s-tools" @click="showJsonEditFn(item)"></yu-xform-item>
                    </yu-xform-group>
                  </yu-xform>
                </div>
              </div>
            </el-collapse-item>
          </draggable>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
    <el-drawer
      ref="drawerRef"
      title="编辑器"
      :size="500"
      :with-header="false"
      :visible.sync="drawer"
      direction="rtl"
      append-to-body
      custom-class="custom-chart-drawer json-editor-drawer"
      :modal="false"
    >
      <json-editor ref="jsonEditor" v-model="jsonValue" />
      <div class="btns">
        <el-button @click="cancelFn">取消</el-button>
        <el-button type="primary" @click="saveFn">确定</el-button>
      </div>
    </el-drawer>
    <form-action-dialog :data="actionBtns" :visible.sync="addVisible" @sure="sureAddFuncFn"></form-action-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";
import JsonEditor from "@/components/JsonEditor/index.vue";
import { setCompConfigById } from "@/utils/lowCode";
import FormActionDialog from "@/components/dialogs/FormActionDialog.vue";
import Draggable from "vuedraggable";
export interface IAction {
  key: string;
  value: string;
  showPos: string;
}

@Component({
  name: "CurdActionConfig",
  components: {
    JsonEditor,
    FormActionDialog,
    Draggable,
  },
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
  drag = false;
  dragDisabled = true;
  activeTab = "1";
  activeCollapse = "1";
  queryFormData = {};
  title = "";
  actionBtns: IAction[] = [];

  diffConfig = {
    create: [{ label: "关联组件", ctype: "input", name: "relationComp" }],
    edit: [{ label: "关联组件", ctype: "input", name: "relationComp" }],
    delete: [
      { label: "接口", ctype: "input", name: "url" },
      { label: "提示语", ctype: "input", name: "tip" },
    ],
    detail: [
      { label: "接口", ctype: "input", name: "url" },
      { label: "关联组件", ctype: "input", name: "relationComp" },
    ],
    import: [
      { label: "是否选择导入方式", ctype: "radio", name: "uploadType" },
      { label: "导入接口", ctype: "input", name: "url" },
      { label: "导出失败接口", ctype: "input", name: "exportUrl" },
      { label: "提示语", ctype: "input", name: "tip" },
      { label: "插槽组件", ctype: "input", name: "relationComp" },
    ],
    download: [{ label: "接口", ctype: "input", name: "url" }],
    export: [
      { label: "文件名称", ctype: "input", name: "fileName" },
      { label: "接口", ctype: "input", name: "url" },
    ],
  };

  private jsonValue = "";
  private drawer = false;

  private curAction: any = {};

  // 添加功能
  addVisible = false;

  @Watch("data", { immediate: true })
  onDataChange() {
    const { bulkActions, itemActions, title } = this._.cloneDeep(this.data);
    this.title = title;
    this.actionBtns = [...bulkActions, ...itemActions];
  }

  @Watch("actionBtns", { deep: true })
  onActionBtnsChange() {
    this.updateConfig();
  }

  titleChangeFn() {
    this.updateConfig();
  }

  updateConfig() {
    let config = {
      ...this.data,
      title: this.title,
      bulkActions: this.actionBtns.filter((item) => item.showPos === "1"),
      itemActions: this.actionBtns.filter((item) => item.showPos !== "1"),
    };
    setCompConfigById(this.data.id, config);
  }

  addFn() {
    this.addVisible = true;
  }

  sureAddFuncFn(data: any) {
    this.actionBtns = [...data];
    this.updateConfig();
  }

  deleteFn(index: number) {
    this.actionBtns.splice(index, 1);
    this.updateConfig();
  }

  showJsonEditFn(action: any) {
    this.drawer = true;
    this.curAction = action;
    this.jsonValue = action.eventFunc || "";
  }

  cancelFn() {
    this.drawer = false;
  }

  saveFn() {
    this.curAction.eventFunc = this.jsonValue;
    this.actionBtns.map((item: any) => {
      if (item.key === this.curAction.key) {
        item.eventFunc = this.jsonValue;
      }
    });
    this.updateConfig();
    this.cancelFn();
  }
}
</script>
<style lang="scss">
.json-editor-drawer {
  .json-editor {
    height: calc(100% - 60px);
    border-bottom: 1px solid #ccc;
  }
  .btns {
    text-align: center;
    margin-top: 20px;
  }
}
</style>

<style lang="scss" scoped>
.curd-action-config {
  height: 100%;
  ::v-deep .el-collapse {
    position: relative;
  }
  .action-btn__add {
    padding: 10px 0;
    cursor: pointer;
    i {
      font-weight: bold;
    }
  }
  .action-btns {
    .action-btn {
      position: relative;
      border: 1px solid #ccc;
      padding: 20px 10px 10px;
      & + .action-btn {
        border-top: none;
      }
      .action-btn__type {
        position: absolute;
        top: -20px;
        left: -10px;
        width: 0;
        height: 0;
        border-top: 50px solid #007eff;
        border-right: 50px solid transparent;
        color: #fff;
        font-size: 12px;
        span {
          display: inline-block;
          width: 50px;
          position: absolute;
          top: -53px;
          left: 1px;
          transform: rotate(-45deg);
          &.custom {
            top: -47px;
            left: -3px;
          }
        }
      }
      .action-btn__delete {
        position: absolute;
        bottom: -10px;
        right: -10px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        // border-radius: 50%;
        text-align: center;
        background: #f56c6c;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>
