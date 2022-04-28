<template>
  <el-drawer
    title="更多"
    :with-header="false"
    :size="width"
    :visible.sync="drawerVisible"
    direction="rtl"
    append-to-body
    custom-class="view-more-drawer"
    :close-on-press-escape="false"
    :wrapperClosable="false"
  >
    <div class="view-more-wrapper">
      <img class="view-more-close" src="../../../assets/images/common/close-more.png" @click="closeHandler" />
      <div class="view-more-content">
        <div class="unit" v-if="viewOptions.unit">单位：{{ viewOptions.unit }}</div>
        <top-table
          v-if="height && drawerVisible"
          :height="height"
          :show-more="false"
          :tabs="viewOptions.tabs"
          :rank-key="viewOptions.rankKey"
          :tab-value="viewOptions.tabValue"
          :title="viewOptions.title"
          :columns="viewOptions.columns"
          :pageable="viewOptions.pageable"
          :url="viewOptions.url"
          :base-params="viewOptions.baseParams"
          :page-size="viewOptions.size"
          @change="tabChangeFn"
        >
        </top-table>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: "ViewMore",
  props: {
    visible: Boolean,
    options: {
      type: Object,
      default: function () {
        return {};
      },
    },
    width: {
      type: Number,
      default: 1000,
    },
  },
  data: function () {
    return {
      height: 0,
      viewOptions: {},
      drawerVisible: false,
    };
  },
  watch: {
    visible: function () {
      this.drawerVisible = this.visible;
    },
    options: function (options) {
      this.viewOptions = options;
    },
  },
  mounted: function () {
    this.height = document.body.clientHeight - 100;
  },
  methods: {
    tabChangeFn: function (value) {
      var copyOpitons = Object.assign({}, this.viewOptions);
      if (copyOpitons.typeName && copyOpitons.typeLookup) {
        copyOpitons.baseParams[copyOpitons.typeName] = copyOpitons.typeLookup[value];
      }
      copyOpitons.url = copyOpitons.urls ? copyOpitons.urls[value] : copyOpitons.url;
      copyOpitons.columns = copyOpitons.allColumns ? copyOpitons.allColumns[value] : copyOpitons.columns;
      copyOpitons.tabValue = value;
      this.viewOptions = copyOpitons;
    },
    closeHandler: function () {
      this.$emit("update:visible", false);
    },
  },
};
</script>
<style lang="scss">
.view-more-drawer {
  padding: 20px;
  position: relative;
  overflow: visible !important;
  .unit {
    position: absolute;
    top: 22px;
    right: 20px;
  }
  .view-more-wrapper {
    .view-more-close {
      position: absolute;
      top: 50%;
      left: -24px;
      transform: translateY(-50%);
      cursor: pointer;
    }
  }
}
</style>
