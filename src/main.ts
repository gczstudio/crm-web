/*
 * @Descripttion:
 * @Author: gaocz
 * @Date: 2022-03-03 15:43:54
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-20 10:52:56
 * @FilePath: /edmp-web/src/main.ts
 */
import Vue, { DirectiveOptions } from "vue";

// ie兼容
import "es6-promise/auto";

import "normalize.css";
import ElementUI from "element-ui";
import animated from "animate.css";

// 主题
import "@/styles/theme/customTheme/main.scss";
import "@/styles/theme/redTheme/main.scss";

// iconfont
import "@/assets/iconfont/iconfont.css";
// 多色图标
import "@/assets/iconfont/iconfont.js";

import "@/styles/index.scss";

import App from "@/App.vue";
import store from "@/store";
import router from "@/router";
import "@/permission";
import * as directives from "@/directives";

// 将yufp组件注册成全局组件
import "@/components/index.js";

import lookup from "@/utils/lookup";
import validator from "@/utils/validator";
import checkCtr from "@/utils/permission";
import exportQueue from "@/utils/exportQueue";

import * as utils from "@/utils";

import _ from "lodash";

import mixin from "@/mixin";

import Component from "vue-class-component";

import VueFullscreen from "vue-fullscreen";

//import VueClipboard from 'vue-clipboard2'

// ts注册vue-router钩子函数
Component.registerHooks(["beforeRouteEnter", "beforeRouteLeave", "beforeRouteUpdate"]);

Vue.mixin(mixin);

//Vue.use(VueClipboard);

// 解决火狐浏览器拖拽自动打开新窗口搜索
document.body.ondrop = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

Vue.use(ElementUI);
Vue.use(animated);

Vue.use(VueFullscreen);

// Register global directives
Object.keys(directives).forEach((key) => {
  Vue.directive(key, (directives as { [key: string]: DirectiveOptions })[key]);
});

Vue.config.productionTip = false;

Vue.prototype.$lookup = lookup;
Vue.prototype.$util = utils;
Vue.prototype.$validator = validator;
Vue.prototype._ = _;
Vue.prototype.$checkCtr = checkCtr;
Vue.prototype.$exportQueue = exportQueue;

(window as any)._vue = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
