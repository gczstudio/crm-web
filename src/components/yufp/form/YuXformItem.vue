<template>
  <div v-show="show" class="el-form-item" :class="getStyle()">
    <yu-label-wrap :is-auto-width="labelStyle && labelStyle.width === 'auto'" :update-all="form.labelWidth === 'auto'">
      <label :for="labelFor" class="el-form-item__label" :style="labelStyle" v-if="label || $slots.label">
        <slot name="label">{{ label + (showLabelSuffix ? form.labelSuffix : "") }}</slot>
      </label>
    </yu-label-wrap>
    <div class="el-form-item__content" :style="contentStyle">
      <slot v-if="ctype === 'custom'"></slot>
      <yu-xform-ctype :options="options" ref="formCtype" v-else></yu-xform-ctype>
      <transition name="el-zoom-in-top">
        <slot v-if="validateState === 'error' && showMessage && form.showMessage" name="error" :error="validateMessage">
          <div class="el-form-item__error" :class="{ 'el-form-item__error--inline': typeof inlineMessage === 'boolean' ? inlineMessage : (elForm && elForm.inlineMessage) || false }">
            {{ validateMessage }}
          </div>
        </slot>
      </transition>
    </div>
    <span v-if="this.suffixLabel && this.suffixLabelWidth" ref="suffixLabel">{{ suffixLabel }}</span>
  </div>
</template>

<script>
import YuLabelWrap from "./YuLabelWrap";
import YuXformCtype from "./YuXformCtype";
import Schema from "async-validator";

