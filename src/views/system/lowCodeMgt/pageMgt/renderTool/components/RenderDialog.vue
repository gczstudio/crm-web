<!--
 * @Descripttion: 渲染弹出框
 * @Author: gaocz
 * @Date: 2022-04-28 15:08:11
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-17 14:44:09
 * @FilePath: /edmp-web/src/views/system/lowCodeMgt/pageMgt/renderTool/components/RenderDialog.vue
-->
<template>
  <div class="render-dialog" v-editor.dialog="{ action: ['delete'] }">
    <div class="el-dialog__header" v-editor.dialog-header>
      <div><span class="el-dialog__title">弹出框</span></div>
      <button type="button" aria-label="Close" class="el-dialog__headerbtn"><i class="el-dialog__close el-icon el-icon-close"></i></button>
    </div>
    <div class="el-dialog__body" v-editor.dialog-body>
      <render-type v-if="data.body && data.body.length" :data="data.body"></render-type>
      <div v-else class="tip">
        <span><i class="iconfont icon-zujianxinxi"></i>从左侧选择组件</span>
      </div>
    </div>
    <div class="el-dialog__footer" v-editor.dialog-footer>
      <div>
        <div class="operate-btns tc">
          <button type="button" class="el-button el-button--primary"><span>确定</span></button><button type="button" class="el-button el-button--default"><span>取消</span></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RenderDialog",
  components: {},
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.render-dialog {
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  .el-dialog__body {
    .tip {
      padding: 100px;
      text-align: center;
      span {
        display: inline-block;
        .iconfont {
          color: #999;
        }
        color: #999;
      }
    }
  }
}
</style>
