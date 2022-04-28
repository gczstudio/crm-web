<template>
  <div class="YufpCustomerModal-container">
    <CstgroupModal :selection-type="selectionType" :ids="selectIds" :visible.sync="visible" @sure="sureFn" />
    <el-input v-model="inputVal" readonly @click.native="focusFn" suffix-icon="el-icon-search"></el-input>
  </div>
</template>
<script>
import { backend } from "@/config";
import request from "@/utils/request";
export default {
  name: "YufpCstgroupModal",
  props: {
    selectionType: {
      type: String,
      default: "checkbox",
    },
    value: String | Number,
  },
  data() {
    return {
      dataUrl: backend.custService + "/api/ocrmfcifqdbcol/cstgroupdraglist",
      visible: false,
      inputVal: "",
      customerData: [],
      selectIds: "",
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.selectIds = val;
          this.querySelectData();
        }
      },
      immediate: true,
    },
  },
  methods: {
    querySelectData() {
      request({
        method: "GET",
        url: this.dataUrl,
        params: {
          condition: JSON.stringify({
            ids: this.selectIds.split(","),
          }),
        },
      }).then((res) => {
        this.inputVal = res.data.map((item) => item.custGroupNm).join(",");
      });
    },
    getSelectVal() {
      return this.inputVal;
    },
    focusFn() {
      this.visible = true;
    },
    sureFn(data) {
      let names = data.map((item) => item.custGroupNm).join(",");
      let ids = data.map((item) => item.custGroupId).join(",");
      this.inputVal = names;
      this.$emit("input", ids);
      this.$emit("select-fn", data);
      this.visible = false;
    },
  },
};
</script>
