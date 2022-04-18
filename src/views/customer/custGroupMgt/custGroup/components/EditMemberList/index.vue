<template>
  <div class="EditMemberList-component">
    <el-row :gutter="10">
      <el-col :span="12">
        <MainLayout class="table-left" title="客户查询">
          <template v-slot:header>
            <el-button icon="el-icon-plus" @click="addCustGroupFn">加入客户群</el-button>
          </template>
          <template v-slot:form>
            <yu-xform class="search" form-type="search" related-table-name="refTable1">
                <yu-xform-group>
                  <yu-xform-item label="客户名称" placeholder="客户名称" ctype="input" name="custNm" :rules="globalRules.input"></yu-xform-item>
                  <yu-xform-item label="核心客户号" placeholder="核心客户号" ctype="input" name="custId" :rules="globalRules.input"></yu-xform-item>
                  <yu-xform-item label="组织机构代码" placeholder="组织机构代码" ctype="input" name="insCredCode" :rules="globalRules.input" ></yu-xform-item>
                  <yu-xform-item label="主管客户经理" placeholder="主管客户经理" ctype="yufp-customer-modal" selection-type="radio" name="blgMgrNm" :rules="globalRules.input"></yu-xform-item>
                  <yu-xform-item label="主管机构" placeholder="主管机构" ctype="yufp-org-tree" name="blgOrgNm" :rules="globalRules.input"></yu-xform-item>
                </yu-xform-group>
              </yu-xform>
          </template>
          <template v-slot:table>
            <yu-xtable ref="refTable1" :data-url="dataUrl1" row-number selection-type="checkbox" :dynamic-height="true" border>
              <yu-xtable-column label="客户名称" prop="custNm" min-width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom">
                <template slot-scope="scope">
                <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{scope.row.custNm}}</div>
                </template>
              </yu-xtable-column>
              <yu-xtable-column label="核心客户号" prop="custId" width="120" is-num :show-overflow-tooltip="true" fixed="left" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="组织机构代码" prop="insCredCode" width="130" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="主管机构" prop="blgOrgNm" width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="主管客户经理" prop="blgMgrNm" width="130" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            </yu-xtable>
          </template>
        </MainLayout>
      </el-col>
      <el-col :span="12">
        <MainLayout class="table-right" title="客户群成员管理">
          <template v-slot:header>
            <el-button icon="el-icon-delete" @click="removeCustGroupFn">移出客户群</el-button>
          </template>
          <template v-slot:form>
            <yu-xform class="search" related-table-name="refTable2" form-type="search">
                <yu-xform-group>
                  <yu-xform-item label="成员名称" placeholder="成员名称" ctype="input" name="custNm" :rules="globalRules.input"></yu-xform-item>
                  <yu-xform-item label="核心客户号" placeholder="核心客户号" ctype="input" name="custId" :rules="globalRules.input"></yu-xform-item>
                  <yu-xform-item label="组织机构代码" placeholder="组织机构代码" ctype="input" name="insCredCode" :rules="globalRules.input"></yu-xform-item>
                </yu-xform-group>
              </yu-xform>
          </template>
          <template v-slot:table>
            <yu-xtable ref="refTable2" :data-url="dataUrl2" :base-params="baseParams" row-number selection-type="checkbox" :dynamic-height="true" border>
              <yu-xtable-column label="客户名称" prop="custNm" min-width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom">
                <template slot-scope="scope">
                <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{scope.row.custNm}}</div>
                </template>
              </yu-xtable-column>
              <yu-xtable-column label="核心客户号" prop="custId" width="120" is-num :show-overflow-tooltip="true" fixed="left" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="组织机构代码" prop="insCredCode" width="130" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="主管客户经理" prop="blgMgrNm" width="130" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="主管机构" prop="blgOrgNm" width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            </yu-xtable>
          </template>
        </MainLayout>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, InjectReactive, Inject } from "vue-property-decorator";
