<template>
  <div class="RenderGraph-container">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="width: 100%; height: 100%">
      <template v-for="item in graphData">
        <g id="straightLine" :key="item.id" @mousedown.stop="moveMousedown(item, $event)">
          <!-- 直线 -->
          <line v-if="item.type === 'straightLine'" v-bind="item" style="cursor: move" />
          <!-- 箭头 -->
          <line v-if="item.type === 'singleArrowLine'" v-bind="item" style="cursor: move; marker-end: url(#rightArrow)" />
          <!-- 双箭头 -->
          <line v-if="item.type === 'doubleArrowLine'" v-bind="item" style="cursor: move; marker-start: url(#leftArrow); marker-end: url(#rightArrow)" />
          <!-- 肘型连接符 -->
          <polyline v-if="item.type === 'elbowLine'" v-bind="item" style="cursor: move" @mousedown.stop="moveMousedown(item, $event)" />
          <!-- 肘型箭头连接符 -->
          <polyline v-if="item.type === 'elbowSingleArrowLine'" v-bind="item" style="cursor: move; marker-end: url(#rightArrow)" @mousedown.stop="moveMousedown(item, $event)" />
          <!-- 肘型双箭头连接符 -->
          <polyline
            v-if="item.type === 'elbowDoubleArrowLine'"
            v-bind="item"
            style="cursor: move; marker-start: url(#leftArrow); marker-end: url(#rightArrow)"
            @mousedown.stop="moveMousedown(item, $event)"
          />
          <!-- 矩形 -->
          <rect v-if="item.type === 'square'" v-bind="item" style="cursor: move" />
          <!-- 圆角矩形 -->
          <rect v-if="item.type === 'roundSquare'" v-bind="item" rx="10" ry="10" style="cursor: move" />
          <!-- 半圆角矩形 -->
          <rect v-if="item.type === 'halfRoundSquare'" v-bind="item" :rx="item.height / 2" :ry="item.height / 2" style="cursor: move" />
          <!-- 圆形 -->
          <circle v-if="item.type === 'circle'" v-bind="item" :cx="(item.x1 + item.x2) / 2" :cy="(item.y1 + item.y2) / 2" :r="item.height / 2" style="cursor: move" />
          <!-- 路径：箭头，标注 -->
          <path v-if="['rightArrow', 'leftArrow', 'roundSquareLabel'].includes(item.type)" v-bind="item" :d="item.path" style="cursor: move"></path>

          <!-- 路径：虚线标注 -->
          <path v-if="item.type === 'roundSquareDashedLabel'" v-bind="item" :d="item.path" stroke-dasharray="5" style="cursor: move"></path>

          <!-- 文本输入框 -->
          <foreignObject v-if="item.type === 'text'" :x="item.x" :y="item.y" :width="item.width" :height="item.height">
            <textarea v-model="item.value" type="text" style="width: 100%; height: 100%; resize: none; background: transparent; border: none; cursor: move" />
          </foreignObject>

          <!-- 改变尺寸 -->
          <circle v-if="item.active" :cx="item.x1" :cy="item.y1" r="5" stroke="black" stroke-width="1" fill="#fff" style="cursor: nw-resize" @mousedown.stop="sizeMousedown(item, 'start', $event)" />
          <circle v-if="item.active" :cx="item.x2" :cy="item.y2" r="5" stroke="black" stroke-width="1" fill="#fff" style="cursor: ne-resize" @mousedown.stop="sizeMousedown(item, 'end', $event)" />
        </g>
      </template>
      <defs>
        <!-- 定义右箭头 -->
        <marker id="rightArrow" markerWidth="30" markerHeight="13" refX="3" refY="6" orient="auto">
          <path d="M2,2 L2,10 L10,6 L2,2" style="stroke: none; fill: #333"></path>
        </marker>
        <!-- 定义左箭头 -->
        <marker id="leftArrow" markerWidth="20" markerHeight="20" refX="8" refY="12" orient="auto">
          <path d="M8,8 L8,16 L0,12 Z" style="stroke: none; fill: #333"></path>
        </marker>
      </defs>
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";

@Component({
  name: "RenderGraph",
})
export default class extends Vue {
  @Prop() data!: any;

  graphData: any[] = [];
  activeType = "";

  mounted() {
    document.body.onmousedown = () => {
      this.clearActive();
    };
  }

  @Watch("data", { immediate: true, deep: true })
  onDataChange() {
    console.log(this.data);
    this.graphData = [...this.data];
  }

  moveMousedown(item: any, e: MouseEvent) {
    item && this.$emit("ele-move", item, e);
    this.graphData.map((ele: any) => {
      this.$set(ele, "active", item ? item.id === ele.id : false);
    });
  }

  sizeMousedown(item: any, direction: string, e: MouseEvent) {
    item && this.$emit("ele-size", item, direction, e);
  }

  clearActive() {
    this.graphData.map((ele: any) => {
      this.$set(ele, "active", false);
    });
  }
}
</script>

<style lang="scss" scoped>
.RenderGraph-container {
  height: 100%;
  position: relative;
}
</style>
