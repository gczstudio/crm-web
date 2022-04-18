<template>
  <div :class="{'yufp-top10-table': true, border: border}">
      <div class="top10-table__header" v-if="title || showMore">
        <span class="top10-table__title">{{title}}</span>
        <small-tab :class="{fr:!showMore}" :type="tabType" v-model="curTab" :data="tabs" @change="tabChange"></small-tab>
        <span v-if="showMore" class="view-more" @click="viewMoreFn">更多<i class="el-icon-arrow-right"></i></span>
      </div>
      <div ref="table" class="top10-table__table" v-mloading="loading">
        <el-table
          ref="table"
          :key="JSON.stringify(tableData)"
          :data="tableData"
          :height="height"
          border
          style="width: 100%">
          <el-table-column v-if="showRank" label="排名" width="60" align="center">
            <template slot-scope="scope">
              <div class="rank-cell">
                <img class="icon-rank" v-if="scope.row[rankKey]<4" :src="require('@/assets/images/common/no.png')" />
                <span :class="{'rank-no': scope.row[rankKey]<4}">{{ scope.row[rankKey]}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-for="(column, index) in columns" :key="index" v-bind="column">
            <template slot-scope="scope">
              <div @click.prevent="column.onClick ? column.onClick(scope) : null" :class="{'render-box': true, 'num': column.isNum || column.formatMoney}" v-html="column.render ? column.render(scope) : (column.formatMoney ? $util.formatMoney(scope.row[column.prop]) : scope.row[column.prop])"></div>
            </template>
          </el-table-column>
          <div slot="empty">
            <Empty />
          </div>
        </el-table>
        <el-pagination
          v-if="pageable"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
</template>

<script>
import request from '@/utils/request'
import { backend } from '@/config'

export default {
  name: 'TopTable',
  props: {
    tabs: {
      type: Array,
      default: function () {
        return [];
      }
    },
    tabValue: Number,
    tabType: {
      type: String,
      default: 'top'
    },
    title: String,
    showMore: { // 是否显示查看更多
      type: Boolean,
      default: true
    },
    showRank: { // 是否显示排名
      type: Boolean,
      default: true
    },
    rankKey: {
      type: String,
      default: 'rowId'
    }, // 排名key
    columns: {
      type: Array,
      default: function () {
        return [];
      }
    },
    data: {
      type: Array,
      default: function () {
        return [];
      }
    },
    height: {
      type: Number,
      default: 458
    },
    border: {
      type: Boolean,
      default: false
    },
    formatMoney:  {
      type: Boolean,
      default: false
    },
    url: String,
    pageable: {
      type: Boolean,
      default: false
    },
    pageSize: Number,
    baseParams: Object
  },
  computed: {
    changeData: function () {
      return {
        baseParams: this.baseParams,
        url: this.url,
        tabValue: this.tabValue
      };
    }
  },
  watch: {
    data: function (data) {
      this.loading = false;
      this.tableData = data;
    },
    changeData: function () {
      this.getData();
    },
    pageSize: function (val) {
      this.size = val;
    }
  },
  data: function () {
    return {
      tableData: [],
      loading: true,
      curTab: 0,
      page: 1,
      size: 10,
      total: 0
    };
  },
  created: function () {
    var _this = this;
    this.size = this.pageSize;
    this.curTab = this.tabValue;
    if (this.url) {
      this.$nextTick(function () {
        _this.getData();
      });
    }
  },
  methods: {
    clearSort: function () {
      this.$refs.table && this.$refs.table.clearSort();
    },
    // 自适应表格列宽
    flexColumnWidth: function (column, tableData) {
      var tableWidth = this.$refs.table ? this.$refs.table.clientWidth : 0;
      if (tableData && tableData.length > 0 && tableWidth) {
        var flexWidth = 0;
        // var avgWidth = tableWidth / this.columns.length;
        var minWidth = (column.label.length * 15) + 5;
        var values = tableData.filter(function (item) {
          return item[column.prop];
        }).map(function (item) {
          return item[column.prop];
        }).sort(function (a, b) {
          return String(b).length - String(a).length;
        });
        if (values.length) {
          var maxVal = values[0];
          flexWidth = this.calcStrWidth(maxVal);
        }
        // 计算其他columns的总宽度
        var str = this.columns.filter(function (item) {
          return item.label !== column.label;
        }).map(function (item) {
          return item.label;
        }).join('');
        var otherColumnsWidth = (5 * (this.columns.length - 1)) + 80 + this.calcStrWidth(str);
        var maxWidth = tableWidth - otherColumnsWidth;
        // if (flexWidth < avgWidth) {
        //   flexWidth = avgWidth;
        // }
        if (flexWidth > maxWidth) {
          flexWidth = maxWidth;
        }
        if (flexWidth < minWidth) {
          flexWidth = minWidth;
        }
        return flexWidth;
      }
      return null;
    },
    calcStrWidth: function (str) {
      str = str.split('');
      var flexWidth = 0;
      str.map(function (char) {
        if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
          // 如果是英文字符，为字符分配8个单位宽度
          flexWidth += 8;
        } else if (char >= '\u4e00' && char <= '\u9fa5') {
          // 如果是中文字符，为字符分配15个单位宽度
          flexWidth += 15;
        } else {
          // 其他种类字符，为字符分配8个单位宽度
          flexWidth += 8;
        }
      });
      return flexWidth;
    },
    tabChange: function (value) {
      this.loading = true;
      this.$emit('change', value);
    },
    viewMoreFn: function () {
      this.$emit('view-more');
    },
    handleSizeChange: function (size) {
      var _this = this;
      this.size = size;
      this.$nextTick(function () {
        _this.getData();
      });
    },
    handleCurrentChange: function (page) {
      var _this = this;
      this.page = page;
      this.$nextTick(function () {
        _this.getData();
      });
    },
    getData: function () {
      this.loading = true;
      let params = {
        page: this.page,
        size: this.size,
        condition: JSON.stringify(this.baseParams)
      };
      request({
        url: backend.workService + this.url,
        method: 'get',
        params
      }).then(res => {
        this.loading = false;
        if (res.code == 0) {
          this.tableData = res.data;
          this.total = res.total;
        }
      });
    }
  }
}
</script>

