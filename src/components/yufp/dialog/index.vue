<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :visible.sync="visible"
    :before-close="handleCloseFn"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :append-to-body="appendToBody"
  >
    <slot></slot>
    <div slot="title">
      <slot name="title"
        ><span class="el-dialog__title">{{ title }}</span></slot
      >
    </div>
    <div slot="footer" v-if="$scopedSlots.footer">
      <slot name="footer"></slot>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "YuDialog",
  props: {
    title: String,
    visible: Boolean,
    handleClose: Function,
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false,
    },
    appendToBody: {
      type: Boolean,
      default: true,
    },
  },
  data: function () {
    return {};
  },
  methods: {
    handleCloseFn: function () {
      this.handleClose && this.handleClose();
      this.$emit("update:visible", false);
    },
  },
};
</script>
<style lang="scss">
.main-theme {
  .el-timeline-item__node--normal {
    left: 1px;
    width: 8px;
    height: 8px;
  }
  .el-dialog__header {
    position: relative;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    // &::before {
    //   content: "";
    //   display: inline-block;
    //   width: calc(100% - 40px);
    //   height: 1px;
    //   background: #e1e1e1;
    //   position: absolute;
    //   bottom: 0;
    //   left: 50%;
    //   transform: translateX(-50%);
    // }
  }
  .el-dialog__body {
    padding: 20px 20px 10px;
  }

  .el-dialog__footer {
    padding: 15px;
    border-top: 1px solid #d8d8d8;
  }
}
</style>
