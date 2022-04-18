<template>
  <el-scrollbar wrap-class="scrollbar-wrapper" :style="{height: height + 'px'}">
    <el-tree ref="tree" :node-key="dataId" :data="treeData" v-bind="$attrs" v-on="$listeners"></el-tree>
  </el-scrollbar>
</template>
<script>
import request from "@/utils/request";
import { CommonModule } from '@/store/modules/common'
export default {
  name: 'YuExtTree',
  inheritAttrs: false,
  props: {
    treeKey: String, // 将数据放到vuex中
    dataUrl: String,
    dataRoot: Object,
    dataId: [String, Number],
    dataLabel: String,
    dataPid: [String, Number],
    requestType: {
      type: String,
      default: 'GET'
    },
    dataParams: {
      type: Object,
      default: () => {}
    },
    height: {
      type: Number,
      default: 500
    },
    expandLevel: {
      type: Number,
      default: 2
    },
    level: {
      type: String,
      default: 'orgLevel'
    },
    orgLevel: String,   // 可选择的层级
    filterIds: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      originTreeData: [],
      treeData: []
    };
  },
  mounted() {
    this.remoteData();
  },
  methods: {
    filterByIds(data, ids) {
      for(var i= data.length-1;i>=0;i--) {
        var item = data[i]
        if(ids.includes(item.orgId)) {
          data.splice(i, 1)
        } else if(item.children?.length) {
          this.filterByIds(item.children, ids)
        }
      }
    },
    // 更新树数据，按照层级
    updataTreeDataByLevel () {
      var originData = CommonModule.treeOriginMgr[this.treeKey]
      let transData = originData.map(item => {
        return {
          ...item,
          label: item[this.dataLabel],
          id: item[this.dataId],
          disabled: this.orgLevel ? !this.orgLevel.split(',').includes(String(item[this.level])) : false
        }
      })
      let treeData = this.$util.arrayToTree(transData, this.dataId, this.dataPid)
      this.filterIds.length && this.filterByIds(treeData, this.filterIds)
      return treeData;
    },
    filter (val) {
      this.$refs.tree.filter(val);
    },
    getRef () {
      return this.$refs.tree
    },
    remoteData () {
      if(CommonModule.treeMgr[this.treeKey]) {
        this.treeData = this.updataTreeDataByLevel()
        this.$emit("get-tree-datas", CommonModule.treeOriginMgr[this.treeKey]);
        setTimeout(() => {
          // 默认展开根节点
          this.expandNode(this.$refs.tree?.root?.childNodes, 1);
        }, 1);
        return;
      }

      let paramsKey = this.requestType.toUpperCase() === 'GET' ? 'params' : 'data'
      request({
        method: this.requestType,
        url: this.dataUrl,
        [paramsKey]: this.dataParams,
      }).then(res => {
        let originTreeData = this._.cloneDeep(res.data)
        this.originTreeData = originTreeData;
        this.$emit("get-tree-datas", originTreeData);
        // 添加label属性
        let transData = res.data.map(item => {
          return {
            ...item,
            label: item[this.dataLabel],
            id: item[this.dataId],
            disabled: this.orgLevel ?!this.orgLevel.split(',').includes(String(item[this.level])) : false
          }
        })
        this.treeData = this.$util.arrayToTree(transData, this.dataId, this.dataPid)
        if(this.dataRoot) {
          this.dataRoot.children = this.treeData
          this.treeData = [this.dataRoot]
        }
        // 将请求的数据设置到vuex中
        if(this.treeKey) {
          this.$nextTick(function () {
            let treeMgr = CommonModule.treeMgr;
            let treeOriginMgr = CommonModule.treeOriginMgr;
            treeMgr[this.treeKey] = this.treeData;
            treeOriginMgr[this.treeKey] = this.originTreeData;
            CommonModule.SET_TREE_MGR(treeMgr);
            CommonModule.SET_TREE_ORIGIN_MGR(treeOriginMgr);
          });
        }
        setTimeout(() => {
          // 默认展开根节点
          this.expandNode(this.$refs.tree?.root?.childNodes, 1);
        }, 1);
      });
    },
    /**
     * [expandNode 展开当前数据的子节点]
     * @param  {[type]} data  [待展开的节点数组]
     * @param  {[type]} level [当前层级]
     * @return {[type]}       [description]
     */
    expandNode(data, level) {
      if (data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i]) {
            if (level < this.expandLevel) {
              this.expandNode(data[i].childNodes, level + 1);
              data[i].expanded = true;
            }
          }
        }
      }
    },
  }
}
</script>
<style lang="scss">
  .scrollbar-wrapper {
    overflow-x: hidden!important;
  }
</style>