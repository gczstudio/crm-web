<template>
  <div class="tab-config">
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="选项卡属性" name="1">
        <yu-xform :model="tabConfigForm" label-width="100px">
          <yu-xform-group :column="1">
            <yu-xform-item name="id" label="组件id" disabled></yu-xform-item>
            <yu-xform-item v-for="config in tabConfigList" :key="config.id" :name="config.proId" :label="config.proName" :placeholder="config.proId" v-bind="config"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </el-tab-pane>
      <el-tab-pane label="选项卡子项" name="2">
        <div class="action-btn__add" @click="addFn"><i class="el-icon-plus">添加子项</i></div>
        <el-collapse v-model="activeCollapse" accordion>
          <draggable v-model="tabColumns" animation="300" handle=".mover" @start="drag = true" @end="drag = false">
            <el-collapse-item v-for="(item, index) in tabColumns" :key="item.prop" :name="item.prop">
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
                      <yu-xform-item label="标题" ctype="input" type="text" name="label"></yu-xform-item>
                      <yu-xform-item label="标识符" ctype="input" type="text" name="name"></yu-xform-item>
                      <yu-xform-item label="查询组件id" ctype="input" type="text" name="search-comp-id"></yu-xform-item>
                      <yu-xform-item label="查询字段名" ctype="input" type="text" name="search-key"></yu-xform-item>
                    </yu-xform-group>
                  </yu-xform>
                  <div class="sort-fields">
                    <div class="sort-label"><span>排序字段：</span><span class="sort-add" @click="addFieldFn(item)">+</span></div>
                    <div class="field-list">
                      <div class="field-item" v-for="(field, idx) in item.sortFields" :key="field.id">
                        <yu-xform :model="field" label-width="40px">
                          <yu-xform-group :column="2">
                            <yu-xform-item label="名称" ctype="input" name="value" :clearable="false"></yu-xform-item>
                            <yu-xform-item label="标识" ctype="input" name="key" :clearable="false"></yu-xform-item>
                          </yu-xform-group>
                        </yu-xform>
                        <span class="sort-delete" @click="deleteFielsFn(item, idx)">-</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </draggable>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import JsonEditor from "@/components/JsonEditor/index.vue";
import { setCompConfigById } from "@/utils/lowCode";
import request from "@/utils/request";
import { backend } from "@/config";
import { formatConfitItem } from "@/utils/lowCode";
import Draggable from "vuedraggable";
@Component({
  name: "CurdActionConfig",
  components: {
    JsonEditor,
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

  // 选项卡配置
  tabConfigList = [];
  tabConfigForm: any = {
    type: "",
  };
  // 选项卡子项配置
  tabColumns: any[] = [];
  drag = false;

  created() {
    this.getTabConfig();
  }

  @Watch("data", { immediate: true })
  onDataChange() {
    const { body, tabType } = this._.cloneDeep(this.data);
    this.tabColumns = [...body];
    this.tabConfigForm = {
      ...this.data,
      type: tabType,
    };
  }

  @Watch("tabConfigForm", { deep: true })
  onTabConfigFormChange() {
    this.updateConfig();
  }

  @Watch("tabColumns", { deep: true })
  onActionBtnsChange() {
    this.updateConfig();
  }

  updateConfig() {
    let config = {
      ...this.data,
      ...this.tabConfigForm,
      tabType: this.tabConfigForm.type,
      body: this.tabColumns,
    };
    delete config.type;
    setCompConfigById(this.data.id, config);
  }

  async getTabConfig() {
    let res = await request({
      url: backend.comptMgrService + "/api/sysmodule/list",
      method: "get",
      params: {
        condition: JSON.stringify({
          modRegName: "el-tab",
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
          size: 100,
        },
      }).then((res) => {
        formatConfitItem(res.data, () => {
          this.tabConfigList = res.data;
        });
      });
    }
  }

  deleteFn(index: number) {
    this.tabColumns.splice(index, 1);
    this.updateConfig();
  }

  addFn() {
    this.tabColumns.push({
      id: this.$util.guid(),
      label: "自定义",
      name: "custom",
      body: [],
    });
  }
  // 确认添加
  sureAddFuncFn(data: any) {
    let props = this.tabColumns.map((item) => item.prop);
    this.tabColumns = data.map((item: any) => {
      if (props.includes(item.fieldEn)) {
        item = this.tabColumns.find((ele) => ele.prop === item.fieldEn);
      } else {
        item = {
          prop: item.fieldEn,
          label: item.fieldZh,
          ctype: "input",
        };
      }
      return item;
    });
  }

  addFieldFn(data: any) {
    console.log(data, 888);
    // this.tableData.push({
    //   id: this.$util.guid(),
    // });
    data.sortFields.push({
      id: this.$util.guid(),
      key: "",
      value: "",
    });
  }

  deleteFielsFn(data: any, index: number) {
    data.sortFields.splice(index, 1);
  }
}
</script>

<style lang="scss" scoped>
.tab-config {
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

  .sort-fields {
    .field-item {
      position: relative;
      ::v-deep .yu-xform {
        width: calc(100% - 25px);
      }
    }
    .sort-add {
      cursor: pointer;
      margin-left: 5px;
      display: inline-block;
      width: 16px;
      height: 16px;
      line-height: 16px;
      border-radius: 50%;
      text-align: center;
      background: #007eff;
      color: #fff;
      font-weight: bold;
    }
    .sort-delete {
      position: absolute;
      top: 6px;
      right: 0;
      cursor: pointer;
      display: inline-block;
      width: 16px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      border-radius: 50%;
      background: #f56c6c;
      color: #fff;
      font-weight: bold;
    }
  }
}
</style>
