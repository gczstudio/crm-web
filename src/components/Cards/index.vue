<template>
  <div class="Cards-component">
    <component :is="type" v-bind="$attrs"></component>
  </div>
</template>

<script>
import Card1 from "./Card1";
export default {
  name: "Cards",
  components: {
    Card1,
  },
  props: {
    type: {
      required: true,
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss">
.Cards-component {
  height: 100%;
}
</style>
