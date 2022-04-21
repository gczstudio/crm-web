<template>
  <div class="edit-container yu-main-wrapper">
    <div class="layout-box">
      <div class="layout-header">
        <div class="layout-title" v-if="isEditName"><input type="text" v-model="row.name"><el-button type="text" icon="el-icon-mobile" @click="saveNameFn"></el-button></div>
        <div class="layout-title" v-else>{{row.name}}<el-button type="text" icon="el-icon-edit" @click="editNameFn"></el-button></div>
        <div class="layout-btns fr">
          <el-button class="yu-button-text" icon="el-icon-edit" @click="closeFn">返回</el-button>
          <el-button class="yu-button-text" icon="el-icon-edit">清空</el-button>
          <el-button class="yu-button-text" icon="el-icon-delete">保存</el-button>
          <el-button class="yu-button-text" icon="el-icon-folder-add">保存并上架</el-button>
        </div>
      </div>
    </div>
    <el-row>
      <el-col :span="5">
        <div class="basic-mode" :style="{height: cHeight - 25 + 'px'}">
          <draggable
            v-model="mode"
            animation="300"
            :options="{group:{name: 'mode',pull:'clone'}}"
            @start="drag = true"
            @end="drag = false"
          >
            <div class="mode-item" v-for="item in mode" :key="item.type">
              <div :class="['mode-item__box', 'mode-type' + item.type ]"></div>
              <p class="mode-item__name">{{item.name}}</p>
            </div>
          </draggable>
        </div>
      </el-col>
      <el-col :span="19">
        <div ref="chunkRef" class="drag-section" :style="{height: cHeight - 25 + 'px'}">
            <draggable
              v-model="layoutArr"
              pull="clone"
              :options="{group:{name: 'mode',pull:'clone'}}"
              animation="300"
              @start="drag = true"
              @end="drag = false"
              v-if="chunkHeight"
            >
              <transition-group>
              <div v-for="(item, index) in layoutArr" :key="index" :class="['drag-section__chunk', 'chunk-type' + item.type ]" :style="getChunkHeight(item.type)">
                <i class="el-icon-close" @click="deleteFn(index)"></i>
              </div>
              </transition-group>
            </draggable>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from 'vue-property-decorator'
import { addLayout } from '@/api/lowCode'
import { backend } from '@/config'
import Draggable from "vuedraggable";

export interface Mode {
  type: number
  name: string
}


@Component({
  name: 'Edit',
  components: {
    Draggable
  }
})
export default class extends Vue {
  @Prop() private instance!: any;
  @Prop() private row!: any;
  @Ref('refTable') refTable: any;
  @Ref('layoutFormRef') layoutFormRef: any;
  @Ref('chunkRef') chunkRef: any;

  private drag = false
  private dragItem = {}
 
  private isEditName = false
  private mode = [
    { type: 1, name: '1*1模式' },
    { type: 2, name: '1*2模式' },
    { type: 3, name: '2*1模式' },
    { type: 4, name: '2*2模式' }
  ]

  private layoutArr = [
    // { type: 1, name: '1*1模式' },
    // { type: 1, name: '1*1模式' },
    // { type: 3, name: '1*1模式' },
    // { type: 4, name: '1*1模式' },
    // { type: 4, name: '1*1模式' },
    // { type: 4, name: '1*1模式' },
  ]

  private chunkHeight:number = 0
  

  mounted() {
    this.changeSize()
    window.addEventListener('resize', this.changeSize)
  
  }

  destroyed() {
    window.removeEventListener('resize', this.changeSize)
  }

  changeSize() {
    this.chunkHeight = ((this.chunkRef.clientWidth / 4 - 16) * 0.618);
  }

  onDragModeEnd() {
    this.drag = false;
  }

  getChunkHeight(type: number) {
    if(!this.chunkHeight) return;
    let chunkHeight = 0;
    switch (type) {
      case 1:
      case 2:
      chunkHeight = this.chunkHeight;
      break
      case 3:
      case 4: 
      chunkHeight = this.chunkHeight * 2 + 16;
      break
    }
    return {
      height: chunkHeight + 'px'
    }
    
  }

  deleteFn(index: number) {
    this.layoutArr.splice(index, 1);
  }

  closeFn () {
    this.instance.hide();
  }

  editNameFn() {
    this.isEditName = true
  }

  saveNameFn() {
    this.isEditName = false
  }


}
</script>

<style lang="scss" scoped>
.layout-box {
  .layout-header {
    position: relative;
    background: #fff;
    padding: 10px;
    box-shadow: 0px 3px 6px rgba($color: #000000, $alpha: .1);
  }
  .layout-title {

  }
  .layout-btns{
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    .el-button {
      &:nth-child(1) {
        border: none;
      }
      border-left: 1px solid #707070;
    }
  }
}
.basic-mode{
  overflow-y: auto;
  background: #fff;
  padding: 20px 40px;
  .mode-item{
    .mode-item__box {
      position: relative;
      width: 100%;
      height: 1.4rem;
      border: 1px solid #d9d9d9;
      border-radius: 3px;
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: inline-block;
        background: #d2d2d2;
      }
      
    }
    .mode-type1 {
      &::before {
        width: 0.6rem;
        height: 0.4rem;
      }
    }
    .mode-type2 {
      &::before {
        width: 1.2rem;
        height: 0.4rem;
      }
    }
    .mode-type3 {
      &::before {
        width: 0.6rem;
        height: 0.8rem;
      }
    }

    .mode-type4 {
      &::before {
        width: 1.2rem;
        height: 0.8rem;
      }
    }
    .mode-item__name {
      margin: 10px 0 20px;
      text-align: center;
    }
  }
}

.drag-section {

  
  
  &>div{
    width: 100%;
    height: 100%;
    &>span{
      display: inline-block;
      width: 100%;
      height: 100%;
      padding-right: 16px;
      overflow-y: auto;
      padding-bottom: 16px;
    }
  }
 
  .drag-section__chunk {
    float: left;
    margin: 16px 0 0 16px;
    width: calc(25% - 16px);
    height: 3rem;
    background: #fff;
    border-radius: 5px;
    position: relative;
    &:hover {
      cursor: move;
      border: 1px dashed #007EFF;
      .el-icon-close {
        display: block;
      }
    }
    .el-icon-close {
      cursor: pointer;
      position: absolute;
      top: 10px;
      right: 10px;
      display: none;
      font-size: 16px;
    }
    &.chunk-type1 {
      width: calc(25% - 16px);
    }
    &.chunk-type2 {
      width: calc(50% - 16px);
    }
    &.chunk-type3 {
      width: calc(25% - 16px);
    }

    &.chunk-type4 {
      width: calc(50% - 16px);
    } 
  }
  .mode-item__name{
    display: none;
  }
  

}
  
</style>
