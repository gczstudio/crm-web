<template>
  <el-popover v-model="visiable" :width="width" :visible-arrow="false" popper-class="tag-popover" :trigger="disabled ? 'manual' : 'click'">
    <!-- 树形控件 -->
    <el-tree
      ref="treeRef"
      :data="treeData"
      :props="defalutProps"
      node-key="tagNo"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      @node-click="nodeClick"
      :show-checkbox="options.showCheckbox"
    >
    </el-tree>
    <div class="tc mt16" v-if="options.showCheckbox">
      <el-button @click="cancelFn" size="small">取 消</el-button>
      <el-button type="primary" @click="confirmFn" size="small">确 定</el-button>
    </div>
    <el-input
      slot="reference"
      ref="treeInput"
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
import request from "@/utils/request";
import { backend } from "@/config";

export default {
  name: "YufpTreeSelect",
  props: {
    treeOptions: {
      type: Object,
      default: () => {
        return {};
      },
    },
    placeholder: {
      type: String,
      default: "请选择标签",
    },
    value: {
      // type: String,
      required: true,
    },
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
    return {
      visiable: false,
      width: 200,
      defalutProps: {
        children: "childList",
        label: "tagNm",
      },
      defaultOptions: {
        showCheckbox: false,
        height: 300,
        dataUrl: backend.custService + "/api/ocrmftagtags/querytagtree",
        dataId: "tagNo",
        dataLabel: "tagNm",
        readonly: false,
      },
      searchVal: "",
      treeData: [],
      originTreeData: [],
    };
  },
  watch: {
    value: function (val) {
      if (!val) {
        this.$refs.treeRef.setCheckedKeys([]);
      }
      this.updateSearchVal(val);
    },
    searchVal: function (val) {
      this.$refs.treeRef.filter(val);
    },
    disabled: {
      handler: function () {},
      immediate: true,
    },
  },
  created() {
    this.getTreeData();
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
      if (this.$refs.treeInput != null && this.$refs.treeInput != undefined) {
        this.$nextTick(() => {
          this.width = this.$refs.treeInput.$el.scrollWidth + 50;
        });
      }
    },
    getTreeData() {
      request({
        url: this.options.dataUrl,
        method: "GET",
      }).then((res) => {
        this.treeData = res.data;
        this.originTreeData = this.treeToArray(res.data);
        this.updateSearchVal(this.value);
      });
    },
    cancelFn() {
      this.visiable = false;
    },
    clearFn() {
      this.$emit("input", "");
      this.$refs.treeRef.setCheckedKeys([]);
    },
    updateSearchVal(val) {
      if (!val) {
        this.searchVal = "";
        return;
      }
      val = val.split(",");
      this.searchVal = this.getLabelString(val);
      this.$refs.treeRef.setCheckedKeys(val);
    },
    confirmFn() {
      let treeRef = this.$refs.treeRef;
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
        this.$emit("input", nodeData[this.options.dataId]);
        this.$emit("select-fn", nodeData);
        this.$nextTick(() => {
          this.searchVal = nodeData[this.options.dataLabel];
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
      return data[this.options.dataLabel].indexOf(value) !== -1;
    },
    treeToArray(data) {
      let fn = (data) => {
        data.forEach((item) => {
          arr.push(item);
          let children = item[this.options.children];
          if (children && children.length) {
            fn(children);
          }
        });
      };
      var arr = [];
      fn(data);
      return arr;
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
