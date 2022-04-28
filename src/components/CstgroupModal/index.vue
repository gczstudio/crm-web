<template>
  <div class="YufpCstgroupModal-container">
    <yu-dialog title="选择客户群" :visible.sync="dialogVisible" :width="selectionType === 'checkbox' ? '1300px' : '1000px'" @close="cancelFn" top="5vh">
      <div v-loading="loading" :element-loading-text="loadingTitle">
        <el-row :gutter="16">
          <el-col :span="selectionType === 'checkbox' ? 19 : 24">
            <yu-xform ref="refForm" related-table-name="mytable" form-type="search">
              <yu-xform-group :column="2">
                <yu-xform-item placeholder="客户群名称" label="客户群名称" name="custGroupNm" ctype="input" :rules="globalRules.input"></yu-xform-item>
              </yu-xform-group>
            </yu-xform>
            <!-- 查询结果表格 -->
            <yu-xtable
              v-if="dialogVisible"
              ref="mytable"
              row-number
              border
              :selection-type="selectionType"
              row-key="custGroupId"
              :height="bHeight - 380"
              :data-url="dataUrl"
              @selections-change="selectionChangeFn"
            >
              <yu-xtable-column label="客户群名称" prop="custGroupNm" :show-overflow-tooltip="true"></yu-xtable-column>
              <yu-xtable-column label="客户群类别" prop="custGroupType" data-code="CUST_GROUP_TYPE" :show-overflow-tooltip="true"></yu-xtable-column>
              <yu-xtable-column label="创建人名称" prop="creatorName" :show-overflow-tooltip="true"></yu-xtable-column>
              <yu-xtable-column label="创建日期" prop="creatorTime" :show-overflow-tooltip="true"></yu-xtable-column>
            </yu-xtable>
          </el-col>
          <el-col :span="5" v-if="selectionType === 'checkbox'">
            <div class="select-org">
              <div class="select-title"><i class="el-icon-s-custom"></i>已选择客户群({{ selections.length }})</div>
              <el-scrollbar wrap-class="scrollbar-wrapper" :style="{ height: bHeight - 324 + 'px' }">
                <!-- 滚动条包裹部分 -->
                <ul>
                  <li v-for="item in selections" :key="item.custGroupId">{{ item.custGroupNm }}<i class="el-icon-close" @click="deleteFn(item)"></i></li>
                </ul>
              </el-scrollbar>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="operate-btns tc">
        <el-button type="primary" v-debounce="sureFn">确定</el-button>
        <el-button @click="cancelFn">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>
<script>
import { backend } from "@/config";
import request from "@/utils/request";
export default {
  name: "CstgroupModal",
  props: {
    selectionType: {
      type: String,
      default: "checkbox",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    ids: String,
    required: {
      // 是否必选
      type: Boolean,
      default: false,
    },
    isAuth: {
      // 默认查全部，为true时，查当前用户可导入客户的客群
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingTitle: String,
  },
  data() {
    return {
      dialogVisible: false,
      dataUrl: backend.custService + "/api/ocrmfcifqdbcol/cstgroupdraglist",
      queryFormData: {},
      selections: [],
    };
  },
  watch: {
    visible: function () {
      this.selections = [];
      this.dialogVisible = this.visible;
      if (this.visible) {
        if (this.isAuth) this.dataUrl = backend.custService + "/api/ocrmfcifqdbcol/cstgroupaddlist";
        this.querySelectData();
      }
    },
  },
  created() {
    this.dialogVisible = this.visible;
  },
  methods: {
    querySelectData() {
      if (!this.ids) return;
      request({
        method: "GET",
        url: this.dataUrl,
        params: {
          condition: JSON.stringify({
            ids: this.ids.split(","),
          }),
        },
      }).then((res) => {
        this.selections = res.data;
        this.$nextTick(() => {
          this.$refs.mytable.toggleSelection(res.data);
        });
      });
    },
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
      let selected = this.$refs.mytable.selections;
      if (!selected.length && this.required) {
        this.$message.warning(this.selectionType === "checkbox" ? "请至少选择一条数据" : "请选择一条数据");
        return;
      }
      this.$emit("sure", selected);
    },
    cancelFn() {
      this.hide();
      this.clearSelection();
      this.$refs.refForm.resetFields();
    },
    deleteFn(item) {
      this.$refs.mytable.deleterSelectionFn(item);
    },
    clearSelection() {
      this.$refs.mytable.clearSelection();
      this.$refs.mytable.setCurrentRow();
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
