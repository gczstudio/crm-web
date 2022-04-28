<template>
  <yu-dialog custom-class="create-tag-modal" :visible.sync="dialogVisible" width="780px" @close="cancelFn" top="5vh" :key="type">
    <div v-if="dialogVisible">
      <div class="header">
        <img :src="require(`@/assets/images/customer/${type}-tag-title.png`)" alt="" />
        <i class="el-icon-close" @click="cancelFn"></i>
      </div>
      <div class="form">
        <yu-xform ref="form1" :model="formData1" label-width="123px" :disabled="formData1.mntMode === '1'">
          <yu-xform-group>
            <yu-xform-item
              label="标签类型"
              placeholder="标签类型"
              ctype="yufp-tree-select"
              name="parentTagNo"
              :tree-options="tagTreeOptions"
              :rules="formData1.mntMode === '1' ? null : globalRules.required"
              @select-fn="tagSelectFn"
              :disabled="formData1.mntMode === '1'"
            ></yu-xform-item>
            <yu-xform-item label="标签名称" placeholder="标签名称" ctype="input" name="tagNm" :rules="formData1.mntMode === '1' ? null : globalRules.requiredInput"></yu-xform-item>
            <yu-xform-item label="管理机构" placeholder="管理机构" ctype="yufp-org-tree" name="mgrOrg" :disabled="formData1.mntMode === '1'"></yu-xform-item>
            <yu-xform-item
              label="管理角色"
              placeholder="管理角色"
              ctype="select"
              name="mgrRole"
              :options="roleOptions"
              :rules="formData1.mntMode === '1' ? null : globalRules.required"
              multiple
              filterable
            ></yu-xform-item>
            <yu-xform-item label="可见范围" placeholder="可见范围" ctype="select" name="vslRange" data-code="VSL_RANGE" disabled></yu-xform-item>
            <yu-xform-item label="标签状态" placeholder="标签状态" ctype="select" name="tagStatus" data-code="TAG_STATUS" disabled></yu-xform-item>
          </yu-xform-group>
          <yu-xform-group :column="1">
            <yu-xform-item label="标签定义" placeholder="标签定义" ctype="input" type="textarea" name="tagDefinition" :rows="3" :rules="globalRules.input"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
        <div class="tag-section">
          <span v-if="formData1.mntMode != '1'" style="color: #f56c6c; margin-right: 4px">*</span><span>标签值</span>
          <img v-if="formData1.mntMode != '1'" :src="require('@/assets/images/common/icon-plus.png')" alt="" @click="addTagValueFn" />
        </div>
        <yu-xform ref="form2" class="tag-value-form" :model="formData2" label-width="90px" v-loading="loading">
          <div class="form-section" v-for="(item, index) in tagValues" :key="item.id">
            <yu-xform-group :column="3">
              <yu-xform-item
                label="标签值"
                placeholder="标签值"
                ctype="input"
                :name="`tagItemCode_${index}`"
                :disabled="type === 'edit' && !item.isAdd"
                :rules="formData1.mntMode === '1' ? null : globalRules.requiredInput"
                @change="tagValueChange($event, index, 'tagItemCode')"
              ></yu-xform-item>
              <yu-xform-item
                label="文字说明"
                placeholder="文字说明"
                ctype="input"
                :name="`itemCodeNm_${index}`"
                :disabled="formData1.mntMode == '1'"
                :rules="formData1.mntMode === '1' ? null : globalRules.required500"
                @change="tagValueChange($event, index, 'itemCodeNm')"
              ></yu-xform-item>
              <yu-xform-item label="是否为下拉项" ctype="checkbox" label-width="120px" :name="`isFlag_${index}`" @change="tagValueChange($event, index, 'isFlag')"></yu-xform-item>
            </yu-xform-group>
            <img v-if="type === 'create' || item.isAdd" class="icon-delete" :src="require('@/assets/images/common/icon-delete.png')" alt="" @click="deleteTagValueFn(index)" />
          </div>
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
import { backend } from "@/config";
import { TagValue } from "@/types/customer";
import request from "@/utils/request";
import { UserModule } from "@/store/modules/user";
import * as userApi from "@/api/users";
import * as customerApi from "@/api/customer";

@Component({
  name: "CreateTagModal",
})
export default class extends Vue {
  @Prop({ default: false }) private visible!: boolean;
  @Prop({ default: "create" }) private type!: string;
  @Prop() private data!: any;
  @Ref("searchForm") searchForm: any;
  @Ref("form1") form1: any;
  @Ref("form2") form2: any;
  private dialogVisible = false;
  private formData1 = {
    vslRange: "0",
    tagStatus: "0",
    mgrRole: [],
  };
  private formData2 = {};
  private tagValues: Array<TagValue> = [];
  private roleOptions = [];
  private tagTreeOptions = {
    children: "childList",
    label: "tagNm",
    dataUrl: backend.custService + "/api/ocrmftagtags/querytagtree",
    dataId: "tagNo",
    dataLabel: "tagNm",
  };
  private loading = false;

