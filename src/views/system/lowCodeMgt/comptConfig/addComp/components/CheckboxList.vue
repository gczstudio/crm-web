<!--
 * @Descripttion: 
 * @Author: gaocz
 * @Date: 2022-04-21 10:27:39
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-20 16:38:37
 * @FilePath: /edmp-web/src/views/system/lowCodeMgt/comptConfig/addComp/components/CheckboxList.vue
-->
<script lang="tsx">
import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";
import { CreateElement } from "vue";

export interface Options {
  key: string;
  value: any;
}

/**多选列表组件 */
@Component({
  name: "CheckboxList",
})
export default class extends Vue {
  @Prop() height!: string;
  @Prop({ default: true }) multiple!: boolean;
  @Prop() title!: string;
  @Prop() data!: Options[];
  @Prop() value!: string[] | string;

  private checkList: string[] = [];
  private radioValue = "";

  @Watch("value", { immediate: true })
  onValueChange() {
    if (this.multiple) {
      this.checkList = this.value as string[];
    } else {
      this.radioValue = this.value as string;
    }
  }

  onChange(value: string[] | string) {
    if (this.multiple) {
      this.checkList = value as string[];
    } else {
      this.radioValue = value as string;
    }
    this.$emit("input", value);
    this.$emit("change", value);
  }

  render() {
    return (
      <div class="checbox-section" style={{ height: this.height }}>
        <div class="section-title">{this.title}</div>

        <div class="section-content">
          {this.multiple ? (
            <el-checkbox-group value={this.checkList} onInput={this.onChange}>
              {this.data.map((item: Options) => {
                return (
                  <el-checkbox label={item.key} key={item.key}>
                    {item.value}
                  </el-checkbox>
                );
              })}
            </el-checkbox-group>
          ) : (
            <el-radio-group value={this.radioValue} onInput={this.onChange}>
              {this.data.map((item: Options) => {
                return <el-radio label={item.key}>{item.value}</el-radio>;
              })}
            </el-radio-group>
          )}
        </div>
      </div>
    );
  }
}
</script>

<style lang="scss" scoped>
.checbox-section {
  padding-left: 16px;
  border-top: 1px solid #d8d8d8;
  label {
    padding: 5px 0;
  }
  .section-title {
    padding: 10px 0;
    font-size: 12px;
    font-weight: bold;
  }
  .section-content {
    overflow-y: auto;
    height: calc(100% - 44px);
  }
  .el-checkbox {
    display: block;
  }
  .el-checkbox__label {
    font-size: 12px;
    font-weight: normal;
  }
  .el-radio {
    display: block;
  }
}
</style>
