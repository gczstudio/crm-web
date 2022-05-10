/*
 * @Descripttion: 生成编辑id
 * @Author: gaocz
 * @Date: 2022-04-29 15:11:53
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-05 09:13:21
 * @FilePath: /edmp-web/src/directives/editor/index.ts
 */
import { DirectiveOptions } from "vue";
import { guid } from "@/utils";
import { LowCodeModule } from "@/store/modules/lowCode";

export const editor: DirectiveOptions = {
  inserted(el, binding, vnode) {
    const id = guid();
    el.setAttribute("data-editor-id", id);
    LowCodeModule.SET_WIDGETS_MAP({
      [id]: binding.value || [],
    });
  },
};
