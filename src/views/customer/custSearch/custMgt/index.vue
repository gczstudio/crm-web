<template>
  <div>
    <render-page></render-page>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import RenderPage from "@/components/RenderPage/index.vue";
@Component({
  name: "CustMgt",
  components: {
    RenderPage,
  },
})
export default class extends Vue {}
</script>
