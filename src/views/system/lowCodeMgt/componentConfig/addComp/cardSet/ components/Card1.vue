<script lang="tsx">
import { Component, Vue, Prop, Ref, Watch } from 'vue-property-decorator'
import { CreateElement } from 'vue';

export interface Options {
  key: string,
  value: any
}

@Component({
  name: 'Card1'
})
export default class extends Vue {

  render() {
    return (
      <div class="card-config card1">
        <div class="top">
          <div class="drag-box">
          </div>
        </div>
        <div class="bottom">
          <el-row>
            <el-col span={8}>
              <div class="drag-box">

              </div>
            </el-col>
            <el-col span={8}>
              <div class="drag-box">
              </div>
            </el-col>
            <el-col span={8}>
              <div class="drag-box">
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    )
  }

}

</script>

<style lang="scss" scoped>
  .card-config {
    margin: 1rem auto 0;
    width: 400px;
    .top {
      height: 1.5rem;
      border: 1px dashed #D8D8D8;
    }
    .el-col {
      height: 0.8rem;
      border: 1px dashed #D8D8D8;
      border-top: none;
      &+.el-col{
        border-left: none;
      }
    }
  }
</style>
