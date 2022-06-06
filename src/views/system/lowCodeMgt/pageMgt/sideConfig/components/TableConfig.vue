<template>
  <div class="table-config">
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="表格" name="1">
        <yu-xform :model="tableConfigForm" label-width="100px" key="table">
          <yu-xform-group :column="1">
            <yu-xform-item v-for="config in tableConfigList" :key="config.id" :name="config.proId" :label="config.proName" :placeholder="config.proId" v-bind="config"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </el-tab-pane>
      <el-tab-pane label="列属性" name="2">
        <div class="action-btn__add" @click="addFn"><i class="el-icon-plus">添加列</i></div>
        <el-collapse v-model="activeCollapse" accordion>
          <draggable v-model="tableColumns" animation="300" handle=".mover" @start="drag = true" @end="drag = false">
            <el-collapse-item v-for="(item, index) in tableColumns" :key="item.prop" :name="item.prop">
              <template slot="title"
                >{{ item.label }}
                <div class="action-operator">
                  <i class="el-icon-rank mover"></i>
                  <i class="el-icon-delete" @click="deleteFn(index)"></i>
                </div>
              </template>
              <div class="action-btns">
                <div class="action-btn">
                  <yu-xform :model="item" label-width="100px" :key="item.prop">
                    <yu-xform-group :column="1">
                      <yu-xform-item
                        v-for="config in itemConfigList"
                        :key="config.id + index"
                        :name="config.proId"
                        :label="config.proName"
                        :placeholder="config.proId"
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
    <table-dialog :data-id="data.id" :data="tableColumns" :visible.sync="addVisible" @sure="sureAddFuncFn"></table-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import JsonEditor from "@/components/JsonEditor/index.vue";
import { setCompConfigById } from "@/utils/lowCode";
import TableDialog from "@/components/Dialogs/TableDialog.vue";
import request from "@/utils/request";
import { backend } from "@/config";
import { formatConfitItem } from "@/utils/lowCode";
import Draggable from "vuedraggable";
@Component({
  name: "TableConfig",
  components: {
    JsonEditor,
    TableDialog,
    Draggable,
  },
})
export default class extends Vue {
  @Prop({ default: () => {} }) data!: any;
  activeTab = "1";
  activeCollapse = "1";

  // 表格配置
  tableConfigList = [];
  tableConfigForm: Record<string, unknown> = {};
  // 表格属性配置
  tableColumns: any[] = [];
  itemConfigList = [];
  drag = false;

  // 添加条件
  addVisible = false;

  created() {
    this.getTableConfig();
    this.getPropConfig();
  }

  @Watch("data", { immediate: true })
  onDataChange() {
    const { columns } = this._.cloneDeep(this.data);
    this.tableColumns = [...columns];
    this.tableConfigForm = {
      ...this.data,
      type: this.data.tableType,
      "data-url": this.data.api,
    };
  }

  @Watch("tableConfigForm", { deep: true })
  onTableConfigFormChange() {
    this.updateConfig();
  }

  @Watch("tableColumns", { deep: true })
  onActionBtnsChange() {
    this.updateConfig();
  }

  updateConfig() {
    let config = {
      ...this.data,
      ...this.tableConfigForm,
      tableType: this.tableConfigForm.type,
      type: "table",
      columns: this.tableColumns,
    };
    setCompConfigById(this.data.id, config);
  }

  // 获取表格配置信息
  async getTableConfig() {
    let res = await request({
      url: backend.comptMgrService + "/api/sysmodule/list",
      method: "get",
      params: {
        condition: JSON.stringify({
          modRegName: "yu-xtable",
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
        this.tableConfigList = res.data;
        formatConfitItem(res.data);
      });
    }
  }

  // 获取属性配置信息
  async getPropConfig() {
    let res = await request({
      url: backend.comptMgrService + "/api/sysmodule/list",
      method: "get",
      params: {
        condition: JSON.stringify({
          modRegName: "yu-xtable-column",
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
          this.itemConfigList = res.data;
        });
      });
    }
  }

  deleteFn(index: number) {
    this.tableColumns.splice(index, 1);
    this.updateConfig();
  }

  addFn() {
    this.addVisible = true;
  }
  // 确认添加
  sureAddFuncFn(data: any) {
    this.tableColumns = data.columns;
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
.table-config {
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
