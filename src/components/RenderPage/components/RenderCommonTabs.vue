<template>
  <div class="render-common-tabs" v-editor.common-tabs="{ action: ['delete'] }">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="tab in tabs" v-bind="tab" :key="tab.id">
        <div class="common-tabs-pane" v-editor.common-tabs-pane="{ id: tab.id }">
          <render-type v-if="tab.body && tab.body.length" :data="tab.body"></render-type>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: "RenderLeftTree",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      activeName: "",
      tabs: [],
    };
  },
  watch: {
    data: {
      handler(val) {
        this.tabs = this.data.body;
        this.activeName = this.tabs[0].name;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleClick() {},
  },
};
</script>
<style lang="scss" scoped>
.common-tabs-pane {
  min-height: 40px;
}
</style>
