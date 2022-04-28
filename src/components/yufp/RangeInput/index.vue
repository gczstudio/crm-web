<template>
  <div class="YufpRangeInput-container">
    <el-input :class="{ 'is-error': isminError, 'has-unit': unit }" v-model="minVal" :maxlength="20" placeholder="最小值（含）" clearable @input="valChange('min')"></el-input> {{ unit }}
    <span class="spacing">~</span>
    <el-input :class="{ 'is-error': ismaxError, 'has-unit': unit }" v-model="maxVal" :maxlength="20" placeholder="最大值（不含）" clearable @input="valChange('max')"></el-input> {{ unit }}
  </div>
</template>
<script>
export default {
  name: "YufpRangeInput",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    unit: String,
  },
  data() {
    return {
      minVal: "",
      maxVal: "",
      isminError: false,
      ismaxError: false,
    };
  },
  watch: {
    value(val) {
      this.minVal = val?.[0] || "";
      this.maxVal = val?.[1] || "";
    },
  },
  methods: {
    isvalid(value) {
      var reg = /^\d+(\.\d+)?$/;
      if (!value || (value && reg.test(value))) {
        return true;
      }
      return false;
    },
    valChange(type) {
      if (type === "min") {
        this.isminError = !this.isvalid(this.minVal);
      } else {
        this.ismaxError = !this.isvalid(this.maxVal);
      }
      let resultVal = [this.minVal, this.maxVal];
      this.$emit("input", resultVal);
    },
    getSelectVal() {
      return (this.minVal ? `最小值（含）：${this.minVal}` : "") + (this.minVal ? `最大值（不含）：${this.maxVal}` : "");
    },
  },
};
</script>
<style lang="scss">
.YufpRangeInput-container {
  .spacing {
    padding: 0 2px;
  }
  .el-input {
    width: calc(50% - 10px);
    .el-input__inner {
      padding: 0 5px;
    }
  }
  .is-error {
    .el-input__inner {
      border-color: #f56c6c !important;
    }
  }
  .has-unit {
    &.el-input {
      width: calc(50% - 26px);
    }
  }
}
</style>
