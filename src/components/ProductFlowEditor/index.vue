<template>
  <div class="ProductFlowEditor-container">
    <div class="tool-bar">
      <div :class="['tool-bar__item', curTool === item.type && 'active']" v-for="item in toolBar" :key="item.type" @click="selectToolFn(item)">
        <!-- <i :class="['iconfont', item.icon]"></i> -->
        <img :src="require(`@/assets/images/lowCode/product/${item.type}.png`)" alt="" />
      </div>
    </div>
    <div class="editor-box" :style="{ height: cHeight - 20 + 'px' }">
      <div ref="editorLeft" :class="['editor-left', cursorType]" @mousedown="mousedown" @mousemove="mousemove" @mouseup="mouseup">
        <render-graph :data="graphConfig" @ele-move="eleMoveFn" @ele-size="eleChangeSizeFn"></render-graph>
      </div>
      <div class="editor-right"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import RenderGraph from "./RenderGraph.vue";

@Component({
  name: "ProductFlowEditor",
  components: {
    RenderGraph,
  },
})
export default class extends Vue {
  @Ref("editorLeft") editorLeft: any;

  toolBar = [
    { type: "straightLine", name: "直线", icon: "icon-dianzan1" },
    { type: "singleArrowLine", name: "箭头", icon: "icon-dianzan1" },
    { type: "doubleArrowLine", name: "双箭头", icon: "icon-dianzan1" },
    { type: "elbowLine", name: "肘型连接符", icon: "icon-dianzan1" },
    { type: "elbowSingleArrowLine", name: "肘型箭头连接符", icon: "icon-dianzan1" },
    { type: "elbowDoubleArrowLine", name: "肘型双箭头连接符", icon: "icon-dianzan1" },
    { type: "square", name: "矩形", icon: "icon-dianzan1" },
    { type: "roundSquare", name: "圆角矩形", icon: "icon-dianzan1" },
    { type: "halfRoundSquare", name: "半圆角矩形", icon: "icon-dianzan1" },
    { type: "circle", name: "圆形", icon: "icon-dianzan1" },
    { type: "rightArrow", name: "右箭头", icon: "icon-dianzan1" },
    { type: "leftArrow", name: "左箭头", icon: "icon-dianzan1" },
    { type: "roundSquareLabel", name: "圆角矩形标注", icon: "icon-dianzan1" },
    { type: "roundSquareDashedLabel", name: "虚线圆角矩形标注", icon: "icon-dianzan1" },
    { type: "text", name: "文本", icon: "icon-dianzan1" },
  ];
  boxPoint: any = {};
  curTool = "";
  curId = "";
  mouseStatus = "";
  eleStatus = "";
  cursorType = "";
  startPointer = { x: 0, y: 0 };
  endPointer = { x: 0, y: 0 };
  graphConfig: any[] = [];
  initPointer: any = {}; // 选中时某个元素的初始数据
  direction = ""; // 改变尺寸的方向

  mounted() {
    this.boxPoint = this.editorLeft.getBoundingClientRect();
    document.addEventListener("keydown", this.onKeyDown);
  }

  // 删除键按下
  onKeyDown(e: any) {
    if (e.key === "Backspace" && this.curId) {
      let index = this.graphConfig.findIndex((item) => item.id === this.curId);
      this.graphConfig.splice(index, 1);
    }
  }

  selectToolFn(item: { type: string }) {
    this.curTool = item.type;
    this.cursorType = "crosshair";
  }

