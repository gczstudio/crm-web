<template>
  <div class="addPageComp-container">
    <div class="header">
      <div class="yu-button-group">
        <!-- <el-button class="yu-button-text" icon="iconfont icon-37yulan"><i></i>预览</el-button> -->
        <el-button class="yu-button-text" icon="iconfont icon-baocun" @click="saveFn">保存</el-button>
        <el-button class="yu-button-text" icon="iconfont icon-fabu" @click="publishFn">发布</el-button>
        <el-button class="yu-button-text" icon="iconfont icon-fanhui1" @click="backFn">返回</el-button>
      </div>
    </div>
    <div class="content">
      <div :class="{ 'left-box': true, 'hide-left-panel': !showLeftPanel }">
        <div class="left-panel-arrow" @click="toggleLeftPanel"><i :class="`el-icon-caret-${showLeftPanel ? 'left' : 'right'}`"></i></div>
        <el-row>
          <el-col :span="5">
            <div class="sider-tab">
              <div :class="{ 'tab-item': true, active: item.key === curTab }" v-for="item in siderTabs" :key="item.key" @click="tabClickFn(item.key)">
                <i :class="`iconfont icon-${item.icon}`"></i>
                <p>{{ item.name }}</p>
              </div>
            </div>
          </el-col>
          <el-col :span="19" v-show="showLeftPanel">
            <LayoutList v-show="curTab == 'layout'" @select-layout="selectLayoutFn" />
            <CompList v-show="curTab == 'comp'" />
          </el-col>
        </el-row>
      </div>
      <div class="center-box">
        <RenderTool :data="pageConfig" />
      </div>
      <div v-if="activeEditorId" :class="{ 'right-box': true, 'hide-right-panel': !showRightPanel }">
        <div v-if="hasSideConfig" class="right-panel-arrow" @click="toggleRightPanel"><i :class="`el-icon-caret-${showRightPanel ? 'right' : 'left'}`"></i></div>
        <SideConfig v-show="showRightPanel" />
      </div>
    </div>
    <!-- 保存组件 -->
    <yu-dialog title="提交" :visible.sync="addPageVisible" width="400px">
      <yu-xform ref="compFormRef" :model="pageForm" label-width="80px">
        <yu-xform-group :column="1">
          <yu-xform-item label="页面名称" placeholder="名称" name="pageName" ctype="input" :rules="globalRules.requiredInput50"></yu-xform-item>
          <yu-xform-item label="页面类型" placeholder="类型" name="pageType" ctype="select" data-code="LC_PAGE_MODE_TYPE" :rules="globalRules.requiredInput50"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button type="primary" @click="savePageFn">保存</el-button>
        <el-button @click="addPageVisible = false">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Watch, InjectReactive } from "vue-property-decorator";
import { backend } from "@/config";
import { getUserInfo } from "@/utils";
import LayoutList from "../layoutList/index.vue";
import CompList from "../compList/index.vue";
import RenderTool from "../renderTool/index.vue";
import SideConfig from "../sideConfig/index.vue";
import { ILayoutListItem } from "../../layoutMgt/index.vue";
import { IMode, mode } from "../../layoutMgt/edit/index.vue";
import { LowCodeModule } from "@/store/modules/lowCode";
import { savePage, deletePage } from "@/api/lowCode";

export interface IPageItem {
  id: string;
  pageName: string;
  pageType: string;
  pageSts: string;
  pageConfig: string;
  catalogId?: string;
}

@Component({
  name: "AddPageComp",
  components: {
    LayoutList,
    CompList,
    RenderTool,
    SideConfig,
  },
})
export default class extends Vue {
  @Prop() private instance!: any;
  @Prop() private data!: any;
  private curTab = "layout";
  private siderTabs = [
    { key: "layout", name: "布局", icon: "buju" },
    { key: "comp", name: "组件", icon: "zujian" },
    // { key: 'code', name: '代码', icon: 'daimashili' },
  ];

  // private pageConfig = {
  //   type: "page",
  //   title: "页面名称",
  //   body: [],
  // };

  private showLeftPanel = true;

