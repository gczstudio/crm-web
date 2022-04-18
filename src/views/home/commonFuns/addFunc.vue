<template>
  <div class="common-funcs-add">
    <div class="common-funcs__header">
      <div class="dashboard_section-title f3"><i class="iconfont icon-changyonggongneng"></i> 常用功能</div>
      <div class="common-funcs__search">
        <el-input placeholder="请输入常用功能名称" v-model="funName" clearable class="yu-input" style="width: 400px;">
          <template slot="append"><div class="yu-input-slot" @click="searchFunc">搜索</div></template>
        </el-input>
      </div>
      <el-button class="common-funcs__back fr" icon="el-icon-close" @click="goBack">关闭</el-button>
    </div>
    <el-row :gutter="6">
      <el-col :span="18">
        <div class="common-funcs__menus">
          <div class="common-funcs__tabs">
            <ul class="clearfix">
              <li v-for="item in tabs" :key="item.id" :class="{'f3': true, active: curTab === item.id}" @click="tabChangeFn(item.id)">{{item.mText}}</li>
            </ul>
          </div>
          <el-scrollbar :wrap-style="`height: calc(100vh - ${this.isMaxScreen ? 258 : 232}px);`">
            <div class="common-funcs-modules">
              <div class="common-funcs-module" v-for="item in menus" :key="item.id">
                <div v-if="item.children && item.children.length">
                  <div class="common-funcs-module__title f3">{{item.mText}}</div>
                  <div class="common-funcs-module__funcs">
                    <el-row :gutter="16">
                      <el-col :span="4" v-for="(child, index) in item.children" :key="child.id">
                        <div class="common-funcs-module__func">
                          <img :src="require(`@/assets/images/theme/${themeType}/func/func${index%27}.png`)" />
                          <div class="common-funcs-module__func-mtext f2" :title="child.mText">{{child.mText}}</div>
                          <div class="mask">
                            <div class="add-btn" @click="addFuncFn(child)">添加</div>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="selected-funcs">
          <div class="selected-funcs__title f3">已添加（{{selectedFuncs.length}}/7）</div>
          <el-scrollbar :wrap-style="`height: calc(100vh - ${this.isMaxScreen ? 258 : 232}px);`">
            <el-row :gutter="16">
              <draggable v-model="selectedFuncs" group="card" animation="300" @start="drag = true" @end="dragEndFn">
                <transition-group>
                  <el-col :span="12" v-for="(item, index) in selectedFuncs" :key="item.id">
                    <div class="common-funcs-module__func has-select-funcs">
                      <i class="el-icon-close f3" @click="deleteFuncs(index)"></i>
                      <img :src="require(`@/assets/images/theme/${themeType}/func/func${index%6}.png`)" />
                      <div class="f2" style="margin-top: 10px;">{{item.mText}}</div>
                    </div>
                  </el-col>
                </transition-group>
              </draggable>
            </el-row>
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import request from "@/utils/request";
import draggable from "vuedraggable";
import { backend } from "@/config";
import { arrayToTree } from '@/utils'
import { SettingsModule } from '@/store/modules/settings';
export default {
  name: 'AddFunc',
  components: {
    draggable
  },
  props: {
    instance: Object
  },
  data () {
    return {
      curTab: '0',
      tabs: [{
        id: '0',
        mText: '全部'
      }],
      menus: this.getMenuData(),
      funName: '',
      drag: false,
      selectedFuncs: [],
      groupName: ''
    };
  },
  computed: {
    themeType() {
      return SettingsModule.themeType
    }
  }, 
  created () {
    this.tabs = this.tabs.concat(this.getMenuData());
    this.getCommonFuncData();
  },
  methods: {
    getMenuData () {
      let menu = JSON.parse(sessionStorage.getItem('contrMgr')).menu;
      menu = menu.filter(item => item.menuTip !== '建设中').map(item => {
        return {
          ...item,
          id: item.menuId,
          mText: item.menuName
        }
      })
      let menuTree = arrayToTree(menu, 'menuId', 'upMenuId')

      let menuData = menuTree.filter(function (item) {
        return item.children?.length;
      });

      menuData.map(function (item) {
        var result = [];
        item.children.map(function (child) {
          result = child.children ? result.concat(child.children) : result;
        });
        item.children = result;
      });
      return menuData;
    },
    goBack () {
      this.instance.hide()
    },
    tabChangeFn (id) {
      var _this = this;
      this.curTab = id;
      this.$nextTick(function () {
        _this.setMuesFilterSelected();
      });
    },
    getIcon () {
      return Math.floor(Math.random() * 4);
    },
    // 搜索
    searchFunc () {
      this.setMuesFilterSelected();
    },
    // 获取菜单下所有功能
    getAllChildren: function (data) {
      var result = [];
      data.map(function (item) {
        result = result.concat(item);
      });
      return result;
    },
    // 获取常用功能
    getCommonFuncData () {
      var _this = this;
      request({
        method: 'GET',
        url: backend.workService + '/api/homepageconfig/usercommfunclist'
      }).then(res => {
        _this.selectedFuncs = res.data.map(function (item) {
          return {
            id: item.menuId,
            mText: item.menuName
          };
        });
        _this.$nextTick(function () {
          _this.setMuesFilterSelected();
        });
      })
    },
    // 修改常用功能
    modifyCommFunc () {
      var _this = this;
      var menuId = this.selectedFuncs.map(function (item) {
        return item.id;
      });
      request({
        method: 'POST',
        url: backend.workService + '/api/homepageconfig/modifycommfunc',
        data: menuId
      }).then(res => {
        _this.$emit('success')
      })
    },
    addFuncFn (item) {
      var _this = this;
      if(this.selectedFuncs.length >= 7) {
        this.$message.warning("选择的菜单不能大于7个");
        return;
      }
      this.selectedFuncs.push(item);
      this.$nextTick(function () {
        _this.modifyCommFunc();
        _this.setMuesFilterSelected();
      });
    },
    deleteFuncs (index) {
      var _this = this;
      this.selectedFuncs.splice(index, 1);
      this.$nextTick(function () {
        _this.modifyCommFunc();
        _this.setMuesFilterSelected();
      });
    },
    dragEndFn () {
      this.drag = false;
      this.modifyCommFunc();
    },
    setMuesFilterSelected () {
      var _this = this;
      var ids = this.selectedFuncs.map(function (item) {
        return item.id;
      });
      var menuData = this.getMenuData();
      menuData.map(function (item) {
        for (var i = item.children.length - 1; i >= 0; i--) {
          var child = item.children[i];
          if (ids.indexOf(child.id) !== -1) {
            item.children.splice(i, 1);
          }
        }
      });

      // 查询条件
      if (this.funName && this.funName.trim()) {
        menuData.map(function (item) {
          if (item.children && item.children.length) {
            item.children = item.children.filter(function (child) {
              return child.mText.indexOf(_this.funName) !== -1;
            });
          }
        });
      }
      // 切换tab
      if (this.curTab) {
        if (this.curTab === '0') {
          this.menus = menuData;
        } else {
          menuData = menuData.filter(function (item) {
            return item.id === _this.curTab;
          });
        }
      };
      this.menus = menuData;
      return menuData;
    }
  }
}
</script>
<style lang="scss" scoped>

