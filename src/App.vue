<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "App",
  components: {},
})
export default class extends Vue {
  mounted() {
    this.$exportQueue.addEvent();
  }

  destroyed() {
    this.$exportQueue.removeEvent();
  }
}
</script>
