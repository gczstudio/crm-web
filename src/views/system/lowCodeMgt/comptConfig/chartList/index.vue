<template>
  <div class="chartList-container">
    <yu-xform-item-part class="search-input" placeholder="输入组件名称/创建人" ctype="input" suffix-icon="el-icon-search" name="searchText"></yu-xform-item-part>
    <MainLayout is-tab>
      <template v-slot:header>
        <el-button icon="el-icon-plus" @click="addCompFn">新增</el-button>
      </template>
      <template v-slot:table>
        <yu-xtable ref="refTable" :data-url="dataUrl" type="custom" :dynamic-height="true" :default-load="false">
          <div class="custom-container" slot-scope="scope">
            <el-row :gutter="16">
              <el-col :span="8" v-for="item in scope.tableData" :key="item.rowId">
                <div class="card-item">
                  <div class="card-item-top">
                    <div class="card-item__img">
                      <img src="https://t7.baidu.com/it/u=3180010982,1201664165&fm=74&app=80&size=f256,256&n=0&f=JPEG&fmt=auto?sec=1650560400&t=bd9ca514e4a0343cb1ab8d1dd62d594c" alt="" />
                    </div>
                    <div class="card-item__info">
                      <p class="card-item__title">{{ item.modName }}</p>
                      <p class="c2"><i class="el-icon-user"></i>创建人：{{ item.createUser }}</p>
                      <p class="c2"><i class="el-icon-time"></i>创建时间：{{ item.createTime }}</p>
                    </div>
                  </div>
                  <div class="card-bts">
                    <template v-if="item.modSts === '0'">
                      <el-button @click="editFn(item)">编辑</el-button>
                      <el-button @click="deleteFn(item)">删除</el-button>
                    </template>
                    <el-button @click="startOrStopFn(item)">{{ item.modSts === "0" ? "启用" : "停用" }}</el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </yu-xtable>
      </template>
    </MainLayout>
    <content-modal :visible.sync="contentVisible" @close="searchFn">
      <template slot-scope="scope">
        <add-comp :instance="scope" :data="curItem" />
      </template>
    </content-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import { backend } from "@/config";
import AddComp from "../addComp/index.vue";
import { saveBusiModule, deleteBusiModule, updateStsBusiModule } from "@/api/lowCode";

export interface IChartItem {
  id: string;
  modName: string;
  modType: string;
  modSts: string;
  modConfig: string;
}

@Component({
  name: "ChartList",
  components: {
    AddComp,
  },
})
export default class extends Vue {
  @Ref("compFormRef") compFormRef: any;
  @Ref("propFormRef") propFormRef: any;
  @Ref("refTable") refTable: any;
  @Prop() type!: string;

  private dataUrl = backend.comptMgrService + "/api/busimodule/list";
  private compForm = {};
  private addCompVisible = false;
  private compStatus = "add";

  private propForm = {};
  private addPropVisible = false;
  private propStatus = "add";

  private contentVisible = false;
  private curItem = {};

  mounted() {
    this.searchFn({
      condition: JSON.stringify({
        modType: this.type,
      }),
    });
  }

  searchFn(params?: any) {
    this.refTable.remoteData(params);
  }

  addCompFn() {
    // this.$message.warning('请先选择左侧目录');
    this.contentVisible = true;
  }

  saveCompFn() {
    console.log(1);
  }

  addPropFn() {
    this.addPropVisible = true;
    this.propFormRef && this.propFormRef.resetFields();
  }

  savePropFn() {
    console.log(1);
  }

  // 编辑组件
  editFn(item: IChartItem) {
    this.curItem = item;
    this.contentVisible = true;
  }

  deleteFn(item: IChartItem) {
    this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      callback: (action) => {
        if (action === "confirm") {
          deleteBusiModule({
            condition: JSON.stringify({
              id: item.id,
            }),
          }).then((res) => {
            this.$message.success("删除成功");
            this.searchFn();
          });
        }
      },
    });
  }

  startOrStopFn(item: IChartItem) {
    updateStsBusiModule({
      id: item.id,
      modSts: item.modSts === "0" ? "1" : "0",
    }).then((res) => {
      this.$message.success("操作成功");
      this.searchFn();
    });
  }
}
</script>

<style lang="scss" scoped>
.chartList-container {
  position: relative;
  .search-input {
    width: 200px;
    position: absolute;
    top: -40px;
    right: 100px;
    // z-index: 9999;
  }
}
.custom-container {
  padding: 0 16px;
  .card-item {
    margin-bottom: 16px;
    padding: 12px;
    background: #f5fafe;
    border-radius: 5px;
    .card-item-top {
      display: flex;
      .card-item__img {
        flex: 12;
      }
      .card-item__info {
        flex: 12;
        p {
          line-height: 1.5;
          i {
            margin-right: 5px;
          }
        }
        .card-item__title {
          margin-bottom: 10px;
          font-size: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .card-bts {
      margin-top: 12px;
      text-align: right;
      .el-button {
        font-size: 12px;
        border-radius: 14px;
        border-color: #b3d8ff;
        color: #007eff;
        font-weight: normal;
      }
    }
  }
}
</style>
