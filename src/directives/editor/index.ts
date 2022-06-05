/*
 * @Descripttion: 生成编辑id
 * @Author: gaocz
 * @Date: 2022-04-29 15:11:53
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-17 14:50:54
 * @FilePath: /edmp-web/src/directives/editor/index.ts
 */
import { DirectiveOptions } from "vue";
import { guid } from "@/utils";
import { LowCodeModule } from "@/store/modules/lowCode";

export const editor: DirectiveOptions = {
  inserted(el, binding, vnode: any) {
    if (vnode.context?.data?.type === "show") return;
    const id = guid();
    el.setAttribute("data-editor-id", id);
    LowCodeModule.SET_WIDGETS_MAP({
      [id]: {
        type: Object.keys(binding.modifiers)[0],
        dataId: binding.value?.id || vnode.context?.data?.id,
        actions: binding.value?.action,
      },
    });
  },
};
