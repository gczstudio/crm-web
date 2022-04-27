<template>
  <div class="edit-container yu-main-wrapper">
    <div class="layout-box">
      <div class="layout-header" v-if="type==='edit'">
        <div class="layout-title" v-if="isEditName"><input type="text" v-model="row.name"><el-button type="text" icon="el-icon-mobile" @click="saveNameFn"></el-button></div>
        <div class="layout-title" v-else>{{row.name}}<el-button type="text" icon="el-icon-edit" @click="editNameFn"></el-button></div>
        <div class="layout-btns fr">
          <el-button class="yu-button-text" icon="el-icon-edit" @click="closeFn">返回</el-button>
          <el-button class="yu-button-text" icon="el-icon-edit">清空</el-button>
          <el-button class="yu-button-text" icon="el-icon-delete" @click="saveFn">保存</el-button>
          <el-button class="yu-button-text" icon="el-icon-folder-add">保存并上架</el-button>
        </div>
      </div>
    </div>
    <el-row>
      <el-col :span="5" v-if="type==='edit'">
        <div class="basic-mode" :style="{height: cHeight - 25 + 'px'}">
          <draggable
            v-model="mode"
            animation="300"
            :options="{group:{name: 'mode',pull:'clone'}}"
            @start="drag = true"
            @end="drag = false"
          >
            <div class="mode-item" v-for="item in mode" :key="item.type">
              <div class="mode-item__box">
                <div class="mode-item__chunk" :style="getModeChunkStyle(item)"></div>
              </div>
              <p class="mode-item__name">{{item.name}}</p>
            </div>
          </draggable>
        </div>
      </el-col>
      <el-col :span="type==='edit' ? 19 : 24">
        <div ref="chunkRef" class="drag-section" :style="{height: cHeight - 25 + 'px'}">
            <draggable
              v-model="layoutArr"
              pull="clone"
              :disabled="type!=='edit'"
              :options="{group:{name: 'mode',pull:'clone'}}"
              animation="300"
              @start="drag = true"
              @end="drag = false"
              v-if="chunkHeight"
            >
              <transition-group>
              <div v-for="(item, index) in layoutArr" :key="index" :class="{'drag-section__chunk': true, 'is-hover': type==='edit'}" :style="getChunkStyle(item)">
                <i v-if="type==='edit'" class="el-icon-close" @click="deleteFn(index)"></i>
              </div>
              </transition-group>
            </draggable>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop, Watch } from 'vue-property-decorator'
import { addLayout } from '@/api/lowCode'
import { backend } from '@/config'
import Draggable from "vuedraggable";

export interface Mode {
  type: string
  name: string
  row: number
  col: number
}

export let mode: Mode[] = [
  { type: '1', name: '1*1模式', col: 1, row: 1 },
  { type: '2', name: '1*2模式', col: 1, row: 2 },
  { type: '3', name: '2*1模式', col: 2, row: 1 },
  { type: '4', name: '2*2模式', col: 2, row: 2 }
]

@Component({
  name: 'Edit',
  components: {
    Draggable
  }
})
export default class extends Vue {
  @Prop({ default: 'edit' }) type!:string;    // edit  // render
  @Prop() private instance: any;
  @Prop() private row!: any;
  @Ref('refTable') refTable: any;
  @Ref('layoutFormRef') layoutFormRef: any;
  @Ref('chunkRef') chunkRef: any;

  private drag = false
  private dragItem = {}
 
  private isEditName = false
  private mode: Mode[] = mode

  private layoutArr = []

  private chunkHeight:number = 0

  @Watch('row', { immediate: true })
  onRowChange(){
    let layoutConfig = this.row.layoutConfig;
    this.layoutArr = layoutConfig.split(',').map((item:string) => {
      return this.mode.find((ele:Mode)=> ele.type == item)
    })
  }

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

  getModeChunkStyle(item: Mode) {
    return {
      width: 0.6 * item.col + 'rem',
      height:  0.4 * item.row + 'rem'
    }
    
  }

  getChunkStyle(item: Mode) {
    if(!this.chunkHeight) return;
    return {
      width: `calc(${25*item.col}% - 16px)`,
      height: this.chunkHeight * item.row + (item.row - 1) * 16 + 'px'
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

  saveFn() {
    console.log(JSON.stringify(this.layoutArr), 888)
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
      .mode-item__chunk{
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: inline-block;
        background: #d2d2d2;
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
    &.is-hover {
      &:hover {
        cursor: move;
        border: 1px dashed #007EFF;
        .el-icon-close {
          display: block;
        }
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
  }
  .mode-item__name{
    display: none;
  }
  

}
  
</style>
