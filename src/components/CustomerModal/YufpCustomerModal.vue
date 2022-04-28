<template>
  <div class="YufpCustomerModal-container">
    <CustomerModal :title="title" :selection-type="selectionType" :visible.sync="visible" @sure="sureFn" />
    <el-select v-model="inputVal" :placeholder="placeholder" clearable filterable remote :remote-method="remoteMehod" @focus="remoteMehod()" :loading="loading" @change="changeFn">
      <el-option v-for="item in customerData" :label="item.userName" :value="item.userId" :key="item.userId"> </el-option>
    </el-select>
    <div class="search-btn" @click="focusFn"><i class="el-icon-search"></i></div>
    <!-- <el-input v-model="inputVal" :placeholder="placeholder" readonly @click.native="focusFn" suffix-icon="el-icon-search"></el-input> -->
  </div>
</template>
<script>
import { backend } from "@/config";
import request from "@/utils/request";
import { getCheckedRole } from "@/utils";
export default {
  props: {
    selectionType: {
      type: String,
      default: "checkbox",
    },
    title: {
      type: String,
      default: "选择客户经理",
    },
    placeholder: String,
    value: String | Number,
  },
  name: "YufpCustomerModal",
  data() {
    let roleInfo = getCheckedRole();
    return {
      roleInfo: roleInfo,
      loading: false,
      visible: false,
      inputVal: "",
      customerData: [],
    };
  },
  watch: {
    value: function (val) {
      if (!val) {
        this.inputVal = val;
      }
    },
  },
  mounted() {
    if (this.value) {
      this.remoteMehod(this.value, () => {
        this.inputVal = this.value;
      });
    }
  },
  methods: {
    remoteMehod(query, callback) {
      request({
        method: "GET",
        url: backend.appOcaService + "/api/adminsmuser/getmgrlist",
        params: {
          page: 1,
          size: 50,
          condition: JSON.stringify({
            userInfo: query,
            orgId: this.roleInfo.orgCode,
            roleCode: "R300201",
          }),
        },
      }).then((res) => {
        this.customerData = res.data;
        callback && callback();
      });
    },
    changeFn(val) {
      this.$emit("input", val);
      this.$emit("select-fn", this.customerData.find((item) => item.userId === val) || {});
    },
    getSelectVal() {
      return this.inputVal;
    },
    focusFn() {
      this.visible = true;
    },
    sureFn(data) {
      let userNames = data.map((item) => item.userName).join(",");
      let userIds = data.map((item) => item.userId).join(",");
      this.inputVal = userNames;
      this.$emit("input", userIds);
      this.$emit("select-fn", data);
      this.visible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.YufpCustomerModal-container {
  position: relative;
  .search-btn {
    position: absolute;
    top: 0;
    right: 5px;
    color: #666;
    cursor: pointer;
  }
  ::v-deep.el-input__suffix {
    right: 15px;
  }
}
</style>
