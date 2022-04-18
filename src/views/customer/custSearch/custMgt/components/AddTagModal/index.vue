<template>
  <div>
    <yu-dialog
      custom-class="create-tag-customer-modal"
      title="添加标签"
      :visible.sync="dialogVisible"
      width="70%"
      @close="cancelFn"
      top="10vh"
    >
      <div>
        <yu-xform ref="searchForm" class="search" related-table-name="refTable" form-type="search">
          <yu-xform-group :column="4">
            <yu-xform-item label="标签类型" placeholder="标签类型" ctype="yufp-tree-select" name="tagNo" :tree-options="tagTreeOptions" ></yu-xform-item>
            <yu-xform-item label="标签名称" placeholder="标签名称" ctype="input" name="tagNm" :rules="globalRules.input"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
        <yu-xtable ref="refTable" :data-url="dataUrl" row-number :base-params="baseParams" selection-type="radio" :max-height="450" border>
          <yu-xtable-column label="标签类型（一级）" prop="tagTypeOne" width="160" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="标签类型（二级）" prop="tagTypeTwo" width="160" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="标签编号" prop="tagNo" min-width="120" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="标签名称" prop="tagNm" min-width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="标签码值" prop="tagDefinition" align="center" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">
              <i class="iconfont icon-tags" style="cursor:pointer;" @click="tagClickFn(scope.row)"></i>
              </template>
          </yu-xtable-column>
          <yu-xtable-column label="标签定义" prop="tagDefinition"  min-width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="管理机构" prop="orgName"  min-width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="管理角色" prop="mgrRoleNm"  min-width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="标签状态" prop="tagStatus"  min-width="120" align="center" :show-overflow-tooltip="true" sortable="custom" data-code="TAG_STATUS">
            <template slot-scope="scope">
              <el-tag :type="scope.row.tagStatus==1 ? 'success': 'danger'" >{{$lookup.convertKey('TAG_STATUS', scope.row.tagStatus)}}</el-tag>
            </template>
          </yu-xtable-column>
          <yu-xtable-column label="维护方式" prop="mntMode"  min-width="120" data-code="MNT_MODE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="生效日期" prop="effectiveDate"  min-width="120" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="是否加入灵活查询" prop="flexQuery"  min-width="200" data-code="YESNO" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
        </yu-xtable>
      </div>
      <div slot="footer" class="operate-btns tr">
        <el-button @click="cancelFn">取消</el-button>
        <el-button type="primary" @click="nextFn">下一步</el-button>
      </div>
    </yu-dialog>
    <yu-dialog
      custom-class="select-tag-value-modal"
      title="选择指标值"
      :visible.sync="tagValueVisible"
      width="500px"
      @close="closeTagValueFn"
      top="20vh"
    >
      <div>
        <yu-xform ref="searchForm" :model="formData" label-width="80px">
          <yu-xform-item label="标签值" placeholder="标签值" ctype="select" name="tagItemCode" :options="tagValues" :rules="globalRules.required" filterable></yu-xform-item>
        </yu-xform>
      </div>
      <div slot="footer" class="operate-btns tr">
        <el-button @click="closeTagValueFn">取消</el-button>
        <el-button type="primary" @click="sureFn">保存</el-button>
      </div>
    </yu-dialog>
    <yu-dialog  title="标签值" :visible.sync="tagAllVisible" width="800px">
      <yu-xtable ref="refTagTable" v-if="tagAllVisible" :data-url="dataTagUrl" :base-params="tagBaseParams" :max-height="500" :pageable="false" row-number border>
        <yu-xtable-column label="标签值" prop="tagItemCode" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
        <yu-xtable-column label="文字说明" prop="itemCodeNm" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
        <yu-xtable-column label="是否下拉项" prop="isFlag" :show-overflow-tooltip="true" sortable="custom" data-code="YESNO"></yu-xtable-column>
      </yu-xtable>
    </yu-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";
import { backend } from '@/config'
import * as customerApi from '@/api/customer'

@Component({
  name: "CreateTagCustomerModal",
})
export default class extends Vue {
  @Prop({default: false }) private visible!: boolean;
  @Prop() private data!: any;
  @Ref('searchForm') searchForm: any;
  @Ref('refTable') refTable: any;
  private dialogVisible = false;
  private tagValueVisible = false;
  private tagAllVisible = false;
  private dataUrl = backend.custService + '/api/ocrmftagtags/tagsquery'
  private dataTagUrl = backend.custService + '/api/ocrmftagvalue/querytagvalue'
  private formData = {};
  private tagValues = [];
  private tagBaseParams = {}
  private tagTreeOptions = {
    children: 'childList',
    label: 'tagNm',
    dataUrl: backend.custService + '/api/ocrmftagtags/querytagtree',
    dataId: 'tagNo',
    dataLabel: 'tagNm'
  };
  private baseParams = {
    condition: JSON.stringify({
      tagStatus: '1',
      mntMode: '0'
    })
  }
 
  @Watch('visible', { immediate: true })
  onVisibleChange () {
    this.dialogVisible = this.visible;
  }


  show() {
    this.$emit("update:visible", true);
  }

  hide() {
    this.$emit("update:visible", false);
  }


  nextFn () {
    let selections = this.refTable.selections;
    if(!selections.length) {
      this.$message.warning('请选择一条数据！');
      return;
    }
    this.tagValueVisible = true;
    this.getTagValue();
  }

  // 获取当前标签的标签值
  getTagValue () {
    let selections = this.refTable.selections;
    customerApi.querytagvalue({
      condition: JSON.stringify({
        tagNo: selections[0].tagNo,
        isFlag: '1'
      })
    }).then(res => {
      this.tagValues =  res.data.map((item: any) => {
        return {
          key: item.tagItemCode,
          value: item.itemCodeNm
        }
      });
    })
  }

  // 查看标签值
  tagClickFn (row: any) {
    this.tagBaseParams = {
      condition: JSON.stringify({
        tagNo: row.tagNo
      })
    }
    this.$nextTick(() => {
      this.tagAllVisible = true;
    })
  }

  sureFn() {
    this.searchForm.validate((valid: any) => {
      if(valid) {
        let selections = (this.$parent.$refs as any).refTable.selections;
        let params = selections.map((item: any) => {
          return {
            crmCustId: item.crmCustId,
            custNm: item.custNm,
            tagNo: this.refTable.selections[0].tagNo,
            ...this.formData
          }
        })
        customerApi.addtagcust(params).then(res => {
          this.$message.success('添加成功');
          this.$emit('success');
          this.tagValueVisible = false;
          this.hide();
        })
      } 
    })
  }

  cancelFn() {
    this.hide();
    this.refTable.setCurrentRow();
  }

  closeTagValueFn () {
    this.tagValueVisible = false;
    this.searchForm.resetFields();
  }

}
</script>


<style lang="scss">
  .create-tag-customer-modal {
    .el-dialog__footer {
      padding: 15px;
      border-top: 1px solid #D8D8D8;
    }
    
  }

</style>
