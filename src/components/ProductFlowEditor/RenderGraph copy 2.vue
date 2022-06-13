<template>
  <div class="RenderGraph-container">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="width: 100%; height: 100%">
      <template v-for="item in graphData">
        <!-- 直线 -->
        <g v-if="item.type === 'straightLine'" id="straightLine" :key="item.id" @mousedown.stop="moveMousedown(item, $event)">
          <line v-bind="item" style="stroke: rgb(255, 0, 0); stroke-width: 1; cursor: move" />
          <circle v-if="item.active" :cx="item.x1" :cy="item.y1" r="5" stroke="black" stroke-width="1" fill="#fff" style="cursor: nw-resize" @mousedown.stop="sizeMousedown(item, 'start', $event)" />
          <circle v-if="item.active" :cx="item.x2" :cy="item.y2" r="5" stroke="black" stroke-width="1" fill="#fff" style="cursor: ne-resize" @mousedown.stop="sizeMousedown(item, 'end', $event)" />
        </g>
        <!-- 箭头 -->
        <g v-if="item.type === 'singleArrowLine'" id="singleArrowLine" :key="item.id" @mousedown.stop="moveMousedown(item, $event)">
          <line v-bind="item" style="stroke: rgb(255, 0, 0); stroke-width: 1; cursor: move; marker-end: url(#rightArrow)" />
          <circle v-if="item.active" :cx="item.x1" :cy="item.y1" r="5" stroke="black" stroke-width="1" fill="#fff" style="cursor: nw-resize" @mousedown.stop="sizeMousedown(item, 'start', $event)" />
          <circle v-if="item.active" :cx="item.x2" :cy="item.y2" r="5" stroke="black" stroke-width="1" fill="#fff" style="cursor: ne-resize" @mousedown.stop="sizeMousedown(item, 'end', $event)" />
        </g>
        <!-- 双箭头 -->
        <g v-if="item.type === 'doubleArrowLine'" id="doubleArrowLine" :key="item.id" @mousedown.stop="moveMousedown(item, $event)">
          <line v-bind="item" style="stroke: rgb(255, 0, 0); stroke-width: 1; cursor: move; marker-start: url(#leftArrow); marker-end: url(#rightArrow)" />
          <circle v-if="item.active" :cx="item.x1" :cy="item.y1" r="5" stroke="black" stroke-width="1" fill="#fff" style="cursor: nw-resize" @mousedown.stop="sizeMousedown(item, 'start', $event)" />
          <circle v-if="item.active" :cx="item.x2" :cy="item.y2" r="5" stroke="black" stroke-width="1" fill="#fff" style="cursor: ne-resize" @mousedown.stop="sizeMousedown(item, 'end', $event)" />
        </g>
        <!-- 肘型连接符 -->
        <g v-if="item.type === 'elbowLine'" id="elbowLine" :key="item.id">
          <polyline :points="item.points" style="fill: none; stroke: black; stroke-width: 1; cursor: move" @mousedown.stop="moveMousedown(item, $event)" />
          <circle v-if="item.active" :cx="item.x1" :cy="item.y1" r="5" stroke="black" stroke-width="1" fill="#fff" style="cursor: nw-resize" @mousedown.stop="sizeMousedown(item, 'start', $event)" />
          <circle v-if="item.active" :cx="item.x2" :cy="item.y2" r="5" stroke="black" stroke-width="1" fill="#fff" style="cursor: ne-resize" @mousedown.stop="sizeMousedown(item, 'end', $event)" />
        </g>
        <!-- 肘型箭头连接符 -->
        <g v-if="item.type === 'elbowSingleArrowLine'" id="elbowSingleArrowLine" :key="item.id" @mousedown.stop="moveMousedown(item, $event)">
          <polyline :points="item.points" style="fill: none; stroke: black; stroke-width: 1; cursor: move; marker-end: url(#rightArrow)" />
          <circle v-if="item.active" :cx="item.x1" :cy="item.y1" r="5" stroke="black" stroke-width="1" fill="#fff" style="cursor: nw-resize" @mousedown.stop="sizeMousedown(item, 'start', $event)" />
          <circle v-if="item.active" :cx="item.x2" :cy="item.y2" r="5" stroke="black" stroke-width="1" fill="#fff" style="cursor: ne-resize" @mousedown.stop="sizeMousedown(item, 'end', $event)" />
        </g>
        <!-- 肘型双箭头连接符 -->
        <g v-if="item.type === 'elbowDoubleArrowLine'" id="elbowDoubleArrowLine" :key="item.id" @mousedown.stop="moveMousedown(item, $event)">
          <polyline :points="item.points" style="fill: none; stroke: black; stroke-width: 1; cursor: move; marker-start: url(#leftArrow); marker-end: url(#rightArrow)" />
          <circle v-if="item.active" :cx="item.x1" :cy="item.y1" r="5" stroke="black" stroke-width="1" fill="#fff" style="cursor: nw-resize" @mousedown.stop="sizeMousedown(item, 'start', $event)" />
          <circle v-if="item.active" :cx="item.x2" :cy="item.y2" r="5" stroke="black" stroke-width="1" fill="#fff" style="cursor: ne-resize" @mousedown.stop="sizeMousedown(item, 'end', $event)" />
        </g>
        <g v-if="item.type === 'square'" id="square" :key="item.id" @mousedown.stop="moveMousedown(item, $event)">
          <rect
            :width="item.width"
            :height="item.height"
            :x="item.x"
            :y="item.y"
            :rx="item.height / 2"
            :ry="item.height / 2"
            style="fill: rgb(0, 0, 255); stroke-width: 1; stroke: rgb(0, 0, 0); cursor: move"
          />
          <circle v-if="item.active" :cx="item.x1" :cy="item.y1" r="5" stroke="black" stroke-width="1" fill="#fff" style="cursor: nw-resize" @mousedown.stop="sizeMousedown(item, 'start', $event)" />
          <circle v-if="item.active" :cx="item.x2" :cy="item.y2" r="5" stroke="black" stroke-width="1" fill="#fff" style="cursor: ne-resize" @mousedown.stop="sizeMousedown(item, 'end', $event)" />
        </g>
      </template>

      <defs>
        <!-- 定义右箭头 -->
        <marker id="rightArrow" markerWidth="30" markerHeight="13" refX="3" refY="6" orient="auto">
          <path d="M2,2 L2,10 L10,6 L2,2" style="stroke: none; fill: #000000"></path>
        </marker>
        <!-- 定义左箭头 -->
        <marker id="leftArrow" markerWidth="20" markerHeight="20" refX="8" refY="12" orient="auto">
          <path d="M8,8 L8,16 L0,12 Z" style="stroke: none; fill: #000000"></path>
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
}
</style>
