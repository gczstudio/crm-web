<template>
  <div :class="tabsClass">
    <div :class="tabsBarWrapper">
      <div :class="titleClass" v-if="title">{{title}}</div>
      <div :class="tabsBarClass">
        <ul class="clearfix">
          <li class="yufp-self-tabs-li" v-for="(item) in navList" :key="item.name" :class="getActiveClass(item)" @click="handleChange(item)">{{item.label}}</li>
        </ul>
      </div>
    </div>
    <div class="yufp-self-tabs-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomTabs',
  props: {
    value: [String, Number],
    type: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'left'
    },
    title: String
  },
  data: function () {
    return {
      currentValue: this.value,
      navList: []
    };
  },
  computed: {
    tabsBarWrapper: function () {
      return 'clearfix yufp-self-tabs-wrapper' + (this.type ? '-' + this.type : '');
    },
    tabsClass: function () {
      return 'yufp-self-tabs' + (this.type ? '-' + this.type : '');
    },
    titleClass: function () {
      return 'yufp-self-tabs-title' + (this.type ? '-' + this.type : '');
    },
    tabsBarClass: function () {
      if (this.position === 'right') {
        return 'fr yufp-self-tabs-bar' + (this.type ? '-' + this.type : '');
      }
      return 'yufp-self-tabs-bar' + (this.type ? '-' + this.type : '');
    },
    tabsTitleClas: function () {
      return this.position === 'right' ? 'yufp-self-tabs-title fl' : 'yufp-self-tabs-title fr';
    }
  },
  mounted: function () {
    this.updateNav();
    this.updataStatus();
  },
  watch: {
    value: function (val) {
      this.currentValue = val;
    },
    currentValue: function () {
      this.updataStatus();
    }
  },
  methods: {
    handleChange: function (data) {
      var _this = this;
      var name = data.name;
      this.currentValue = name;
      this.$emit('input', name);
      // 下一次的时候再执行tab-click，否则yufp.router.to会报$el undefined
      _this.$nextTick(function () {
        _this.$emit('tab-click', name);
      });
    },
    getActiveClass: function (data) {
      return this.currentValue === data.name ? 'active' : '';
    },
    getTabs: function () {
      var panes = [];
      this.$children.map(function (item) {
        if (item.$options._componentTag === 'custom-tab-pane') {
          panes.push(item);
        };
      });
      return panes;
    },
    updateNav: function () {
      var _this = this;
      this.getTabs().forEach(function (pane, index) {
        pane.name = pane.name || index;
        _this.navList.push({
          label: pane.label,
          name: pane.name
        });
        if (index === 0 && !_this.currentValue) {
          _this.currentValue = pane.name;
        }
      });
    },
    updataStatus: function () {
      var _this = this;
      this.getTabs().forEach(function (tab) {
        tab.show = _this.currentValue === tab.name;
      });
    }
  }
}
</script>
<style lang="scss">
  .yufp-self-tabs .yufp-self-tabs-li{float: left;font-size: 14px;line-height: 14px;padding: 7px 12px;cursor: pointer;}
  .yufp-self-tabs-title{font-size: 16px;font-weight: bold;line-height: 29px;}
  .yufp-self-tabs .yufp-self-tabs-bar .yufp-self-tabs-li {position: relative}
  .yufp-self-tabs .yufp-self-tabs-bar .yufp-self-tabs-li.active {
    // color: $blue;
    font-weight: bold;
  }
  .yufp-self-tabs .yufp-self-tabs-bar .yufp-self-tabs-li.active::before, .yufp-self-tabs .yufp-self-tabs-bar .yufp-self-tabs-li.active::after{width: calc(50% - 12px);}
  .yufp-self-tabs .yufp-self-tabs-bar .yufp-self-tabs-li:hover::before, .yufp-self-tabs .yufp-self-tabs-bar .yufp-self-tabs-li:hover::after{width: calc(50% - 12px);}
  .yufp-self-tabs .yufp-self-tabs-bar .yufp-self-tabs-li::before {display: inline-block;content: "";position: absolute;bottom: -5px;left: 50%;width: 0;height: 2px;/*background: $blue;*/transition: all .3s;}
  .yufp-self-tabs .yufp-self-tabs-bar .yufp-self-tabs-li::after {display: inline-block;content: "";position: absolute;bottom: -5px;right: 50%;width: 0;height: 2px;/*background: $blue;*/transition: all .3s;}
  .yufp-self-tabs-card .yufp-self-tabs-li{float: left;font-size: 14px;line-height: 14px;padding: 7px 15px;cursor: pointer;}
  .yufp-self-tabs-card .yufp-self-tabs-wrapper { padding: 10px 0;}
  .yufp-self-tabs-card .yufp-self-tabs-bar-card .yufp-self-tabs-li {font-size: 14px;}
  .yufp-self-tabs-card .yufp-self-tabs-bar-card .yufp-self-tabs-li.active {background: #fff;color: #D80C18;border: 0;}
  .yufp-self-tabs-border-card {font-size: 14px;}
  .yufp-self-tabs-border-card .yufp-self-tabs-wrapper-border-card {padding: 5px 0;background: #fff;border-bottom: 1px solid #f0f0f0;}
  .yufp-self-tabs-title-border-card {float: left;font-size: 16px;font-weight: bold;margin-left: 24px;margin-top: 10px;}
  .yufp-self-tabs-border-card .yufp-self-tabs-bar-border-card .yufp-self-tabs-li {float: left;cursor: pointer;font-weight: bold;color: #333333;position: relative;padding: 10px 30px;border-left: 1px solid #d5d5d5;}
  .yufp-self-tabs-border-card .yufp-self-tabs-bar-border-card .yufp-self-tabs-li:nth-child(1) {border-left: 0;}
  .yufp-self-tabs-border-card .yufp-self-tabs-bar-border-card .yufp-self-tabs-li.active {color: #D80C18;}
  .yufp-self-tabs-border-card .yufp-self-tabs-bar-border-card .yufp-self-tabs-li.active::before {content: '';position: absolute;bottom: -5px;left: 50%;transform: translateX(-50%);width: 40px;height: 3px;background: #D80C18;}
  .yufp-self-tabs .yufp-self-tab-pane{padding-top: 10px;}
</style>
