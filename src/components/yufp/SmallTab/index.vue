<template>
  <div v-if="data.length" :class="'yufp-small-tab ' + type">
    <ol class="clearfix">
      <li v-for="(item, index) in data" :key="index" :class="{active: curTab === index}" @click="clickHandler(index)">{{item}}</li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'SmallTab',
  props: {
    type: {
      type: String, // dashboard card top
      default: 'dashboard'
    },
    data: {
      type: Array,
      default: function () {
        return [];
      }
    },
    value: {
      type: Number,
      default: 0
    }
  },
  data: function () {
    return {
      curTab: 0,
      tableData: [],
      loading: true
    };
  },
  watch: {
    value: function (val) {
      this.curTab = val;
    }
  },
  created: function () {
    this.curTab = this.value;
  },
  methods: {
    clickHandler: function (index) {
      this.curTab = index;
      this.$emit('input', index);
      this.$emit('change', index);
    }
  }
}
</script>

<style lang="scss" scoped>
.yufp-small-tab { font-size: 12px; }
.yufp-small-tab { display: inline-block; vertical-align: middle;}
.yufp-small-tab ol {margin: 0; padding: 0;}
.yufp-small-tab ol li { position: relative; margin: 0 8px; float: left; color: #999; height: 24px; line-height: 24px; cursor: pointer; transition: color .3s;  }
.yufp-small-tab ol li:nth-child(1){ margin-left: 0;}
.yufp-small-tab ol li:nth-child(1)::before{display: none;}
.yufp-small-tab ol li::before{content:'';position: absolute; top: 6px; left: -8px;width: 1px; height: 12px; background: #E8E8E8;}
.yufp-small-tab ol li.active, .yufp-small-tab ol li:hover{ /*color: $blue;*/}

.yufp-small-tab.card ol { padding: 0;}
.yufp-small-tab.card ol li { margin: 0 8px; position: relative; float: left; color: #999; height: 24px; line-height: 24px; padding: 0 4px; border-radius: 2px; cursor: pointer;  }
.yufp-small-tab.card ol li:nth-child(1){ margin-left: 0;}
.yufp-small-tab.card ol li:nth-child(1)::before{display: none;}
.yufp-small-tab.card ol li::before{content:'';position: absolute; top: 6px; left: -8px;width: 1px; height: 12px; background: #E8E8E8;}
.yufp-small-tab.card ol li.active{background: #FB4747; color: #fff;}

.yufp-small-tab.top ol {border-radius: 2px; /*border: 1px solid $blue;*/ box-shadow: 0px 3px 8px rgba(1, 101, 203, .2); }
.yufp-small-tab.top ol li {  margin: 0; position: relative; float: left; padding: 0 10px; /*color: $blue;*/ height: 24px; line-height: 24px; font-size: 14px; cursor: pointer;  }
.yufp-small-tab.top ol li+li { /*border-left: 1px solid $blue;*/ }
.yufp-small-tab.top ol li::before{display: none;}
.yufp-small-tab.top ol li.active{ color: #fff; /*background: $blue;*/}

@media screen and (max-width: 1680px) {
  .yufp-small-tab.top ol li {  padding: 0 6px; height: 20px; line-height: 20px; font-size: 12px;}
}


</style>
