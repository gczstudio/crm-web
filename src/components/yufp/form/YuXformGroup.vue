<script>
export default {
  name: "YuXformGroup",
  inject: ["elForm"],
  props: {
    column: {
      type: Number,
      default: 2,
    },
    fixed: {
      type: Boolean,
      default: false,
    },
  },
  render: function (h) {
    var slots = this.$slots.default;
    if (!slots) return null;
    var rows = [];
    var realRows = slots.filter(function (vdom) {
      return vdom.tag;
    });
    var column = this.column;

    // 有一些不需要在小屏幕下适配，比如不带label的时候
    if (!this.fixed) {
      var width = window.screen.width;
      // 宽度大于等于1920时不做处理，使用传入的column
      if (width < 1920 && column == 4) {
        column = 3;
      }
    }

    if (this.elForm.formType === "search") {
      this.elForm.column = column;
      // 动态计算同一列的form的lable的宽度，以宽的为准
      var hasLabelRows = realRows.filter(function (item) {
        return item.componentOptions.propsData.label;
      });
      // 都存在label时，才计算
      if (hasLabelRows.length === realRows.length) {
        for (var i = 0; i < column; i++) {
          // 找到最大值
          var fitlerRows = realRows
            .filter(function (vdom, index) {
              return index % column === i;
            })
            .sort(function (a, b) {
              return b.componentOptions.propsData.label.length - a.componentOptions.propsData.label.length;
            });
          if (fitlerRows[0] && fitlerRows[0].componentOptions.propsData.label) {
            // 给每个元素设置width
            realRows.map(function (item, index) {
              if (index % column === i) {
                item.componentOptions.propsData.labelWidth = fitlerRows[0].componentOptions.propsData.label.length * 14 + 10 + 16 + "px"; // 10是：16是距离左侧的距离
              }
            });
          }
        }
      }
    }
    realRows.map(function (vdom) {
      var span = vdom.componentOptions.propsData.colspan ? parseInt(vdom.componentOptions.propsData.colspan) : 24 / column;
      rows.push(
        h(
          "el-col",
          {
            props: {
              span: span,
            },
          },
          [vdom]
        )
      );
    });
    return h("el-row", rows);
  },
};
</script>