  // 保存组件
  private addPageVisible = false;
  private pageForm = {};
  private submitType = "save";

  get activeEditorId() {
    return LowCodeModule.activeEditorId;
  }

  get showRightPanel() {
    return LowCodeModule.showRightPanel;
  }

  get pageConfig(): any {
    return LowCodeModule.pageConfig;
  }

  get hasSideConfig() {
    return LowCodeModule.hasSideConfig;
  }

  @Watch("showRightPanel")
  onShowRightPanelChange() {
    this.updateActiveWidgetsWidth();
  }

  created() {
    this.pageForm = { ...this.data };
  }

  tabClickFn(key: string) {
    this.curTab = key;
    this.showLeftPanel = true;
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

  toggleLeftPanel() {
    this.showLeftPanel = !this.showLeftPanel;
    this.updateActiveWidgetsWidth();
  }

  toggleRightPanel() {
    LowCodeModule.SET_SHOW_RIGHT_PANEL(!this.showRightPanel);
  }

  updateActiveWidgetsWidth() {
    // 执行动画效果有300ms
    let activeDom = document.querySelector(`div[data-editor-id="${this.activeEditorId}"]`) as HTMLElement;
    let activeWidgetsDom = document.querySelector(".editor-hlbox.selected") as HTMLElement;
    activeWidgetsDom.style.display = "none";
    setTimeout(() => {
      if (activeWidgetsDom) {
        activeWidgetsDom.style.display = "block";
        activeWidgetsDom.style.width = activeDom.clientWidth + "px";
        activeWidgetsDom.style.height = activeDom.clientHeight + "px";
      }
    }, 400);
  }

  // 保存
  saveFn() {
    this.submitType = "save";
    this.addPageVisible = true;
  }

  savePageFn() {
    const { pageName, pageType, pageSts, catalogId } = this.pageForm as IPageItem;
    let params = {
      catalogId,
      pageName,
      pageType,
      pageSts: this.submitType === "save" ? "0" : "1",
      pageConfig: JSON.stringify(this.pageConfig),
    };
    savePage(params).then((res) => {
      this.$message.success("保存成功");
      this.backFn();
      LowCodeModule.CLEAR_PAGE_CONFIG();
    });
  }

  // 发布
  publishFn() {
    this.submitType = "publish";
    this.addPageVisible = true;
    LowCodeModule.CLEAR_PAGE_CONFIG();
  }

  // 返回
  backFn() {
    this.instance.hide();
    LowCodeModule.CLEAR_PAGE_CONFIG();
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
    display: flex;
    .left-box {
      position: relative;
      flex: 0 0 300px;
      height: 100%;
      box-shadow: 0 6px 6px 2px rgba(0, 0, 0, 0.15);
      transition: all 0.3s;
      &.hide-left-panel {
        flex: 0 0 60px;
      }
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
      flex: 1;
      width: 500px;
      background: #f2f2f4;
    }
    .right-box {
      position: relative;
      flex: 0 0 350px;
      height: 100%;
      border-left: 1px solid #e6e6e8;
      box-shadow: 0 6px 6px 2px rgba(0, 0, 0, 0.15);
      transition: all 0.3s;
      &.hide-right-panel {
        flex: 0 0 0;
      }
    }
    .left-panel-arrow {
      cursor: pointer;
      position: absolute;
      width: 14px;
      height: 50px;
      background: #fff;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-left: 0;
      border-radius: 0 10px 10px 0;
      top: 50%;
      right: -14px;
      z-index: 9;
      transform: translateY(-50%);
      box-shadow: 2px 0px 6px rgba(0, 0, 0, 0.15);
      i {
        line-height: 50px;
        color: #a1a6b3;
      }
    }
    .right-panel-arrow {
      cursor: pointer;
      position: absolute;
      top: 50%;
      left: -14px;
      z-index: 9;
      transform: translateY(-50%);
      width: 14px;
      height: 50px;
      background: #fff;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 10px 0 0 10px;
      border-right: 0;
      box-shadow: -2px 0px 6px rgba(0, 0, 0, 0.15);
      i {
        line-height: 50px;
        color: #a1a6b3;
      }
    }
  }
}
</style>
