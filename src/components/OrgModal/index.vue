<template>
  <div class="CustomerModal-container">
    <yu-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :width="selectionType==='checkbox' ? '1300px' : '1000px'"
      @close="hide"
      top="5vh"
    >
      <div>
        <el-row :gutter="16">
          <el-col :span="5">
            <yu-left-tree ref="mytree" :data-url="treeUrl" data-id="orgId" data-label="orgName" data-pid="upOrgId" @node-xclick="nodeClickFn"
              :show-checkbox="false" :expand-level='2' :highlight-current="true" :height="bHeight-350"></yu-left-tree>
          </el-col>
          <el-col :span="selectionType==='checkbox' ? 14 : 19">
              <yu-xform :model="queryFormData" :search="searchFn" ref="custSearchForm" form-type="search">
                <yu-xform-group :column="2">
                  <yu-xform-item placeholder="机构代码" name="orgCode" ctype="input" :rules="globalRules.input"></yu-xform-item>
                  <yu-xform-item placeholder="机构名称" name="orgName" ctype="input" :rules="globalRules.input"></yu-xform-item>
                </yu-xform-group>
              </yu-xform>
              <yu-xtable ref="mytable" v-if="visible" border :data-url="dataUrl" :base-params="dataParams" :height="bHeight-380" row-key="orgId"  @selections-change="selectionChangeFn" :selection-type="selectionType" :default-load="true" :auto-clear-checked="false">
                <yu-xtable-column label="机构名称" prop="orgName" width="200" :show-overflow-tooltip="true"></yu-xtable-column>
                <yu-xtable-column label="机构代码" prop="orgCode" :show-overflow-tooltip="true"></yu-xtable-column>
                <yu-xtable-column label="上级机构" prop="upOrgName" :show-overflow-tooltip="true"></yu-xtable-column>
              </yu-xtable>
          </el-col>
          <el-col :span="5" v-if="selectionType==='checkbox'">
            <div class="select-org">
              <div class="select-title"><i class="iconfont icon-cunkuantongji"></i>已选择机构（{{selections.length}}）</div>
              <el-scrollbar wrap-class="scrollbar-wrapper" :style="{height: bHeight-324 + 'px'}">
                <!-- 滚动条包裹部分 -->
                <ul>
                  <li v-for="item in selections" :key="item.orgId">{{item.orgName}}<i class="el-icon-close" @click="deleteFn(item)"></i></li>
                </ul>
              </el-scrollbar>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="operate-btns tc">
        <el-button type="primary" @click="sureFn">确定</el-button>
        <el-button @click="cancelFn">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>
<script>
import { backend } from "@/config";
import { getCheckedRole } from '@/utils';
import request from "@/utils/request"
export default {
  name: 'OrgModal',
  props: {
    selectionType: {
      type: String,
      default: 'checkbox'
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择机构'
    },
    orgCodes: String,
    isAuthOrg: { //   是否按权限机构过滤， true   是   false 按所在分支行过滤
      type: Boolean,
      default: true
    },
    required:  { // 是否必选
      type: Boolean,
      default: false
    }
  },
  data() {
    let roleInfo = getCheckedRole()
    return {
      orgCode: this.isAuthOrg ? roleInfo.orgCode : roleInfo.mappingOrg,
      custInfo: {},
      dialogVisible: false,
      treeUrl: backend.appOcaService + '/api/util/getorgtree?orgId=' + (this.isAuthOrg ? roleInfo.orgCode : roleInfo.mappingOrg),
      dataUrl: backend.appOcaService + '/api/adminsmorg/querypage',
      queryFormData: {},
      dataParams: {
        condition: JSON.stringify({
          unitOrgId: this.isAuthOrg ? roleInfo.orgCode : roleInfo.mappingOrg,
        })
      },
      nowNode: {},
      selections: []
    }
  },
  watch: {
    visible: function(){
      this.selections = []
      this.dialogVisible = this.visible;
      if (this.visible) {
        this.querySelectData();
      }
    },
  },
  created() {
    this.dialogVisible = this.visible;
  },
  methods: {
    querySelectData () {
      if(!this.orgCodes) return;
      request({
        method: 'GET',
        url: this.dataUrl,
        params: {
          condition: JSON.stringify({
            orgCodes: this.orgCodes
          })
        }
      }).then(res => {
        this.selections = res.data;
        this.$nextTick(() => {
          this.$refs.mytable.toggleSelection(res.data);
        });
      })
    },
    selectionChangeFn (selections) {
      this.selections = selections;
    },
    // 查询机构列表
    searchFn: function () {
      var param = {
        condition: JSON.stringify({
          ...this.queryFormData,
          unitOrgId: this.nowNode.orgId || this.orgCode,
        })
      };
      this.$refs.mytable.remoteData(param);
    },
    nodeClickFn: function (node, obj, nodeComp) {
      if (node != '') {
        this.nowNode = node;
        this.$nextTick(() => {
          this.searchFn();
        });
      }
    },
    show() {
      this.$emit("update:visible", true);
    },
    hide() {
      this.$emit("update:visible", false);
    },
    sureFn() {
      let selected = this.$refs.mytable.selections;
      if(!selected.length && this.required ) {
        this.$message.warning(this.selectionType === 'checkbox' ? '请至少选择一条数据' : '请选择一条数据');
        return;
      }
      this.$emit('sure', selected)
    },
    cancelFn() {
      this.hide();
    },
    deleteFn (item) {
      this.$refs.mytable.deleterSelectionFn(item);
    }
  }
}
</script>
<style lang="scss" scoped>
  .select-org{
    .select-title {
      padding: 16px;
      border: 1px solid #e6e6e6;
      border-bottom: 0;
      font-weight: bold;
      .iconfont {
       font-size: 12px;
        margin-right: 8px;
      }
    }
    .el-scrollbar {
      border: 1px solid #e6e6e6;
    }
    ul{
      padding: 10px 0;
      li {
        position: relative;
        padding: 10px 32px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover {
          background: $blue-hover;
          .el-icon-close {
            display: block;
          }
        }
        .el-icon-close {
          position: absolute;
          top: 10px;
          right: 16px;
          display: none;
          cursor: pointer;
        }
      }
    }
  }
</style>

