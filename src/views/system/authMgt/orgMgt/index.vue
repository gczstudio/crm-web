<template>
<div  class="yu-main-wrapper">
    <div class="yu-main__header">
      <div class="yu-main-toolbar">
        <div class="yu-main__header--title">机构列表</div>
      </div>
    </div>
    <el-row :gutter="6">
      <el-col :span="5">
        <yu-left-tree ref="mytree" class="no-border" :data-url="treeUrl" data-id="orgId" data-label="orgName"
          data-pid="upOrgId" @node-xclick="nodeClickFn" :show-checkbox="false" :expand-level='2' :highlight-current="true"
          :height="bHeight- (isMaxScreen?283:249)"></yu-left-tree>
          <div class="blank-box"></div>
      </el-col>
      <el-col :span="19">
        <div>
          <div class="yu-main-form">
            <yu-xform class="search" :model="mainGrid.query" :search="queryMainGridFn" ref="custSearchForm" form-type="search"
              label-width="120px">
              <yu-xform-group :column="4">
                <yu-xform-item label="机构代码" placeholder="机构代码" name="orgCode" ctype="input" :rules="globalRules.input"></yu-xform-item>
                <yu-xform-item label="机构名称" placeholder="机构名称" name="orgName" ctype="input" :rules="globalRules.input"></yu-xform-item>
                <!-- <yu-xform-item label="状态" placeholder="状态" name="orgSts" ctype="select" data-code="DATA_STS"></yu-xform-item> -->
              </yu-xform-group>
            </yu-xform>
          </div>
          <div class="yu-main-content">
            <!-- 查询结果表格 -->
            <div class="yu-main-table">
              <yu-xtable ref="mytable" border :data-url="mainGrid.dataUrl" :base-params="mainGrid.dataParams" selection-type="checkbox" :default-load="true" dynamic-height>
                <yu-xtable-column label="机构名称" prop="orgName" :show-overflow-tooltip="true"></yu-xtable-column>
                <yu-xtable-column label="机构代码" prop="orgCode" :show-overflow-tooltip="true" is-num></yu-xtable-column>
                <!-- <yu-xtable-column label="状态" prop="orgSts" :show-overflow-tooltip="true" data-code="DATA_STS"></yu-xtable-column> -->
                <!-- <yu-xtable-column label="最新变更用户" prop="lastChgName" :show-overflow-tooltip="true"></yu-xtable-column> -->
                <yu-xtable-column label="最新变更时间" prop="lastChgDt" :show-overflow-tooltip="true" is-num></yu-xtable-column>
                <yu-xtable-column label="上级机构" prop="upOrgName" :show-overflow-tooltip="true"></yu-xtable-column>
              </yu-xtable>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import request from "@/utils/request";
import { backend } from "@/config";
import { getCheckedRole } from '@/utils';
export default {
  name: 'OrgMgt',
  data: function () {
    var em = this;
    let roleInfo = getCheckedRole()
    return {
      roleInfo: roleInfo,
      treeUrl: backend.appOcaService + '/api/util/getorgtree?orgId=' + roleInfo.orgCode,
      myformModel: {
        orgId: roleInfo.orgCode,
      },
      formDisabled: false,
      mainGrid: {
        query: {
          orgCode: '',
          orgName: '',
          unitOrgId: '',
          orgSts: ''
        },
        checkbox: true,
        dataUrl: backend.appOcaService + '/api/adminsmorg/querypage',
        paging: {
          page: 1,
          size: 20
        },
        currentRow: null,
        dataParams: {
          condition: JSON.stringify({
            unitOrgId: roleInfo.orgCode
          })
        }
      },
      nowNode: null, // 当前选中节点数据
    };
  },
  methods: {
    // 查询机构列表
    queryMainGridFn: function () {
      var me = this;
      var param = {
        condition: JSON.stringify({
          orgCode: this.mainGrid.query.orgCode || null,
          orgName: this.mainGrid.query.orgName || null,
          unitOrgId: this.mainGrid.query.unitOrgId || null,
          orgSts: this.mainGrid.query.orgSts || null,
        })
      };
      me.$refs.mytable.remoteData(param);
    },
    nodeClickFn: function (node, obj, nodeComp) {
      if (node != '') {
        this.nowNode = node;
        this.mainGrid.query.unitOrgId = node.orgId;
        this.queryMainGridFn();
      }
    }
  }
}
</script>