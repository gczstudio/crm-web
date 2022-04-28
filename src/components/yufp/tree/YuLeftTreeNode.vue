<template>
  <div class="yu-tree-node" ref="treeNode">
    <span>{{ node.label }}</span>
    <div class="yu-tree__operate-box" v-if="selectNode.id === node.id && operates.length && !filterOperateNodes.includes(node.id)">
      <img class="yu-tree__more" src="../../../assets/images/common/operate.png" @mouseenter="mouseenterFn" />
      <div class="yu-tree__operates" :style="getStyle">
        <ul>
          <li v-for="item in operates" :key="item.label" @click.stop="operateFn(item)">
            {{ item.label }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "YuLeftTreeNode",
  inheritAttrs: false,
  props: {
    node: Object,
    selectNode: Object,
    operates: Array,
    filterOperateNodes: Array,
  },
  data: function () {
    return {
      top: 0,
      left: 0,
    };
  },
  computed: {
    getStyle: function () {
      return { top: this.top + "px", left: this.left + "px" };
    },
  },
  methods: {
    mouseenterFn: function (e) {
      var pos = this.$refs.treeNode.getBoundingClientRect();
      this.top = pos.height + pos.top - 20;
      this.left = pos.width + pos.left - 20;
    },
    operateFn: function (item) {
      item.func();
    },
  },
};
</script>