  @Watch("visible", { immediate: true })
  onVisibleChange() {
    this.dialogVisible = this.visible;
    this.$set(this.formData1, "mntMode", "");
    if (this.type === "edit" && this.visible) {
      this.formData1 = {
        ...this.data,
        parentTagNo: this.data.tagTypeNo,
        mgrRole: this.data.mgrRole ? this.data.mgrRole.split(",") : [],
      };
      this.getTagValue();
    }
  }

  created() {
    this.getAllRoles();
  }

  show() {
    this.$emit("update:visible", true);
  }

  hide() {
    this.$emit("update:visible", false);
  }

  tagSelectFn(data: any) {
    if (data.tagLevel != 2) {
      this.$message.warning("只能选择二级标签");
      this.$nextTick(() => {
        this.$set(this.formData1, "parentTagNo", "");
      });
    }
  }

  // 获取当前标签的标签值
  getTagValue() {
    this.loading = true;
    customerApi
      .querytagvalue({
        condition: JSON.stringify({
          tagNo: this.data.tagNo,
        }),
      })
      .then((res) => {
        this.tagValues = res.data.map((item: any) => {
          return {
            ...item,
            isFlag: item.isFlag === "1" ? true : false,
          };
        });
        this.updateFormData2();
        this.loading = false;
      });
  }

  sureFn() {
    // 手工标签才需要校验
    if ((this.formData1 as any).mntMode != "1") {
      var validate1 = false,
        validate2 = false;
      this.form1.validate((valid: any) => {
        if (valid) {
          validate1 = true;
        }
      });
      this.form2.validate((valid: any) => {
        if (valid) {
          validate2 = true;
        }
      });
      if (!validate1 || !validate2) return;

      if (!this.tagValues.length) {
        this.$message.warning("请添加标签值");
        return;
      }

      // 标签值不能有重复的
      let valueArr = this.tagValues.map((item) => item.tagItemCode);
      var valueSet = new Set(valueArr);
      if (valueArr.length !== valueSet.size) {
        this.$message.warning("标签值重复");
        return;
      }
    }

    let params = {
      ...this.formData1,
      mgrRole: this.formData1.mgrRole.join(","),
      mgrRoleNm: this.getNamesByCode(),
      list: this.tagValues.map((item) => {
        return {
          itemCodeNm: item.itemCodeNm,
          tagItemCode: item.tagItemCode,
          isFlag: item.isFlag ? "1" : "0",
        };
      }),
    };
    if (this.type === "create") {
      customerApi.addtag(params).then((res) => {
        this.$message.success("新建成功");
        this.hide();
        this.$emit("success");
      });
    } else {
      customerApi.edittag(params).then((res) => {
        this.$message.success("修改成功");
        this.hide();
        this.$emit("success");
      });
    }
  }

  getNamesByCode() {
    return this.roleOptions
      .filter((item: any) => {
        return (this.formData1.mgrRole as any).includes(item.key);
      })
      .map((item: any) => {
        return item.value;
      })
      .join(",");
  }

  cancelFn() {
    this.formData1 = {
      vslRange: "0",
      tagStatus: "0",
      mgrRole: [],
    };
    this.form1.resetFields();
    this.formData2 = {};
    this.tagValues = [];
    this.$nextTick(() => {
      this.hide();
    });
  }

  // 获取角色
  getAllRoles() {
    var params = {
      page: 1,
      size: 100,
    };
    userApi.getAllRoles(params).then((res) => {
      this.roleOptions = res.data.map((item: any) => {
        return {
          key: item.roleCode,
          value: item.roleName,
        };
      });
    });
  }

  // 添加标签值
  addTagValueFn() {
    this.tagValues.push({
      id: this.$util.genUUID(),
      tagItemCode: undefined,
      itemCodeNm: undefined,
      isFlag: true,
      isAdd: true,
    });
    this.updateFormData2();
  }

  // 标签值改变时
  tagValueChange(value: string, index: number, type: string) {
    this.tagValues.splice(index, 1, {
      ...this.tagValues[index],
      [type]: value,
    });
  }

  // 删除标签值
  deleteTagValueFn(index: number) {
    let id = this.tagValues[index].id;
    this.tagValues.splice(index, 1);
    this.updateFormData2();
  }

  updateFormData2() {
    let obj: any = {};
    this.$nextTick(() => {
      this.tagValues.forEach((item: any, index: number) => {
        obj[`tagItemCode_${index}`] = item.tagItemCode || undefined;
        obj[`itemCodeNm_${index}`] = item.itemCodeNm || undefined;
        obj[`isFlag_${index}`] = item.isFlag;
      });
      this.formData2 = obj;
    });
  }
}
</script>

<style lang="scss">
.create-tag-modal {
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
    background: url("../../../../../../assets/images/customer/create-tag-bg.png") no-repeat center;
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
