<template>
  <div class="drag-table">
    <yu-xtable ref="refTable" 
      :key="key"
      v-if="dropCol.length"
      :data-url="dataUrl"
      border
      row-key="id"
      align="left"
      :default-load="false"
      selection-type="checkbox"
      @header-dragend="headerDragendFn"
      >
      <template v-for="item in dropCol">
        <!-- 客户名称 -->
        <yu-xtable-column v-if="item.prop==='custNm'"  :key="item.prop" :min-width="item.width" :prop="item.prop" :label="item.label" :render-header="renderHeaderFn" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{scope.row.custNm}}</div>
          </template>
        </yu-xtable-column>
        <!-- 金额类型 -->
        <yu-xtable-column v-else-if="isMoney(item)" :key="item.prop" :min-width="item.width" :prop="item.prop" format-money align="right" :label="item.label" :render-header="renderHeaderFn" :show-overflow-tooltip="true"></yu-xtable-column>
        <!-- 数字类型 -->
        <yu-xtable-column v-else-if="isNum(item)"  :key="item.prop" :min-width="item.width" :prop="item.prop" align="right" is-num :label="item.label" :render-header="renderHeaderFn" :show-overflow-tooltip="true"></yu-xtable-column>
        <!-- 其他 -->
        <yu-xtable-column v-else  :key="item.prop" :min-width="item.width" :prop="item.prop" :label="item.label" :render-header="renderHeaderFn" :show-overflow-tooltip="true" :data-code="item.dataCode"></yu-xtable-column>
      </template>
     
    </yu-xtable>
    <Empty v-else description="暂无数据，请从左侧树中进行拖拽" />
  </div>
</template>
<script>
import Sortable from 'sortablejs';
import { backend } from '@/config';
export default {
  name: 'DragTable',
  props: {
    columns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dataUrl: backend.custService + '/api/ocrmfcifqdbcol/queryresult',
      dropCol: [],
      tableData: [],
      key: 1
    }
  },
  watch: {
    columns: {
      handler: function (columns) {
        this.dropCol = this._.cloneDeep(columns);
      },
      immediate: true
    },
    dropCol: function () {
      this.$nextTick(() => {
        this.headerColumnDrop();
      });
    }
  },
  mounted() {
  // 阻止默认行为
    document.body.ondrop =  (event)  => {
      event.preventDefault();
      event.stopPropagation();
    };
    this.headerColumnDrop();
  },
  methods: {
    isNum (item) {
      return ['NUMBER', 'DECIMAL', 'INTEGER', 'DATE', 'TIMESTMP' ].includes(item.colType);
    },
    isMoney (item) {
      return item.isMoneyData === 'true';
    },
    remoteData (data, callback) {
      this.$refs.refTable.remoteData(data, true, callback);
    },
    customerViewFn(row) {
      this.$router.push({ path: '/custInfo/custView/' + row.crmCustIdBase, query: { crmCustId: row.crmCustIdBase, custId: row.custId, title: '客户详情-' + row.custNm }})
    },
    renderHeaderFn (h, { column, $index}) {
      return (
        <div class={`header-wrapper header_${$index}`}>
          {column.label}
          <span
            class='caret-wrapper'
            on-click={ ($event) => this.handleSortClick($event, column) }>
            <i class="sort-caret ascending"
              on-click={ ($event) => this.handleSortClick($event, column, 'asc') }>
            </i>
            <i class="sort-caret descending"
              on-click={ ($event) => this.handleSortClick($event, column, 'desc') }>
            </i>
          </span>
          <span class="header-delete">
            <i class='el-icon-close' on-click={($event) => this.deleteColumnFn($event, $index)} ></i>
          </span>
        </div>
      )
    },
    handleSortClick(event, column, givenOrder) {
      event.stopPropagation();
      const target = event.target;
      const isCaret = target.className.includes('caret-wrapper');
      this.clearSort();
      if(!isCaret) {
        target.parentNode.className = `caret-wrapper ${givenOrder}`;
      } else {
        target.className = 'caret-wrapper';
      }
      this.$emit('sort-change', { column, givenOrder});
    },
    clearSort () {
      document.querySelectorAll('.drag-table .caret-wrapper').forEach(dom => {
        dom.className = 'caret-wrapper';
      })
    },
    //列拖拽
    headerColumnDrop() {
      let _this = this;
      const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
      if(!wrapperTr) return;
      if(this.sortable) {
        this.sortable.destroy();
        this.sortable = null;
      }
      this.sortable = Sortable.create(wrapperTr, {
        group: "name" + Date.now(),
        animation: 180,
        delay: 0,
        onEnd: evt => {
          this.key++;
          if(!evt.newIndex) {
            _this.dropCol = this._.cloneDeep(_this.dropCol);
            return
          };
          const oldItem = _this.dropCol[evt.oldIndex - 1];
          _this.dropCol.splice(evt.oldIndex - 1, 1);
          _this.dropCol.splice(evt.newIndex - 1, 0, oldItem);
          _this.$emit('change', _this.dropCol);
        }
      })
    },
    deleteColumnFn (event, index) {
      event.stopPropagation();
      this.dropCol.splice(index-1, 1);
      this.$emit('change', this.dropCol);
    },
    headerDragendFn (newWidth, oldWidth, column, event) {
      this.headerColumnDrop();
    }
  }
}
</script>
<style lang="scss" scoped>

  .drag-table {
    ::v-deep .el-table {
      th .cell {
        padding: 0px;
        line-height: 48px;
        .header-wrapper {
          white-space: nowrap;
          padding: 0 45px;
        }
      }
      .caret-wrapper {
        right: 3px;
        &.asc {
          display: block;
          .ascending {
            border-bottom-color: $blue;
          }
        }
        &.desc {
          display: block;
          .descending {
            border-top-color: $blue;
          }
        }
      }
      th:hover {
        .header-delete {
          display: block;
        }
      }
      .header-delete {
        display: none;
        position: absolute;
        right: 25px;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
        background: #e05534;
        font-weight: bold;
        border-radius: 50%;
        color: #fff;
        text-align: center;
        line-height: 16px;
        cursor: pointer;
      }
    }
  }
</style>