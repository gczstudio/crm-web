<template>
  <div class="yufp-self-tab-pane" v-show="show">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "CustomTabPane",
  props: {
    label: String,
    name: String,
  },
  data: function () {
    return {
      show: true,
    };
  },
};
</script>
