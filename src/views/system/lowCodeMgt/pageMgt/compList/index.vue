<template>
  <div class="compList-container">
    <div class="comp-search">
      <yu-xform-item-part placeholder="请输入组件名称" ctype="input" suffix-icon="el-icon-search"></yu-xform-item-part>
    </div>
    <div class="comp-box">
      <el-collapse v-model="activeNames">
        <el-collapse-item v-for="item in compList" :key="item.type" :title="item.name" :name="item.type">
          <div class="section">
            <div :class="['section-item', child.type === active ? 'active' : '']" v-for="child in item.children" :key="child.type" @click="clickFn(child)">
              <div><i :class="['iconfont', 'icon-' + child.icon]"></i></div>
              <p>{{ child.name }}</p>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <SelectChartDialog :visible.sync="selectChartVisible" @sure="selectChartFn" />
    <SelectCardDialog :visible.sync="selectCardVisible" @sure="selectCardFn" />
    <CurdDialog :visible.sync="selectCurdVisible" @sure="selectCurdFn" />
    <FormDialog :visible.sync="selectFormVisible" @sure="selectFormFn" />
    <TableDialog :visible.sync="selectTableVisible" @sure="selectTableFn" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import request from "@/utils/request";
import { backend } from "@/config";
import SelectChartDialog from "@/components/Dialogs/SelectChartDialog.vue";
import SelectCardDialog from "@/components/Dialogs/SelectCardDialog.vue";
import CurdDialog from "@/components/Dialogs/CurdDialog.vue";
import FormDialog from "@/components/Dialogs/FormDialog.vue";
import TableDialog from "@/components/Dialogs/TableDialog.vue";
import { LowCodeModule } from "@/store/modules/lowCode";
import { appendToPageById } from "@/utils/lowCode";

export interface IChartItem {
  id: string;
  modName: string;
  modType: string;
  modSts: string;
  modConfig: string;
}

export interface ICompItem {
  type: string;
  name: string;
  icon: string;
}

@Component({
  name: "CompList",
  components: {
    SelectChartDialog,
    SelectCardDialog,
    CurdDialog,
    FormDialog,
    TableDialog,
  },
})
export default class extends Vue {
  activeNames = ["1", "2", "3", "4"];
  active = "";
  compList = [
    {
      type: "1",
      name: "功能",
      children: [
        { type: "curd", name: "增删改查", icon: "biaodanzujian-biaoge" },
        { type: "form", name: "表单", icon: "m-biaodan" },
        { type: "table", name: "表格", icon: "biaoge" },
        { type: "chart", name: "图表", icon: "tubiao1" },
        { type: "card", name: "指标卡", icon: "zhibiaoka" },
        { type: "leftTree", name: "左侧树", icon: "zhibiaoka" },
        { type: "commonSearch", name: "通用搜索", icon: "zhibiaoka" },
      ],
    },
    {
      type: "2",
      name: "容器",
      children: [
        { type: "div", name: "div标签", icon: "xuanxiangqia" },
        { type: "tab", name: "标签页", icon: "xuanxiangqia" },
        { type: "grid", name: "分栏", icon: "fenlan" },
        { type: "dialog", name: "弹出框", icon: "danchuceng" },
      ],
    },
  ];
  selectChartVisible = false;
  selectCurdVisible = false;
  selectFormVisible = false;
  selectTableVisible = false;
  selectCardVisible = false;

  get layout() {
    return LowCodeModule.layout;
  }

  get activeFixedLayoutItem() {
    return LowCodeModule.activeFixedLayoutItem;
  }

  get pageConfig() {
    return LowCodeModule.pageConfig;
  }

  get dataId() {
    return (LowCodeModule.widgetsMap as any)[LowCodeModule.activeEditorId]?.dataId;
  }

  clickFn(item: ICompItem) {
    this.active = item.type;
    switch (item.type) {
      case "chart":
        this.selectChartVisible = true;
        break;
      case "card":
        this.selectCardVisible = true;
        break;
      case "curd":
        this.selectCurdVisible = true;
        break;
      case "table":
        this.selectTableVisible = true;
        break;
      case "dialog":
        this.setDialogFn();
        break;
      case "form":
        this.selectFormVisible = true;
        break;
      case "grid":
        this.setGridFn();
        break;
      case "leftTree":
        this.setLeftTreeFn();
        break;
      case "commonSearch":
        this.setCommonSearchFn();
        break;
      case "tab":
        this.setTabFn();
        break;
      case "div":
        this.setDivFn();
        break;
    }
  }

  // 获取配置属性
  async getTableConfig(componentName: string) {
    let res = await request({
      url: backend.comptMgrService + "/api/sysmodule/list",
      method: "get",
      params: {
        condition: JSON.stringify({
          modRegName: componentName,
        }),
      },
    });
    let propRes = await request({
      url: backend.comptMgrService + "/api/sysmodule/property/list",
      method: "get",
      params: {
        condition: JSON.stringify({
          moduleId: res.data[0]?.id,
        }),
      },
    });
    let result: Record<string, unknown> = {};
    propRes.data.map((item: any) => {
      if (item.valDefault === "true") {
        item.valDefault = true;
      }
      if (item.valDefault === "false") {
        item.valDefault = false;
      }
      result[item.proId] = item.valDefault;
    });
    return result;
  }

