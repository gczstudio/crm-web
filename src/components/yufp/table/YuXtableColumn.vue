<script>
export default {
  name: 'YuXtableColumn',
  inject: ['yuXtable'],
  props: {
    dataCode: String,
    options: Array,
    formatter: Function,
    formatMoney: {
      type: [Boolean, String],
      default: false
    },
    unit: {
      type: Number,
      default: 0
    },
    isNum: {
      type: Boolean,
      default: false
    }
  },
  created () {
    if (this.dataCode) {
      this.yuXtable.dataCodes.push(this.dataCode);
    }
  },
  methods: {
    formatterFn (row, column, cellValue, index) {
      var value =  row[column.property]
      if(!value && value != 0) return '';
      if (this.dataCode) {
        return this.$lookup.convertKey(this.dataCode, value);
      }
      if (!this.dataCode && this.options) {
        return this.$lookup.convertKey(this.options, value);
      }
      if (this.formatter) {
        return this.formatter(row, column, cellValue, index);
      }
      if(this.formatMoney) {
        if(this.unit) {
          value = value / this.unit;
        }
        return _vue.$createElement('div', { class: 'num' }, this.$util.formatMoney(value, this.formatMoney === true ? 2 : Number(this.formatMoney)));
      }
      return value;
    },
    formatterNumFn(row, column, cellValue, index) {
      return _vue.$createElement('span', { class: 'num' }, row[column.property])
    },
    getLabelWidth (label) {
      var labelDom = document.createElement('div');
      labelDom.innerText = label;
      labelDom.style.cssText = 'position: fixed; top: 0;left: 0; z-index: 9999; font-weigth: 700;';
      document.body.appendChild(labelDom);
      var labelWidth = labelDom.clientWidth;
      document.body.removeChild(labelDom);
      return labelWidth;
    },
    renderHeaderFn (h, row) {
      var labelWidth = this.getLabelWidth(row.column.label);
      if (row.column.width && labelWidth > row.column.width) {
        return h('el-tooltip', {
          class: 'item',
          props: {
            effect: 'dark',
            content: row.column.label,
            placement: 'top'
          }
        }, [
          h('span', { class: 'yu-header-tooltip' }, row.column.label)
        ]);
      }
      return h('span', row.column.label);
    }
  },
  render (h) {
    var props = Object.assign({}, this.$attrs, { 
      renderHeader: this.$attrs['render-header'] || this.renderHeaderFn
    });
    
    if (this.$slots.default) {
      return h('el-table-column', {
        props: props
      }, this.$slots.default);
    }
    if (!this.$slots.default && this.$scopedSlots.default) {
      return h('el-table-column', {
        props: props,
        scopedSlots: {
          default: (props) => {
            return h('span', {}, this.$scopedSlots.default ? this.$scopedSlots.default(props) : '');
          }
        }
      });
    }
    return h('el-table-column', {
      props: Object.assign({}, props, { formatter: this.isNum ? this.formatterNumFn : this.formatterFn}),
    });
  }
}
</script>
