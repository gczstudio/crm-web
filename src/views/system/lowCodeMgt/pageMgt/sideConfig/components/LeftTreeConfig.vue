<template>
  <div class="left-tree-config">
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="属性" name="1">
        <yu-xform :model="formConfigForm" label-width="100px">
          <yu-xform-group :column="1">
            <yu-xform-item
              v-for="config in formConfigList"
              :key="config.id"
              :name="config.proId"
              :label="config.proName"
              :placeholder="config.proId"
              :ctype="config.ctype || 'input'"
              :options="config.options"
            ></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </el-tab-pane>
      <el-tab-pane label="操作按钮" name="2">
        <div class="action-btn__add" @click="addFn"><i class="el-icon-plus">添加功能</i></div>
        <el-collapse v-model="activeCollapse" accordion>
          <el-collapse-item v-for="(item, index) in actionBtns" :key="item.id" :name="item.id">
            <template slot="title"
              >{{ item.value }}
              <div class="action-operator" @click.stop="() => {}">
                <el-switch v-if="item.type === '1'" v-model="item.switch"> </el-switch>
                <i v-if="item.type === '2'" class="el-icon-delete" @click.stop="deleteFn(index)"></i>
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
                    <yu-xform-item label="是否控制权限" ctype="switch" name="isPermission"></yu-xform-item>
                    <yu-xform-item
                      label="权限标识"
                      v-if="item.isPermission"
                      ctype="input"
                      name="permissionCode"
                      :rules="item.isPermission ? globalRules.requiredInput50 : null"
                      key="1"
                    ></yu-xform-item>
                    <yu-xform-item label="接口" ctype="input" type="text" name="url" key="2"></yu-xform-item>
                    <yu-xform-item label="前置逻辑" ctype="button" type="text" name="eventFunc" icon="el-icon-s-tools" @click="showFuncsonEditFn(item)"></yu-xform-item>
                    <yu-xform-item
                      v-if="item.key === 'create'"
                      label="额外参数"
                      ctype="button"
                      type="text"
                      name="extraParams"
                      icon="el-icon-s-tools"
                      @click="showParamsJsonEditFn(item)"
                    ></yu-xform-item>
                  </yu-xform-group>
                </yu-xform>
              </div>
            </div>
          </el-collapse-item>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import JsonEditor from "@/components/JsonEditor/index.vue";
import { setCompConfigById } from "@/utils/lowCode";
import FormDialog from "@/components/Dialogs/FormDialog.vue";
import request from "@/utils/request";
import { backend } from "@/config";
import { formatConfitItem } from "@/utils/lowCode";
@Component({
  name: "LeftTreeConfig",
  components: {
    JsonEditor,
    FormDialog,
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
  activeTab = "1";
  activeCollapse = "";

  // 属性配置
  formConfigList = [];
  formConfigForm = {};
  // 按钮配置
  actionBtns = [
    { id: "1", type: "1", value: "新增", key: "create" },
    { id: "2", type: "1", value: "修改", key: "edit" },
    { id: "3", type: "1", value: "删除", key: "delete" },
  ];

  // 添加条件
  addVisible = false;

  // 编辑器
  jsonValue = "";
  drawer = false;
  curAction: Record<string, string> = {};
  editorType = "";

  created() {
    this.getTableConfig();
  }

  @Watch("data", { immediate: true })
  onDataChange() {
    this.formConfigForm = { ...this.data };
    if (this.data.actions) {
      this.actionBtns = [...this.data.actions];
    }
  }

  @Watch("formColumns", { deep: true })
  onFormColumnsChange() {
    this.updateConfig();
  }

  @Watch("formConfigForm", { deep: true })
  onFormConfigFormChange() {
    this.updateConfig();
  }

  updateConfig() {
    let config = {
      ...this.data,
      ...this.formConfigForm,
      actions: this.actionBtns,
    };
    setCompConfigById(this.data.id, config);
  }

  // 获取配置信息
  async getTableConfig() {
    let res = await request({
      url: backend.comptMgrService + "/api/sysmodule/list",
      method: "get",
      params: {
        condition: JSON.stringify({
          modRegName: "yu-left-tree",
        }),
      },
    });
    if (res.data[0]?.id) {
      request({
        url: backend.comptMgrService + "/api/sysmodule/property/list",
        method: "get",
        params: {
          condition: JSON.stringify({
            moduleId: res.data[0]?.id,
          }),
        },
      }).then((res) => {
        formatConfitItem(res.data, () => {
          this.formConfigList = res.data;
        });
      });
    }
  }

  deleteFn(index: number) {
    this.actionBtns.splice(index, 1);
    this.updateConfig();
  }

  addFn() {
    this.actionBtns.push({ id: this.$util.guid(), type: "2", value: "", key: "" });
  }

  // 编辑器
  showFuncsonEditFn(action: any) {
    this.editorType = "eventFunc";
    this.drawer = true;
    this.curAction = action;
    this.jsonValue = action.eventFunc || "";
  }

  showParamsJsonEditFn(action: any) {
    this.editorType = "extraParams";
    this.drawer = true;
    this.curAction = action;
    this.jsonValue = action.extraParams || "";
  }

  cancelFn() {
    this.drawer = false;
  }

  saveFn() {
    this.curAction[this.editorType] = this.jsonValue;
    this.actionBtns.map((item: any) => {
      if (item.key === this.curAction.key) {
        item[this.editorType] = this.jsonValue;
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
.left-tree-config {
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
