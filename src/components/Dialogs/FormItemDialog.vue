<template>
  <div>
    <yu-dialog class="form-item-dialog__component" :title="title" :visible.sync="dialogVisible" width="800px" @close="hide" top="5vh">
      <yu-xtable ref="tableRef" border row-key="fieldEn" :data="urlFields" :pageable="false" :init-selection="false" selection-type="checkbox">
        <yu-xtable-column label="名称" prop="fieldZh" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <yu-xform-item-part v-model="scope.row.fieldZh" ctype="input" :rules="globalRules.input"></yu-xform-item-part>
          </template>
        </yu-xtable-column>
        <yu-xtable-column label="字段名" prop="fieldEn" :show-overflow-tooltip="true"></yu-xtable-column>
      </yu-xtable>
      <div slot="footer" class="operate-btns tc">
        <el-button type="primary" @click="sureFn">确定</el-button>
        <el-button @click="cancelFn">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>
<script>
import { getCompConfigById } from "@/utils/lowCode";
import { queryUrlField } from "@/api/lowCode";
export default {
  name: "FormItemDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "添加条件",
    },
    dataId: String,
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogVisible: false,
      urlFields: [],
    };
  },
  watch: {
    visible: function () {
      this.dialogVisible = this.visible;
      this.visible && this.getUrlField();
    },
  },
  created() {
    this.dialogVisible = this.visible;
  },
  methods: {
    show() {
      this.$emit("update:visible", true);
    },
    hide() {
      this.$emit("update:visible", false);
    },
    sureFn() {
      let selections = this.$refs.tableRef.selections;
      this.$emit("sure", this._.cloneDeep(selections));
      this.hide();
    },
    cancelFn() {
      this.hide();
    },
    // 获取接口字段
    getUrlField() {
      let config = getCompConfigById(this.dataId);
      queryUrlField({
        condition: JSON.stringify({
          url: config.api,
        }),
      }).then((res) => {
        this.urlFields = res.data.map((item) => {
          return {
            ...item,
            fieldEn: this.$util.dashToCamel(item.fieldEn),
          };
        });
        let fieldEns = this.data.map((item) => item.name);
        let data = this.urlFields.filter((item) => fieldEns.includes(item.fieldEn));
        this.$nextTick(() => {
          this.$refs.tableRef && this.$refs.tableRef.toggleSelection(data);
        });
      });
    },
  },
};
</script>
<style lang="scss">
.form-item-dialog__component {
  .operate-btns {
    text-align: center;
    .plus {
      cursor: pointer;
      margin-right: 10px;
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      border-radius: 50%;
      text-align: center;
      background: #007eff;
      color: #fff;
      font-weight: bold;
    }
    .delete {
      cursor: pointer;
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-radius: 50%;
      background: #f56c6c;
      color: #fff;
      font-weight: bold;
    }
  }
}
</style>
