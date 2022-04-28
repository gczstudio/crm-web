<template>
  <div class="LayoutMgt-container yu-main-wrapper">
    <el-row :gutter="16">
      <el-col :span="5">
        <MainLayout>
          <template v-slot:header>
            <el-button icon="el-icon-plus" @click="addFn">新增</el-button>
          </template>
          <template v-slot:form>
            <yu-xform :model="searchForm">
              <yu-xform-item name="layoutName" ctype="input" placeholder="布局名称" @change="searchFn"></yu-xform-item>
            </yu-xform>
          </template>
          <template v-slot:table>
            <yu-xtable ref="refTable" :data-url="dataUrl" :dynamic-height="true" :border="false" layout="total, prev, pager, next" @row-click="rowClickFn">
              <yu-xtable-column label="布局名称" prop="layoutName" :show-overflow-tooltip="true"></yu-xtable-column>
              <yu-xtable-column label="状态" prop="layoutSts" width="80" :show-overflow-tooltip="true">
                <template slot-scope="scoped">
                  <el-tag v-if="scoped.row.status" type="success" size="mini">生效</el-tag>
                  <el-tag v-else type="danger" size="mini">未生效</el-tag>
                </template>
              </yu-xtable-column>
            </yu-xtable>
          </template>
        </MainLayout>
      </el-col>
      <el-col :span="19">
        <div class="layout-box">
          <div class="layout-header">
            <div class="layout-title">xxx</div>
            <div class="layout-btns fr">
              <el-button class="yu-button-text" icon="el-icon-edit">编辑</el-button>
              <el-button class="yu-button-text" icon="el-icon-delete">删除</el-button>
              <el-button class="yu-button-text" icon="el-icon-folder-add">下架</el-button>
            </div>
          </div>
          <div class="layout-content">
            <edit type="render" :row="currentRow" />
          </div>
        </div>
      </el-col>
    </el-row>

    <yu-dialog title="新增布局" :visible.sync="addVisible" width="400px" height="350px">
      <yu-xform ref="layoutFormRef" :model="layoutForm" label-width="100px">
        <yu-xform-group :column="1">
          <yu-xform-item label="布局名称" placeholder="布局名称" name="layoutName" ctype="input" :rules="globalRules.requiredInput50"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button type="primary" @click="nextFn()">下一步</el-button>
        <el-button @click="addVisible = false">取消</el-button>
      </div>
    </yu-dialog>
    <content-modal :visible.sync="contentVisible">
      <template slot-scope="scope">
        <edit :instance="scope" :row="currentRow" />
      </template>
    </content-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import { addLayout } from "@/api/lowCode";
import { backend } from "@/config";
import Edit from "./edit/index.vue";
import Draggable from "vuedraggable";

export interface LayoutListItem {
  id: string;
  name: string;
  status: boolean;
}

@Component({
  name: "LayoutMgt",
  components: {
    Edit,
    Draggable,
  },
})
export default class extends Vue {
  @Ref("refTable") refTable: any;
  @Ref("layoutFormRef") layoutFormRef: any;

  private dataUrl = backend.mockService + "/lowcode/layout/list";
  private searchForm = {};
  private addVisible = false;
  private layoutForm = {};
  private contentVisible = false;
  private currentRow = {};

  searchFn() {
    this.refTable.remoteData({
      condition: JSON.stringify(this.searchForm),
    });
  }

  rowClickFn(row: LayoutListItem) {
    this.currentRow = row;
  }

  addFn() {
    this.addVisible = true;
    this.layoutFormRef && this.layoutFormRef.resetFields();
  }

  nextFn() {
    this.contentVisible = true;
    this.currentRow = this.layoutForm;
    this.$nextTick(() => {
      this.addVisible = false;
    });
    // addLayout(params).then(res => {

    // })
  }
}
</script>

<style lang="scss" scoped>
.layout-box {
  .layout-header {
    position: relative;
    z-index: 99;
    background: #fff;
    padding: 10px;
    box-shadow: 0px 3px 6px rgba($color: #000000, $alpha: 0.1);
  }
  .layout-title {
    font-weight: bold;
  }
  .layout-btns {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    .el-button {
      &:nth-child(1) {
        border: none;
      }
      border-left: 1px solid #707070;
    }
  }
}
</style>
