<template>
  <el-select v-model="selectValue" placeholder="请选择" v-bind="$attrs" v-on="$listeners" @change="changeFn" multiple>
    <el-option
      v-for="item in options"
      :key="item.tagItemCode"
      :label="item.itemCodeNm"
      :value="item.tagItemCode">
    </el-option>
  </el-select>
</template>

<script>
import  * as customerApi from '@/api/customer'

export default {
  name: 'YufpTagSelector',
  props: {
    value: {
      required: true
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  
  data() {
    return {
      selectValue: [],
      options: []
    };
  },
  watch: {
    value: {
      handler: function (val) {
        if(val != undefined) {
          this.selectValue = val;
        }
      },
      immediate: true
    }
  },
  created () {
    this.gettagitem();
  },
  methods: {
    gettagitem () {
      let params = {
        tagNo: this.params.colNameE
      };
      customerApi.gettagitem(params).then(res => {
        this.options = res.data;
      })
    },
    changeFn (value) {
      this.$emit('input', value);
    }
  }
}
</script>
<style lang="scss">

</style>