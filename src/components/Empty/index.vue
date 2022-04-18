<template>
  <el-empty v-bind="$attrs" v-on="$listeners" class="chart-empty">
    <div slot="image">
      <img :src="require(`@/assets/images/theme/${themeType}/no-data1.png`)" alt="" />
    </div>
  </el-empty>
</template>
<script>
export default {
  name: 'Empty',
  data() {
    return {}
  },
}
</script>
