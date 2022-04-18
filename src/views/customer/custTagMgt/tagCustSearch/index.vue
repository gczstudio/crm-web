<template>
  <div class="TagCustSearch-container">
    <div class="yu-main-wrapper">
      <MainLayout>
        <template v-slot:form>
          <yu-xform ref="searchForm" class="search" related-table-name="refTable" form-type="search">
            <yu-xform-group :column="4">
              <yu-xform-item label="标签类型" placeholder="标签类型" ctype="yufp-tree-select" name="tagNo" :tree-options="tagTreeOptions" ></yu-xform-item>
              <yu-xform-item label="标签名称" placeholder="标签名称" ctype="input" name="tagNm" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="维护方式" placeholder="维护方式" ctype="select" name="mntMode" data-code="MNT_MODE"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number :base-params="baseParams" :dynamic-height="true" border>
            <yu-xtable-column label="标签类型（一级）" prop="tagTypeOne" width="160" fixed="left" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="标签类型（二级）" prop="tagTypeTwo" width="160" fixed="left" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="标签编号" prop="tagNo" width="120" fixed="left" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="标签名称" prop="tagNm" width="120" fixed="left" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="标签码值" prop="tagDefinition" align="center" width="100" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <i class="iconfont icon-tags" style="cursor:pointer;" @click="tagClickFn(scope.row)"></i>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="标签定义" prop="tagDefinition"  min-width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="管理机构" prop="orgName"  min-width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="标签状态" prop="tagStatus"  min-width="100" align="center" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
                <el-tag :type="scope.row.tagStatus==1 ? 'success': 'danger'" >{{$lookup.convertKey('TAG_STATUS', scope.row.tagStatus)}}</el-tag>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="维护方式" prop="mntMode"  min-width="100" data-code="MNT_MODE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="生效日期" prop="effectiveDate"  min-width="100" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="是否加入灵活查询" prop="flexQuery"  min-width="160" data-code="YESNO" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="操作" width="150" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button class="yu-action-btn" @click.native.prevent="openCustListFn(scope.row)" type="text">客户列表</el-button>
              </template>
            </yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
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
import lookup from '@/utils/lookup'
@Component({
  name: "TagCustSearch",
  components: {
    CustList
  }
})
export default class extends Vue {
  @Ref('searchForm') searchForm: any;
  @Ref('refTable') refTable: any;
  private dataUrl = backend.custService + '/api/ocrmftagtags/tagsqueryall';
  private dataTagUrl = backend.custService + '/api/ocrmftagvalue/querytagvalue';
  private visible = false;
  private tagValueVisible = false;
  private tagTreeOptions = {
    children: 'childList',
    label: 'tagNm',
    dataUrl: backend.custService + '/api/ocrmftagtags/querytagtree',
    dataId: 'tagNo',
    dataLabel: 'tagNm'
  }
  private currentRow = {}
  private baseParams = {
    condition: JSON.stringify({
      tagStatus: '1'
    })
  }
  private tagBaseParams = {}

  beforeRouteEnter (to:any, from:any, next:any) {
    lookup.bind('TAG_STATUS', () => {
      next()
    }) 
  }

  openCustListFn (row: any) {
    this.visible = true;
    this.currentRow = row;
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

}
</script>
