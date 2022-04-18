<template>
  <div class="TagInfoMgt-container">
    <div class="yu-main-wrapper">
      <MainLayout>
        <template v-slot:header>
          <el-button icon="el-icon-plus" @click="createFn" v-permission="'create'">新增</el-button>
          <el-button icon="el-icon-unlock" @click="startFn" v-permission="'start'">启用</el-button>
          <el-button icon="el-icon-lock" @click="stopFn" v-permission="'stop'">停用</el-button>
          <el-button icon="el-icon-delete" @click="deleteFn" v-permission="'delete'">删除</el-button>
          <el-button icon="el-icon-circle-plus-outline" @click="addFlexFn" v-permission="'addFlex'">加入灵活查询</el-button>
          <el-button icon="el-icon-remove-outline" @click="removeFlexFn" v-permission="'deleteFlex'">从灵活查询移除</el-button>
        </template>
        <template v-slot:form>
          <yu-xform ref="searchForm" class="search" related-table-name="refTable" form-type="search" :need-export="true">
            <yu-xform-group :column="4">
              <yu-xform-item label="标签类型" placeholder="标签类型" ctype="yufp-tree-select" name="tagNo" :tree-options="tagTreeOptions" ></yu-xform-item>
              <yu-xform-item label="标签名称" placeholder="标签名称" ctype="input" name="tagNm" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="维护方式" placeholder="维护方式" ctype="select" name="mntMode" data-code="MNT_MODE"></yu-xform-item>
              <yu-xform-item label="标签状态" placeholder="标签状态" ctype="select" name="tagStatus" data-code="TAG_STATUS"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number selection-type="checkbox" :dynamic-height="true" border>
            <yu-xtable-column label="标签类型（一级）" prop="tagTypeOne" width="160" fixed="left" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="标签类型（二级）" prop="tagTypeTwo" width="160" fixed="left" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="标签编号" prop="tagNo" width="120" fixed="left" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="标签名称" prop="tagNm" width="120" fixed="left" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="标签码值" prop="tagDefinition" align="center" min-width="100" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <i class="iconfont icon-tags" style="cursor:pointer;" @click="tagClickFn(scope.row)"></i>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="标签定义" prop="tagDefinition"  min-width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="管理机构" prop="orgName"  min-width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="管理角色" prop="mgrRoleNm"  min-width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="可见范围" prop="vslRange"  min-width="120" :show-overflow-tooltip="true" data-code="VSL_RANGE" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="标签状态" prop="tagStatus"  min-width="100" align="center" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
                <el-tag :type="scope.row.tagStatus==1 ? 'success': 'danger'" >{{$lookup.convertKey('TAG_STATUS', scope.row.tagStatus)}}</el-tag>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="维护方式" prop="mntMode"  min-width="100" data-code="MNT_MODE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="生效日期" prop="effectiveDate"  min-width="100" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="是否加入灵活查询" prop="flexQuery"  min-width="160" data-code="YESNO" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="操作" width="180" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button class="yu-action-btn" @click.native.prevent="editFn(scope.row)" type="text" v-permission="'edit'">修改</el-button>
                <el-button class="yu-action-btn" @click.native.prevent="openCustListFn(scope.row)" type="text" v-permission="'custMgt'" :disabled="scope.row.mntMode==1">客户管理</el-button>
              </template>
            </yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
    <create-tag-modal :visible.sync="tagVisible" :type="tagModalType" :data="currentRow" @success="createTagSuccessFn" />
    <content-modal :visible.sync="visible">
      <template slot-scope="scope">
        <cust-list :instance="scope" :row="currentRow" />
      </template>
    </content-modal>
    <yu-dialog  title="标签值" :visible.sync="tagValueVisible" width="800px">
      <yu-xtable ref="refTagTable" v-if="tagValueVisible" :data-url="dataTagUrl" :base-params="tagBaseParams" :max-height="500" :pageable="false" row-number border>
        <yu-xtable-column label="标签值" prop="tagItemCode" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
        <yu-xtable-column label="文字说明" prop="itemCodeNm" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
        <yu-xtable-column label="是否下拉项" prop="isFlag" :show-overflow-tooltip="true" sortable="custom" data-code="YESNO"></yu-xtable-column>
      </yu-xtable>
    </yu-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import { backend } from '@/config'
