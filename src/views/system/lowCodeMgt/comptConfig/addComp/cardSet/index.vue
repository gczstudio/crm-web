<template>
  <div class="card-set-container">
    <div class="data-section">
      <div style="padding: 0 16px; margin-bottom: 10px">
        <div class="data-title">数据模型</div>
        <yu-xform-item-part placeholder="请选择" ctype="select" v-model="dsId" :options="dsList" @change="dsChangeFn"></yu-xform-item-part>
        <yu-xform-item-part
          placeholder="请输入维度/指标"
          ctype="input"
          v-model="fieldName"
          suffix-icon="el-icon-search"
          clearable
          @clear="dsChangeFn"
          v-debounce="[fieldNameChangeFn, 'input', 300]"
        ></yu-xform-item-part>
      </div>
      <checkbox-list :multiple="false" title="指标" v-model="quota" :data="dsField" height="calc(100% - 102px)" @change="quotaChange"></checkbox-list>
    </div>
    <div class="config-section">
      <div class="config-section__title">配置区域</div>
      <div class="center-section">
        <!--卡片一-->
        <card-1 @change="card1ChangeFn" :data="cardConfig"></card-1>
      </div>
    </div>
    <div class="switch-section">
      <div class="switch-section__title">指标卡切换</div>
      <div class="card-box">
        <div :class="{ 'card-item': true, active: activeCardType === item.type }" v-for="(item, index) in cardTypes" :key="item.type">
          <img :src="require(`@/assets/images/lowCode/card/card${index + 1}.png`)" alt="" />
        </div>
      </div>
    </div>
    <div class="side-config-section">
      <div class="right-panel-arrow" @click="toggleRightPanel"><i :class="`el-icon-caret-${showRightPanel ? 'right' : 'left'}`"></i></div>
      <div class="side-config-section__cont" v-if="showRightPanel">
        <div class="side-config-section__title">属性</div>
        <card-config-1 :type="configType" :data="cardItemData"></card-config-1>
      </div>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";
import CheckboxList from "../components/CheckboxList.vue";
import CommonSection from "../components/CommonSection.vue";
import Card1 from "./card1/index.vue";
import CardConfig1 from "./card1/config.vue";
import { queryDsInfo, queryDsField, queryDsData } from "@/api/lowCode";
import { LowCodeModule } from "@/store/modules/lowCode";

export interface IDsInfo {
  id: string;
  dsName: any;
}

export interface Options {
  key: string;
  value: any;
}

@Component({
  name: "ChartSet",
  components: {
    CheckboxList,
    CommonSection,
    Card1,
    CardConfig1,
  },
})
export default class extends Vue {
  @Prop() private instance!: any;
  @Ref("compFormRef") compFormRef: any;
  @Prop() private data!: any;

  activeName = "1";
  // 数据模型
  dsId = "";
  dsList = [];
  fieldName = "";
  // 数据集字段信息
  dsField = [];
  // 数据集字段数据
  dsData = [];
  quota = "";

  // 左侧配置列表
  showRightPanel = false;
  // 当前点击的某个块
  configType = "";
  cardItemData = {};

  // 指标卡类型
  cardTypes = [{ type: "1", name: "卡片一" }];
  activeCardType = "1";

  // 指标卡配置
  get cardConfig() {
    return LowCodeModule.cardConfig;
  }

  // 编辑时的回显逻辑
  @Watch("data", { immediate: true })
  onDataChange(data: any) {
    LowCodeModule.SET_CARD_CONFIG(data);
    this.dsId = data[0]?.dsId;
    this.dsId && this.dsChangeFn();
  }

  mounted() {
    this.getDsInfo();
  }

  // 查询数据模型列表
  getDsInfo() {
    queryDsInfo().then((res) => {
      this.dsList = res.data.map((item: IDsInfo) => {
        return {
          key: item.id,
          value: item.dsName,
        };
      });
    });
  }

  // 数据模型变化
  dsChangeFn() {
    this.getDsField();
    this.getDsData();
  }

  // 维度/指标名称搜索
  fieldNameChangeFn(val: string) {
    this.getDsField();
  }

  // 请求数据模型信息
  getDsField() {
    queryDsField({
      condition: JSON.stringify({
        dsId: this.dsId,
        fieldName: this.fieldName,
      }),
    }).then((res) => {
      this.dsField = res.data.map((item: any) => {
        return {
          ...item,
          key: this.$util.dashToCamel(item.fieldKey),
          value: item.fieldName,
        };
      });
    });
  }

  // 请求数据模型数据
  getDsData() {
    queryDsData({
      condition: JSON.stringify({
        dsId: this.dsId,
      }),
    }).then((res) => {
      this.dsData = res.data;
    });
  }

