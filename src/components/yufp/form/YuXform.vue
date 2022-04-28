<template>
  <div :class="['yu-xform', isExpand ? 'expand' : '', formType === 'search' ? 'search' : '']">
    <div class="clearfix">
      <div :class="getFormClass()">
        <form class="el-form" :class="getStyle()" @keyup.enter="enterSearchFn">
          <slot></slot>
        </form>
      </div>
      <div class="yu-xform-btns" v-if="formType === 'search' && showSearchBtn">
        <el-button type="text" @click="expandToggle" v-if="showExpand">
          <template v-if="isExpand">收起<i class="arrow-up"></i></template>
          <template v-else>展开<i class="arrow-down"></i></template>
        </el-button>
        <el-button type="primary" v-debounce="searchFn">查询</el-button>
        <el-button @click="resetFn">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { CommonModule } from "@/store/modules/common";
import { formatQueryField } from "@/utils";
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
  name: "YuXform",
  componentName: "ElForm",
  provide: function () {
    return {
      elForm: this,
    };
  },
  props: {
    model: {
      type: Object,
      default: function () {
        return {};
      },
    },
    rules: Object,
    labelPosition: String,
    labelWidth: String,
    labelSuffix: {
      type: String,
      default: "：",
    },
    inline: Boolean,
    inlineMessage: Boolean,
    statusIcon: Boolean,
    showMessage: {
      type: Boolean,
      default: true,
    },
    size: String,
    disabled: Boolean,
    validateOnRuleChange: {
      type: Boolean,
      default: true,
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: false,
    },
    // 自定义属性
    formType: String, // search details
    relatedTableName: String,
    search: Function,
    reset: Function,
    showSearchBtn: {
      type: Boolean,
      default: true,
    },
    needExport: {
      type: Boolean,
      default: false,
    },
    enterSearch: {
      // 是否可以通过enter键查询
      type: Boolean,
      default: true,
    },
  },
  watch: {
    rules: function () {
      // remove then add event listeners on form-item after form rules change
      this.fields.forEach(function (field) {
        field.removeValidateEvents();
        field.addValidateEvents();
      });

      if (this.validateOnRuleChange) {
        this.validate(function () {});
      }
    },
    model: {
      deep: true,
      handler: function (val) {
        this.broadcast("YuXformCtype", "el.form.modelChange", val);
      },
    },
    queryField: function () {
      if (!this.isClickSeach) {
        this.searchQueryField = this.queryField;
      }
    },
  },
  computed: {
    autoLabelWidth: function () {
      if (!this.potentialLabelWidthArr.length) return 0;
      var max = Math.max.apply(null, this.potentialLabelWidthArr);
      return max ? max + "px" : "";
    },
    showExpand: function () {
      return this.formType === "search" && this.fields.length > this.column * 2;
    },
  },
  data: function () {
    return {
      fields: [],
      column: 2,
      isExpand: false,
      potentialLabelWidthArr: [], // use this array to calculate auto width
      relatedTableRef: null,
      queryFieldArr: [],
      queryField: "",
      searchModel: {},
      searchQueryField: "",
      isClickSeach: false,
    };
  },
  created: function () {
    var _this = this;
    this.$on("el.form.addField", function (field) {
      if (field) {
        this.fields.push(field);
      }
    });
    /* istanbul ignore next */
    this.$on("el.form.removeField", function (field) {
      if (field.name) {
        _this.fields.splice(_this.fields.indexOf(field), 1);
      }
    });
    this.$on("el.form.ctype.modelChange", function (data) {
      _this.$set(_this.model, data.key, data.value);
    });

    this.$on("el.form.ctype.fieldChange", function (data) {
      if (_this.needExport) {
        var bool = true;
        for (var i = 0, len = _this.queryFieldArr.length; i < len; i++) {
          let item = _this.queryFieldArr[i];
          if (item.cnName === data.fieldName) {
            _this.queryFieldArr[i].value = data.fieldVal || "";
            bool = false;
          }
        }
        if (bool) {
          _this.queryFieldArr.push({
            cnName: data.fieldName,
            value: data.fieldVal || "",
          });
        }
        _this.$nextTick(() => {
          _this.queryField = formatQueryField(_this.queryFieldArr);
        });
      }
    });
    this.searchModel = this.model;
  },
  methods: {
    broadcast: function (componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    },
    getFormClass: function () {
      var className = "yu-xform-content";
      if (this.formType === "search") {
        className += " yu-xform-content--search fl";
      }
      if (this.formType === "details") {
        className += " yu-xform-content--details";
      }
      if (this.showExpand) {
        className += " yu-xform-content--expand";
      }
      return className;
    },
    // 展开，收起
    expandToggle: function () {
      this.isExpand = !this.isExpand;
    },
    enterSearchFn: function (e) {
      if (!this.enterSearch) return;
      this.searchFn();
      // select enter时下拉框不会关闭
      this.$nextTick(() => {
        document.querySelectorAll(".el-select-dropdown").forEach((item) => {
          item.style.display = "none";
        });
        document.querySelectorAll(".el-popover").forEach((item) => {
          item.style.display = "none";
        });
      });
    },
    // 查询
    searchFn: function () {
      var _this = this;
      if (this.search) {
        this.$nextTick(function () {
          _this.validate(function (valid) {
            if (valid) {
              _this.$parent.toggleFormArrow && _this.$parent.toggleFormArrow();
              _this.isExpand = false;
              _this.search();
              // 保存查询成功的查询条件
              _this.searchModel = _this._.cloneDeep(_this.model);
              _this.searchQueryField = _this.queryField;
              _this.isClickSeach = true;
            } else {
              console.log("error submit!!");
              return false;
            }
          });
        });
        return;
      }
      // 向上找到父节点，然后向下查找第一个table
      this.relatedTableRef = this.$parent.$refs[this.relatedTableName];
      if (!this.$parent.$refs[this.relatedTableName]) {
        this.recursionChild(this.$parent.$children);
      }
      this.$nextTick(function () {
        _this.validate(function (valid) {
          if (valid) {
            _this.$parent.toggleFormArrow && _this.$parent.toggleFormArrow();
            _this.isExpand = false;
            _this.relatedTableRef.remoteData({
              condition: JSON.stringify(_this.model),
            });
            // 保存查询成功的查询条件
            _this.searchModel = _this._.cloneDeep(_this.model);
            _this.searchQueryField = _this.queryField;
            _this.isClickSeach = true;
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      });
    },
    recursionChild: function (childs) {
      var _this = this;
      for (var i = 0; i < childs.length; i++) {
        var child = childs[i];
        if (child.$options.componentName === "YuXtable" && child.remoteData) {
          _this.relatedTableRef = child;
          return;
        } else {
          _this.recursionChild(child.$children);
        }
      }
    },
    // 重置
    resetFn: function () {
      var _this = this;
      this.resetFields();
      this.queryFieldArr = [];
      this.queryField = "";
      //this.searchModel = {};
      //this.searchQueryField = '';
      this.relatedTableRef = this.$parent.$refs[this.relatedTableName];
      if (!this.$parent.$refs[this.relatedTableName]) {
        this.recursionChild(this.$parent.$children);
      }
      this.relatedTableRef && this.relatedTableRef.$refs.table.clearSort();
      this.$nextTick(function () {
        _this.reset && _this.reset();
      });
    },
    getStyle: function () {
      var className = "";
      if (this.labelPosition) {
        className += " el-form--label-" + this.labelPosition;
      }
      if (this.inline) {
        className += " el-form--inline";
      }
      return className;
    },
    objectAssign: function (target) {
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
    resetFields: function () {
      if (!this.model) {
        console.warn("[Element Warn][Form]model is required for resetFields to work.");
        return;
      }
      this.fields.forEach(function (field) {
        field.resetField();
      });
    },
    clearValidate: function (props) {
      props = props || [];
      var fields = props.length
        ? typeof props === "string"
          ? this.fields.filter(function (field) {
              return props === field.name;
            })
          : this.fields.filter(function (field) {
              return props.indexOf(field.name) > -1;
            })
        : this.fields;
      fields.forEach(function (field) {
        field.clearValidate();
      });
    },
    validate: function (callback) {
      var _this = this;
      if (!this.model) {
        console.warn("[Element Warn][Form]model is required for validate to work!");
        return;
      }

      var promise;
      // if no callback, return promise
      if (typeof callback !== "function" && window.Promise) {
        promise = new window.Promise(function (resolve, reject) {
          callback = function (valid) {
            valid ? resolve(valid) : reject(valid);
          };
        });
      }

      var valid = true;
      var count = 0;
      // 如果需要验证的fields为空，调用验证时立刻返回callback
      if (this.fields.length === 0 && callback) {
        callback(true);
      }
      var invalidFields = {};
      this.fields.forEach(function (field) {
        field.validate("", function (message, field) {
          if (message) {
            valid = false;
          }
          invalidFields = _this.objectAssign({}, invalidFields, field);
          if (typeof callback === "function" && ++count === _this.fields.length) {
            callback(valid, invalidFields);
          }
        });
      });

      if (promise) {
        return promise;
      }
    },
    validateField: function (props, cb) {
      props = [].concat(props);
      var fields = this.fields.filter(function (field) {
        return props.indexOf(field.name) !== -1;
      });
      if (!fields.length) {
        console.warn("[Element Warn]please pass correct props!");
        return;
      }

      fields.forEach(function (field) {
        field.validate("", cb);
      });
    },
    getLabelWidthIndex: function (width) {
      var index = this.potentialLabelWidthArr.indexOf(width);
      // it's impossible
      if (index === -1) {
        throw new Error("[ElementForm]unpected width ", width);
      }
      return index;
    },
    registerLabelWidth: function (val, oldVal) {
      if (val && oldVal) {
        var index = this.getLabelWidthIndex(oldVal);
        this.potentialLabelWidthArr.splice(index, 1, val);
      } else if (val) {
        this.potentialLabelWidthArr.push(val);
      }
    },
    deregisterLabelWidth: function (val) {
      var index = this.getLabelWidthIndex(val);
      this.potentialLabelWidthArr.splice(index, 1);
    },
  },
};
</script>
<style lang="scss">
.yu-xform {
  position: relative;
  background: #fff;
}
.yu-xform.expand {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
}
.yu-xform .yu-xform-content {
  width: 100%;
}
.yu-xform .yu-xform-content--search {
  width: calc(100% - 200px);
}
.yu-xform .yu-xform-content--details {
  width: 100%;
}
.yu-xform .yu-xform-content--expand {
  width: calc(100% - 225px);
}
.yu-xform .yu-xform-btns {
  text-align: center;
  position: absolute;
  right: 16px;
  bottom: 16px;
}
.yu-xform .icon-btn {
  font-weight: bold;
  font-size: 15px;
  position: relative;
  top: 1px;
}
.yu-xform .arrow-down {
  position: relative;
  top: 15px;
  margin-left: 8px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  // border-top: 8px solid $blue;
  border-radius: 2px;
}
.yu-xform .arrow-up {
  position: relative;
  bottom: 13px;
  margin-left: 8px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  // border-bottom: 8px solid $blue;
  border-radius: 2px;
}
// form表单表格化
.yu-xform-table {
  margin-bottom: 15px;
  position: relative;
}
.yu-xform-table::before {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 1px;
  background: #e1e1e1;
}
.yu-xform-table::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 1px;
  height: 100%;
  background: #e1e1e1;
}
.yu-xform-table .el-input.is-disabled .el-input__inner {
  background-color: #fff;
  border: none;
}
.yu-xform-table .el-form-item {
  margin-bottom: 0px;
  background: #e4f2f6;
}
.yu-xform-table .el-form-item__content {
  border-left: 1px solid #e1e1e1;
  background: #fff;
}
.yu-xform-table .el-form-item__label {
  padding-left: 10px !important;
  background-color: #e4f2f6;
}
.yu-xform-table .el-col {
  border-bottom: 1px solid #e1e1e1;
  border-right: 1px solid #e1e1e1;
}
.yu-xform-table .el-input.is-disabled .el-input__inner {
  color: #666;
}
.yu-xform-table .el-textarea.is-disabled .el-textarea__inner {
  background-color: #fff;
  color: #666;
  resize: none;
  border: none;
  overflow: hidden;
}
.yu-xform__arrow {
  cursor: pointer;
  position: absolute;
  top: -20px;
  left: 50%;
  z-index: 999;
  transform: translateX(-50%);
  width: 51px;
  height: 51px;
  background: url("../../../assets/images/common/arrow-bg.png") no-repeat center / 100% 100%;
  text-align: center;
  img {
    margin-top: 23px;
  }
}

.yu-xform.search .el-select__tags {
  flex-wrap: nowrap !important;
  overflow: hidden;
  & > span {
    display: flex;
    flex-wrap: nowrap;
  }
}
@media screen and (max-width: 1680px) {
  .yu-xform .yu-xform-btns {
    bottom: 12px;
    right: 12px;
  }
}
</style>
