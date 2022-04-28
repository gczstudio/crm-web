<template>
  <transition name="dialog-fade" @after-enter="afterEnter" @after-leave="afterLeave">
    <div v-show="visible" class="cm-dialog__wrapper" @click.self="handleWrapperClick">
      <div
        role="dialog"
        :key="key"
        aria-modal="true"
        :aria-label="title || 'dialog'"
        :class="['el-dialog', { 'is-fullscreen': fullscreen, 'el-dialog--center': center }, customClass]"
        ref="dialog"
        :style="style"
      >
        <el-scrollbar wrap-class="scrollbar-wrapper" style="height: 100%">
          <!-- 滚动条包裹部分 -->
          <div class="el-dialog__body" v-if="rendered"><slot v-bind="instance"></slot></div>
        </el-scrollbar>
        <div class="el-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Popup from "element-ui/src/utils/popup";
import Migrating from "element-ui/src/mixins/migrating";
import emitter from "element-ui/src/mixins/emitter";

export default {
  name: "ContentModal",

  mixins: [Popup, emitter, Migrating],

  props: {
    title: {
      type: String,
      default: "",
    },

    modal: {
      type: Boolean,
      default: false,
    },

    modalAppendToBody: {
      type: Boolean,
      default: true,
    },

    appendToBody: {
      type: Boolean,
      default: false,
    },

    lockScroll: {
      type: Boolean,
      default: true,
    },

    closeOnClickModal: {
      type: Boolean,
      default: false,
    },

    closeOnPressEscape: {
      type: Boolean,
      default: false,
    },

    showClose: {
      type: Boolean,
      default: false,
    },

    width: String,

    fullscreen: {
      type: Boolean,
      default: false,
    },

    customClass: {
      type: String,
      default: "",
    },

    top: {
      type: String,
      default: "0",
    },
    beforeClose: Function,
    center: {
      type: Boolean,
      default: false,
    },

    destroyOnClose: Boolean,
  },

  data() {
    return {
      closed: false,
      key: 0,
      instance: this,
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.rendered = true;
        this.closed = false;
        this.$emit("open");
        this.$el.addEventListener("scroll", this.updatePopper);
        this.$nextTick(() => {
          this.$refs.dialog.scrollTop = 0;
        });
        if (this.appendToBody) {
          document.body.appendChild(this.$el);
        }
      } else {
        this.rendered = false;
        this.$el.removeEventListener("scroll", this.updatePopper);
        if (!this.closed) this.$emit("close");
        if (this.destroyOnClose) {
          this.$nextTick(() => {
            this.key++;
          });
        }
      }
    },
    // $route() {
    //   // 监听到路由变化时，关闭
    //   this.hide();
    // }
  },

  computed: {
    style() {
      let style = {};
      if (!this.fullscreen) {
        style.marginTop = this.top;
        if (this.width) {
          style.width = this.width;
        }
      }
      return style;
    },
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          size: "size is removed.",
        },
      };
    },
    handleWrapperClick() {
      if (!this.closeOnClickModal) return;
      this.handleClose();
    },
    handleClose() {
      if (typeof this.beforeClose === "function") {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit("update:visible", false);
        this.$emit("close");
        this.closed = true;
      }
    },
    updatePopper() {
      this.broadcast("ElSelectDropdown", "updatePopper");
      this.broadcast("ElDropdownMenu", "updatePopper");
    },
    afterEnter() {
      this.$emit("opened");
    },
    afterLeave() {
      this.$emit("closed");
    },
  },

  mounted() {
    if (this.visible) {
      this.rendered = true;
      this.open();
      if (this.appendToBody) {
        document.body.appendChild(this.$el);
      }
    }
  },

  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  },
};
</script>

<style lang="scss" scoped>
.cm-dialog__wrapper {
  position: fixed;
  top: 94px;
  left: 60px;
  overflow: hidden;
  margin: 0;
  width: calc(100% - 60px);
  height: calc(100vh - 95px);
  padding: 16px;
  background: #efefef;
  z-index: 1000;
  //
  .el-dialog {
    width: 100%;
    height: 100%;
    margin: 0;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-scrollbar {
    background: #efefef;
  }
  ::v-deep.el-scrollbar__bar.is-horizontal {
    display: none;
  }
}
@media screen and (max-width: 1680px) {
  .cm-dialog__wrapper {
    top: 78px;
    left: 56px;
    width: calc(100% - 56px);
    height: calc(100vh - 76px);
    padding: 12px;
  }
}
</style>
