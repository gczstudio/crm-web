<template>
  <div class="curd-form-config">
    <el-tabs v-model="activeTab" type="card">
      <div class="action-btn__add" @click="addFn"><i class="el-icon-plus">添加条件</i></div>
      <el-tab-pane label="属性" name="1">
        <el-collapse v-model="activeCollapse" accordion>
          <draggable v-model="formItems" animation="300" handle=".mover" @start="drag = true" @end="drag = false">
            <el-collapse-item v-for="(item, index) in formItems" :key="item.prop" :name="item.prop">
              <template slot="title"
                >{{ item.label }}
                <div class="action-operator">
                  <i class="el-icon-rank mover"></i>
                  <i class="el-icon-delete" @click="deleteFn(index)"></i>
                </div>
              </template>
              <div class="action-btns">
                <div class="action-btn">
                  <yu-xform ref="searchForm" :model="item" label-width="100px">
                    <yu-xform-group :column="1">
                      <yu-xform-item
                        :disabled="config.proId === 'name'"
                        v-for="config in itemConfigList"
                        :key="config.id + index"
                        :name="config.proId"
                        :label="config.proId"
                        :placeholder="config.proName"
                        :ctype="config.ctype || 'input'"
                        :options="config.options"
                      ></yu-xform-item>
                    </yu-xform-group>
                  </yu-xform>
                </div>
              </div>
            </el-collapse-item>
          </draggable>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
    <form-item-dialog :data-id="data.id" :data="formItems" :visible.sync="addVisible" @sure="sureAddFuncFn"></form-item-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";
import JsonEditor from "@/components/JsonEditor/index.vue";
import { setCompConfigById, formatConfitItem } from "@/utils/lowCode";
import FormItemDialog from "@/components/Dialogs/FormItemDialog.vue";
import request from "@/utils/request";
import { backend } from "@/config";
import Draggable from "vuedraggable";
@Component({
  name: "CurdActionConfig",
  components: {
    JsonEditor,
    FormItemDialog,
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
  activeTab = "1";
  activeCollapse = "1";
  queryFormData = {};
  formItems: any[] = [];
  itemConfigList = [];
  drag = false;

  // 添加条件
  addVisible = false;

  created() {
    this.getConfig();
  }

  @Watch("data", { immediate: true })
  onDataChange() {
    const { formItems } = this._.cloneDeep(this.data);
    this.formItems = [...formItems];
  }

  @Watch("formItems", { deep: true })
  onActionBtnsChange() {
    this.updateConfig();
  }

  updateConfig() {
    let config = {
      ...this.data,
      formItems: this.formItems,
    };
    setCompConfigById(this.data.id, config);
  }

  // 获取配置信息
  async getConfig() {
    let res = await request({
      url: backend.comptMgrService + "/api/sysmodule/list",
      method: "get",
      params: {
        condition: JSON.stringify({
          modRegName: "yu-xform-item",
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
        this.itemConfigList = res.data;
        formatConfitItem(res.data);
      });
    }
  }

  deleteFn(index: number) {
    this.formItems.splice(index, 1);
    this.updateConfig();
  }
  addFn() {
    this.addVisible = true;
  }
  // 确认添加
  sureAddFuncFn(data: any) {
    let names = this.formItems.map((item) => item.name);
    this.formItems = data.map((item: any) => {
      if (names.includes(item.fieldEn)) {
        item = this.formItems.find((ele) => ele.name === item.fieldEn);
      } else {
        item = {
          name: item.fieldEn,
          label: item.fieldZh,
          ctype: "input",
        };
      }
      return item;
    });
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
.curd-form-config {
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
