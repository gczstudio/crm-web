<template>
  <div class="product-table">
    <el-row :gutter="12">
      <el-col :span="8" v-for="item in data" :key="item.id">
        <div class="product-item">
          <div class="product-type"><span>推荐</span></div>
          <div class="product-item__top">
            <img src="~@/assets/images/lowCode/product.png" alt="" />
            <div class="product-title">产品名称</div>
            <div class="product-catalog">上一级目录 > 上级目录 > 目录</div>
            <div class="product-tags">
              <span class="tag">产品标签</span>
              <span class="tag">产品标签</span>
              <span class="tag">产品标签</span>
              <span class="tag">产品标签</span>
              <span class="tag">产品标签</span>
              <span class="tag">产品标签</span>
              <!-- <span class="tag">产品标签</span> -->
            </div>
            <div class="product-create-info">
              <span class="create-user"><span>江夏支行</span></span>
              <span class="create-time">2022.05.24</span>
            </div>
          </div>
          <div class="product-item__bottom">
            <div class="product-btn">
              <i class="iconfont icon-yanjing1" style="position: relative; top: 1px"></i>
              <span>3255</span>
            </div>
            <div class="product-btn dianzan">
              <i class="iconfont icon-dianzan1"></i>
              <span>3255</span>
            </div>
            <div class="product-btn shoucang">
              <i class="iconfont icon-shoucang"></i>
              <span>3255</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  name: "ProductTable",
})
export default class extends Vue {
  @Prop() data!: any;
}
</script>

<style lang="scss" scoped>
.product-table {
  .product-item {
    position: relative;
    margin-bottom: 12px;
    padding: 6px 6px 0;
    background: #ffffff;
    box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
    border-radius: 4px 4px 4px 4px;
    .product-type {
      position: absolute;
      top: 0;
      left: 0;
      width: 48px;
      height: 48px;
      background: url("~@/assets/images/lowCode/arrow.png") no-repeat center;
      span {
        display: inline-block;
        position: absolute;
        top: 8px;
        left: 2px;
        color: #fff;
        font-size: 13px;
        transform: rotate(-45deg);
      }
    }
    .product-item__top {
      img {
        width: 100%;
        height: 140px;
      }
      .product-title {
        font-size: 15px;
        font-weight: bold;
        margin: 12px 0 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .product-catalog {
        padding: 10px 0;
        border-bottom: 1px solid #d8d8d8;
      }
      .product-tags {
        padding: 10px 0;
        height: 60px;
        overflow: hidden;
        .tag {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 2px 2px 2px 2px;
          background: rgba(244, 122, 40, 0.1);
          font-size: 12px;
          color: #f47a28;
          margin: 0 8px 5px 0;
        }
      }
      .product-create-info {
        display: flex;
        .create-user {
          flex: 1;
          display: inline-block;
          & > span {
            display: inline-block;
            padding: 2px 10px;
            border: 1px solid #00a4db;
            border-radius: 2px;
            color: #00a4db;
            font-size: 12px;
          }
        }
        .create-time {
          display: inline-block;
          padding: 2px 0;
          flex: 0 0 80px;
          text-align: right;
          font-size: 12px;
          color: #666;
        }
      }
    }
    .product-item__bottom {
      margin-top: 10px;
      border-top: 1px solid #d8d8d8;
      padding: 10px 0;
      display: flex;
      font-size: 12px;
      .product-btn {
        flex: 8;
        text-align: center;
        & > span {
          margin-left: 9px;
        }
        & + .product-btn {
          border-left: 1px solid #d8d8d8;
        }
        .iconfont {
          color: #333;
        }
        &.dianzan {
          cursor: pointer;
          color: #f25a5a;
          .iconfont {
            color: #f25a5a;
          }
        }
        &.shoucang {
          cursor: pointer;
          color: #f4bc28;
          .iconfont {
            color: #f4bc28;
          }
        }
      }
    }
  }
}
</style>
