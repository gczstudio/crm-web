<!--
 * @Descripttion: 图表和卡片选择弹出框
 * @Author: gaocz
 * @Date: 2022-04-24 08:45:49
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-20 10:05:51
 * @FilePath: /edmp-web/src/components/dialogs/SelectChartDialog.vue
-->
<template>
  <yu-dialog :title="title" :visible.sync="dialogVisible" width="1000px" @close="hide" top="5vh">
    <el-row :gutter="16">
      <el-col :span="5">
        <yu-left-tree
          ref="menuTree"
          :show-checkbox="false"
          :height="bHeight - (isMaxScreen ? 232 : 202)"
          :data-url="treeUrl"
          data-id="id"
          data-label="catalogName"
          @node-xclick="nodeClickFn"
          data-pid="upId"
          :expand-level="2"
          :highlight-current="true"
        >
        </yu-left-tree>
      </el-col>
      <el-col :span="19">
        <div class="left-container">
          <yu-xform :model="queryFormData" ref="searchForm" related-table-name="refTable" form-type="search">
            <yu-xform-group :column="2">
              <yu-xform-item label="组件名称" placeholder="组件名称" name="searchText" ctype="input" :rules="globalRules.input"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
          <yu-xtable ref="refTable" :data-url="dataUrl" :base-params="baseParams" type="custom" :dynamic-height="true">
            <template v-slot:custom="scope">
              <div class="custom-container">
                <el-row :gutter="16">
                  <el-col :span="12" v-for="item in scope.tableData" :key="item.rowId">
                    <div class="card-item" @click="selectChartFn(item)">
                      <div class="card-item-top">
                        <div class="card-item__img">
                          <img src="https://t7.baidu.com/it/u=3180010982,1201664165&fm=74&app=80&size=f256,256&n=0&f=JPEG&fmt=auto?sec=1650560400&t=bd9ca514e4a0343cb1ab8d1dd62d594c" alt="" />
                        </div>
                        <div class="card-item__info">
                          <p class="card-item__title">{{ item.modName }}</p>
                          <p class="c2"><i class="el-icon-user"></i>创建人：{{ item.createUser }}</p>
                          <p class="c2"><i class="el-icon-time"></i>创建时间：{{ item.createTime }}</p>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </template>
          </yu-xtable>
        </div>
      </el-col>
    </el-row>
  </yu-dialog>
</template>
<script>
import { backend } from "@/config";
import request from "@/utils/request";
import { getUserInfo } from "@/utils";
export default {
  name: "SelectChartDialog",
  props: {
    type: {
      type: String,
      default: "chart", // chart 图表  card 指标卡
    },
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "图表组件",
    },
    required: {
      // 是否必选
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
      treeUrl: backend.comptMgrService + "/api/busimodule/catalog/info",
      dataUrl: backend.comptMgrService + "/api/busimodule/list",
      queryFormData: {},
      baseParams: {
        condition: JSON.stringify({
          modType: "chart",
        }),
      },
      nowNode: {},
      selections: [],
    };
  },
  watch: {
    visible: function () {
      this.selections = [];
      this.dialogVisible = this.visible;
    },
  },
  created() {
    this.dialogVisible = this.visible;
  },
  methods: {
    nodeClickFn(node) {
      this.$refTable.remoteData({
        condition: {
          catalogId: node.id,
        },
      });
    },
    show() {
      this.$emit("update:visible", true);
    },
    hide() {
      this.$emit("update:visible", false);
    },
    selectChartFn(item) {
      this.$emit("sure", item);
      this.hide();
    },
    cancelFn() {
      this.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
.custom-container {
  padding: 0 16px;
  .card-item {
    cursor: pointer;
    margin-bottom: 16px;
    padding: 12px;
    background: #f5fafe;
    border-radius: 5px;
    border: 1px solid #fff;
    &:hover {
      border: 1px solid #007eff;
    }
    .card-item-top {
      display: flex;
      .card-item__img {
        flex: 12;
      }
      .card-item__info {
        flex: 12;
        p {
          line-height: 1.5;
          i {
            margin-right: 5px;
          }
        }
        .card-item__title {
          margin-bottom: 10px;
          font-size: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
