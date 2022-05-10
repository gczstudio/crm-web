<!--
 * @Descripttion: 固定布局选择弹出框
 * @Author: gaocz
 * @Date: 2022-04-24 08:45:49
 * @LastEditors: gaocz
 * @LastEditTime: 2022-04-28 09:15:55
 * @FilePath: /edmp-web/src/components/dialogs/FixedLayoutDialog.vue
-->
<template>
  <yu-dialog :title="title" :visible.sync="dialogVisible" width="800px" @close="hide" top="5vh">
    <yu-xform :model="queryFormData" ref="searchForm" related-table-name="tableRef" form-type="search">
      <yu-xform-group :column="2">
        <yu-xform-item placeholder="布局名称" name="layoutName" ctype="input" :rules="globalRules.input"></yu-xform-item>
      </yu-xform-group>
    </yu-xform>
    <yu-xtable ref="tableRef" v-if="visible" border :data-url="dataUrl" :height="bHeight - 380" @selections-change="selectionChangeFn" selection-type="radio">
      <yu-xtable-column label="布局名称" prop="layoutName" :show-overflow-tooltip="true"></yu-xtable-column>
      <yu-xtable-column label="状态" prop="layoutSts" :show-overflow-tooltip="true"></yu-xtable-column>
    </yu-xtable>
    <div slot="footer" class="operate-btns tc">
      <el-button type="primary" @click="sureFn">确定</el-button>
      <el-button @click="cancelFn">取消</el-button>
    </div>
  </yu-dialog>
</template>
<script>
import { backend } from "@/config";
import request from "@/utils/request";
export default {
  name: "FixedLayoutDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "选择固定布局",
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
      dataUrl: backend.mockService + "/lowcode/layout/list",
      queryFormData: {},
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
    selectionChangeFn(selections) {
      this.selections = selections;
    },
    show() {
      this.$emit("update:visible", true);
    },
    hide() {
      this.$emit("update:visible", false);
    },
    sureFn() {
      let selected = this.$refs.tableRef.selections;
      if (!selected.length && this.required) {
        this.$message.warning("请选择一条数据");
        return;
      }
      this.$emit("sure", selected);
      this.hide();
    },
    cancelFn() {
      this.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
.select-org {
  .select-title {
    padding: 16px;
    border: 1px solid #e6e6e6;
    border-bottom: 0;
    font-weight: bold;
    .iconfont {
      font-size: 12px;
      margin-right: 8px;
    }
  }
  .el-scrollbar {
    border: 1px solid #e6e6e6;
  }
  ul {
    padding: 10px 0;
    li {
      position: relative;
      padding: 10px 32px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:hover {
        background: $blue-hover;
        .el-icon-close {
          display: block;
        }
      }
      .el-icon-close {
        position: absolute;
        top: 10px;
        right: 16px;
        display: none;
        cursor: pointer;
      }
    }
  }
}
</style>
