<template>
  <div class="addPageComp-container">
    <div class="header">
      <div class="yu-button-group">
        <el-button class="yu-button-text" icon="iconfont icon-37yulan"><i></i>预览</el-button>
        <el-button class="yu-button-text" icon="iconfont icon-baocun">保存</el-button>
        <el-button class="yu-button-text" icon="iconfont icon-fabu">发布</el-button>
        <el-button class="yu-button-text" icon="iconfont icon-fanhui1" @click="instance.hide()">返回</el-button>
      </div>
    </div>
    <div class="content">
      <div class="left-box">
        <el-row>
          <el-col :span="5">
            <div class="sider-tab">
              <div :class="{ 'tab-item': true, active: item.key === curTab }" v-for="item in siderTabs" :key="item.key" @click="tabClickFn(item.key)">
                <i :class="`iconfont icon-${item.icon}`"></i>
                <p>{{ item.name }}</p>
              </div>
            </div>
          </el-col>
          <el-col :span="19">
            <LayoutList v-show="curTab == 'layout'" @select-layout="selectLayoutFn" />
            <CompList v-show="curTab == 'comp'" />
          </el-col>
        </el-row>
      </div>
      <div class="center-box">
        <RenderTool />
      </div>
      <div class="right-box"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import { backend } from "@/config";
import { getUserInfo } from "@/utils";
import LayoutList from "../layoutList/index.vue";
import CompList from "../compList/index.vue";
import RenderTool from "../renderTool/index.vue";
import { ILayoutListItem } from "../../layoutMgt/index.vue";
import { IMode, mode } from "../../layoutMgt/edit/index.vue";
import { LowCodeModule } from "@/store/modules/lowCode";
@Component({
  name: "AddPageComp",
  components: {
    LayoutList,
    CompList,
    RenderTool,
  },
})
export default class extends Vue {
  @Prop() private instance!: any;
  private curTab = "layout";
  private siderTabs = [
    { key: "layout", name: "布局", icon: "buju" },
    { key: "comp", name: "组件", icon: "zujian" },
    // { key: 'code', name: '代码', icon: 'daimashili' },
  ];

  private pageConfig = {
    type: "page",
    title: "页面名称",
    body: [],
  };

  // let data = {
  //   type: 'page',
  //   title: '页面名称',
  //   body: [
  //     {
  //       type: 'fixed-layout',
  // layout;
  //       title: '布局名称',
  //       body: [
  //         {
  //           row: 1,
  //           col: 1,
  //           type: 'chart',
  //           chartId: '11111',
  //         }
  //       ]
  //     }
  //   ]
  // }

  tabClickFn(key: string) {
    this.curTab = key;
  }

  // 选择布局
  selectLayoutFn(layout: { type: string; name: string; data: ILayoutListItem }) {
    const { type, name, data } = layout;
    // 布局格式转换
    let bodyConfig: any = [];
    bodyConfig[0] = {
      layout: type,
      title: name,
      body: [],
    };
    if (layout.type === "fixed") {
      bodyConfig[0].body = data.layoutConfig.split(",").map((item: string) => {
        let curMode = mode.find((ele: IMode) => ele.type === item) as IMode;
        return {
          row: curMode.row,
          col: curMode.col,
        };
      });
    }
    this.pageConfig.body = bodyConfig;
    LowCodeModule.SET_PAGE_CONFIG(this.pageConfig);
  }
}
</script>

<style lang="scss" scoped>
.addPageComp-container {
  position: relative;
  height: calc(100vh - 100px);
  background: #ffffff;
  .header {
    padding-top: 10px;
    height: 36px;
    border-bottom: 1px solid #e6e6e8;
    text-align: right;
  }
  .content {
    height: calc(100% - 36px);
    display: grid;
    // grid-template-columns: 314px auto 300px;
    grid-template-columns: 314px auto 0;
    grid-template-rows: 100%;
    .left-box {
      width: 314px;
      height: 100%;
      & > .el-row {
        height: 100%;
        & > .el-col {
          height: 100%;
        }
      }
      .sider-tab {
        height: 100%;
        width: 60px;
        border-right: 1px solid #e6e6e8;
        padding-top: 20px;
        .tab-item {
          cursor: pointer;
          text-align: center;
          margin-bottom: 20px;
          .iconfont {
            font-size: 20px;
            color: #666;
            font-weight: bold;
          }
          p {
            margin-top: 6px;
            color: #999;
          }
          &.active {
            .iconfont {
              color: #007eff;
            }
            p {
              color: #007eff;
            }
          }
        }
      }
    }
    .center-box {
      height: 100%;
      background: #f2f2f4;
    }
    .right-box {
      // width: 300px;
      width: 0;
      height: 100%;
    }
  }
}
</style>
