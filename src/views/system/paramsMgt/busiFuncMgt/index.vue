<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="10">
        <div class="yu-main-wrapper">
          <!-- 表格工具栏 -->
          <div class="yu-main__header clearfix">
            <div class="yu-main-toolbar fr">
              <el-button icon="el-icon-plus" @click="modAddFn">新增</el-button>
            </div>
          </div>
          <div class="yu-main-form">
            <yu-xform class="search" :model="query" ref="query" form-type="search">
              <yu-xform-group :column="2">
                <yu-xform-item  placeholder="模块名称" name="modName" ctype="input" :rules="globalRules.input"></yu-xform-item>
              </yu-xform-group>
            </yu-xform>
          </div>
          <div class="yu-main-content">
            <!-- 查询结果表格 -->
            <div class="yu-main-table">
              <yu-xtable ref="modTable" :data-url="modDataUrl" row-number row-key="modName" @row-dblclick="modSelect" @row-click="modSelect" :default-load="true" border dynamic-height>
                <yu-xtable-column label="模块名称" prop="modName" :show-overflow-tooltip="true">
                  <template scope="scope">
                    <a onclick="return false;" href="javascipt:void(0);" style="text-decoration:underline;"
                      @click="modRowClick(scope)">{{ scope.row.modName }}</a>
                  </template>
                </yu-xtable-column>
                <yu-xtable-column label="操作" width="120" align="center">
                  <template slot-scope="scope">
                    <el-button class="yu-action-btn" @click.native.prevent="modModifyFn(scope.row)" type="text">修改</el-button>
                    <el-button class="yu-action-btn" @click.native.prevent="modDeleteFn(scope.row)" type="text">删除</el-button>
                  </template>
                </yu-xtable-column>
              </yu-xtable>
            </div>
          </div>
        </div>
        <yu-dialog  :title="viewTitle[viewType]" :visible.sync="modDialogVisible" width="500px">
          <yu-xform :model="modForm" ref="modForm" :disabled="modFormDisabled" label-width="120px">
            <yu-xform-group :column="1">
              <yu-xform-item label="模块名称" name="modName" :rules="globalRules.requiredInput" ctype="input"></yu-xform-item>
              <yu-xform-item label="模块描述" name="modDesc" :rules="globalRules.input" ctype="input" type="textarea"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
          <div slot="footer" align="center">
            <el-button v-if="viewType=='ADD'" type="primary" @click="saveCreateMod()">保 存</el-button>
            <el-button v-if="viewType=='EDIT'" type="primary" @click="saveEditMod()">保 存</el-button>
            <el-button @click="modDialogVisible = false">取消</el-button>
          </div>
        </yu-dialog>
      </el-col>
      <el-col :span="14">
        <div class="yu-main-wrapper">
           <!-- 表格工具栏 -->
          <div class="yu-main__header clearfix">
            <div class="yu-main-toolbar fr">
              <el-button icon="el-icon-plus" @click="funcAddFn">新增</el-button>
              <el-button icon="el-icon-delete" @click="funcDeleteFn">删除</el-button>
            </div>
          </div>
          <div class="yu-main-form">
            <yu-xform class="search" :model="query1" :search="funcSearch" ref="query1" form-type="search">
              <yu-xform-group :column="3">
                <yu-xform-item placeholder="功能点名称" name="funcName" ctype="input" :rules="globalRules.input"></yu-xform-item>
                <yu-xform-item placeholder="URL链接" name="funcUrl" ctype="input" :rules="globalRules.input500"></yu-xform-item>
              </yu-xform-group>
            </yu-xform>
          </div>
          <div class="yu-main-content">
            <!-- 查询结果表格 -->
            <div class="yu-main-table">
              <yu-xtable ref="funcTable" :data-url="funcDataUrl" row-number selection-type="checkbox" :default-load="false"  border dynamic-height>
                <yu-xtable-column label="业务功能名称" prop="funcName" :show-overflow-tooltip="true" :sortable="true"
                  :resizable="true">
                  <template scope="scope">
                    <a onclick="return false;" href="javascipt:void(0);" style="text-decoration:underline;"
                      @click="funcRowClick(scope)">{{ scope.row.funcName }}</a>
                  </template>
                </yu-xtable-column>
                <yu-xtable-column label="URL链接" prop="funcUrl" :show-overflow-tooltip="true" :sortable="true"
                  :resizable="true" :showOverflowTooltip="true">
                </yu-xtable-column>
                  <yu-xtable-column label="顺序" prop="funcOrder" :show-overflow-tooltip="true" :sortable="true"
                    :resizable="true">
                  </yu-xtable-column>
                  <yu-xtable-column label="操作" width="100" align="center">
                    <template slot-scope="scope">
                      <el-button class="yu-action-btn" @click.native.prevent="funcModifyFn(scope.row)" type="text">修改</el-button>
                    </template>
                  </yu-xtable-column>
              </yu-xtable>
            </div>
          </div>
        </div>
        <yu-dialog  :title="viewTitle[viewType]" :visible.sync="funcDialogVisible" width="800px">
          <yu-xform :model="funcForm" ref="funcForm" :disabled="funcFormDisabled" label-width="120px">
            <yu-xform-group :column="1">
              <yu-xform-item label="功能点名称" :rules="globalRules.requiredInput" name="funcName" ctype="input">
              </yu-xform-item>
              <yu-xform-item label="URL链接" :rules="globalRules.required" name="funcUrl" ctype="input">
                </yu-xform-item>
            </yu-xform-group>
            <yu-xform-group :column="2">
              <yu-xform-item label="图标" name="funcIcon" :rules="globalRules.required" ctype="input">
              </yu-xform-item>
              <yu-xform-item label="顺序" name="funcOrder" :rules="globalRules.required" ctype="input"></yu-xform-item>
              <yu-xform-item label="最近更新人" :hidden="funcFormItemHidden" name="lastChgName" ctype="input"></yu-xform-item>
              <yu-xform-item label="最近更新时间" :hidden="funcFormItemHidden" name="lastChgDt" ctype="input"></yu-xform-item>
            </yu-xform-group>
            <yu-xform-group :column="1">
              <yu-xform-item label="功能点描述" name="funcDesc" :rules="globalRules.desc" ctype="input" type="textarea">
              </yu-xform-item>
            </yu-xform-group>
          </yu-xform>
          <div slot="footer" align="center">
            <el-button v-if="viewType=='ADD'" type="primary" @click="saveCreateFunc()">保 存</el-button>
            <el-button v-if="viewType=='EDIT'" type="primary" @click="saveEditFunc()">保 存</el-button>
            <el-button @click="funcDialogVisible = false">取消</el-button>
          </div>
        </yu-dialog>
      </el-col>
    </el-row>
    <yu-dialog  title="图标选择" :visible.sync="iconDialogVisible" height="400px">
      <div class="yu-icons">
        <a v-for="icons in icons" href="javascript:void(0)" :key="icons" :class="icons" :title="icons" @click="iconSelect"></a>
      </div>
    </yu-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import { backend, baseUrl } from "@/config";
