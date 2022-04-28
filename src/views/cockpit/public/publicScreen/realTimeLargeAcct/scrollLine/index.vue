<template>
  <div class="scroll-line">
    <div class="content" ref="listRef" @mouseenter="mouseenterFn" @mouseleave="mouseleaveFn">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";

@Component({
  name: "ScrollLine",
})
export default class extends Vue {
  @Ref("listRef") listRef: any;
  private timer: any = null;
  private curPos: any = 0;
  private ulWidth: any = 0;

  mounted() {
    this.moveLeft();
  }

  mouseenterFn() {
    this.clearTimer();
  }

  mouseleaveFn() {
    this.moveLeft();
  }

  moveLeft() {
    let boxWidth = this.listRef.clientWidth,
      realWdith = this.listRef.scrollWidth;
    this.ulWidth = this.ulWidth || realWdith;
    var startDis = 0;
    if (this.curPos) {
      startDis = this.curPos;
      this.curPos = 0;
    }
    if (!this.timer) {
      this.timer = setInterval(() => {
        startDis -= 0.5;
        if (startDis === 0) {
          this.ulWidth = realWdith;
        }

        if (Math.abs(startDis) > this.ulWidth) {
          startDis = boxWidth;
          this.ulWidth = realWdith;
        }
        this.curPos = startDis;
        this.$nextTick(() => {
          this.listRef.style = `left: ${startDis}px`;
        });
        // this.clearTimer();  // 清除定时器
        // this.moveLeft(); // 启动定时器
      }, 10);
    }
  }

  clearTimer() {
    clearInterval(this.timer);
    this.timer = null;
  }

  destroyed() {
    this.clearTimer();
  }
}
</script>

<style lang="scss" scoped>
.scroll-line {
  display: inline-block;
  .content {
    position: relative;
  }
}
</style>
