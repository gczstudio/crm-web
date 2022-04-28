<template>
  <div class="yu-tree__left">
    <div class="yufp__title--icon" v-if="title || showCreate">
      {{ title }}
      <img class="yu__title__icon--left" src="../../../assets/images/common/plus.png" v-if="showCreate" @click="createFn" />
    </div>
    <div class="tree-box">
      <div class="yu-tree__left--serach" v-if="search">
        <el-input :placeholder="placeholder" suffix-icon="el-icon-search" v-model="filterText" clearable></el-input>
      </div>
      <yu-ext-tree
        ref="extTreeRef"
        v-bind="$attrs"
        v-on="$listeners"
        :expand-on-click-node="false"
        :filter-node-method="filterNode || filterNodeFn"
        :render-content="renderContent ? renderContent : renderCustomContent"
        @node-click="nodeClickFn"
      ></yu-ext-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: "YuLeftTree",
  inheritAttrs: false,
  props: {
    placeholder: {
      type: String,
      default: "输入关键字进行过滤",
    },
    showCreate: Boolean,
    createFn: Function,
    title: String,
    operates: {
      type: Array,
      default: function () {
        return [];
      },
    },
    filterOperateNodes: {
      type: Array,
      default: function () {
        return [];
      },
    },
    renderContent: Function,
    search: {
      type: Boolean,
      default: true,
    },
    filterNode: Function,
  },
  data: function () {
    return {
      curNode: {},
      selectNode: {},
      filterText: "",
    };
  },
  watch: {
    filterText: function (val) {
      this.$refs.extTreeRef.filter(val);
    },
    operates: function (val) {
      if (this.operates && this.operates.length) {
        this.selectNode = this.curNode.id ? this.curNode : { id: this.$attrs["current-node-key"] };
      } else {
        this.selectNode = {};
      }
    },
  },
  methods: {
    filterNodeFn: function (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    renderCustomContent: function (h, obj) {
      var _this = this;
      var node = obj.data;
      return h(
        "yu-left-tree-node",
        {
          props: {
            node: node,
            selectNode: _this.selectNode,
            operates: _this.operates,
            filterOperateNodes: _this.filterOperateNodes,
          },
        },
        ""
      );
    },
    nodeClickFn: function (nodeData, node, self) {
      this.curNode = nodeData;
      this.selectNode = nodeData;
      this.$emit("node-xclick", nodeData, node, self);
    },
    remoteData: function () {
      this.selectNode = {};
      this.curNode = {};
      this.$refs.extTreeRef.remoteData();
    },
  },
};
</script>

<style lang="scss">
.yu-tree__left {
  color: #333;
  background: #ffffff;
  &.box-shadow {
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  }
  .yufp__title--icon {
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
  }
  .yu__title__icon--left {
    cursor: pointer;
    float: right;
    width: 14px;
    height: 14px;
  }

  .el-tree-node__expand-icon.expanded,
  .el-tree-node__expand-icon {
    font-size: 18px;
    color: #333;
  }
}
.yu-tree__left .el-tree-node__content:hover {
  background: #f5f5f5;
}
.yu-tree__left .el-tree-node__content {
  height: 40px;
  line-height: 40px;
}
.yu-tree__left .el-table__fixed-right {
  background: #fff;
}
/* .el-tree-x, .el-tree {border: 1px solid #E6E6E6;} */
.yu-tree__left .tree-box {
  border: 1px solid #e6e6e6;
}

.yu-tree__left.no-border .tree-box {
  border: 0;
}

.el-tree-node__expand-icon:before {
  border-left-color: #000;
}
.yu-tree-node {
  color: rgba(0, 0, 0, 0.65);
}
.yu-tree__left .el-tree > .el-tree-node > .el-tree-node__content .yu-tree-node {
  color: #000;
  font-weight: bold;
}
.yu-tree__left .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  position: relative;
  // background: #e7f7ff;
}
.yu-tree__left .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content .yu-tree-node > span {
  // color: $blue;
}
.yu-tree__left .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content::after {
  position: absolute;
  top: 0;
  right: 0;
  content: "";
  width: 3px;
  height: 40px;
  // background: $blue;
}
.yu-tree-node {
  font-size: 14px;
  position: relative;
  display: inline-block;
  width: calc(100% - 32px);
}
.yu-tree-node span {
  vertical-align: middle;
}
.yu-tree__operate-box {
  position: absolute;
  top: 4px;
  right: 20px;
}
.yu-tree__operate-box:hover .yu-tree__operates {
  display: block;
}
.yu-tree__operates:hover {
  display: block;
}
.yu-tree__operates {
  background: #fff;
  display: none;
  position: fixed;
  top: 15px;
  left: 0;
  z-index: 999;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 2px;
}
.yu-tree__operates li {
  padding: 0 12px;
}
.yu-tree__operates li:hover {
  background: #f5f5f5;
}
.yu-tree__left--serach {
  padding: 16px;
}
.yu-tree__icon-flex {
  position: absolute;
  top: 14px;
  left: -24px;
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url("../../../assets/images/common/icon-flex.png") no-repeat center;
}
.yu-tree__icon-tag {
  position: absolute;
  top: 12px;
  left: -50px;
}

@media screen and (max-width: 1680px) {
  .yu-tree__left {
    .yufp__title--icon {
      padding: 12px;
      font-size: 15px;
    }
  }
}
</style>