  // 选择某个图表
  selectChartFn(chart: IChartItem) {
    let curLayoutItem = (this.pageConfig.body[0] as any).body[this.activeFixedLayoutItem];
    curLayoutItem = {
      ...curLayoutItem,
      ...chart,
      type: "chart",
      id: this.$util.guid(),
    };
    if (this.layout === "fixed") {
      (this.pageConfig.body[0] as any).body[this.activeFixedLayoutItem] = curLayoutItem;
      LowCodeModule.SET_PAGE_CONFIG({ ...this.pageConfig });
    } else {
      appendToPageById(this.dataId, curLayoutItem);
    }
  }

  // 选择某个卡片
  selectCardFn(card: IChartItem) {
    let curLayoutItem = (this.pageConfig.body[0] as any).body[this.activeFixedLayoutItem];
    curLayoutItem = {
      ...curLayoutItem,
      ...card,
      type: "card",
      id: this.$util.guid(),
    };
    if (this.layout === "fixed") {
      (this.pageConfig.body[0] as any).body[this.activeFixedLayoutItem] = curLayoutItem;
      LowCodeModule.SET_PAGE_CONFIG({ ...this.pageConfig });
    } else {
      appendToPageById(this.dataId, curLayoutItem);
    }
  }

  //选择增删改查配置
  selectCurdFn(result: any) {
    appendToPageById(this.dataId, {
      id: this.$util.guid(),
      type: "curd",
      ...result,
    });
  }

  // 选择弹出框
  setDialogFn() {
    (this.pageConfig.body[0] as any).body = [
      {
        id: this.$util.guid(),
        type: "dialog",
        body: [],
      },
    ];
    LowCodeModule.SET_PAGE_CONFIG({ ...this.pageConfig });
  }

  // 选择表单配置
  selectFormFn(result: any) {
    appendToPageById(this.dataId, {
      id: this.$util.guid(),
      type: "form",
      items: result,
    });
  }

  // 选择table
  async selectTableFn(result: any) {
    let propData = await this.getTableConfig("yu-xtable");
    appendToPageById(this.dataId, {
      id: this.$util.guid(),
      ...propData,
      ...result,
      type: "table",
      tableType: "table",
    });
  }

  // 选择分栏
  setGridFn() {
    appendToPageById(this.dataId, {
      id: this.$util.guid(),
      type: "grid",
      gutter: 16,
      body: [
        {
          type: "col",
          id: this.$util.guid(),
          span: 12,
          body: [],
        },
        {
          type: "col",
          id: this.$util.guid(),
          span: 12,
          body: [],
        },
      ],
    });
  }

  // 选择左侧机构树
  setLeftTreeFn() {
    appendToPageById(this.dataId, {
      id: this.$util.guid(),
      type: "left-tree",
    });
  }

  // 选择通用搜索
  setCommonSearchFn() {
    appendToPageById(this.dataId, {
      id: this.$util.guid(),
      type: "common-search",
    });
  }

  // 选择选项卡
  setTabFn() {
    appendToPageById(this.dataId, {
      id: this.$util.guid(),
      type: "tab",
      tabType: "normal",
      body: [
        {
          id: this.$util.guid(),
          label: "选项卡1",
          name: "tab1",
          sortFields: [],
          body: [],
        },
        {
          id: this.$util.guid(),
          label: "选项卡2",
          name: "tab2",
          sortFields: [],
          body: [],
        },
      ],
    });
  }

  // 选择div标签
  setDivFn() {
    appendToPageById(this.dataId, {
      id: this.$util.guid(),
      type: "div",
      styles: "",
      body: [],
    });
  }
}
</script>

<style lang="scss" scoped>
.compList-container {
  border-right: 1px solid #e6e6e8;
  height: 100%;
  .comp-search {
    padding: 10px;
  }
  .comp-box {
    height: calc(100% - 48px);
    overflow-y: auto;
    padding: 0 10px;
    ::v-deep.el-collapse {
      .el-collapse-item__wrap {
        border: none;
      }
      .el-collapse-item__arrow {
        font-size: 16px;
      }
    }

    .section {
      .section-item {
        float: left;
        cursor: pointer;
        width: calc(50% - 10px);
        &:nth-child(2n) {
          margin-left: 10px;
        }
        text-align: center;
        & > div {
          position: relative;
          height: 80px;
          border: 1px solid #ccc;
          border-radius: 2px;
          transition: color 0.3s;
        }
        .iconfont {
          color: #bbb;
          font-size: 40px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: color 0.3s;
        }
        p {
          margin: 5px 0 10px;
          transition: color 0.3s;
        }
        &:hover,
        &.active {
          & > div {
            border-color: #007eff;
          }
          .iconfont,
          p {
            color: #007eff;
          }
        }
      }
    }
  }
}
</style>
