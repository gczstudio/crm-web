<template>
  <div class="layoutList-container">
    <div class="layout-box">
      <div class="section">
        <div :class="['section-item', child.type === active ? 'active' : '']" v-for="child in layoutList" :key="child.type" @click="clickFn(child)">
          <div><i :class="['iconfont', 'icon-' + child.icon]"></i></div>
          <p>{{ child.name }}</p>
        </div>
      </div>
    </div>
    <FixedLayoutDialog :visible.sync="fixedVisible" @sure="fixedSureFn" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, InjectReactive, Watch } from "vue-property-decorator";
import FixedLayoutDialog from "@/components/Dialogs/FixedLayoutDialog.vue";
import { LowCodeModule } from "@/store/modules/lowCode";
export interface ILayoutItem {
  type: string;
  name: string;
  icon: string;
}

@Component({
  name: "LayoutList",
  components: {
    FixedLayoutDialog,
  },
})
export default class extends Vue {
  private active = "none";
  private layoutList = [
    { type: "none", name: "无布局", icon: "nothing" },
    { type: "fixed", name: "固定布局", icon: "zidingyibuju" },
  ];
  private fixedVisible = false;
  private selectItem = {};

  get pageConfig() {
    return LowCodeModule.pageConfig;
  }

  @Watch("pageConfig", { immediate: true })
  onPageConfigChange() {
    this.active = this.pageConfig.body[0].layout;
  }

  clickFn(item: ILayoutItem) {
    LowCodeModule.SET_LAYOUT(item.type);
    this.active = item.type;
    this.selectItem = item;
    if (item.type === "fixed") {
      this.fixedVisible = true;
    } else if (item.type === "none") {
      this.$emit("select-layout", item);
    }
  }

  fixedSureFn(selections: string[]) {
    LowCodeModule.SET_HOVER_WIDGETS("");
    LowCodeModule.SET_ACTIVE_WIDGETS("");
    LowCodeModule.SET_HOVER_EDITOR_ID("");
    LowCodeModule.SET_ACTIVE_EDITOR_ID("");
    this.$emit("select-layout", {
      ...this.selectItem,
      data: selections[0],
    });
  }
}
</script>

<style lang="scss" scoped>
.layoutList-container {
  border-right: 1px solid #e6e6e8;
  height: 100%;
  .layout-box {
    height: calc(100% - 48px);
    overflow-y: auto;
    padding: 20px 10px 0;
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