import { getUserInfo } from '@/utils'
export default {
  name: 'BusiFuncMgt',
  data: function () {
    var me = this;
    // 业务功能url格式校验
    var urlValidate = function (rule, value, callback) {
      var reg = /^pages\/([a-zA-Z0-9_]+\/)+[a-zA-Z0-9_]+$/;
      if (!reg.test(value)) {
        callback(new Error('请输入合法格式'));
        return;
      }
      callback();
    };
    // 业务功能顺序校验
    var orderValidate = function (rule, value, callback) {
      var reg = /^\d{0,4}$/;
      if (!reg.test(value)) {
        callback(new Error('请输入数字(不超过9999)'));
        return;
      }
      callback();
    };
    let userInfo = getUserInfo()
    return {
      userInfo: userInfo,
      viewType: 'DETAIL',
      viewTitle: {
        'DETAIL': '详情',
        'ADD': '新增',
        'EDIT': '修改'
      },
      iconDialogVisible: false,
      modCurrentRow: '',
      modFormDisabled: false,
      funcFormDisabled: false,
      modDialogVisible: false,
      funcDialogVisible: false,
      modDataUrl: backend.appOcaService + '/api/adminsmfuncmod/querymod',
      funcDataUrl: backend.appOcaService + '/api/adminsmbusifunc/queryfunc',
      icons: [],
      query: {},
      query1: {},
      modForm: {},
      funcForm: {},
      modFormItemDisabled: true,
      funcFormItemDisabled: true,
      modFormItemHidden: true,
      funcFormItemHidden: true
    };
  },
  methods: {
    funcSearch: function (model, valid) {
      var param = {
        condition: JSON.stringify({
          modId: this.modCurrentRow.modId ? this.modCurrentRow.modId : null,
          funcName: this.query1.funcName ? this.query1.funcName : null,
          funcUrl: this.query1.funcUrl ? this.query1.funcUrl : null
        })
      };
      this.$refs.funcTable.remoteData(param);
    },
    modIsOuterChange: function (isOuter) {
      if (isOuter == 'Y') {
        this.modFormItemDisabled = false;
      } else {
        this.modFormItemDisabled = true;
      }
    },
    // 模块管理操作状态选择
    modSwitchStatus: function (viewType, editable) {
      this.viewType = viewType;
      this.modDialogVisible = true;
      this.modFormDisabled = !editable;
    },
    // 模块管理不同状态最近更新人与时间字段显示控制
    modSwitchHidden: function (viewType, isHidden) {
      this.viewType = viewType;
      this.modFormItemHidden = !isHidden;
    },
    // 是否外部系统
    isOuterFn: function () {
      this.modForm.userName = '';
      this.modForm.userKey = '';
      this.modForm.password = '';
      this.modForm.pwdKey = '';
    },
    // 业务功能管理操作状态选择
    funcSwitchStatus: function (viewType, editable) {
      this.viewType = viewType;
      this.funcDialogVisible = true;
      this.funcFormDisabled = !editable;
    },
    // 业务功能管理不同状态最近更新人与时间字段显示控制
    funcSwitchHidden: function (viewType, isHidden) {
      this.viewType = viewType;
      this.funcFormItemHidden = !isHidden;
    },
    // 模块新增
    modAddFn: function () {
      this.modSwitchStatus('ADD', true);
      this.$refs.modTable.clearSelection();
      this.modSwitchHidden('ADD', false);
      this.$nextTick(function () {
        this.$refs.modForm.resetFn();
        this.modForm.isApp = 'N';
        this.modForm.isOuter = 'N';
      });
    },
    saveCreateMod: function () {
      var _this = this;
      if (_this.modForm.isOuter == 'N') {
        _this.isOuterFn();
      }
      delete _this.modForm.modId;
      _this.$refs.modForm.validate(function (valid) {
        if (valid) {
          _this.modForm.lastChgUsr = _this.userInfo.userId;
          request({
            method: 'GET',
            url: backend.appOcaService + '/api/adminsmfuncmod/checkname',
            params: {
              modName: _this.modForm.modName ? _this.modForm.modName : null,
              modId: _this.modForm.modId ? _this.modForm.modId : null
            }
          }).then(res => {
            request({
              method: 'POST',
              url: backend.appOcaService + '/api/adminsmfuncmod/createmod',
              data: _this.modForm
            }).then(res => {
              _this.modDialogVisible = false;
              _this.$message({ message: '保存成功！', type: 'success' });
              _this.$refs.modTable.remoteData({});
            })
          })
        } else {
          _this.$message({ message: '请检查输入项是否合法', type: 'warning' });
          return false;
        }
      });
    },
    // 模块修改
    modModifyFn: function (row) {
      this.modSwitchStatus('EDIT', true);
      this.modSwitchHidden('EDIT', false);
      this.modForm = row;
    },
    saveEditMod: function () {
      var _this = this;
      if (_this.modForm.isOuter == 'N') {
        _this.isOuterFn();
      }
      _this.$refs.modForm.validate(function (valid) {
        if (valid) {
          _this.modForm.lastChgUsr = _this.userInfo.userId;
          request({
            method: 'GET',
            url: backend.appOcaService + '/api/adminsmfuncmod/checkname',
            params: {
              modName: _this.modForm.modName ? _this.modForm.modName : null,
              modId: _this.modForm.modId ? _this.modForm.modId : null
            }
          }).then(res => {
            request({
              method: 'POST',
              url: backend.appOcaService + '/api/adminsmfuncmod/editmod',
              data: _this.modForm
            }).then(res => {
              _this.modDialogVisible = false;
              _this.$message({ message: '数据保存成功！', type: 'success' });
              _this.$refs.modTable.remoteData();
            })
          })
        } else {
          _this.$message({ message: '请检查输入项是否合法', type: 'warning' });
          return false;
        }
      });
    },
    // 业务功能新增
    funcAddFn: function () {
      if (this.modCurrentRow.modId == '' || this.modCurrentRow.modId == undefined) {
        this.$message({ message: '请先选择模块', type: 'warning' });
        return;
      }
      this.funcSwitchStatus('ADD', true);
      this.funcSwitchHidden('ADD', false);
      this.$refs.funcTable.clearSelection();
      this.$nextTick(function () {
        this.$refs.funcForm.resetFn();
      });
    },
    saveCreateFunc: function () {
      var _this = this;
      delete _this.funcForm.funcId;
      _this.$refs.funcForm.validate(function (valid) {
        _this.funcForm.modId = _this.modCurrentRow.modId;
        _this.funcForm.lastChgUsr = _this.userInfo.userId;
        if (valid) {
          request({
            method: 'POST',
            url: backend.appOcaService + '/api/adminsmbusifunc/createfunc',
            data: _this.funcForm
          }).then(res => {
            _this.funcDialogVisible = false;
            _this.$message({ message: '数据保存成功！', type: 'success' });
            _this.funcSearch();
          })
        } else {
          _this.$message({ message: '请检查输入项是否合法', type: 'warning' });
          return false;
        }
      });
    },
    // 业务功能修改
    funcModifyFn (row) {
      this.funcSwitchStatus('EDIT', true);
      this.funcSwitchHidden('EDIT', false);
      this.$nextTick(() =>  {
        this.funcForm = this._.cloneDeep(row);
      });
    },
    saveEditFunc: function () {
      var _this = this;
      _this.$refs.funcForm.validate(function (valid) {
        _this.funcForm.lastChgUsr = _this.userInfo.userId;
        if (valid) {
          request({
            method: 'POST',
            url: backend.appOcaService + '/api/adminsmbusifunc/editfunc',
            data: _this.funcForm
          }).then(res => {
            _this.funcDialogVisible = false;
            _this.$message({ message: '数据保存成功！', type: 'success' });
            var param = {
              condition: JSON.stringify({
                modId: _this.modCurrentRow.modId ? _this.modCurrentRow.modId : null
              })
            };
            _this.$refs.funcTable.remoteData(param);
          })
        } else {
          _this.$message({ message: '请检查输入项是否合法', type: 'warning' });
          return false;
        }
      });
    },
    // 点击模块名称列,查看模块管理详情
    modRowClick: function (scope) {
      this.modSwitchStatus('DETAIL', false);
      this.modSwitchHidden('DETAIL', true);
      this.$nextTick(function () {
        this.$refs.modForm.resetFn();
        this.modForm = this._.cloneDeep(scope.row)
      });
    },
    // 点击业务功能名称列,查看业务功能管理详情
    funcRowClick: function (scope) {
      this.funcSwitchStatus('DETAIL', false);
      this.funcSwitchHidden('DETAIL', true);
      this.$nextTick(function () {
        this.$refs.funcForm.resetFn();
        this.funcForm = this._.cloneDeep(scope.row)
      });
    },
    // 模块删除,删除前先判断是否有关联业务功能信息,如有不能进行删除
    modDeleteFn: function (row) {
      // if (this.$refs.modTable.selections.length < 1) {
      //   this.$message({ message: '请先选择一条记录', type: 'warning' });
      //   return;
      // }
      var _this = this;
      _this.$confirm('确定删除所选模块?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: function (action) {
          if (action === 'confirm') {
            request({
              method: 'POST',
              data: {
                modId: row.modId
              },
              url: backend.appOcaService + '/api/adminsmfuncmod/deletemod',
            }).then(res => {
              _this.$message({ message: '数据删除成功！', type: 'success' });
              _this.modCurrentRow.modId = '';
              _this.$refs.modTable.remoteData({});
            })
          }
        }
      });
    },
    // 业务功能删除,删除前先判断是否有关联控制点信息,如有不能进行删除
    funcDeleteFn: function (row) {
      var _this = this;
      if (_this.$refs.funcTable.selections) {
        var ids = '';
        for (var i = 0; i < _this.$refs.funcTable.selections.length; i++) {
          ids = ids + ',' + _this.$refs.funcTable.selections[i].funcId;
        }
        _this.$confirm('确定删除所选业务功能?', '提示', {
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
                url: backend.appOcaService + '/api/adminsmbusifunc/deletefunc'
              }).then(response => {
                _this.$message.success("删除成功");
                var param = {
                  condition: JSON.stringify({
                    modId: _this.modCurrentRow.modId ? _this.modCurrentRow.modId : null
                  })
                };
                _this.$refs.funcTable.remoteData(param);
              })
            }
          }
        });
      }
    },
    // 模块点击事件,查询模块关联业务功能
    modSelect: function (row, event) {
      this.modCurrentRow = row;
      var param = {
        condition: JSON.stringify({
          modId: this.modCurrentRow.modId ? this.modCurrentRow.modId : null
        })
      };
      this.$refs.funcTable.remoteData(param);
    },
    // 业务功能图标选择
    iconSelect: function (event) {
      this.funcForm.funcIcon = event.target.className;
      this.iconDialogVisible = false;
    }
  }
}
</script>