  // 鼠标按下
  mousedown(e: MouseEvent) {
    const { pageX, pageY } = e;
    this.startPointer.x = pageX;
    this.startPointer.y = pageY;
    this.endPointer.x = pageX;
    this.endPointer.y = pageY;
    this.curId = "";
    if (this.curTool) {
      this.mouseStatus = "down";
      this.curId = this.draw();
    }
  }
  // 鼠标移动
  mousemove(e: MouseEvent) {
    const { pageX, pageY } = e;
    this.endPointer.x = pageX;
    this.endPointer.y = pageY;
    if (this.curId && (this.eleStatus || this.mouseStatus)) {
      this.draw("update");
    }
  }
  // 鼠标放开
  mouseup(e: MouseEvent) {
    const { pageX, pageY } = e;
    this.endPointer.x = pageX;
    this.endPointer.y = pageY;
    if (this.mouseStatus) {
      // 选择工具，画图结束后清除id
      this.curId = "";
    }
    this.mouseStatus = "";
    this.eleStatus = "";
    this.curTool = "";
  }

  // 元素移动
  eleMoveFn(item: any, e: MouseEvent) {
    console.log("zxl");
    const { pageX, pageY } = e;
    this.startPointer.x = pageX;
    this.startPointer.y = pageY;
    this.endPointer.x = pageX;
    this.endPointer.y = pageY;
    // 获取移动前选中元素的数据
    this.initPointer = this._.cloneDeep(this.graphConfig.find((ele) => item.id === ele.id));
    this.eleStatus = "down";
    this.mouseStatus = "";
    this.curId = item.id;
    this.curTool = item.type;
  }

  // 元素改变尺寸
  eleChangeSizeFn(item: any, direction: string, e: MouseEvent) {
    const { pageX, pageY } = e;
    this.startPointer.x = pageX;
    this.startPointer.y = pageY;
    this.endPointer.x = pageX;
    this.endPointer.y = pageY;
    // 获取移动前选中元素的数据
    this.initPointer = this._.cloneDeep(this.graphConfig.find((ele) => item.id === ele.id));
    this.direction = direction;
    this.eleStatus = "size";
    this.curId = item.id;
    this.curTool = item.type;
  }

  // 清除选中
  eleClearFn() {
    if (this.curTool) this.curId = "";
  }

  // 绘制直线
  draw(type?: string) {
    let { x: x1, y: y1 } = this.startPointer;
    let { x: x2, y: y2 } = this.endPointer;
    let xDirect = x2 - x1,
      yDirect = y2 - y1;
    // 鼠标在绘画区域的位置
    x1 = x1 - this.boxPoint.x;
    y1 = y1 - this.boxPoint.y;
    x2 = x2 - this.boxPoint.x;
    y2 = y2 - this.boxPoint.y;

    if (type === "update") {
      this.graphConfig.map((item) => {
        if (item.id === this.curId) {
          // 新建
          if (this.mouseStatus === "down") {
            item.x1 = x1;
            item.y1 = y1;
            item.x2 = x2;
            item.y2 = y2;
            // 移动
          } else if (this.eleStatus === "down") {
            item.x1 = this.initPointer.x1 + xDirect;
            item.y1 = this.initPointer.y1 + yDirect;
            item.x2 = this.initPointer.x2 + xDirect;
            item.y2 = this.initPointer.y2 + yDirect;
            // 改变尺寸
          } else if (this.eleStatus === "size") {
            if (this.direction === "start") {
              item.x1 = this.initPointer.x1 + xDirect;
              item.y1 = this.initPointer.y1 + yDirect;
            } else {
              item.x2 = this.initPointer.x2 + xDirect;
              item.y2 = this.initPointer.y2 + yDirect;
            }
          }
          let centerPoint = {
            x: (item.x2 + item.x1) / 2,
            y: (item.y2 + item.y1) / 2,
          };
          // 绘制肘型连接符
          item.points = `${item.x1},${item.y1} ${centerPoint.x},${item.y1} ${centerPoint.x},${item.y2}  ${item.x2},${item.y2}`;
          // 绘制矩形
          const { x, y } = this.getVertexPoint(item);
          item.width = Math.abs(item.x2 - item.x1);
          item.height = Math.abs(item.y2 - item.y1);
          item.x = x;
          item.y = y;

          // 获取路径
          item.path = this.getPath(item);
        }
      });
      return;
    }

    let centerPoint = {
      x: (x2 + x1) / 2,
      y: (y2 + y1) / 2,
    };

    const { x, y } = this.getVertexPoint({ x1, x2, y1, y2 });

    let config = {
      id: this.$util.guid(),
      type: this.curTool,
      x1,
      y1,
      x2,
      y2,
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
      x,
      y,
      points: `${x1},${y1} ${centerPoint.x},${y1} ${centerPoint.x},${y2}  ${x2},${y2}`,
      path: "",
      // 样式属性
      stroke: "#333",
      strokeWidth: 2,
      fill: "none",
    };
    config.path = this.getPath(config);
    this.graphConfig.push(config);
    return config.id;
  }

