<template>
  <div class="common-search">
    <el-input v-model="inputVal" v-bind="$attrs" @input="inputChange">
      <template slot="append">搜索</template>
    </el-input>
  </div>
</template>

<script>
export default {
  name: "CommonSearch",
  props: {
    value: String,
  },
  watch: {
    value() {
      this.inputVal = this.value;
    },
  },
  data() {
    return {
      inputVal: "",
    };
  },
  methods: {
    inputChange() {
      this.$emit("input", this.inputVal);
    },
  },
};
</script>

<style lang="scss" scoped>
.common-search {
  ::v-deep .el-input {
    .el-input__inner {
      height: 40px;
      line-height: 40px;
    }
    .el-input-group__append {
      cursor: pointer;
      background: #007eff;
      color: #fff;
    }
  }
}
</style>
