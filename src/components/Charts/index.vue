<template>
  <div class="Charts-component">
    <component :is="type" v-bind="$attrs"></component>
  </div>
</template>

<script>
import BasicLineChart from './BasicLineChart'
import MixedLineAndBar from './MixedLineAndBar'
export default {
  name: 'Charts',
  components: {
    BasicLineChart,
    MixedLineAndBar
  },
  props: {
    type: {
      required: true
    }
  },
  data() {
    return {
    };
  },
  mounted() {
    console.log(this.$attrs,888)
  }
}
</script>
<style lang="scss">

</style>