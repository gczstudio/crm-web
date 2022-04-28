import { DirectiveOptions } from "vue";
export const animate: DirectiveOptions = {
  inserted: function (el, binding: any) {
    // 聚焦元素
    binding.addClass = () => {
      const { top, height } = el.getBoundingClientRect();
      const h = document.documentElement.clientHeight || document.body.clientHeight;

      // // 当不在可视范围内时，清除掉animate类
      // if((top + height) < 0 || top > h) {
      //   el.className = el.className.split(" ").filter(ele=>!ele.includes("animate")).join(" ")
      // } else {
      if (!el.className.includes("animate")) {
        el.className = el.className + " " + binding.value;
      }
      // }
    };

    // // 监听多个定时器，可能会有性能问题，后面采用防抖函数优化一下
    // window.addEventListener("scroll", binding.addClass)

    binding.addClass();
  },
  // unbind: function (el, binding) {
  //   if (binding.addClass) {
  //     window.removeEventListener("scroll", binding.addClass)
  //   }
  // }
};
