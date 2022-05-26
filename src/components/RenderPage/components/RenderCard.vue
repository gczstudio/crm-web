<template>
  <cards v-editor.chart="{ id: data.id }" :type="type" :card-data="cardData" />
</template>

<script>
import { queryDsData } from "@/api/lowCode";
export default {
  name: "RenderCard",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dsId: "",
      type: "",
      cardData: {},
    };
  },
  watch: {
    data: {
      handler(val) {
        console.log(val, 888888);
        if (Object.keys(val).length) {
          this.cardData = JSON.parse(val.modConfig);
          this.type = `Card${this.cardData[0].cardType}`;
          this.dsId = this.cardData[0].dsId;
          this.dsId && this.getDsData();
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 请求数据模型数据
    getDsData() {
      queryDsData({
        condition: JSON.stringify({
          dsId: this.dsId,
        }),
      }).then((res) => {
        // 重新取数，后面要根据实际情况优化
        this.cardData.map((item) => {
          item.value = res.data[0][item.key];
        });
      });
    },
  },
};
</script>
<style lang="scss"></style>
