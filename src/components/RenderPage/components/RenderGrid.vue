<template>
  <div class="render-grid">
    <el-row v-bind="data">
      <el-col v-for="col in colData" v-bind="col" :span="Number(col.span)" :key="col.id">
        <div class="render-grid__col">
          <render-page-type v-if="col.body && col.body.length" :data="col.body"></render-page-type>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "RenderGrid",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      colData: [],
    };
  },
  watch: {
    data: {
      handler() {
        this.colData = this.data.body.map((item) => {
          return {
            ...item,
            span: Number(item.span),
          };
        });
      },
      immediate: true,
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
// .render-grid {
//   padding: 16px;
//   .render-grid__col {
//     padding: 16px;
//     min-height: 40px;
//     border: 1px dashed #ccc;
//   }
// }
</style>
