<template>
  <div class="paramsSet-container">
    <el-row :gutter="16">
      <el-col :span="5">
        <div class="team-wrapper" :style="{ height: bHeight - (isMaxScreen ? 125 : 101) + 'px' }">
          <div class="team-header">
            <span>规则类型</span>
          </div>
          <ul class="team-cont">
            <li :class="{ active: nowNode.remindSubclassId === item.remindSubclassId }" v-for="item in remindOptions" :key="item.remindSubclassId" @click="nodeClickFn(item)">
              {{ item.remindSubclassNm }}
            </li>
          </ul>
          <Empty v-if="!remindOptions.length" />
        </div>
      </el-col>
      <el-col :span="19">
        <MainLayout class="yu-main-wrapper">
          <template v-slot:header>
            <el-button icon="el-icon-plus" @click="createRuleFn">新增</el-button>
            <el-button icon="el-icon-close" @click="closeFn">关闭</el-button>
          </template>
          <template v-slot:table>
            <yu-xtable ref="refTable" :data-url="dataUrl" row-number :dynamic-height="true" border style="margin-top: 16px" :default-load="false">
              <yu-xtable-column label="规则类型" prop="remindSubclassNm" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="状态" prop="status" :show-overflow-tooltip="true" sortable="custom" data-code="RULE_TYPE"></yu-xtable-column>
              <yu-xtable-column label="适用范围" prop="appScope" :show-overflow-tooltip="true" data-code="RULE_RANGE" sortable="custom"></yu-xtable-column>
              <yu-xtable-column v-if="nowNode.remindSubclassId === '0101'" label="大额阈值设定(万元)" prop="limitAmt" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column v-else label="提前提醒天数" prop="remindDays" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button class="yu-action-btn" @click.native.prevent="editRuleFn(scope.row)" type="text">修改</el-button>
                </template>
              </yu-xtable-column>
            </yu-xtable>
          </template>
        </MainLayout>
      </el-col>
    </el-row>
    <yu-dialog :title="type === 'edit' ? '编辑规则' : '新建规则'" :visible.sync="visible" width="500px" @close="closeRuleFn" top="20vh">
      <div>
        <yu-xform ref="ruleRef" :model="formData" label-width="150px">
          <yu-xform-item label="规则类型" placeholder="规则类型" ctype="input" name="remindSubclassNm" disabled></yu-xform-item>
          <!-- <yu-xform-item label="规则名称" placeholder="规则名称" ctype="input" name="remindRuleNm" :rules="globalRules.requiredInput50"></yu-xform-item> -->
          <yu-xform-item label="状态" placeholder="状态" ctype="select" name="status" data-code="RULE_TYPE" :rules="globalRules.required"></yu-xform-item>
          <yu-xform-item label="适用范围" placeholder="适用范围" ctype="select" name="appScope" data-code="RULE_RANGE" :rules="globalRules.required"></yu-xform-item>
          <!-- 大额动账设置金额，其他设置天数 -->
          <yu-xform-item v-if="nowNode.remindSubclassId === '0101'" label="大额阀值设定(万元)" placeholder="大额阀值设定" ctype="input" name="limitAmt" :rules="limitAmtRules"></yu-xform-item>
          <yu-xform-item v-else label="提前提醒天数" placeholder="提前提醒天数" ctype="input" name="remindDays" :rules="globalRules.requiredOrderNumber"></yu-xform-item>
        </yu-xform>
      </div>
      <div slot="footer" class="operate-btns tr">
        <el-button @click="closeRuleFn">取消</el-button>
        <el-button type="primary" @click="saveRuleFn">保存</el-button>
      </div>
    </yu-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import { backend } from "@/config";
import { ServiceModule } from "@/store/modules/service";
import * as serviceApi from "@/api/service";
@Component({
  name: "ParamsSet",
  components: {},
})
export default class extends Vue {
  @Prop() private instance!: any;
  @Ref("refTable") refTable: any;
  @Ref("ruleRef") ruleRef: any;
  private roleInfo = this.$util.getCheckedRole();
  private dataUrl = backend.workService + "/api/remindtype/queryresult";
  private nowNode: any = {};
  private visible = false;
  private type = "create";
  private formData: any = {
    status: "1",
    appScope: "1",
    limitAmt: "500",
    remindDays: "3",
  };