.common-funcs-add {
  .el-scrollbar__bar.is-horizontal {
    display: none;
  }
  .common-funcs__header {
    position: relative;
    padding: 20px;
    height: 60px;
    background: #fff;
    box-shadow: 0px 3px 7px rgba(0, 0, 0, .1);
    .common-funcs__back {
      position: absolute;
      top: 14px;
      right: 20px;
      padding: 8px 15px; 
      border: 1px solid rgba(0, 0, 0, .15);
      border-radius: 2px; 
      color: rgba(0, 0, 0, .65); 
      transition: all .3s;
      .icon-fanhui{
        color: #333;
      }
    }
    .dashboard_section-title {
      display: inline-block;
      color: rgba(0, 0, 0, 0.85); font-weight: bold;
      .iconfont{ margin-right: 8px;}
    }
    .common-funcs__search {
      position: absolute;
      top: 14px;
      left: 140px;
    }
  }
  .common-funcs-module__title {
    color: #333;
    font-weight: bold;
    margin-bottom: 12px;
  }
  .common-funcs-module__func {
    position: relative;
    margin-bottom: 30px;
    cursor: pointer;
    text-align: center;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, .2);
    border-radius: 2px;
    padding: 10px;
    .common-funcs-module__func-mtext {
      margin-top: 10px;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .mask {
      display: none;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, .5);
      border-radius: 2px;
      .add-btn {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 48px;
        height: 24px;
        line-height: 24px;
        color: #007EFF;
        background: #fff;
        box-shadow: 0 2px 3px rgba(0, 126, 255, .4);
        border-radius: 2px;
      }
    }
    &:hover{
      .mask {
        display: block;
      }
      .el-icon-close { display: block;}
    }
    .el-icon-close { 
      display: none; 
      position: absolute; 
      top: 10px; 
      right: 10px; 
      font-weight: bold;
    }
    &.has-select-funcs {
      padding: 14px 0;
    }
  }
}
.common-funcs-modules {
  padding: 0 20px;
}
.common-funcs__menus {
  background: #fff;
}
.common-funcs__tabs {
  padding: 0 20px;
  margin-bottom: 20px;
  ul {
    padding: 16px 0;
    border-bottom: 1px solid #DDD;
  }
  li { 
    position: relative;
    float: left; 
    padding: 0 14px;
    height: 32px;
    line-height: 32px; 
    margin: 0 15px; 
    border-radius: 5px; 
    cursor: pointer; 
    &.active {
      // background: $blue; 
      color: #fff;
    }
    &+li {
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: -14px;
        transform: translateY(-50%);
        display: inline-block;
        width: 1px;
        height: 12px;
        background: #666;
      }
    }
  }
}

