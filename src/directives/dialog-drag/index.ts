import { DirectiveOptions } from "vue";
export const dialogDrag: DirectiveOptions = {
  inserted: function (el: any, binding) {
    el.onmouseover = function (e: any) {
      if (e.target.className === "el-dialog__header") {
        const moveDom = el.querySelector(".el-dialog__header");
        const curDom = el.querySelector(".el-dialog");
        moveDom.onmouseenter = function () {
          moveDom.style.cursor = "move";
        };

        moveDom.onmouseleave = function () {
          moveDom.style.cursor = "default";
        };

        moveDom.onmousedown = function (e: any) {
          const disx = e.pageX - curDom.offsetLeft;
          const disy = e.pageY - curDom.offsetTop;
          document.onmousemove = function (e) {
            const top = e.pageY - disy;
            const left = e.pageX - disx;
            curDom.style.marginTop = 0;
            curDom.style.top = top + "px";
            curDom.style.left = left + "px";
          };
          document.onmouseup = function (e) {
            document.onmousemove = document.onmouseup = null;
          };
        };
      }
    };
  },
};