  // 切换右侧配置面板
  toggleRightPanel() {
    this.showRightPanel = !this.showRightPanel;
  }

  // 指标卡1配置点击
  card1ChangeFn(configType: string) {
    this.showRightPanel = true;
    this.configType = configType;
    this.quota = (this.cardConfig as any)[Number(this.configType)].key;
  }

  // 指标变化
  quotaChange(key: string) {
    let cardQuota: Options = this.dsField.find((item: Options) => item.key === key) || { key: "", value: "" };
    let value = this.dsData[0][cardQuota.key];
    LowCodeModule.SET_SELECT_CARD_QUATO({
      ...cardQuota,
      data: value,
    });
    let cardConfig: any[] = [...this.cardConfig];
    let cardSection: any = cardConfig[Number(this.configType)] || {};
    cardSection.name = cardQuota.value;
    cardSection.value = value; // 数据，未来要改
    cardSection.dsId = this.dsId; // 数据集id
    cardSection.key = cardQuota.key;
    cardSection.cardType = this.activeCardType;
    cardConfig[Number(this.configType)] = { ...cardSection };
    LowCodeModule.SET_CARD_CONFIG(cardConfig);
  }
}
</script>

<style lang="scss" scoped>
.card-set-container {
  position: relative;
  height: calc(100% - 55px);
  display: flex;
  .data-section {
    flex: 0 0 230px;
    height: 100%;
    border-right: 1px solid #d8d8d8;
    .data-title {
      font-weight: bold;
    }
    .el-select,
    .el-input {
      margin-top: 10px;
    }
  }
  .config-section {
    flex: 1;
    height: 100%;
    .config-section__title {
      padding: 0 10px;
      height: 36px;
      line-height: 36px;
      background: #f7f8fa;
      color: #007eff;
    }
  }
  .switch-section {
    flex: 0 0 230px;
    height: 100%;
    border-left: 1px solid #d8d8d8;
    .switch-section__title {
      padding: 0 10px;
      height: 36px;
      line-height: 36px;
      background: #fff;
      font-weight: bold;
    }
    .card-box {
      height: calc(100% - 36px);
      overflow-y: auto;
      .card-item {
        margin: 10px 10px 0;
        padding: 10px;
        border: 1px solid #ccc;
        img {
          text-align: center;
          width: 100%;
        }
        &.active {
          border: 1px solid #007eff;
        }
      }
    }
  }
  .side-config-section {
    position: absolute;
    top: 0;
    right: 0;
    background: #fff;
    height: 100%;
    box-shadow: 0 6px 6px 2px rgba(0, 0, 0, 0.15);
    .side-config-section__title {
      padding: 10px;
      font-weight: bold;
      border-bottom: 1px solid #ccc;
    }
    .side-config-section__cont {
      width: 300px;
    }
  }
}

.center-section {
  height: calc(100% - 36px);
  overflow-y: auto;
  ::v-deep .section-wrapper {
    margin: 0 auto;
    width: 4rem;
    li {
      cursor: pointer;
      margin-top: 10px;
      position: relative;
      width: 4rem;
      height: 1.5rem;
      border: 1px solid #d8d8d8;
      .tip {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #999;
      }
      &:hover,
      &.active {
        border: 1px dashed #007eff;
      }
    }
    .top {
      &.center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      img {
        margin-top: 8px;
        float: left;
      }
      .total {
        margin-left: 70px;
        p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 16px;
          line-height: 21px;
          &:nth-child(2) {
            line-height: 31px;
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
          .unit {
            font-weight: normal;
            margin-left: 6px;
            font-size: 12px;
            color: rgba(51, 51, 51, 0.8);
          }
        }
      }
    }
    .bottom {
      &.center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin-top: 0;
      }
      color: #333;
      margin-top: 26px;
      font-size: 14px;
      .iconfont {
        margin-left: 10px;
        font-size: 14px;
      }
      .icon-shangsheng {
        color: #f14922;
      }
      .icon-xiajiang {
        color: #0fcb51;
      }
      .label {
        line-height: 16px;
      }
      .value {
        white-space: nowrap;
        margin-top: 8px;
      }
      .up {
        p:nth-child(2) {
          color: #f14922;
        }
      }
      .down {
        p:nth-child(2) {
          color: #0fcb51;
        }
      }
    }
  }
}

.right-panel-arrow {
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: -14px;
  z-index: 9;
  transform: translateY(-50%);
  width: 14px;
  height: 50px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px 0 0 10px;
  border-right: 0;
  box-shadow: -2px 0px 6px rgba(0, 0, 0, 0.15);
  i {
    line-height: 50px;
    color: #a1a6b3;
  }
}
</style>
