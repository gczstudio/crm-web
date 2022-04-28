import { DirectiveOptions } from "vue";
import Vue from "vue";

const Mask = Vue.extend({
  template:
    '<div class="el-loading-mask yu-loading-mask" v-show="visible">\
    <div class="el-loading-spinner">\
      <svg viewBox="25 25 50 50" class="circular">\
        <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>\
      </svg>\
    </div>\
  </div>',
  data: function () {
    return {
      visible: false,
    };
  },
});

const toggleLoading = function (el: any, binding: any) {
  if (binding.value) {
    insetDom(el, binding);
  } else {
    el.instance.visible = false;
  }
};

var insetDom = function (el: any, binding: any) {
  el.instance.visible = true;
  el.style.position = "relative";
  el.appendChild(el.mask);
};

export const mloading: DirectiveOptions = {
  bind(el, binding) {
    const mask = new Mask({
      el: document.createElement("div"),
    });
    (el as any).instance = mask;
    (el as any).mask = mask.$el;
    binding.value && toggleLoading(el, binding);
  },
  update(el, binding) {
    if (binding.oldValue !== binding.value) {
      toggleLoading(el, binding);
    }
  },
  unbind: function (el, binding) {
    (el as any).instance && (el as any).instance.$destroy();
  },
};
