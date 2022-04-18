<template>
  <div class="yu-xtable" v-mloading="loading">
    <div class="yu-xtable__table">
      <el-table ref="table" :height="height || tableHeight" v-bind="$attrs" v-on="$listeners" :data="tableData" highlight-current-row @row-click="rowClickFn" @select="selectChange" @select-all="selectAllChange" @sort-change="sortChangeFn">
        <el-table-column
          v-if="selectionType==='checkbox'"
          type="selection"
          align="center"
          width="55"
          :fixed="isFixedLeft"
        >
        </el-table-column>
        <el-table-column
          v-if="selectionType==='radio'"
            type="radio"
            width="55"
            align="center"
            :fixed="isFixedLeft"
          >
          <template slot-scope="scope">
            <el-radio @click.native.prevent="radioChangeFn(scope.row, $event)" v-model="radioForm['radio-'+scope.$index]" :label="scope.$index" class="el-radio--table"></el-radio>
          </template>
        </el-table-column>
        <el-table-column
          v-if="rowNumber"
          class-name="el-table-index"
          type="index"
          label="序号"
          align="center"
          :fixed="isFixedLeft"
          width="55">
        </el-table-column>
        <slot></slot>
        <div slot="empty">
          <Empty />
        </div>
      </el-table>
    </div>
    <div class="yu-pagination" v-if="pageable">
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page="page"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="size"
        :layout="layout"
        :total="pageTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'YuXtable',
  componentName: 'YuXtable',
  inheritAttrs: false,
  provide: function () {
    return {
      yuXtable: this
    };
  },
  props: {
    height: {
      type: [Number, String],
      default: null
    },
    dynamicHeight: {   // 是否动态计算表格高度
      type: Boolean,
      default: false
    },
    data: Array,
    dataUrl: String,
    baseParams: {
      type: Object,
      default: function () {
        return {};
      }
    },
    selectionType: String, // checkbox, radio
    defaultLoad: {
      type: Boolean,
      default: true
    },
    requestType: {
      type: String,
      default: 'GET'
    },
    pageable: {
      type: Boolean,
      default: true
    },
    rowNumber: {
      type: Boolean,
      default: false
    },
    rowKey: {
      type: String,
      // required: true
      default: 'rowId'
    },
    autoClearChecked: { // 除点击分页查询外，其他情况都清除选中
      type: Boolean,
      default: true
    },
    total: {
      type: Number,
      default: 0
    },
    pageChange: Function,
    sizeChange: Function,
    loadEnd: Function,
    initSelection: {   // 一些特殊情况，监听到data改变时，不初始化
      type: Boolean,
      default: true
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    pageSize: {
      type: Number,
      default: 20
    }
  },
  data: function () {
    return {
      loading: false,
      isFixedLeft: false,
      page: 1,
      size: 20,
      pageTotal: 0,
      originTableData: [],
      tableData: [],
      searchParams: {},
      sort: '',
      radioForm: {},
      selections: [], // 当前选中的值
      tableHeight: null,
      dataCodes: []
    };
  },
  watch: {
    baseParams: function (params) {
      this.remoteData(params);
    },
    total: function (total) {
      this.pageTotal = total;
    },
    pageSize: {
      handler (data) {
        this.size = data;
      },
      immediate: true
    },
    data: {
      handler(data) {
        if (!this.dataUrl) {
          if (this.initSelection) {
            this.selections = [];
          } else {
            // 设置选中，并同步更新this.selections
            this.updateSelections(data);
            this.toggleSelection(this.selections)
          }
          this.originTableData = data;
          this.tableData = this.pageable ? data.slice(0, this.page * this.size) : data;
          this.pageTotal = this.total || data.length;
        }
      },
      deep: true
    },
    selections: function (val) {
      this.$emit('selections-change', this.selections);
    }
  },
  created: function () {
    // 判断是否将序号固定
    this.isFixedLeft = this.$slots.default && this.$slots.default[0].data && this.$slots.default[0].data.attrs.fixed;
    if (this.data) {
      this.tableData = this.data;
      return;
    }
  },
  mounted: function () {
    this.$lookup.reg(this.dataCodes.join(','), () => {
      this.defaultLoad && this.remoteData();
    })
    if (this.dynamicHeight) {
      this.setTableHeight();
    }
  },
  methods: {
    setTableHeight() {
      // 点击展开的时候，涉及到300ms的动画，获取top值不准确
      setTimeout(() => {
        const { top } = this.$refs.table.$el.getBoundingClientRect();
        let dHeight = document.body.clientHeight - top - (this.pageable ? (this.isMaxScreen ? 70 : 63) : (this.isMaxScreen ? 34 : 24));
        this.tableHeight = dHeight;
      }, 300)
     
    },
    updateSelections: function (data) {
      this.selections =  this.selections.map(item => {
        return {
          ...item,
          ...data.find(ele => ele[this.rowKey] === item[this.rowKey]) || {}
        }
      })
    },
    // 重新布局
    doLayout: function () {
      this.$refs.table && this.$refs.table.doLayout();
    },
    rowClickFn (row, column, event) {
      this.radioChangeFn(row)
    },
    // 单选
    radioChangeFn (currentRow, event) {
      if(event) {
        event.stopPropagation()
        event.preventDefault()
      }
    
      if (!currentRow) {
        return;
      }
      if (this.selectionType === 'radio') {
        var curIndex = '';
        // // 如果重复点击，则取消
        // if (this.selections.length && this.selections[0][this.rowKey] === currentRow[this.rowKey] && !flag) {
        //   this.selections = [];
        //   this.radioForm = {};
        //   return;
        // }
        this.tableData.map( (item, index) => {
          if (item[this.rowKey] === currentRow[this.rowKey]) {
            curIndex = index;
          }
        });
        this.selections = [currentRow];
        this.radioForm = {};
        this.$set(this.radioForm, 'radio-' + curIndex, curIndex);
      }
    },
    // 手动删除某个selections
    deleterSelectionFn(selection) {
      for(var i=this.selections.length-1;i>=0;i--) {
        let item = this.selections[i];
        if(item[this.rowKey] === selection[this.rowKey]) {
          this.selections.splice(i, 1);
          this.toggleSelection();
        }
      }
    },
    // 多选
    selectAllChange: function (selection) {
      var _this = this;
      if (selection.length) {
        // 全选
        var selectionIds = this.selections.map(function (item) {
          return item[_this.rowKey];
        });
        selection.map(function (item, index) {
          if (!selectionIds.includes(item[_this.rowKey])) {
            _this.selections.push(item);
          }
        });
      } else {
        // 取消全选
        var tableDataIds = this.tableData.map(function (item) {
          return item[_this.rowKey];
        });
        for (var i = this.selections.length - 1; i >= 0; i--) {
          var item = this.selections[i];
          var curIndex = tableDataIds.indexOf(item[this.rowKey]);
          if (curIndex !== -1) {
            _this.selections.splice(i, 1);
          }
        }
      }
    },
    selectChange: function (selection, row) {
      var _this = this;
      var checked = false; // 判断是否选中
      selection.map(function (item) {
        if (item[_this.rowKey] === row[_this.rowKey]) {
          checked = true;
        }
      });

      if (checked) {
        this.selections.push(row);
      } else {
        this.selections.map(function (item, index) {
          if (item[_this.rowKey] === row[_this.rowKey]) {
            _this.selections.splice(index, 1);
          }
        });
      }
    },
    // 设置当前页的选中
    toggleSelection: function (selections) {
      var _this = this;
      if(selections) {
        this.selections = selections
      }
      this.$nextTick(() => {
        if (this.selections.length) {
          var selectionIds = this.selections.map(function (item) {
            return item[_this.rowKey];
          });
          this.tableData.map(function (item) {
            _this.$refs.table.toggleRowSelection(item, selectionIds.indexOf(item[_this.rowKey]) !== -1);
          });
        } else {
          this.clearSelection()
        }
      });
    },
    // 清除所有的选中
    clearSelection: function () {
      this.selections = [];
      this.$refs.table && this.$refs.table.clearSelection();
    },
    // 单选时设置选中
    setCurrentRow: function (row) {
      this.radioForm = {};
      this.$refs.table && this.$refs.table.setCurrentRow(row);
    },
    // 合并condition
    mergeCondition: function (params) {
      // 如果params为undefined， 保留之前的查询条件
      if (params === undefined) {
        params = Object.assign({}, this.searchParams);
      }
      var baseParams = this.formatParams(this.baseParams);
      params = this.formatParams(params);
      var result = Object.assign({}, baseParams, params);
      // 将空值转换为null
      var condition = Object.assign({}, baseParams.condition, params.condition)
      Object.keys(condition).forEach(item => {
        condition[item] = condition[item] || null
      });
      result.condition = JSON.stringify(condition);
      this.searchParams = result;
      return result;
    },
    formatParams: function (data) {
      data = Object.assign({}, data);
      if (data.condition && typeof data.condition === 'string') {
        data.condition = JSON.parse(data.condition);
      } else {
        data.condition = data.condition || {};
      }
      return data;
    },
    /**
     * params为object时，为查询参数，为boolean时，是否清除selection
     * clearSelection 是否清除selection
     */
    remoteData: function (params, clearSelection, callback) {
      var _this = this;
      this.page = 1;
      this.$refs.table && this.$refs.table.clearSort();
      this.sort = '';
      this.$nextTick(function () {
        _this.getTableData(params, clearSelection, callback);
      });
    },
    setTableData(data) {
      this.tableData = data;
    },
    clearTable() {
      this.tableData = [];
      this.pageTotal = 0;
    },
    getTableData (params, clearSelection, callback) {
      if(!this.dataUrl) return;
      if ((typeof params === 'boolean' && params) || clearSelection || (params !== false && clearSelection === undefined && this.autoClearChecked)) {
        this.clearSelection();
      }
      this.loading = true;
      var data = this.mergeCondition(params);
      if (this.pageable) {
          data = Object.assign(data, {
          page: this.page,
          size: this.size,
          sort: params?.customSort || this.sort || null
        });
      }
      request({
        method: this.requestType,
        url: this.dataUrl,
        params: data
      }).then(response => {
        this.loading = false;
        // 会存在没有code的情况，这个时候特殊处理一下
        if ((response.data && Array.isArray(response.data))) {
          this.tableData = response.data;
          this.pageTotal = response.total;
          callback && callback(response.data);
          this.$nextTick(function () {
            if (this.$refs.table && this.$refs.table.bodyWrapper) {
              // 重新计算一下表格的高度
              if (this.dynamicHeight) {
                this.setTableHeight();
              }
              this.$refs.table.bodyWrapper.scrollTop = 0; // 数据更新后，滚动条回到顶部
              this.$refs.table.bodyWrapper.style.zIndex = response.data.length ? 0 : 2; // 解决没有数据时被固定列遮挡滚动条
              // this.$refs.table.bodyWrapper.scrollLeft = 0;
            }
            this.doLayout(); // 重新布局
            if (this.selectionType === 'checkbox') {
              this.toggleSelection();
            }
            if (this.selectionType === 'radio') {
              this.setCurrentRow();
            }
            this.loadEnd && this.loadEnd(response.data);
          });
        } else {
          this.tableData = [];
          this.pageTotal = 0;
        }
      }).catch(err => {
        if (this.dynamicHeight) {
          this.setTableHeight();
        }
        this.loading = false;
      })
    },
    sortChangeFn: function ({column, prop, order}) {
      var _this = this;
      if(column.sortable === 'custom') {
        this.sort = order ? prop + " " + (order === "descending" ? "desc" : "asc") : null
        this.$nextTick(function () {
          this.tableData.length && _this.getTableData(this.searchParams);
        });
      }
    },
    handleSizeChangeFn: function (size) {
      var _this = this;
      this.size = size;
      if (this.sizeChange) {
        this.sizeChange(size);
        return;
      }
      if (!this.dataUrl && this.pageable) {
        this.tableData = this.originTableData.slice(0, this.page * size);
        return;
      }
      this.$nextTick(function () {
        _this.getTableData(this.searchParams, false);
      });
    },
    handleCurrentChangeFn: function (page) {
      var _this = this;
      this.page = page;
      if (this.pageChange) {
        this.pageChange(page);
        return;
      }
      if (!this.dataUrl && this.pageable) {
        this.tableData = this.originTableData.slice((page - 1) * this.size, page * this.size);
        return;
      }
      this.$nextTick(function () {
        _this.getTableData(this.searchParams, false);
      });
    }
  }
}
</script>

