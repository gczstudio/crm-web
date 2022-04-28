<template>
  <div class="FixedRightTool-component">
    <div class="tool-box">
      <div class="tool-item" v-for="item in tools" :key="item.name" @click="goToolFn(item)">
        <i :class="['iconfont', `icon-${item.icon}`]"></i>
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { baseUrl } from "@/config";
export default {
  name: "FixedRightTool",
  data() {
    return {
      tools: [
        // {
        //   name: '我要留意',
        //   icon: 'liuyan',
        //   url: '/',
        //   type: 'route'
        // },
        {
          name: "操作手册",
          icon: "caozuoshouce",
          url: "",
          type: "url",
        },
      ],
    };
  },
  methods: {
    goToolFn(item) {
      if (item.type === "url") {
        window.open(item.url);
      } else {
        this.$router.push(item.url);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.FixedRightTool-component {
  position: fixed;
  z-index: 2010;
  right: 0;
  top: 104px;
  .tool-box {
    width: 40px;
    .tool-item {
      margin-top: 4px;
      cursor: pointer;
      color: #fff;
      width: 112px;
      height: 40px;
      position: relative;
      right: 0px;
      padding: 11px 13px;
      background: #f47a28;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      transition: all 0.5s;
      overflow: hidden;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
      &:hover {
        right: 70px;
        // background: #F47A28;
        .iconfont {
          color: #fff;
        }
      }
      .iconfont {
        color: #fff;
        display: inline-block;
        font-size: 16px;
        vertical-align: middle;
      }
      span {
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        font-weight: bold;
        margin-left: 10px;
      }
    }
  }
}

@media screen and (max-width: 1680px) {
  .FixedRightTool-component {
    top: 86px;
  }
}
</style>
