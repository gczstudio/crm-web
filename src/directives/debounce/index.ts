import { DirectiveOptions } from "vue";
import { debounce as debounceFn } from "@/utils";

export const debounce: DirectiveOptions = {
  inserted: function (el, binding) {
    if (typeof binding.value === "function") {
      el.addEventListener("click", debounceFn(binding.value, 500, true));
    } else if (Array.isArray(binding.value) && binding.value.length) {
      // [fn, event, timer, immediate]
      const fn =
        binding.value[0] && typeof binding.value[0] === "function"
          ? binding.value[0]
          : function () {
              throw new Error("请传入function");
            };
      const event = binding.value[1] || "click";
      const timer = binding.value[2] || 500;
      const immediate = binding.value[3];
      el.addEventListener(event, debounceFn(fn, timer, immediate));
    }
  },
};
