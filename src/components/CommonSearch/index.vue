<template>
  <div class="common-search">
    <el-input v-model="inputVal" v-bind="$attrs" @input="inputChange" clearable>
      <template slot="append"><div class="search-btn" @click="searchFn">搜索</div></template>
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
    searchFn() {
      this.$emit("submit", this.inputVal);
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
      padding: 0;
      width: 68px;
      height: 38px;
      cursor: pointer;
      background: #007eff;
      color: #fff;
      border: 1px solid #007eff;
    }
  }
  .search-btn {
    width: 100%;
    height: 100%;
    line-height: 38px;
    text-align: center;
  }
}
</style>