  private limitAmtValidate = (rule: any, value: any, callback: any) => {
    var reg = /^-?\d+(\.\d+)?$/;
    if (value && reg.test(value) && parseFloat(value) <= 1000000 && parseFloat(value) >= 100) {
      callback();
    } else if ((value && !reg.test(value)) || parseFloat(value) > 1000000 || parseFloat(value) < 100) {
      callback(new Error("请输入数字(100-1000000)"));
    } else {
      callback();
    }
  };

  private limitAmtRules = [{ required: true, message: "字段不能为空" }, { validator: this.limitAmtValidate }];

  // 点击规则
  nodeClickFn(node: any) {
    this.nowNode = node;
    this.formData.remindSubclassNm = node.remindSubclassNm;
    this.searchRule();
  }

  get remindOptions() {
    return this.getAllChildren(ServiceModule.remindOptions);
  }

  getAllChildren(data: Array<any>) {
    let arr: any = [];
    let fn = (data: Array<any>) => {
      data.forEach((item: any) => {
        if (item.childList?.length) {
          fn(item.childList);
        } else {
          arr.push(item);
        }
      });
    };
    fn(data);
    return arr;
  }

  // 查询当前类型下的规则
  searchRule() {
    let params = {
      remindSubclassId: this.nowNode.remindSubclassId,
    };
    this.refTable.remoteData(params);
  }

  // 新增规则
  createRuleFn() {
    this.type = "create";
    if (!this.nowNode.remindSubclassId) {
      this.$message.warning("请先选择规则类型！");
      return;
    }
    this.formData.remindSubclassNm = this.nowNode.remindSubclassNm;
    if (this.nowNode.remindSubclassId === "0101") {
      this.formData.limitAmt = "500";
    } else {
      this.formData.limitAmt = "";
    }
    this.formData.remindDays = "3";
    this.visible = true;
  }

  // 修改规则
  editRuleFn(row: any) {
    this.formData = {
      ...row,
      limitAmt: row.limitAmt + "",
      remindDays: row.remindDays + "",
    };
    this.visible = true;
    this.type = "edit";
  }

  saveRuleFn() {
    let validate = false;
    this.ruleRef.validate((valid: any) => {
      if (valid) {
        validate = true;
      }
    });
    if (!validate) return;
    let params = {
      ...this.formData,
      remindSubclassId: this.nowNode.remindSubclassId,
      limitAmt: Number(this.formData.limitAmt),
      remindDays: Number(this.formData.remindDays),
    };
    if (this.type === "create") {
      serviceApi.addruletype(params).then((res) => {
        this.$message.success("新增成功");
        this.searchRule();
        this.closeRuleFn();
      });
    } else {
      serviceApi.updateruletype(params).then((res) => {
        this.$message.success("编辑成功");
        this.searchRule();
        this.closeRuleFn();
      });
    }
  }

  closeRuleFn() {
    this.formData = {
      status: "1",
      appScope: "1",
      limitAmt: 500,
      remindDays: 3,
    };
    this.visible = false;
  }

  closeFn() {
    this.instance.hide();
  }
}
</script>
<style lang="scss" scoped>
.yu-main-wrapper {
  background: #fff;
}
.team-wrapper {
  background: #fff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  .team-header {
    span {
      font-weight: 16px;
      font-weight: bold;
    }
    padding: 12px 0 12px 12px;
    background: #fff;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
  }
  .team-title {
    font-weight: bold;
    padding: 10px;
    i {
      padding: 0 5px;
      font-size: 16px;
    }
  }
  .team-cont {
    li {
      cursor: pointer;
      padding: 10px 10px 10px 20px;
      .btns {
        display: none;
        float: right;
        i {
          cursor: pointer;
          padding: 0 5px;
        }
      }
      &:hover,
      &.active {
        background: rgba(0, 134, 179, 0.1);
      }
      &:hover {
        .btns {
          display: block;
        }
      }
    }
  }
}
</style>
