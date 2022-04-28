<template>
  <div>
    <el-tooltip v-if="showToolTip && !rowspan" popper-class="yu-detail-popper" effect="dark" :content="value" placement="top">
      <div class="yu-detail" v-clipboard>{{ value }}</div>
    </el-tooltip>
    <div v-else ref="detailRef" :class="{ 'yu-detail': true, 'yu-rowspan': rowspan }" :style="{ 'min-height': rowspan ? rowspan * 10 + 'px' : 'auto' }" v-clipboard>{{ value }}</div>
  </div>
</template>
<script>
export default {
  name: "YuDetail",
  props: {
    value: [String, Number],
    rowspan: [String, Number],
  },
  data: function () {
    return {
      showToolTip: false,
    };
  },
  watch: {
    value: function () {
      this.setShowToolTip();
    },
  },
  mounted() {
    this.setShowToolTip();
  },
  methods: {
    setShowToolTip() {
      if (this.value && this.$el) {
        var html = document.createElement("span");
        html.innerText = this.value;
        document.body.appendChild(html);
        this.showToolTip = html.offsetWidth > this.$el.clientWidth;
        document.body.removeChild(html);
      }
    },
  },
};
</script>
<style lang="scss">
.yu-detail-popper {
  max-width: 50%;
}
.yu-detail {
  padding: 0 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.yu-rowspan {
  white-space: inherit;
  overflow: visible;
  line-height: 1.5;
  padding: 5px;
}
.num {
  .yu-detail {
    font-family: "Times New Roman", Times, serif !important;
  }
}
</style>
