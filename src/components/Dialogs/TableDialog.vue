<template>
  <yu-dialog class="table-dialog-container" :title="title" :visible.sync="dialogVisible" width="1000px" @close="hide" top="5vh">
    <yu-xform :model="formData" label-width="80px" style="width: 400px">
      <yu-xform-group :column="1">
        <yu-xform-item label="接口地址" placeholder="获取数据库字段信息" name="api" ctype="input" v-debounce="[apiChangeFn, 'input']" @clear="apiChangeFn"></yu-xform-item>
      </yu-xform-group>
    </yu-xform>
    <yu-xtable ref="tableRef" :data="tableData" row-key="id" selection-type="checkbox" :init-selection="false" border :pageable="false">
      <yu-xtable-column label="标题" prop="label" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <yu-xform-item-part v-model="scope.row.label" ctype="input" :key="scope.row.id" clearable></yu-xform-item-part>
        </template>
      </yu-xtable-column>
      <yu-xtable-column label="字段名" prop="prop" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <yu-xform-item-part v-model="scope.row.prop" ctype="input" :key="scope.row.id" clearable></yu-xform-item-part>
        </template>
      </yu-xtable-column>
      <yu-xtable-column label="操作" prop="action" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="operate-btns">
            <span v-if="scope.$index === tableData.length - 1" class="plus" @click="addFn">+</span>
            <span v-if="tableData.length > 1 && scope.row.type === 'custom'" class="delete" @click="deleteFn(scope.$index)">-</span>
          </div>
        </template>
      </yu-xtable-column>
    </yu-xtable>
    <div slot="footer" class="operate-btns tc">
      <el-button type="primary" @click="sureFn">确定</el-button>
      <el-button @click="cancelFn">取消</el-button>
    </div>
  </yu-dialog>
</template>
<script>
import { queryUrlField } from "@/api/lowCode";
import { getCompConfigById } from "@/utils/lowCode";
export default {
  name: "TableDialog",
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
      tableData: [
        {
          id: this.$util.guid(),
        },
      ],
      formData: {},
    };
  },
  watch: {
    visible: function () {
      this.dialogVisible = this.visible;
      this.dataId && this.visible && this.getUrlField();
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
      this.$emit("sure", {
        api: this.formData.api,
        columns: this._.cloneDeep(selections),
      });
      this.hide();
    },
    cancelFn() {
      this.hide();
    },
    addFn() {
      this.tableData.push({
        type: "custom",
        id: this.$util.guid(),
      });
    },
    deleteFn(index) {
      // 删除的如果是已勾选的元素，要先去掉勾选
      let selections = this.$refs.tableRef.selections;
      if (selections.find((item) => item.prop === this.tableData[index].prop)) {
        this.$refs.tableRef && this.$refs.tableRef.deleterSelectionFn(this.tableData[index]);
      }
      this.tableData.splice(index, 1);
    },
    // 接口地址变化
    async apiChangeFn(type) {
      await this.$nextTick();
      if (!this.formData.api) {
        this.tableData = [];
        return;
      }
      queryUrlField({
        condition: JSON.stringify({
          url: this.formData.api,
        }),
      }).then((res) => {
        this.tableData = res.data.map((item) => {
          return {
            type: "api",
            id: this.$util.guid(),
            name: this.$util.dashToCamel(item.fieldEn),
            prop: this.$util.dashToCamel(item.fieldEn),
            ctype: "input",
            label: item.fieldZh,
            column: "1",
          };
        });
        if (type === "eidt") {
          let tableNames = this.tableData.map((item) => item.name);
          let selectNames = this.data.map((item) => {
            if (!tableNames.includes(item.name)) {
              this.tableData.push(item);
            }
            return item.name;
          });

          let data = this.tableData.filter((item) => selectNames.includes(item.name));
          this.$nextTick(() => {
            this.$refs.tableRef && this.$refs.tableRef.toggleSelection(data);
          });
        }
      });
    },
    // 获取接口字段
    getUrlField() {
      let config = getCompConfigById(this.dataId);
      this.$set(this.formData, "api", config.api);
      this.apiChangeFn("eidt");
    },
  },
};
</script>
<style lang="scss" scoped>
.table-dialog-container {
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
