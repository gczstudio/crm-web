<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="5">
        <yu-left-tree class="box-shadow" title="控制点目录" ref="resContrTree" @node-xclick="nodeClickFn" :show-checkbox="false" :height="bHeight-(isMaxScreen?232:202)"
          :data-url="treeUrl" data-id="nodeId" data-label="nodeName" :render-content="renderContent" data-pid="upTreeId"
          :highlight-current="true" :expand-level='1'></yu-left-tree>
      </el-col>
      <el-col :span="19">
        <div class="yu-main-wrapper">
           <!-- 表格工具栏 -->
          <div class="yu-main__header clearfix">
            <div class="yu-main-toolbar fr">
              <el-button icon="el-icon-plus" @click="pointAddFn">新增</el-button>
              <el-button icon="el-icon-delete" @click="pointDeleteFn">删除</el-button>
            </div>
          </div>
          <div class="yu-main-form">
            <yu-xform class="search" :model="pointQuery" :search="queryMainGridFn" ref="pointQuery" form-type="search">
              <yu-xform-group :column="4">
                <yu-xform-item placeholder="控制操作名称" name="contrName" ctype="input" :rules="globalRules.input"></yu-xform-item>
                <yu-xform-item placeholder="控制操作代码" name="contrCode" ctype="input" :rules="globalRules.input"></yu-xform-item>
                <yu-xform-item placeholder="控制操作URL" name="contrUrl" ctype="input" :rules="globalRules.input"></yu-xform-item>
              </yu-xform-group>
            </yu-xform>
          </div>
          <div class="yu-main-content">
            <!-- 查询结果表格 -->
            <div class="yu-main-table">
              <yu-xtable ref="pointTable" :data-url="contrDataUrl" selection-type="checkbox" :default-load="true" border dynamic-height>
                <yu-xtable-column label="控制操作名称" min-width="120" prop="contrName">
                  <template scope="scope">
                    <a onclick="return false;" href="javascipt:void(0);" style="text-decoration:underline;"
                      @click="rowClick(scope)">{{ scope.row.contrName }}</a>
                  </template>
                </yu-xtable-column>
                <yu-xtable-column label="控制操作代码" prop="contrCode" :sortable="true" :resizable="true"></yu-xtable-column>
                <yu-xtable-column label="控制操作URL" prop="contrUrl" :show-overflow-tooltip="true" :sortable="true"
                  :resizable="true"></yu-xtable-column>
                <!-- <yu-xtable-column label="HTTP方法" prop="methodType" min-width="100" :sortable="true" :resizable="true"
                  data-code="HTTP_METHOD_TYPE"></yu-xtable-column> -->
                <yu-xtable-column label="最近变更用户" prop="lastChgName" :sortable="true" :resizable="true"></yu-xtable-column>
                <yu-xtable-column label="最近变更时间" prop="lastChgDt" :sortable="true" :resizable="true"></yu-xtable-column>
                <yu-xtable-column label="操作" width="80" align="center">
                  <template slot-scope="scope">
                    <el-button class="yu-action-btn" @click.native.prevent="modifyFn(scope.row)" type="text">修改</el-button>
                  </template>
                </yu-xtable-column>
              </yu-xtable>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--机构信息维护页面-->
    <yu-dialog  :title="viewTitle[viewType]" :visible.sync="dialogVisible">
      <yu-xform :disabled="formDisabled" :model="pointForm" :form-type="viewType == 'DETAIL'?'details':''" ref="pointForm"
        label-width="120px">
        <yu-xform-group :column="2">
          <yu-xform-item label="控制操作名称" :rules="globalRules.requiredInput" name="contrName" ctype="input"></yu-xform-item>
          <yu-xform-item label="控制操作代码" :rules="globalRules.requiredInput" name="contrCode" ctype="input"></yu-xform-item>
          <yu-xform-item label="最近更新人" :hidden="formItemHidden" name="lastChgName" ctype="input"></yu-xform-item>
          <yu-xform-item label="最近更新时间" :hidden="formItemHidden" name="lastChgDt" ctype="input"></yu-xform-item>
          <yu-xform-item label="控制操作URL" :rules="globalRules.input" name="contrUrl" ctype="input"></yu-xform-item>
          <!-- <yu-xform-item label="HTTP方法" name="methodType" ctype="select" data-code="HTTP_METHOD_TYPE"></yu-xform-item> -->
        </yu-xform-group>
        <yu-xform-group :column="1">
          <yu-xform-item label="备注" name="contrRemark" ctype="input" type="textarea" rows="3"></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div slot="footer" align="center">
        <el-button v-if="viewType=='ADD'" type="primary" @click="saveCreateFn()">保 存</el-button>
        <el-button v-if="viewType=='EDIT'" type="primary" @click="saveEditFn()">保 存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </yu-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import { backend, baseUrl } from "@/config";
