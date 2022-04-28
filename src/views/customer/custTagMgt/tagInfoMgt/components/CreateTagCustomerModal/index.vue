<template>
  <div>
    <yu-dialog custom-class="create-tag-customer-modal" title="添加客户" :visible.sync="dialogVisible" width="70%" @close="cancelFn" top="5vh">
      <div>
        <yu-xform ref="searchForm" class="search" related-table-name="refTable" form-type="search">
          <yu-xform-group :column="2">
            <yu-xform-item label="客户名称" placeholder="客户名称" ctype="input" name="custNm" :rules="globalRules.input" style="width: 400px"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
        <yu-xtable ref="refTable" :data-url="dataUrl" height="60vh" row-number selection-type="checkbox" border>
          <yu-xtable-column label="客户名称" prop="custNm" min-width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom">
            <template slot-scope="scope">
              <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{ scope.row.custNm }}</div>
            </template>
          </yu-xtable-column>
          <yu-xtable-column label="核心客户号" prop="custId" min-width="120" is-num :show-overflow-tooltip="true" fixed="left" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="国标行业" prop="natStdIndsOne" min-width="180" :show-overflow-tooltip="true" data-code="NAT_STD_INDS_MIS" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="客户类型" prop="custType" width="120" :show-overflow-tooltip="true" data-code="CUST_TYPE_MIS"></yu-xtable-column>
          <yu-xtable-column label="企业规模" prop="entScale" width="120" :show-overflow-tooltip="true" data-code="ENT_SCALE_MIS" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="存款余额（元）" prop="custBal" min-width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="存款日均（元）" prop="deptBalAvgYear" min-width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="贷款余额（元）" prop="loanBal" min-width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="FTP利润（元）" prop="ftpProfitBalnc" min-width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="中间业务收入（元）" prop="midBizInc" min-width="180" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="主管机构" prop="blgOrgNm" min-width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
        </yu-xtable>
      </div>
      <div slot="footer" class="operate-btns tr">
        <el-button @click="cancelFn">取消</el-button>
        <el-button type="primary" @click="nextFn">下一步</el-button>
      </div>
    </yu-dialog>
    <yu-dialog custom-class="select-tag-value-modal" title="选择指标值" :visible.sync="tagValueVisible" width="500px" @close="closeTagValueFn" top="20vh">
      <div>
        <yu-xform ref="searchForm" :model="formData" label-width="80px">
          <yu-xform-item label="标签值" placeholder="标签值" ctype="select" name="tagItemCode" :options="tagValues" :rules="globalRules.required" filterable></yu-xform-item>
        </yu-xform>
      </div>
      <div slot="footer" class="operate-btns tr">
        <el-button @click="closeTagValueFn">取消</el-button>
        <el-button type="primary" @click="sureFn">保存</el-button>
      </div>
    </yu-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";
import { backend } from "@/config";
import * as customerApi from "@/api/customer";

@Component({
  name: "CreateTagCustomerModal",
})
export default class extends Vue {
  @Prop({ default: false }) private visible!: boolean;
  @Prop() private data!: any;
  @Prop() private tagValues!: any;
  @Ref("searchForm") searchForm: any;
  @Ref("refTable") refTable: any;
  private dialogVisible = false;
  private tagValueVisible = false;
  private dataUrl = backend.custService + "/api/custquery/managecustlist";
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

  customerViewFn(row: any) {
    this.cancelFn();
    this.$router.push({ path: "/custInfo/custView/" + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: "客户详情-" + row.custNm } });
  }

  nextFn() {
    let selections = this.refTable.selections;
    if (!selections.length) {
      this.$message.warning("请至少选择一条数据！");
      return;
    }
    this.tagValueVisible = true;
  }

  sureFn() {
    this.searchForm.validate((valid: any) => {
      if (valid) {
        let selections = this.refTable.selections;
        let params = selections.map((item: any) => {
          return {
            crmCustId: item.crmCustId,
            custNm: item.custNm,
            tagNo: this.data.tagNo,
            ...this.formData,
          };
        });
        customerApi.addtagcust(params).then((res) => {
          this.$message.success("添加成功");
          this.$emit("success");
          this.tagValueVisible = false;
          this.hide();
        });
      }
    });
  }

  cancelFn() {
    this.hide();
    this.refTable.clearSelection();
  }

  closeTagValueFn() {
    this.tagValueVisible = false;
    this.searchForm.resetFields();
  }
}
</script>

<style lang="scss">
.create-tag-customer-modal {
  .el-dialog__footer {
    padding: 15px;
    border-top: 1px solid #d8d8d8;
  }
}
</style>
