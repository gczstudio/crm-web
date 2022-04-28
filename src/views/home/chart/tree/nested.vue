<template>
  <draggable class="tree-node" tag="ul" :list="treeData" :options="opionts" :group="groupName" animation="300" @start="dragStartFn" @end="dragEndFn">
    <li v-for="(el, index) in treeData" :key="el.chartNm" class="tree-node__wrapper" :data-type="el.chartBCgory">
      <template v-if="(el.checked || el.checked === undefined) && !el.selected">
        <template v-if="el.chartLevel !== '3'">
          <div class="tree-node__content forbid" @click="toggleFn(el, index)">
            <span :class="['tree-node__expand-icon', el.expand ? 'el-icon-caret-bottom' : 'el-icon-caret-right']"></span>
            <span class="tree-node__label"><i v-if="el.chartLevel === '3'" :class="['iconfont', chartTyeps[el.chartBCgory][el.chartSCgroy]]"></i>{{ el.chartNm }}</span>
          </div>
        </template>
        <template v-else>
          <div class="tree-node__content">
            <span class="tree-node__label"><i v-if="el.chartLevel === '3'" :class="['iconfont', chartTyeps[el.chartBCgory][el.chartSCgroy]]"></i>{{ el.chartNm }}</span>
          </div>
        </template>

        <!-- <transition name="fade" mode="out-in"> -->
        <div class="tree-node__children" v-if="el.expand && el.childList && el.childList.length">
          <nested-draggable :data="el.childList" />
        </div>
        <!-- </transition> -->
      </template>
    </li>
  </draggable>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import draggable from "vuedraggable";
import { HomeModule } from "@/store/modules/home";
@Component({
  name: "nested-draggable",
  components: {
    draggable,
  },
})
export default class extends Vue {
  @Prop({
    required: true,
    type: Array,
    default() {
      return [];
    },
  })
  data!: Array<any>;
  private drag = false;
  private treeData: Array<any> = [];
  private groupNames = {
    "1": "card",
    "2": "chart",
    "3": "rank",
  };
  private groupName = "";
  private opionts: any = {
    filter: ".forbid",
  };

  chartTyeps: any = {
    "1": {
      "11": "icon-kapian",
    },
    "2": {
      "21": "icon-zhexian",
      "22": "icon-zhexian",
      "23": "icon-zhexian",
    },
    "3": {
      "31": "icon-zhuzhuang",
      "32": "icon-zhuzhuang",
      "33": "icon-zhuzhuang",
    },
  };

  @Watch("data")
  onChangeValue() {
    this.setTreeData();
  }

  get customTreeData() {
    return HomeModule.customTreeData;
  }

  mounted() {
    this.setTreeData();
  }

  setTreeData() {
    this.treeData = this.data.map((item) => {
      return {
        ...item,
        expand: item.expand === false ? false : true,
      };
    });
  }

  toggleFn(el: any, index: number) {
    let treeData = (this as any)._.cloneDeep(this.customTreeData);
    this.recursion(treeData, el.chartId, !el.expand);
    HomeModule.UPDATE_CUSTOM_TREE_DATA(treeData);
  }

  recursion(data: any[], chartId: string[], bool: boolean) {
    data.forEach((item) => {
      if (item.chartId === chartId) {
        item.expand = bool;
      }
      if (item.childList?.length) {
        this.recursion(item.childList, chartId, bool);
      }
    });
  }

  dragStartFn(e: any) {
    this.drag = true;
    let chartBCgory = e.item.dataset.type;
    if (chartBCgory === "1" && HomeModule.cardData.length === 18) {
      this.$message.warning("指标最多展示18个，请删除后再添加！");
      this.groupName = "";
      return;
    }
    if (chartBCgory === "2" && HomeModule.chartData.length === 12) {
      this.$message.warning("趋势最多展示12个，请删除后再添加！");
      this.groupName = "";
      return;
    }
    if (chartBCgory === "3" && HomeModule.rankData.length === 12) {
      this.$message.warning("排名最多展示12个，请删除后再添加！");
      this.groupName = "";
      return;
    }
    this.groupName = (this.groupNames as any)[chartBCgory];
    HomeModule.UPDATE_DRAG_STATUS("draging");
    HomeModule.UPDATE_DRAG_TYPE((this.groupNames as any)[chartBCgory]);
  }

  dragEndFn() {
    HomeModule.UPDATE_NEED_ALIGN_UPDATE(true);
    HomeModule.UPDATE_DRAG_STATUS("");
    this.drag = false;
    // 拖拽完成后将groupName清空,防止从卡片拖动到树上
    this.groupName = "";
  }
}
</script>

<style lang="scss" scope>
.tree-node {
  .tree-node__content {
    cursor: pointer;
    padding: 0 10px;
    &:hover {
      background: rgba(0, 134, 179, 0.1);
    }
    .tree-node__expand-icon {
      font-size: 18px;
      margin-right: 5px;
    }
    .tree-node__label {
      height: 40px;
      line-height: 40px;
      font-weight: bold;
      .iconfont {
        margin-right: 5px;
      }
    }
  }
  .tree-node__children {
    padding-left: 40px;
    .tree-node__label {
      font-weight: normal;
    }
  }
}
</style>