import { getUserInfo } from '@/utils'
export default {
  name: 'ContrMgt',
  data: function () {
    var me = this;
    let userInfo = getUserInfo()
    return {
      userInfo: userInfo,
      viewType: 'DETAIL',
      isChildNode: false,
      funcId: '',
      viewTitle: {
        'DETAIL': '详情',
        'ADD': '新增',
        'EDIT': '修改'
      },
      formDisabled: false,
      dialogVisible: false,
      treeUrl: backend.appOcaService + '/api/adminsmrescontr/treequery',
      contrDataUrl: backend.appOcaService + '/api/adminsmrescontr/getcontrinfo',
      pointQuery: {},
      pointForm: {},
      formItemHidden: true
    };
  },
  methods: {
    queryMainGridFn: function () {
      var me = this;
      var param = {
        condition: JSON.stringify({
          funcId: this.funcId ? this.funcId : null,
          contrName: this.pointQuery.contrName ? this.pointQuery.contrName : '',
          contrCode: this.pointQuery.contrCode ? this.pointQuery.contrCode : '',
          contrUrl: this.pointQuery.contrUrl ? this.pointQuery.contrUrl : ''
        })
      };
      me.$refs.pointTable.remoteData(param);
    },
    // 左侧树节点点击事件,点击业务功能节点查询关联控制点
    nodeClickFn: function (nodeData, node, self) {
      var _this = this;
      _this.isChildNode = false;
      // update 添加F类型为子节点
      if (nodeData && nodeData.nodeType == 'F') {
        _this.isChildNode = true;
      }
      _this.funcId = nodeData.id;
      var _param = this._.cloneDeep(_this.pointQuery);
      _param.funcId = _this.funcId ? _this.funcId : null;
      var param = {
        condition: JSON.stringify(_param)
      };
      _this.$refs.pointTable.remoteData(param);
    },
    // 操作状态选择
    switchStatus: function (viewType, editable) {
      this.viewType = viewType;
      this.dialogVisible = true;
      this.formDisabled = !editable;
    },
    // 不同状态最近更新人与时间字段显示控制
    hiddenSwitch: function (viewType, isHidden) {
      this.viewType = viewType;
      this.formItemHidden = !isHidden;
    },
    // 控制点新增
    pointAddFn: function () {
      if (this.isChildNode == false) {
        this.$message({message: '请先选择业务功能节点', type: 'warning'});
        return;
      }
      this.switchStatus('ADD', true);
      this.$refs.pointTable.clearSelection();
      this.hiddenSwitch('ADD', false);
      this.$nextTick(function () {
        this.$refs.pointForm.resetFn();
      });
    },
    saveCreateFn: function () {
      var _this = this;
      delete _this.pointForm.contrId;
      _this.$refs.pointForm.validate(function (valid) {
        if (valid) {
          _this.pointForm.lastChgUsr = _this.userInfo.userId;
          _this.pointForm.funcId = _this.funcId;
          request({
            method: 'GET',
            url: backend.appOcaService + '/api/adminsmrescontr/ifcoderepeat',
            params: {
              funcId: _this.pointForm.funcId ? _this.pointForm.funcId : null,
              contrCode: _this.pointForm.contrCode ? _this.pointForm.contrCode : null
            }
          }).then(res => {
            request({
              method: 'POST',
              url: backend.appOcaService + '/api/adminsmrescontr/createcontr',
              data: _this.pointForm
            }).then(res => {
              _this.dialogVisible = false;
              _this.$message({message: '数据保存成功！', type: 'success'});
              var param = {
                condition: JSON.stringify({
                  funcId: _this.funcId ? _this.funcId : null
                })
              };
              _this.$refs.pointTable.remoteData(param);
            })
          })
        } else {
          _this.$message({message: '请检查输入项是否合法', type: 'warning'});
          return false;
        }
      });
    },
    // 控制点修改
    modifyFn: function (row) {
      this.switchStatus('EDIT', true);
      this.hiddenSwitch('EDIT', false);
      var _this = this;
      this.$nextTick(function () {
        _this.$refs.pointForm.resetFn();
        _this.pointForm = this._.cloneDeep(row);
      });
    },
    saveEditFn: function () {
      var _this = this;
      _this.$refs.pointForm.validate(function (valid) {
        if (valid) {
          _this.pointForm.lastChgUsr = _this.userInfo.userId;
          request({
            method: 'GET',
            url: backend.appOcaService + '/api/adminsmrescontr/ifcoderepeat',
            data: {
              funcId: _this.pointForm.funcId ? _this.pointForm.funcId : null,
              contrCode: _this.pointForm.contrCode ? _this.pointForm.contrCode : null,
              contrId: _this.pointForm.contrId ? _this.pointForm.contrId : null
            }
          }).then(res => {
            request({
              method: 'POST',
              url: backend.appOcaService + '/api/adminsmrescontr/editcontr',
              data: _this.pointForm
            }).then(res => {
              _this.dialogVisible = false;
              _this.$message({message: '数据保存成功！', type: 'success'});
              var param = {
                condition: JSON.stringify({
                  funcId: _this.funcId ? _this.funcId : null
                })
              };
              _this.$refs.pointTable.remoteData(param);
            })
          })
        } else {
          _this.$message({message: '请检查输入项是否合法', type: 'warning'});
          return false;
        }
      });
    },
    // 点击控制操作名称列查看控制点详情
    rowClick: function (scope) {
      this.switchStatus('DETAIL', false);
      this.hiddenSwitch('DETAIL', true);
      this.$nextTick(function () {
        this.$refs.pointForm.resetFn();
        this.pointForm =  this._.cloneDeep(scope.row)
      });
    },
    // 左侧树节点类型图标
    renderContent: function () {
      var createElement = arguments[0];
      var type = arguments[1].data.nodeType;
      return createElement('span', [
        createElement('span', {attrs: {class: 'yu-treeMenuType' + type}}, type),
        createElement('span', arguments[1].node.label)
      ]
      );
    },
    // 控制点删除,删除前先判断是否有关联数据权限信息,如有不能进行删除
    pointDeleteFn: function () {
      if (this.$refs.pointTable.selections.length < 1) {
        this.$message({message: '请先选择一条记录', type: 'warning'});
        return;
      }
      var _this = this;
      if (_this.$refs.pointTable.selections) {
        var ids = '';
        for (var i = 0; i < _this.$refs.pointTable.selections.length; i++) {
          ids = ids + ',' + _this.$refs.pointTable.selections[i].contrId;
        }
        _this.$confirm('删除控制点将删除其数据权限及授权数据,确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: function (action) {
            if (action === 'confirm') {
              request({
                method: 'POST',
                data: {
                  id: ids
                },
                url: backend.appOcaService + '/api/adminsmrescontr/deletecontr/' + ids
              }).then(res => {
                  _this.$message({message: '数据删除成功！', type: 'success'});
                  var param = {
                    condition: JSON.stringify({
                      funcId: _this.funcId ? _this.funcId : null
                    })
                  };
                  _this.$refs.pointTable.remoteData(param);
              })
            }
          }
        });
      }
    }
  }
}
</script>