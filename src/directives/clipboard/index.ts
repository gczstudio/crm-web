import { DirectiveOptions } from "vue";

export const clipboard: DirectiveOptions = {
  inserted: function (el: any, binding: any) {
    binding.dbclickFn = () => {
      const text = document.createElement("textarea");
      text.value = el.innerText;
      document.body.appendChild(text);
      try {
        text.select();
        document.execCommand("copy");
        // 设置文字选中
        const range = document.createRange();
        range.selectNodeContents(el);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        // 提示复制成功
        el.style.position = "ralative";
        const html = document.createElement("div");
        html.className = "copy-success";
        html.innerText = "复制成功";
        el.appendChild(html);
        setTimeout(() => {
          el.removeChild(html);
        }, 1000);
      } catch (e) {
        console.log("复制失败");
      }
      document.body.removeChild(text);
    };
    el.addEventListener("dblclick", binding.dbclickFn);
  },
  unbind(el: any, binding: any) {
    if (binding.dbclickFn) {
      el.removeEventListener("mousewheel", binding.dbclickFn);
    }
  },
};
