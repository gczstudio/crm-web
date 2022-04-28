<template>
  <el-popover v-model="visiable" :width="width" :visible-arrow="false" popper-class="org-popover" :trigger="disabled ? 'manual' : 'click'">
    <yu-ext-tree ref="orgTree" :orgLevel="orgLevel" v-bind="options" @get-tree-datas="getTreeDatasFn" @node-click="nodeClick" :filter-node-method="filterNode"></yu-ext-tree>
    <div class="tc mt16" v-if="options.showCheckbox">
      <el-button @click="cancelFn" size="small">取 消</el-button>
      <el-button type="primary" @click="confirmFn" size="small">确 定</el-button>
    </div>
    <el-input
      slot="reference"
      ref="orgTreeInput"
      v-model="searchVal"
      :readonly="options.readonly"
      :disabled="disabled"
      :placeholder="placeholder"
      suffix-icon="el-icon-arrow-down"
      @clear="clearFn"
      clearable
    ></el-input>
  </el-popover>
</template>

<script>
import { backend } from "@/config";
import { getCheckedRole } from "@/utils";
export default {
  name: "YufpOrgTree",
  props: {
    treeOptions: {
      type: Object,
      default: () => {
        return {};
      },
    },
    placeholder: {
      type: String,
      default: "请选择机构",
    },
    value: {
      // type: String,
      required: true,
    },
    orgLevel: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    options() {
      return this._.assign(this.defaultOptions, this.treeOptions);
    },
  },
  data() {
    let roleInfo = getCheckedRole();
    return {
      roleInfo: roleInfo,
      visiable: false,
      width: 200,
      searchVal: "",
      originTreeData: [],
      defaultOptions: {
        showCheckbox: false,
        height: 300,
        treeKey: "authOrg",
        dataUrl: backend.appOcaService + "/api/util/getorgtree?orgId=" + roleInfo.orgCode,
        dataId: "orgId",
        dataLabel: "orgName",
        dataPid: "upOrgId",
        readonly: false,
      },
    };
  },
  watch: {
    value: function (val) {
      if (!val) {
        this.$refs.orgTree.getRef().setCheckedKeys([]);
      }
      this.updateSearchVal(val);
    },
    searchVal: function (val) {
      this.$refs.orgTree.filter(val);
    },
  },
  // 挂载后
  mounted() {
    this.updateWidth();
  },
  methods: {
    getSelectVal() {
      return this.searchVal;
    },
    updateWidth() {
      if (this.$refs.orgTreeInput != null && this.$refs.orgTreeInput != undefined) {
        this.$nextTick(() => {
          this.width = this.$refs.orgTreeInput.$el.scrollWidth + 50;
        });
      }
    },
    getTreeDatasFn(data) {
      this.originTreeData = data;
      this.updateSearchVal(this.value);
    },
    cancelFn() {
      this.visiable = false;
    },
    clearFn() {
      this.$emit("input", "");
      this.$refs.orgTree.getRef().setCheckedKeys([]);
    },
    updateSearchVal(val) {
      if (!val) {
        this.searchVal = "";
        return;
      }
      val = val.split(",");
      this.searchVal = this.getLabelString(val);
      this.$refs.orgTree.getRef().setCheckedKeys(val);
    },
    confirmFn() {
      let treeRef = this.$refs.orgTree.getRef();
      var checkedKeys = treeRef.getCheckedKeys();
      var checkedNodes = treeRef.getCheckedNodes();
      var value = this._.cloneDeep(checkedKeys).join(",");
      this.$emit("input", value);
      this.$emit("select-fn", checkedNodes);
      this.updateSearchVal(value);
      this.visiable = false;
    },
    getLabelString(ids) {
      return this.originTreeData
        .filter((item) => ids.includes(item[this.options.dataId]))
        .map((item) => item[this.options.dataLabel])
        .join(",");
    },
    nodeClick(nodeData, node, self) {
      if (!this.options.showCheckbox) {
        this.$emit("input", nodeData.id);
        this.$emit("select-fn", nodeData);
        this.$nextTick(() => {
          this.searchVal = nodeData.label;
        });
        this.visiable = false;
      }
    },
    /**
     * 树节点筛选方法
     */
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      return data.label.indexOf(value) !== -1;
    },
  },
};
</script>
<style lang="scss">
.org-popover {
  .search-input {
    margin-bottom: 10px;
  }
  .el-input__validateIcon {
    display: none !important;
  }
}
</style>