const broadcast = function (componentName, eventName, params) {
  this.$children.forEach(function (child) {
    var name = child.$options.componentName;
    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
};
export default {
  name: "YuXformItem",
  componentName: "ElFormItem",
  components: {
    YuLabelWrap,
    YuXformCtype,
  },
  provide: function () {
    return {
      elFormItem: this,
    };
  },
  inject: ["elForm"],
  props: {
    label: String,
    labelWidth: String,
    prop: String,
    required: {
      type: Boolean,
      default: undefined,
    },
    rules: [Object, Array, Function],
    error: String,
    validateStatus: String,
    for: String,
    inlineMessage: {
      type: [String, Boolean],
      default: "",
    },
    showMessage: {
      type: Boolean,
      default: true,
    },
    size: String,
    // 新增自定义属性
    ctype: String,
    name: String,
    dataCode: String,
    options: Array,
    colspan: [Number, String],
    rowspan: [Number, String],
    formatMoney: {
      type: Boolean,
      default: false,
    },
    isNum: {
      type: Boolean,
      default: false,
    },
    showLabelSuffix: {
      type: Boolean,
      default: true,
    },
    suffixLabel: String,
    suffixLabelWidth: String,
  },
  watch: {
    error: {
      immediate: true,
      handler(value) {
        this.validateMessage = value;
        this.validateState = value ? "error" : "";
      },
    },
    validateStatus: function (value) {
      this.validateState = value;
    },
  },
  computed: {
    show() {
      return this.elForm.formType !== "search" || this.elForm.isExpand || (!this.elForm.isExpand && this.elForm.fields.indexOf(this) < this.elForm.column * 2);
    },
    labelFor() {
      return this.for || this.name;
    },
    labelStyle() {
      var ret = {};
      if (this.form.labelPosition === "top") return ret;
      var labelWidth = this.labelWidth || this.form.labelWidth;
      if (labelWidth) {
        ret.width = labelWidth;
      }
      return ret;
    },
    contentStyle() {
      var ret = {};
      var label = this.label;
      if (!label) ret.marginRight = "16px";
      if (this.form.labelPosition === "top" || this.form.inline) return ret;
      if (!label && !this.labelWidth && this.isNested) return ret;
      var labelWidth = this.labelWidth || this.form.labelWidth;
      if (labelWidth === "auto") {
        if (this.labelWidth === "auto") {
          ret.marginLeft = this.computedLabelWidth;
        } else if (this.form.labelWidth === "auto") {
          ret.marginLeft = this.elForm.autoLabelWidth;
        }
      } else {
        ret.marginLeft = labelWidth;
      }

      if (this.suffixLabel && this.suffixLabelWidth) {
        ret.width = `calc(100% - ${parseFloat(this.suffixLabelWidth) + parseFloat(ret.marginLeft) + 10}px)`;
        ret.display = "inline-block";
        ret.margin = "0 5px";
      }
      return ret;
    },
    form() {
      var parent = this.$parent;
      var parentName = parent.$options.componentName;
      while (parentName !== "ElForm") {
        if (parentName === "ElFormItem") {
          this.isNested = true;
        }
        parent = parent.$parent;
        parentName = parent.$options.componentName;
      }
      return parent;
    },
    fieldValue() {
      var model = this.form.model;
      if (!model || !this.name) {
        return;
      }

      var path = this.name;
      if (path.indexOf(":") !== -1) {
        path = path.replace(/:/, ".");
      }

      return this.getPropByPath(model, path, true).v;
    },
    isRequired() {
      var rules = this.getRules();
      var isRequired = false;

      if (rules && rules.length) {
        rules.every(function (rule) {
          if (rule.required) {
            isRequired = true;
            return false;
          }
          return true;
        });
      }
      return isRequired;
    },
    _formSize() {
      return this.elForm.size;
    },
    elFormItemSize() {
      return this.size || this._formSize;
    },
    sizeClass() {
      return this.elFormItemSize || (this.$ELEMENT || {}).size;
    },
  },
  data() {
    return {
      validateState: "",
      validateMessage: "",
      validateDisabled: false,
      validator: {},
      isNested: false,
      computedLabelWidth: "",
    };
  },
  methods: {
    objectAssign(target) {
      for (var i = 1, j = arguments.length; i < j; i++) {
        var source = arguments[i] || {};
        for (var prop in source) {
          if (source.hasOwnProperty(prop)) {
            var value = source[prop];
            if (value !== undefined) {
              target[prop] = value;
            }
          }
        }
      }
      return target;
    },
    dispatch(componentName, eventName, params) {
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
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    },
    getPropByPath(obj, path, strict) {
      var tempObj = obj;
      path = path.replace(/\[(\w+)\]/g, ".$1");
      path = path.replace(/^\./, "");

      var keyArr = path.split(".");
      var i = 0;
      for (var len = keyArr.length; i < len - 1; ++i) {
        if (!tempObj && !strict) break;
        var key = keyArr[i];
        if (key in tempObj) {
          tempObj = tempObj[key];
        } else {
          if (strict) {
            throw new Error("please transfer a valid prop path to form item!");
          }
          break;
        }
      }
      return {
        o: tempObj,
        k: keyArr[i],
        v: tempObj ? tempObj[keyArr[i]] : null,
      };
    },
    getStyle() {
      var className = "";
      if (this.elForm && this.elForm.statusIcon) {
        className += " el-form-item--feedback";
      }
      if (this.validateState === "error") {
        className += " is-error";
      }
      if (this.validateState === "validating") {
        className += " is-validating";
      }
      if (this.validateState === "success") {
        className += " is-success";
      }
      if (this.isRequired || this.required) {
        className += " is-required";
      }
      if (this.elForm && this.elForm.hideRequiredAsterisk) {
        className += " is-no-asterisk";
      }
      if (this.sizeClass) {
        className += " el-form-item--" + this.sizeClass;
      }
      return className;
    },
    validate(trigger, callback) {
      callback = callback || function () {};
      this.validateDisabled = false;
      var rules = this.getFilteredRule(trigger);
      if ((!rules || rules.length === 0) && this.required === undefined) {
        callback();
        return true;
      }

      this.validateState = "validating";

      var descriptor = {};
      if (rules && rules.length > 0) {
        rules.forEach(function (rule) {
          delete rule.trigger;
        });
      }
      descriptor[this.name] = rules;
      var validator = new Schema(descriptor);
      var model = {};

      model[this.name] = this.fieldValue;

      validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
        this.validateState = !errors ? "success" : "error";
        this.validateMessage = errors ? errors[0].message : "";

        callback(this.validateMessage, invalidFields);
        this.elForm && this.elForm.$emit("validate", this.name, !errors, this.validateMessage || null);
      });
    },
    clearValidate() {
      this.validateState = "";
      this.validateMessage = "";
      this.validateDisabled = false;
    },
    resetField() {
      this.validateState = "";
      this.validateMessage = "";

      var model = this.form.model;
      var value = this.fieldValue;
      var path = this.name;
      if (path.indexOf(":") !== -1) {
        path = path.replace(/:/, ".");
      }

      var prop = this.getPropByPath(model, path, true);

      this.validateDisabled = true;
      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(this.initialValue || []);
        this.$refs.formCtype && this.$refs.formCtype.resetField([].concat(this.initialValue || []));
      } else {
        prop.o[prop.k] = this.initialValue;
        this.$refs.formCtype && this.$refs.formCtype.resetField(this.initialValue);
      }

      // reset validateDisabled after onFieldChange triggered
      this.$nextTick(() => {
        this.validateDisabled = false;
      });

      this.broadcast("ElTimeSelect", "fieldReset", this.initialValue);
    },
    getRules() {
      var formRules = this.form.rules;
      var selfRules = this.rules;
      if (typeof this.rules === "function") {
        selfRules = { validator: this.rules };
      }
      var requiredRule = this.required !== undefined ? { required: !!this.required } : [];

      var prop = this.getPropByPath(formRules, this.name || "");
      formRules = formRules ? prop.o[this.name || ""] || prop.v : [];

      return [].concat(selfRules || formRules || []).concat(requiredRule);
    },
    getFilteredRule(trigger) {
      var rules = this.getRules();

      return rules
        .filter(function (rule) {
          if (!rule.trigger || trigger === "") return true;
          if (Array.isArray(rule.trigger)) {
            return rule.trigger.indexOf(trigger) > -1;
          } else {
            return rule.trigger === trigger;
          }
        })
        .map((rule) => {
          return this.objectAssign({}, rule);
        });
    },
    onFieldBlur: function () {
      this.validate("blur");
    },
    onFieldChange: function () {
      if (this.validateDisabled) {
        this.validateDisabled = false;
        return;
      }

      this.validate("change");
    },
    updateComputedLabelWidth: function (width) {
      this.computedLabelWidth = width ? width + "px" : "";
    },
    addValidateEvents: function () {
      var rules = this.getRules();

      if (rules.length || this.required !== undefined) {
        this.$on("el.form.blur", this.onFieldBlur);
        this.$on("el.form.change", this.onFieldChange);
      }
    },
    removeValidateEvents: function () {
      this.$off();
    },
  },
  mounted() {
    if (this.name) {
      this.dispatch("ElForm", "el.form.addField", [this]);

      var initialValue = this.fieldValue;
      if (Array.isArray(initialValue)) {
        initialValue = [].concat(initialValue);
      }
      Object.defineProperty(this, "initialValue", {
        value: initialValue,
      });

      // 详情是不添加校验
      if (this.elForm.formType !== "details") {
        this.addValidateEvents();
      }
    }
  },
  beforeDestroy: function () {
    this.dispatch("ElForm", "el.form.removeField", [this]);
  },
};
</script>
