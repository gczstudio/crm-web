<template>
  <div class="main-layout">
    <div ref="formHeader" :class="['form-header','clearfix',isTab ? 'is-tab' : '']" :style="getHeaderStyle">
      <div class="form-title fl" v-if="title">{{title}}</div>
      <div ref="formToolbar" class="form-toolbar fr">
        <slot name="header"></slot>
      </div>
      <div class="form-arrow" @click="toggleFormArrow" v-if="showFormArrow"><i class="iconfont icon-xialajiantou1"></i></div>
    </div>
    <div class="form-fixed" :style="fixedStyle">
      <div class="form-wrapper">
        <slot name="form"></slot>
      </div>
    </div>
    <div class="form-table" :style="{'padding-top': showFormArrow ? '20px' : '0'}">
      <!-- 查询结果表格 -->
      <slot name="table"></slot>
    </div>
  </div>
  
</template>
<script>
export default {
  name: 'MainLayout',
  data() {
    return {
      showFormArrow: false,
      execFormArrow: false,
      fixedStyle: null
    }
  },
  props: {
    isTab: {
      type: Boolean,
      default: false
    },
    title: String
  },
  computed: {
    getHeaderStyle () {
      return {
        padding: this.$scopedSlots.header && !this.isTab ? (this.isMaxScreen ? '12px' : '10px') : 0,
      }
    }
  },
  mounted() {
    this.fixedStyle = this.getStyle()
    this.setTableHeight();
    if (this.$refs.formToolbar && !this.$refs.formToolbar.innerText) {
      this.$refs.formHeader.style.padding = '0';
    }
  },
  methods: {
    setTableHeight () {
      this.$nextTick(() => {
        // 计算一下table的高度
        var children =  this.$children;
        var tableNode = children.find(item => item.$options._componentTag === 'yu-xtable');
        if(tableNode) {
          tableNode.setTableHeight();
        }
      });
    },
    getStyle () {
      var formVue = this.$children.find(item => item.$options._componentTag === 'yu-xform');
      if(!formVue) return;
      var fileLen = formVue?.fields?.length || 0;
      var column = formVue.column;
      var height = '53px';
      if(this.isMaxScreen && fileLen > column) {
        this.execFormArrow = true;
        height = '120px'
      } else if (!this.isMaxScreen && fileLen > column) {
        this.execFormArrow = true;
        height = '94px'
      } else if (fileLen > 0 ) {
        this.execFormArrow = false;
        height = this.isMaxScreen ? '68px' : '53px'
      } else {
        height = '20px'
      }

      return {
        height: this.showFormArrow ? '0px' : height,
        overflow: this.showFormArrow ? 'hidden' : 'visible',
      }
    },
    toggleFormArrow () {
      if(this.execFormArrow) {
        this.showFormArrow = !this.showFormArrow;
        this.fixedStyle = this.getStyle()
        this.setTableHeight();
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.main-layout {
  .form-header {
    position: relative;
    z-index: 99;
    padding: 12px;
    background: #fff;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
    &.is-tab {
      width: 100%;
      position: absolute;
      top: 1px;
      right: 0;
      box-shadow: none;
      padding: 0;
      .form-toolbar {
        position: absolute;
        top: -36px;
        right: 0;
      }
    }
    .el-button {
      padding: 0 20px;
      border: 0;
      font-size: 14px;
      background: #fff!important;
      &:active, &:hover, &:visited {
        color: #007EFF;
        background: #fff;
      }
    }
    .el-button + .el-button {margin-left: 0; border-left: 1px solid #707070;}
  }
  .form-fixed {
    background: #fff;
    position: relative;
    height: 0;
    transition: height .3s ease;
    .form-wrapper {
      // padding: 16px 16px 0 16px;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9;
    }
    .yu-xform {
      padding: 16px 16px 0 16px;
    }

  }
}
.form-title {
  font-weight: bold;
}
.form-arrow {
  cursor: pointer;
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  width: 54px;
  height: 34px;
  background: url('../../assets/images/common/arrow-bg.png') no-repeat center / 100% 100%;
  text-align: center;
  .iconfont {
    margin-top: 6px;
    display: block;
    font-size: 12px;
    color: #666;
    transform: scale(0.7);
    transition: all .3s;
    // &:hover {
    //   color: $blue;
    // }
  }
}
.form-table {
  background: #fff;
  transition: all .3s ease;
}

.arrow-enter-active, .arrow-leave-active {
  transition: all .5s ease;
}

.arrow-enter, .arrow-leave-to {
  height: 0;
}


@media screen and (max-width: 1680px) {
  .main-layout {
    .form-fixed {
      .yu-xform {
        padding: 12px 12px 0 12px;
      }
    }
  }
}
</style>
