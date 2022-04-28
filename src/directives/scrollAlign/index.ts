import { DirectiveOptions } from "vue";
import { HomeModule } from "@/store/modules/home";
const width = window.screen.width;
const paddingWidth = width >= 1920 ? 16 : 12;
export const scrollalign: DirectiveOptions = {
  inserted(el: any, binding: any) {
    const dashScrollbar: Element | null = document.getElementById("dashScrollbar");
    const scrollDom: any = dashScrollbar?.firstChild;
    // var initPos = el.getBoundingClientRect();
    binding.scrollFn = function () {
      const pos = el.getBoundingClientRect();
      // 滚动事件执行一次后，切换菜单多开tab会执行, 判断高度为0时，不继续执行
      if (!pos.height) {
        return;
      }
      const boxHeight = scrollDom.clientHeight - paddingWidth * 2; // 中心内容区域的高度
      const scrollTop = scrollDom.scrollTop;
      // 第一次页面没有完全加载完成时，不执行
      if (scrollTop === 0 && el.style.position !== "absolute") {
        return;
      }
      el.parentNode.style.height = pos.height + "px";
      el.style.height = "fit-content";
      if (pos.height <= boxHeight) {
        el.style.position = "absolute";
        el.style.top = paddingWidth + "px";
        el.style.width = pos.width + "px";
      } else if (pos.height + 10 < boxHeight + scrollTop) {
        if (el.style.position !== "absolute") {
          el.style.position = "absolute";
          el.style.bottom = paddingWidth + "px";
          el.style.top = "initial";
          el.style.width = pos.width + "px";
        }
      } else {
        el.style.position = "static";
      }
    };

    binding.resizeFn = function () {
      el.style.width = el.parentNode.getBoundingClientRect().width - paddingWidth + "px";
    };

    // 滚动的时候将层级设为 -1，滚动结束后200ms设置层级为1
    let timer: any = null;
    binding.onmousewheel = () => {
      // 针对于左侧有树组件，需要滚动的时候，v-scrollalign="true", 首页设置了dragType，会出现问题
      // if (binding.value) {
      //   el.style.zIndex = 1;
      //   return;
      // }
      el.style.zIndex = -1;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        el.style.zIndex = 1;
      }, 50);
    };
    // 监听鼠标滚轮事件
    if (typeof scrollDom.onmousewheel === "object") {
      scrollDom.addEventListener("mousewheel", binding.onmousewheel);
    } else {
      scrollDom.addEventListener("DOMMouseScroll", binding.onmousewheel);
    }
    // 监听滚动条事件
    scrollDom.addEventListener("scroll", binding.scrollFn);
    // 监听窗口变化事件
    window.addEventListener("resize", binding.resizeFn);

    binding.scrollFn();
  },
  update(el: any, binding: any) {
    // 单滚动页面中有tab切换时，需要重新设置父元素的高度, 等dom加载完成
    setTimeout(() => {
      const pos = el.getBoundingClientRect();
      if (pos.height) {
        el.parentNode.style.height = pos.height + "px";
        el.style.position = "static";
        const dashScrollbar: Element | null = document.getElementById("dashScrollbar");
        const scrollDom: any = dashScrollbar?.firstChild;
        scrollDom.scrollTop = scrollDom.scrollTop - 1;
        HomeModule.UPDATE_NEED_ALIGN_UPDATE(false);
      }
    }, 200);
  },
  unbind(el: any, binding: any) {
    // 清除事件
    const dashScrollbar: Element | null = document.getElementById("dashScrollbar");
    const scrollDom: any = dashScrollbar?.firstChild;
    if (typeof scrollDom.onmousewheel === "object") {
      scrollDom.removeEventListener("mousewheel", binding.onmousewheel);
    } else {
      scrollDom.removeEventListener("DOMMouseScroll", binding.onmousewheel);
    }
    if (binding.scrollFn) {
      scrollDom.removeEventListener("scroll", binding.scrollFn);
    }
    if (binding.resizeFn) {
      window.addEventListener("resize", binding.resizeFn);
    }
  },
};
