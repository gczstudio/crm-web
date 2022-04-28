<template>
  <yu-dialog custom-class="create-group-modal" :visible.sync="dialogVisible" width="580px" @close="cancelFn" top="10vh">
    <div>
      <div class="header">
        <img :src="require(`@/assets/images/customer/create-group-title.png`)" alt="" />
        <i class="el-icon-close" @click="cancelFn"></i>
      </div>
      <div class="form">
        <yu-xform ref="form" :model="formData" label-width="123px">
          <yu-xform-group :column="1">
            <yu-xform-item label="客户群名称" placeholder="客户群名称" ctype="input" name="custGroupNm" :rules="globalRules.requiredInput"></yu-xform-item>
            <yu-xform-item
              label="客户群类别"
              placeholder="客户群类别"
              ctype="select"
              name="custGroupType"
              data-code="CUST_GROUP_TYPE"
              :rules="globalRules.required"
              @change="custGroupTypeChangeFn"
            ></yu-xform-item>
            <yu-xform-item label="是否需审批" placeholder="是否需审批" ctype="select" name="isAppr" data-code="YESNO" disabled></yu-xform-item>
            <yu-xform-item label="客户群描述" placeholder="客户群描述" ctype="input" type="textarea" name="custGroupRemark" :rows="3" :rules="globalRules.input500"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </div>
    </div>
    <div slot="footer" class="operate-btns tr">
      <el-button @click="cancelFn">取消</el-button>
      <el-button type="primary" @click="sureFn">保存</el-button>
    </div>
  </yu-dialog>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";
import { addcrowd } from "@/api/customer";

@Component({
  name: "CreateGroupModal",
})
export default class extends Vue {
  @Prop({ default: false }) private visible!: boolean;
  @Ref("form") form: any;
  private dialogVisible = false;
  private formData = {};

  @Watch("visible", { immediate: true })
  onVisibleChange() {
    this.dialogVisible = this.visible;
  }

  show() {
    this.$emit("update:visible", true);
  }

  hide() {
    this.$emit("update:visible", false);
  }

  custGroupTypeChangeFn(value: string) {
    this.$nextTick(() => {
      this.$set(this.formData, "isAppr", value);
    });
  }

  sureFn() {
    this.form.validate((valid: boolean) => {
      if (valid) {
        addcrowd(this.formData).then((res) => {
          this.$message.success("新增成功！");
          this.$emit("success");
          this.cancelFn();
        });
      }
    });
  }

  cancelFn() {
    this.form.resetFields();
    this.$nextTick(() => {
      this.hide();
    });
  }
}
</script>

<style lang="scss">
.create-group-modal {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__footer {
    padding: 15px;
    border-top: 1px solid #d8d8d8;
  }
  .header {
    position: relative;
    height: 140px;
    background: url("../../../../../../assets/images/customer/create-group-bg.png") no-repeat center;
    padding: 26px 22px;
    .el-icon-close {
      cursor: pointer;
      position: absolute;
      top: 15px;
      right: 15px;
      color: #fff;
      font-size: 20px;
      font-weight: bold;
    }
  }
  .form {
    padding: 20px 53px 30px 0;
    .tag-section {
      margin: 28px 0 20px;
      padding-left: 48px;
      color: #333;
      span,
      img {
        display: inline-block;
        vertical-align: middle;
      }
      img {
        cursor: pointer;
        margin: 2px 0 0 5px;
      }
    }
    .tag-value-form {
      padding: 0 30px 0 57px;
      .form-section {
        position: relative;
        .icon-delete {
          cursor: pointer;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: -26px;
        }
      }
      .el-row {
        background: #e8e8e8;
        margin-bottom: 10px;
        padding-right: 20px;
        .el-form-item {
          margin: 12px 0;
        }
        .el-col:nth-child(1) {
          width: 40%;
        }
        .el-col:nth-child(2) {
          width: 40%;
        }
        .el-col:nth-child(3) {
          width: 20%;
        }
      }
    }
  }
}
</style>
