<template>
  <component
    ref="ctypeRef"
    :class="{ num: elFormItem.isNum || elFormItem.formatMoney }"
    v-model="conponentValue"
    :rowspan="elFormItem.rowspan"
    v-bind="elFormItem.$attrs"
    v-on="elFormItem.$listeners"
    :clearable="elFormItem.$attrs.clearable === false ? false : true"
    :is="getRealCtype()"
  >
    <template v-if="elFormItem.ctype === 'select'">
      <el-option v-for="item in optionData" :key="item.key" :label="item.value" :value="item.key"> </el-option>
    </template>
    <template v-if="elFormItem.ctype === 'radio'">
      <el-radio v-for="item in optionData" :key="item.key" :label="item.key">{{ item.value }}</el-radio>
    </template>
  </component>
</template>

<script>
import moment from "moment";
export default {
  name: "YuXformCtype",
  inject: ["elForm", "elFormItem"],
  componentName: "YuXformCtype",
  props: {
    options: Array,
  },
  data: function () {
    return {
      optionData: [],
      conponentValue: "",
      fieldVal: "",
    };
  },
  watch: {
    conponentValue: function (val) {
      if (this.elFormItem.ctype === "date-picker" && val) {
        val = moment(val).format("YYYY-MM-DD");
      }

      if (this.elFormItem.ctype === "checkbox") {
        val = Boolean(val);
      }

      // 导出的时候要传的queryField处理
      if (this.elForm.needExport) {
        let fieldVal = val;
        // select
        if (["select", "radio-group"].includes(this.elFormItem.ctype)) {
          fieldVal = this.$lookup.convertKey(this.optionData, val);
        }
        this.$nextTick(() => {
          // 自定义组件
          if (this.elFormItem.ctype.includes("yufp") && this.$refs.ctypeRef.getSelectVal) {
            fieldVal = this.$refs.ctypeRef.getSelectVal();
          }
          this.dispatch("ElForm", "el.form.ctype.fieldChange", { fieldVal, fieldName: this.elFormItem.label });
        });
      }
      this.dispatch("ElForm", "el.form.ctype.modelChange", { key: this.elFormItem.name, value: val });
    },
    options: function (val) {
      this.optionData = val;
    },
  },
  created: function () {
    var _this = this;
    this.optionData = this.options;
    if (this.elFormItem.dataCode) {
      this.$lookup.bind(this.elFormItem.dataCode, function (lookup) {
        _this.optionData = lookup;
        if (_this.elForm.formType === "details") {
          _this.conponentValue = _this.$lookup.convertKey(lookup, _this.elForm.model[_this.elFormItem.name]);
        }
      });
    }

    this.conponentValue = this.elForm.model[this.elFormItem.name];
    // 监听model的改变
    this.$on("el.form.modelChange", function (data) {
      var value = data[_this.elFormItem.name];
      _this.conponentValue = value;
      if (this.elForm.formType === "details") {
        if (this.elFormItem.dataCode && value) {
          _this.conponentValue = _this.$lookup.convertKey(this.elFormItem.dataCode, value);
        }
        if (this.elFormItem.formatMoney && !(typeof value === "string")) {
          _this.conponentValue = this.$util.formatMoney(value);
        }
      }
    });
  },
  methods: {
    fieldFn: function (val) {
      this.fieldVal = val;
    },
    getRealCtype: function () {
      var ctype = this.elFormItem.ctype;
      if (this.elForm.formType === "details") {
        return "yu-detail";
      }
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
    resetField: function (initialValue) {
      this.conponentValue = initialValue;
    },
    dispatch: function (componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;
        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
  },
};
</script>