import { backend } from '@/config'
import { addcrowdmem, delcrowdmem } from '@/api/customer';
@Component({
  name: "EditMemberList",
})
export default class extends Vue {
  @Inject() readonly groupInstance!: any;
  @InjectReactive() readonly row!: any;
  @Prop({default: false }) private visible!: boolean;
  @Ref('refTable1') refTable1: any;
  @Ref('refTable2') refTable2: any;
  private queryFormData = {};
  private dataUrl1 = backend.custService + '/api/custquery/managecustlist'
  private dataUrl2 = backend.custService + '/api/crowdmember/querycrowdmem';
  private baseParams = {}

  created () {
    const { custGroupId, etlDate } = this.row;
    this.baseParams = {
      condition: JSON.stringify({
        custGroupId,
        etlDate
      })
    }
  }

  customerViewFn(row: any) {
    this.$router.push({ path: '/custInfo/custView/' + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: '客户详情-' + row.custNm }})
  }

  addCustGroupFn () {
    let selections = this.refTable1.selections;
    if(!selections.length) {
      this.$message.warning('请至少选择一条数据！');
      return;
    }
    let params = {
      custGroupId: this.row.custGroupId,
      custGroupNm: this.row.custGroupNm,
      list: selections.map((item: any) =>{
        return {
          crmCustId: item.crmCustId,
          custNm: item.custNm
        }
      })
    }
    addcrowdmem(params).then(res => {
      this.$message.success("加入客户群成功！");
      this.refTable2.remoteData();
      this.groupInstance.refreshTable();
    })
  }

  removeCustGroupFn () {
    let selections = this.refTable2.selections;
    if(!selections.length) {
      this.$message.warning('请至少选择一条数据！');
      return;
    }
    this.$confirm('此操作将移出所选客户, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      callback: (action) => {
        if (action === 'confirm') {
          let params = {
            custGroupId: this.row.custGroupId,
            list: selections.map((item: any) =>{
              return {
                crmCustId: item.crmCustId
              }
            })
          }
          delcrowdmem(params).then(res => {
            this.$message.success("移出客户群成功！");
            this.refTable2.remoteData();
            this.groupInstance.refreshTable();
          })
        }
      }
    });
  }
}
</script>

<style lang="scss" scoped>
  .EditMemberList-component {
    background: #EFEFEF;
    .main-layout {
      padding: 0 10px;
      background: #fff;
      .form-header {
        z-index: inherit;
        border-bottom: 1px solid #D8D8D8;
      }
    }
    .yu-main-wrapper {
      padding: 0 10px;
    }
    .yu-main__header1 {
      position: relative;
      padding: 12px;
      background: #fff;
      
      .yu-main__header--title {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
  @media screen and (max-width: 1680px) {
    .EditMemberList-component {
      .table-left {
        ::v-deep .yu-xform {
          padding: 12px 0 0;
          .yu-xform-content--search {
            width: calc(100% - 185px);
          }
          .el-row{
            .el-col:nth-child(2n-1) {
              .el-form-item__label {
                width: 95px!important;
              }
              .el-form-item__content {
                margin-left: 95px!important;
              }
            }
            .el-col:nth-child(2n) {
              .el-form-item__label {
                width: 100px!important;
              }
              .el-form-item__content {
                margin-left: 100px!important;
              }
            }
          }
          .yu-xform-btns {
            right: 0;
            .el-button--text {
              padding: 6px 0;
            }
            .arrow-down {
              margin-left: 2px;
            }
          }
        }
      }
      .table-right {
        ::v-deep .yu-xform {
          padding: 12px 0 0;
          .yu-xform-content--search {
            width: calc(100% - 130px);
          }
          .el-row{
            .el-col:nth-child(2n-1) {
              .el-form-item__label {
                width: 95px!important;
              }
              .el-form-item__content {
                margin-left: 95px!important;
              }
            }
            .el-col:nth-child(2n) {
              .el-form-item__label {
                width: 82px!important;
              }
              .el-form-item__content {
                margin-left: 82px!important;
              }
            }
          }
          .yu-xform-btns {
            right: 0;
            .el-button--text {
              padding: 6px 0;
            }
            .arrow-down {
              margin-left: 2px;
            }
          }
        }
      }
    }
  }
</style>
