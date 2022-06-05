<template>
  <div class="render-common-search" v-editor.common-search="{ action: ['delete'] }">
    <common-search v-model="inputVal"></common-search>
  </div>
</template>
<script>
import request from "@/utils/request";
import { backend } from "@/config";
import CommonSearch from "@/components/CommonSearch/index.vue";
export default {
  name: "RenderCommonSeach",
  components: {
    CommonSearch,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      inputVal: "",
    };
  },
  watch: {
    data: {
      handler(val) {
        console.log("zxl");
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.render-left-tree {
}
</style>
