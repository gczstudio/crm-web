<template>
  <div class="EditBaseInfo-component">
    <div class="base-form">
      <yu-xform ref="form" :model="formData" label-width="123px">
        <yu-xform-group :column="1">
          <yu-xform-item label="客户群编号" placeholder="客户群编号" ctype="input" name="custGroupId" disabled></yu-xform-item>
          <yu-xform-item label="客户群名称" placeholder="客户群名称" ctype="input" name="custGroupNm" :rules="globalRules.requiredInput"></yu-xform-item>
          <yu-xform-item label="客户群类别" placeholder="客户群类别" ctype="select" name="custGroupType" data-code="CUST_GROUP_TYPE" :rules="globalRules.required" @change="custGroupTypeChangeFn"></yu-xform-item>
          <yu-xform-item label="是否需审批" placeholder="是否需审批" ctype="select" name="isAppr" data-code="YESNO" disabled></yu-xform-item>
          <yu-xform-item label="客户群成员数" placeholder="客户群成员数" ctype="input" name="custGroupMember" disabled></yu-xform-item>
          <yu-xform-item label="客户群描述" placeholder="客户群描述" ctype="input" type="textarea" name="custGroupRemark" :rows="5" :rules="globalRules.input500"></yu-xform-item>
          <yu-xform-item label="创建人" placeholder="创建人" ctype="input" name="creatorName" disabled></yu-xform-item>
          <yu-xform-item label="创建日期" placeholder="创建日期" ctype="input" name="creatorTime" disabled></yu-xform-item>
        </yu-xform-group>
      </yu-xform>
      <div><el-button type="primary" v-debounce="saveFn">保存</el-button></div>
    </div>
    <div class="base-title">
      <img src="~@/assets/images/customer/cust-group-title.png" alt="">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, InjectReactive, Inject } from "vue-property-decorator";
import { updatecrowd } from '@/api/customer'

@Component({
  name: "EditBaseInfo",
})
export default class extends Vue {
  @Inject() readonly groupInstance!: any;
  @InjectReactive() readonly row!: any;
  @Prop({default: false }) private visible!: boolean;
  @Ref('form') form: any;
  private formData = {};

  created () {
    this.formData = this._.cloneDeep(this.row);
  }

  custGroupTypeChangeFn (value: string) {
    this.$nextTick(() => {
      this.$set(this.formData, 'isAppr', value);
    });
  }

  saveFn () {
    this.form.validate((valid: boolean) => {
      if (valid) {
        updatecrowd(this.formData).then(res => {
          // 保存成功
          this.$message.success("保存成功！");
          this.groupInstance.refreshTable();
        })
      }
    });
  }
}
</script>

<style lang="scss" scoped>
  .EditBaseInfo-component {
    position: relative;
    background: #fff;
    min-height: calc(100vh - 182px);
    .base-form {
      margin-right: 553px;
      padding: 0 20px;
      text-align: center;
      .yu-xform {
        margin-top: 65px;
        display: inline-block;
        width: 70%;
        text-align: right;
      }
    }
    .base-title {
      position: absolute;
      top: 0;
      right: 0;
      width: 555px;
      height: 100%;
      background: url('../../../../../../assets/images/customer/group-bg.png') no-repeat center right;
      background-size: 555px 100%;
      img {
        position: absolute;
        top: 82px;
        right: 176px;
      }
    }
  }

  @media screen and (max-width: 1680px) { 
    .EditBaseInfo-component {
      min-height: calc(100vh - 155px);
    }
  }

</style>