  // 获取矩形的顶点
  getVertexPoint(item: any) {
    const { x1, y1, x2, y2 } = item;
    let width = x2 - x1,
      height = y2 - y1,
      x = 0,
      y = 0;
    if (width >= 0 && height >= 0) {
      x = x1;
      y = y1;
    } else if (width > 0 && height < 0) {
      x = x1;
      y = y2;
    } else if (width < 0 && height > 0) {
      x = x2;
      y = y1;
    } else if (width < 0 && height < 0) {
      x = x2;
      y = y2;
    }
    return {
      x,
      y,
    };
  }

  // 获取路径
  getPath(item: any): string {
    const { y1, y2, x, y, width, height } = item;

    let arrowWidth = height / 2; // 箭头的宽度;
    let centerY = (y1 + y2) / 2;

    if (this.curTool === "rightArrow") {
      return `M${x},${y} L${x + width - arrowWidth},${y} L${x + width},${centerY} L${x + width - arrowWidth},${y + height} L${x},${y + height} L${x + arrowWidth},${centerY} Z`;
    } else if (this.curTool === "leftArrow") {
      return `M${x + arrowWidth},${y} L${x + width},${y} L${x + width - arrowWidth},${centerY} L${x + width},${y + height} L${x + arrowWidth},${y + height} L${x},${centerY} Z`;
    }

    if (["roundSquareLabel", "roundSquareDashedLabel"].includes(this.curTool)) {
      return this.getLabelPath(item);
    }
    return "";
  }

  // 获取标注框路径
  getLabelPath(item: any): string {
    const { x1, x2, x, y, width, height } = item;
    let radius = 10; // 圆弧半径
    let arcPath = `A ${radius} ${radius} 0 0 1`; // 圆弧路径
    let arrowWidth = 10; // 箭头的宽度
    let centerX = (x1 + x2) / 2; // x轴中心点
    return `M ${x} ${y + radius} ${arcPath} ${x + radius} ${y} L ${x + width - radius} ${y} ${arcPath} ${x + width} ${y + radius} L ${x + width} ${y + height - radius} ${arcPath} ${
      x + width - radius
    } ${y + height} L ${centerX + arrowWidth / 2} ${y + height} L ${centerX} ${y + height + arrowWidth / 2} L ${centerX - arrowWidth / 2} ${y + height} L ${x + radius} ${y + height} ${arcPath} ${x} ${
      y + height - arrowWidth
    } Z`;
  }
}
</script>

<style lang="scss" scoped>
.ProductFlowEditor-container {
  border: 1px solid #d8d8d8;
  .tool-bar {
    padding: 10px 12px;
    background: #fff;
    border-bottom: 1px solid #d8d8d8;
    .tool-bar__item {
      cursor: pointer;
      display: inline-block;
      margin-right: 8px;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      &:hover,
      &.active {
        background: rgba(0, 0, 0, 0.1);
      }
      i {
        display: inline-block;
        color: #333;
      }
    }
  }
  .editor-box {
    display: flex;
    .editor-left {
      flex: 1;
      height: 100%;
      &.crosshair {
        cursor: crosshair; // 十字
      }
    }
    .editor-right {
      flex: 0 0 300px;
      height: 100%;
      background: #fff;
    }
  }
}
</style>
