import Vue from "vue";

declare module "vue/types/vue" {
  interface Vue {
    $lookup: any;
    $util: any;
    _: any;
    $checkCtr: any;
    $exportQueue: any;
  }
}
