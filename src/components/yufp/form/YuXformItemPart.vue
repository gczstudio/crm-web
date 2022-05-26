<template>
  <component v-model="conponentValue" v-bind="$attrs" v-on="$listeners" :is="getRealCtype()">
    <template v-if="ctype === 'select'">
      <el-option v-for="item in optionData" :key="item.key" :label="item.value" :value="item.key"> </el-option>
    </template>
    <template v-if="ctype === 'radio'">
      <el-radio v-for="item in optionData" :key="item.key" :label="item.key">{{ item.value }}</el-radio>
    </template>
  </component>
</template>

<script>
export default {
  name: "YuXformItemPart",
  props: {
    value: [String, Number],
    options: [Array, String],
    dataCode: String,
    ctype: String,
  },
  data: function () {
    return {
      optionData: [],
      conponentValue: "",
    };
  },
  watch: {
    value: function (val) {
      this.componentValue = val;
    },
    conponentValue: function (val) {
      this.$emit("input", val);
    },
    options: function (val) {
      this.optionData = val;
    },
  },
  created: function () {
    var _this = this;
    this.optionData = this.options;
    if (this.dataCode) {
      this.$lookup.bind(this.dataCode, function (lookup) {
        _this.optionData = lookup;
      });
    }
    this.conponentValue = this.value;
  },
  methods: {
    getRealCtype: function () {
      var ctype = this.ctype;
      if (!ctype) {
        return "el-input";
      }
      if (ctype.indexOf("el-") !== -1) {
        return ctype;
      }
      if (ctype.indexOf("yu") !== -1) {
        return ctype;
      }
      if (ctype === "radio" || ctype === "el-radio") {
        return "el-radio-group";
      }
      return "el-" + ctype;
    },
  },
};
</script>