.selected-funcs {
  background: #fff;
  padding: 0 20px;
  .el-row { padding: 0 5px;}
  .selected-funcs__title { 
    padding: 24px 0;
    font-weight: bold;
    border-bottom: 1px solid #DDD;
    margin-bottom: 20px;
  }
}

.common-funcs__search{ width: 60%; margin: 0 auto; }
.common-funcs__search .yu-input ::v-deep.el-input-group__append {
  padding: 0;
  cursor: pointer;
  // background-color: $blue;
  color: #fff;
  // border: 1px solid $blue;
}
.common-funcs__search .yu-input .el-input-group__append div {padding: 0 16px;}
.dashboard_section-title { color: rgba(0, 0, 0, 0.85); font-weight: bold;}
.common-funcs__search--input { width: 500px; margin: 0 auto; margin-top: 24px; }
.common-funcs-content { margin-top: 24px; padding: 0 80px;}
@media screen and (max-width: 1680px) {
  .common-funcs-add {
  .common-funcs__header {
    height: 60px;
    .common-funcs__back {
      position: absolute;
      top: 14px;
      right: 20px;
      padding: 8px 15px; 
      border: 1px solid rgba(0, 0, 0, .15);
      border-radius: 2px; 
      color: rgba(0, 0, 0, .65); 
      transition: all .3s;
      .icon-fanhui{
        color: #333;
      }
    }
    .dashboard_section-title {
      display: inline-block;
      color: rgba(0, 0, 0, 0.85); font-weight: bold;
      .iconfont{ margin-right: 8px;}
    }
    .common-funcs__search {
      position: absolute;
      top: 14px;
      left: 140px;
    }
  }
  }
}
</style>