import CustList from './custList.vue'
import CreateTagModal from './components/CreateTagModal/index.vue'
import * as customerApi from '@/api/customer'
import lookup from '@/utils/lookup'
@Component({
  name: "TagInfoMgt",
  components: {
    CustList,
    CreateTagModal
  }
})
export default class extends Vue {
  @Ref('searchForm') searchForm: any;
  @Ref('refTable') refTable: any;
  private dataUrl = backend.custService + '/api/ocrmftagtags/tagsqueryMng'
  private dataTagUrl = backend.custService + '/api/ocrmftagvalue/querytagvalue'
  private visible = false;
  private tagVisible = false;
  private tagValueVisible = false;
  private tagModalType = 'create'
  private currentRow = {};
  private tagTreeOptions = {
    children: 'childList',
    label: 'tagNm',
    dataUrl: backend.custService + '/api/ocrmftagtags/querytagtree',
    dataId: 'tagNo',
    dataLabel: 'tagNm'
  };

  private tagBaseParams = {}

  beforeRouteEnter (to:any, from:any, next:any) {
    lookup.bind('TAG_STATUS', () => {
      next()
    }) 
  }

  openCustListFn (row: any) {
    this.currentRow = row;
    this.visible = true;
  }

  createFn () {
    this.tagVisible = true;
    this.tagModalType = 'create';
  }

  createTagSuccessFn () {
    this.refTable.remoteData();
  }

  editFn (row: any) {
    this.tagVisible = true;
    this.currentRow = row;
    this.tagModalType = 'edit';
  }

  startFn () {
    let selections = this.refTable.selections;
    if(!selections.length) {
      this.$message.warning('请至少选择一条数据！');
      return;
    }
    let bool = selections.some((item: any) => {
      return item.tagStatus == 0
    })
    if(!bool) {
      this.$message.warning('只能选择失效的数据！');
      return;
    }
    this.updateTagStatus('1');
  }

  stopFn () {
    let selections = this.refTable.selections;
    if(!selections.length) {
      this.$message.warning('请至少选择一条数据！');
      return;
    }
    let bool = selections.some((item: any) => {
      return item.tagStatus == 1
    })
    if(!bool) {
      this.$message.warning('只能选择生效的数据！');
      return;
    }
    this.updateTagStatus('0');
  }

  // 查看标签值
  tagClickFn (row: any) {
    this.tagBaseParams = {
      condition: JSON.stringify({
        tagNo: row.tagNo
      })
    }
    this.$nextTick(() => {
      this.tagValueVisible = true;
    })
  }

  updateTagStatus (tagStatus: string) {
    let selections = this.refTable.selections;
    let tips = ['停用成功', '启用成功', '删除成功' ];
    let params = selections.map((item: any) => {
      return {
        tagNo: item.tagNo,
        tagStatus
      }
    })
    customerApi.updatetagstatue(params).then(res => {
      this.$message.success(tips[Number(tagStatus)]);
      this.refTable.remoteData();
    })
  }

  deleteFn () {
    let selections = this.refTable.selections;
    let bool = selections.some((item:any) => item.mntMode === '1');
    if(bool) {
      this.$message.warning('不能删除系统标签！');
      return;
    }

    if(!selections.length) {
      this.$message.warning('请至少选择一条数据！');
      return;
    }
    this.$confirm('此操作将删除所选标签, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      callback: (action) => {
        if (action === 'confirm') {
          this.updateTagStatus('2');
        }
      }
    });
  }

  addFlexFn () {
    let selections = this.refTable.selections;
    if(!selections.length) {
      this.$message.warning('请至少选择一条数据！');
      return;
    }

    let bool = selections.every((item: any) => item.tagStatus === '1');
    if(!bool) {
      this.$message.warning('所选标签中，包含失效的标签！');
      return;
    }

    let params = selections.map((item: any) => {
      return {
        tagNo: item.tagNo,
        tagNm: item.tagNm,
        flexQuery: '1'
      }
    })
    customerApi.addflexquery(params).then(res => {
      this.$message.success('加入灵活查询成功！');
      this.refTable.remoteData();
    })
  }

  removeFlexFn () {
    let selections = this.refTable.selections;
    if(!selections.length) {
      this.$message.warning('请至少选择一条数据！');
      return;
    }
    let params = selections.map((item: any) => {
      return {
        tagNo: item.tagNo,
        flexQuery: '0'
      }
    })
    customerApi.delflexquery(params).then(res => {
      this.$message.success('从灵活查询删除成功！');
      this.refTable.remoteData();
    })
  }
}
</script>