<style lang="scss">
.yufp-top10-table .el-table th > .cell { padding: 0 5px; white-space: nowrap; background: #F2F2F2; }
.yufp-top10-table .top10-table__header{ position: relative; margin-bottom: 16px; }
.yufp-top10-table .view-more { top: 5px; right: 0; z-index: 10; }
.yufp-top10-table .top10-table__title{ color: #333; font-size: 16px; font-weight: bold; vertical-align: middle;margin-right: 24px; }
.yufp-top10-table .top10-table__title .icon-cunkuanyue { color: #47A1FB; margin-right: 8px; }
.yufp-top10-table .top10-table__table .el-table th{ color: #333; font-weight: bold; background: #F2F2F2; height: 46px;line-height: 46px; padding: 0; }
.top10-table__table .el-table td { padding: 0;}
.top10-table__table .el-table td .cell { padding: 0 5px; color: #333; height: 40px; line-height: 40px; }
.top10-table__table .el-table td .el-tooltip .render-box { display: inline; }
.top10-table__table .el-table td .cell .up { color: #F14922;}
.top10-table__table .el-table td .cell .down { color: #0FCB51; }
.yufp-top10-table .el-table--border td, .yufp-top10-table .el-table--border th { border-color: #D8D8D8; }
.yufp-top10-table .el-table--border, .yufp-top10-table .el-table--group { border-color: #D8D8D8; }
.yufp-top10-table .el-table td, .yufp-top10-table .el-table th.is-leaf { border-color: #D8D8D8; }
.yufp-top10-table .el-table__fixed-right::before, .yufp-top10-table .el-table__fixed::before { background-color: #D8D8D8; }
.yufp-top10-table .el-table--border::after, .yufp-top10-table .el-table--group::after, .yufp-top10-table .el-table::before { background-color: #D8D8D8; }
.yufp-top10-table .el-table--border td:first-child .cell, .yufp-top10-table .el-table--border th:first-child .cell { padding-left: 5px; }

.yufp-top10-table .rank-cell { position: relative; height: 100%; }
.yufp-top10-table .rank-cell .icon-rank { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);}
.yufp-top10-table .rank-cell .rank-no { display: inline-block; line-height: 40px; position: relative;  top: 2px; color: #fff; }


.yufp-top10-table .el-table {
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
</style>
