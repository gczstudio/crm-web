<template>
  <div class="quota-container">
    <div class="quota-header">
      <i class="iconfont icon-zidingyishezhi f3"></i
      ><span class="title f3">自定义设置</span>
      <el-input
        class="fr"
        style="width: 50%"
        placeholder="请输入关键字"
        suffix-icon="el-icon-search"
        size="small"
        v-model="keyword"
        clearable
        @input="inputChange"
      ></el-input>
    </div>
    <div class="quota-tree">
      <div class="tip">将所需指标拖拽至左侧相应板块中</div>
      <div class="tree">
        <nested-draggable :data="treeData" />
      </div>
      <div class="btns">
        <el-button @click="cancelFn">取消</el-button>
        <el-button type="primary" @click="saveFn">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop, Watch } from "vue-property-decorator";
import nestedDraggable from "./nested.vue";

@Component({
  name: "Tree",
  components: {
    nestedDraggable,
  },
})
export default class extends Vue {
  @Prop({ required: true }) private data!: Array<any>;
  keyword = "";
  treeData: Array<any> = [];

  @Watch("data")
  private onDataChange() {
    this.treeData = (this as any)._.cloneDeep(this.data);
  }

  inputChange(value: string) {
    if (!value) {
      this.treeData = (this as any)._.cloneDeep(this.data);
      return;
    }
    this.keyword = value;
    // 根据中文进行过滤
    let data = (this as any)._.cloneDeep(this.data);
    this.recursion(data, value, {});
    this.treeData = data;
  }

  recursion(data: any, value: string, parent: any) {
    data.map((item: any) => {
      item.expand = true;
      if (item.chartNm.includes(value)) {
        item.checked = true;
        if(parent?.childList) {
          parent.checked = true
        }
      } else if (item.childList && item.childList.length) {
        this.recursion(item.childList, value, item);
      } else {
        item.checked = false;
      }
    });
  }

  saveFn() {
    this.$emit("save");
  }

  cancelFn() {
    this.$emit("cancel", false);
  }
}
</script>

<style lang="scss" scoped>
.quota-container {
  padding: 64px 0 86px;
  .quota-header {
    width: 100%;
    position: absolute;
    top: 0;
    padding: 12px 20px;
    color: #333;
    background: #fff;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    .iconfont {
      vertical-align: middle;
      line-height: 32px;
    }
    .title {
      line-height: 32px;
      vertical-align: middle;
      margin-left: 10px;
      font-weight: bold;
    }
  }
  .tree {
    padding: 0 20px 0;
  }
  .tip {
    padding: 10px 20px;
    color: #007EFF;
  }
}
.btns {
  text-align: center;
  padding: 25px 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  background: #ffffff;
  box-shadow: 0px -3px 7px 0px rgba(0, 0, 0, 0.1);
}
</style>
