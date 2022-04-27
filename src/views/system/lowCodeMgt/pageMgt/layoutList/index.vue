<template>
  <div class="layoutList-container">
    <div class="layout-box">
      <div class="section">
        <div :class="['section-item', child.type === active ? 'active' : '']" v-for="child in layoutList" :key="child.type" @click="clickFn(child)">
          <div><i :class="['iconfont', 'icon-'+child.icon]"></i></div>
          <p>{{child.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from 'vue-property-decorator'

export interface LayoutItem {
  type: string
  name: string
  icon: string
}

@Component({
  name: 'LayoutList',
  components: {
  }
})
export default class extends Vue { 
  private active = ''
  private layoutList = [
    { type: 'none', name: '无布局', icon: 'nothing' },
    { type: 'fixed', name: '固定布局', icon: 'zidingyibuju' },
  ]

  clickFn(item: LayoutItem) {
    this.active = item.type
  }
  

}
</script>

<style lang="scss" scoped>
  .layoutList-container {
    border-right: 1px solid #e6e6e8;
    height: 100%;
    .layout-box {
      height: calc(100% - 48px);
      overflow-y: auto;
      padding: 20px 10px 0;
      ::v-deep.el-collapse {
        .el-collapse-item__wrap{
          border: none;
        }
        .el-collapse-item__arrow{
          font-size: 16px;
        }
      }
     
      .section{
        .section-item {
          float: left;
          cursor: pointer;
          width: calc(50% - 10px);
          &:nth-child(2n) {
            margin-left: 10px;
          }
          text-align: center;
          &>div{
            position: relative;
            height: 80px;
            border: 1px solid #ccc;
            border-radius: 2px;
            transition: color .3s;
          }
          .iconfont {
            color: #bbb;
            font-size: 40px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: color .3s;
          }
          p{
            margin: 5px 0 10px;
            transition: color .3s;
          }
          &:hover, &.active {
            &>div{
              border-color: #007EFF;
            }
            .iconfont,  p {
              color: #007EFF;
            }
          }
        }
      }
    }
  }
</style>
