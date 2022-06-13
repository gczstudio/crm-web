<template>
  <div class="CustMgt-container">
    <ProductFlowEditor />
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import ProductFlowEditor from "@/components/ProductFlowEditor/index.vue";
@Component({
  name: "CustGroup",
  components: {
    ProductFlowEditor,
  },
})
export default class extends Vue {}
</script>
