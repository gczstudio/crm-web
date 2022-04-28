/** 此组件比较特殊，适用于多个yufp-ext-tree渲染的情况 1.先要提前渲染yu-ext-tree， tree-key为authOrg 2.直接使用vuex中 common. */
<template>
  <el-popover v-model="visiable" :width="width" :visible-arrow="false" popper-class="org-popover" trigger="click">
    <yu-ext-tree ref="orgTree" :filterIds="filterIds" v-if="showTree" :orgLevel="orgLevel" v-bind="options" @node-click="nodeClick" :filter-node-method="filterNode"></yu-ext-tree>
    <div class="tc mt16" v-if="options.showCheckbox">
      <el-button @click="cancelFn" size="small">取 消</el-button>
      <el-button type="primary" @click="confirmFn" size="small">确 定</el-button>
    </div>
    <el-input slot="reference" ref="orgTreeInput" v-model="searchVal" :readonly="options.readonly" :placeholder="placeholder" suffix-icon="el-icon-arrow-down" @clear="clearFn" clearable></el-input>
  </el-popover>
</template>

<script>
import { backend } from "@/config";
import { CommonModule } from "@/store/modules/common";
import { getUserInfo } from "@/utils";
export default {
  name: "YufpAuthOrgTree",
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
    filterIds: Array,
  },
  computed: {
    options() {
      return this._.assign(this.defaultOptions, this.treeOptions);
    },
    originTreeData: function () {
      return CommonModule.treeOriginMgr["authOrg"];
    },
  },
  data() {
    let userInfo = getUserInfo();
    return {
      userInfo: userInfo,
      visiable: false,
      width: 200,
      searchVal: "",
      defaultOptions: {
        showCheckbox: false,
        height: 300,
        treeKey: "authOrg",
        dataUrl: backend.appOcaService + "/api/adminsmorg/orgtreequery?orgCode=" + userInfo.org.code + "&orgSts=A",
        dataId: "orgId",
        dataLabel: "orgName",
        dataPid: "upOrgId",
        filterable: true,
        readonly: false,
      },
      showTree: false,
    };
  },
  watch: {
    value: function (val) {
      if (!val) {
        this.searchVal = "";
        return;
      }
      this.setVal();
    },
    searchVal: function (val) {
      this.$refs.orgTree && this.$refs.orgTree.filter(val);
    },
    visiable: function (val) {
      if (val) {
        this.showTree = true;
        this.$nextTick(() => {
          if (this.value) {
            this.setVal();
          }
        });
      }
    },
  },
  created() {
    this.setVal();
  },
  // 挂载后
  mounted() {
    this.updateWidth();
  },
  methods: {
    setVal() {
      let value = Array.isArray(this.value) ? this.value : this.value.split(",");
      this.searchVal = this.getLabelString(value);
      this.$refs.orgTree && this.$refs.orgTree.getRef().setCheckedKeys(value);
    },
    updateWidth() {
      if (this.$refs.orgTreeInput != null && this.$refs.orgTreeInput != undefined) {
        this.$nextTick(() => {
          this.width = this.$refs.orgTreeInput.$el.scrollWidth + 50;
        });
      }
    },
    cancelFn() {
      this.visiable = false;
    },
    clearFn() {
      this.$emit("input", "");
      this.$refs.orgTree.getRef().setCheckedKeys([]);
    },
    confirmFn() {
      let treeRef = this.$refs.orgTree.getRef();
      var checkedKeys = treeRef.getCheckedKeys();
      var checkedNodes = treeRef.getCheckedNodes();
      this.$emit("input", this._.cloneDeep(checkedKeys).join(","));
      this.$emit("select-fn", checkedNodes);
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
      if (!value || !this.options.filterable) {
        return true;
      }
      return data.label.indexOf(value) !== -1;
    },
  },
};
</script>
