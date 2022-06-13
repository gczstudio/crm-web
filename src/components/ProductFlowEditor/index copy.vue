<template>
  <div class="ProductFlowEditor-container">
    <div class="tool-bar">111</div>
    <div class="editor-box">
      <div class="editor-left"></div>
      <div class="editor-right"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";

@Component({
  name: "ProductFlowEditor",
})
export default class extends Vue {
  toolBar = [
    {
      type: "line",
      lebel: "线条",
      children: [
        { type: "straightLine", name: "直线", icon: "" },
        { type: "singleArrowLine", name: "箭头", icon: "" },
        { type: "doubleArrowLine", name: "双箭头", icon: "" },
        { type: "elbowLine", name: "肘型连接符", icon: "" },
        { type: "elbowSingleArrowLine", name: "肘型箭头连接符", icon: "" },
        { type: "elbowDoubleArrowLine", name: "肘型双箭头连接符", icon: "" },
      ],
    },
    {
      type: "shape",
      lebel: "形状",
      children: [
        { type: "square", name: "矩形", icon: "" },
        { type: "roundSquare", name: "圆角矩形", icon: "" },
        { type: "halfRoundSquare", name: "半圆角矩形", icon: "" },
        { type: "circle", name: "圆形", icon: "" },
      ],
    },
    {
      type: "arrow",
      lebel: "箭头",
      children: [
        { type: "rightArrow", name: "右箭头", icon: "" },
        { type: "leftArrow", name: "左箭头", icon: "" },
        { type: "upArrow", name: "上箭头", icon: "" },
        { type: "downArrow", name: "下箭头", icon: "" },
      ],
    },
    {
      type: "label",
      lebel: "标注",
      children: [{ type: "roundSquareLabel", name: "圆角矩形标注", icon: "" }],
    },
  ];
}
</script>

<style lang="scss" scoped>
.ProductFlowEditor {
}
</style>
