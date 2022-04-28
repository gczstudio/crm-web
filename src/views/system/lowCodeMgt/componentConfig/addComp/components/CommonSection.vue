<script lang="tsx">
import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";
import { CreateElement } from "vue";

/**区域组件 */
@Component({
  name: "CommonSection",
})
export default class extends Vue {
  @Prop() title!: string;

  render(h: CreateElement) {
    return (
      <div class="section">
        <div class="section-title">{this.title}</div>
        {h("div", { class: "section-content" }, this.$slots.default)}
      </div>
    );
  }
}
</script>
<style lang="scss" scoped>
.section {
  padding: 10px;
  border-top: 1px solid #d8d8d8;
  .section-title {
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .section-content {
    height: calc(100% - 26px);
    overflow-y: auto;
  }
}
</style>