<style lang="scss">
.yu-xtable  {
  .chart-empty {
    .el-empty__image {
      width: 250px;
    }
  }
  .yu-pagination { 
    text-align: right; 
    padding: 10px;
    // border-top: 1px solid #D8D8D8;
  }
  .el-table--border th:first-child .cell { padding: 0 20x;}
  .el-table {
    th {
      height: 40px;
      padding: 0;
      color: #333;
      background: #F2F2F2;
      font-weight: bold;
      .cell {
        padding: 0 20px;
      }
      &.el-table-index .cell {
        padding: 0 10px;
      }
    }
    td.el-table-index .cell > div {
      font-family: "Times New Roman", Times, serif !important;
    }

    // .el-table__body-wrapper { z-index: 2;}
    
    .caret-wrapper {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0;
      display: none;
    }
    .el-table__cell {
      &:hover, &.ascending, &.descending {
        .caret-wrapper {
          display: inline-block;
        }
      }
    }
  }
  
  
  .el-table .cell { color: #333;}

  .el-table thead.is-group th {
    background: #F2F2F2;
  }
  .el-table--border {
    border: 1px solid #D8D8D8;
    td, th, th.is-leaf {
      border-bottom: 1px solid #D8D8D8;
      border-right: 1px solid #D8D8D8;
    }
    th{ background: #F2F2F2; }
  }
  .el-radio--table {
    .el-radio__label {
      display: none;
    }
  }
  .el-table__fixed-right::before, .el-table__fixed::before { background-color: transparent; }

  
  
}

@media screen and (min-width: 1920px) {
  .yu-xtable  {
    .el-table {
      th {
        height: 48px;
      }
    }
  }
}

@media screen and (max-width: 1680px) {
  .yu-xtable  {
    .el-table {
      th {
        height: 30px;
        &>.cell {
          font-size: 13px;
        }
      }
      td {
        padding: 3px 0;
      }
      .cell {
        font-size: 13px;
        .el-button {
          font-size: 13px;
        }
      }
    }
  }
}

</style>
