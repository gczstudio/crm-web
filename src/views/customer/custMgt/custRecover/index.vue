<template>
  <div class="CustBank-container">
    <div class="yu-main-wrapper">
      <MainLayout>
        <template v-slot:header>
          <el-button icon="el-icon-user-solid" v-if="$checkCtr('recoverCust') || roleInfo.roleCode === 'R100001'" @click="recoverCustFn">按客户回收</el-button>
          <el-button icon="el-icon-s-custom" v-if="$checkCtr('recoverMgr') || roleInfo.roleCode === 'R100001'" @click="recoverMgrFn">按客户经理回收</el-button>
        </template>
        <template v-slot:form>
          <yu-xform ref="searchForm" class="search" :model="queryFormData" form-type="search" related-table-name="refTable">
            <yu-xform-group :column="4">
              <yu-xform-item label="核心客户号" placeholder="核心客户号" ctype="input" name="custId" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="客户名称" placeholder="客户名称" ctype="input" name="custNm" :rules="globalRules.input"></yu-xform-item>
              <!-- <yu-xform-item label="证件号码" placeholder="证件号码" ctype="input" name="socialCode" :rules="globalRules.input"></yu-xform-item> -->
              <yu-xform-item label="组织机构代码" placeholder="组织机构代码" ctype="input" name="insCredCode" :rules="globalRules.input"></yu-xform-item>
              <!-- 只有总行有 authorg T -->
              <yu-xform-item label="主管机构" placeholder="主管机构" ctype="yufp-org-tree" name="blgOrgNo"></yu-xform-item>
              <yu-xform-item label="协管机构" placeholder="协管机构" ctype="yufp-org-tree" name="assistBlgOrgNo"></yu-xform-item>
              <yu-xform-item label="主管客户经理" placeholder="主管客户经理" ctype="yufp-customer-modal" selection-type="radio" name="blgMgrId"></yu-xform-item>
              <yu-xform-item label="协管客户经理" placeholder="协管客户经理" ctype="yufp-customer-modal" selection-type="radio" name="assistBlgMgrId"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number :dynamic-height="true" border selection-type="checkbox">
            <yu-xtable-column label="核心客户号" prop="custId" width="150" fixed="left" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="组织机构代码" prop="insCredCode" width="150" fixed="left" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="客户名称" prop="custNm" width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
                <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{ scope.row.custNm }}</div>
              </template>
            </yu-xtable-column>
            <!-- <yu-xtable-column label="证件类型" prop="insCredCode" min-width="120" :show-overflow-tooltip="true"></yu-xtable-column> -->
            <!-- <yu-xtable-column label="证件号码" prop="custType" min-width="120" :show-overflow-tooltip="true" data-code="CUST_TYPE_MIS"></yu-xtable-column> -->
            <yu-xtable-column label="主管机构" prop="blgOrgNm" min-width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="协管机构" prop="assistBlgOrgNm" min-width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="主管客户经理" prop="blgMgrNm" min-width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="协管客户经理" prop="assistBlgMgrNm" min-width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="操作" width="100" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button class="yu-action-btn" @click.native.prevent="allotHistoryFn(scope.row)" type="text">分配历史</el-button>
              </template>
            </yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
    <CustomerModal :selection-type="selectionType" :is-auth-org="false" :show-other="showOther" :crm-cust-id="selectCrmCustIds" :visible.sync="customerVisible" @sure="customerSureFn" />
    <yu-dialog title="按客户回收" :visible.sync="recoverVisible" width="500px">
      <div>
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="主管客户经理"></el-checkbox>
          <el-checkbox label="协管客户经理"></el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="operate-btns tc">
        <el-button type="primary" @click="sureFn">确定</el-button>
        <el-button @click="recoverVisible = false">取消</el-button>
      </div>
    </yu-dialog>
    <!-- 分配机构历史列表 -->
    <yu-dialog title="分配历史" :visible.sync="historyVisible" width="1200px" custom-class="allot-dialog">
      <div>
        <el-tabs class="yu-tabs" v-model="activeName">
          <el-tab-pane label="分配机构历史" name="1" lazy>
            <!-- 分配机构历史列表 -->
            <yu-xtable ref="allotOrgTable" :data-url="allotOrgDataUrl" :base-params="allotBaseParams" row-number border>
              <yu-xtable-column label="客户号" prop="custId" width="150" fixed="left" :show-overflow-tooltip="true"></yu-xtable-column>
              <yu-xtable-column label="客户名称" prop="custNm" width="250" fixed="left" :show-overflow-tooltip="true">
                <template>
                  {{ custRow.custNm }}
                </template>
              </yu-xtable-column>
              <yu-xtable-column label="归属机构" prop="aOrgNm" width="150" :show-overflow-tooltip="true"></yu-xtable-column>
              <yu-xtable-column label="机构类型" prop="aOrgType" min-width="150" :show-overflow-tooltip="true" data-code="AORG_TYPE"></yu-xtable-column>
              <yu-xtable-column label="分配类型" prop="assiType" min-width="150" :show-overflow-tooltip="true" data-code="ALLOT_TYPE"></yu-xtable-column>
              <yu-xtable-column label="分配来源" prop="blgOrgSys" min-width="150" :show-overflow-tooltip="true" data-code="BLG_ORG_SYS"></yu-xtable-column>
              <yu-xtable-column label="调整时间" prop="assiDate" min-width="180" :show-overflow-tooltip="true"></yu-xtable-column>
              <yu-xtable-column label="调整人" prop="assiUsrNm" min-width="150" :show-overflow-tooltip="true"></yu-xtable-column>
              <yu-xtable-column label="调整人机构" prop="assiOrgNm" min-width="150" :show-overflow-tooltip="true"></yu-xtable-column>
            </yu-xtable>
          </el-tab-pane>
          <el-tab-pane label="分配客户经理历史" name="2" lazy>
            <!-- 分配客户经理历史列表 -->
            <yu-xtable ref="allotOrgTable" :data-url="allotMgrDataUrl" :base-params="allotBaseParams" row-number border>
              <yu-xtable-column label="客户号" prop="custId" width="150" fixed="left" :show-overflow-tooltip="true"></yu-xtable-column>
              <yu-xtable-column label="客户名称" prop="custNm" width="250" fixed="left" :show-overflow-tooltip="true">
                <template>
                  {{ custRow.custNm }}
                </template>
              </yu-xtable-column>
              <yu-xtable-column label="归属客户经理" prop="aMgrNm" width="150" :show-overflow-tooltip="true"></yu-xtable-column>
              <yu-xtable-column label="客户经理类型" prop="aMgrType" min-width="150" :show-overflow-tooltip="true" data-code="AMGR_TYPE"></yu-xtable-column>
              <yu-xtable-column label="分配类型" prop="assiType" min-width="150" :show-overflow-tooltip="true" data-code="ALLOT_TYPE"></yu-xtable-column>
              <yu-xtable-column label="分配来源" prop="blgMrgSys" min-width="150" :show-overflow-tooltip="true" data-code="BLG_ORG_SYS"></yu-xtable-column>
              <yu-xtable-column label="调整时间" prop="assiDate" min-width="180" :show-overflow-tooltip="true"></yu-xtable-column>
              <yu-xtable-column label="调整人" prop="assiUsrNm" min-width="150" :show-overflow-tooltip="true"></yu-xtable-column>
              <yu-xtable-column label="调整人机构" prop="assiOrgNm" min-width="150" :show-overflow-tooltip="true"></yu-xtable-column>
            </yu-xtable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </yu-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from "vue-property-decorator";
import { backend } from "@/config";
import lookup from "@/utils/lookup";
import * as customerApi from "@/api/customer";
import { getCheckedRole, getUserInfo } from "@/utils";

@Component({
  name: "CustRecover",
})
export default class extends Vue {
  private dataUrl = backend.custService + "/api/custallocate/getcustlist";
  private queryFormData = {};
  private customerVisible = false;
  private orgVisible = false;
  private selectionType = "checkbox";
  private disType = "";
  private orgId = "";
  private recoverVisible = false;
  private checkList = [];
  private historyVisible = false;
  private activeName = "1";
  private allotOrgDataUrl = backend.custService + "/api/custallocate/getcustorghis";
  private allotMgrDataUrl = backend.custService + "/api/custallocate/getcustmgrhis";
  private allotBaseParams = {};
  private custRow = {};
  private selectOrgIds = "";
  private selectCrmCustIds = "";
  private showOther = false;
  private userInfo = getUserInfo();
  private roleInfo = getCheckedRole();

  beforeRouteEnter(to: any, from: any, next: any) {
    lookup.bind("YESNO", () => {
      next();
    });
  }

  customerViewFn(row: any) {
    this.$router.push({ path: "/custInfo/custView/" + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: "客户详情-" + row.custNm } });
  }

  // 确认分配客户经理
  customerSureFn(data: any) {
    if (!data?.length && this.disType !== "assistMgr") {
      this.$message.warning("请选择一条数据！");
      return;
    }
    this.sureMgrFn(data);
  }

  // 回收校验是否存在营销标识
  validaterecycleinfo(callback: any, mgrIds?: any) {
    let selections = (this.$refs.refTable as any).selections;
    let params = {
      condition: JSON.stringify({
        mgrIds: mgrIds || "",
        crmCustIds: selections.map((item: any) => item.crmCustId).join(";") || "",
      }),
    };
    customerApi.validaterecycleinfo(params).then((res) => {
      if (res.data.length > 0) {
        let custStrs = res.data.map((item: any) => item.custName).join(",");
        this.$confirm(custStrs + "的唯一营销标识将被一同回收，是否回收?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: (action) => {
            if (action === "confirm") {
              callback && callback();
            }
          },
        });
      } else {
        callback && callback();
      }
    });
  }

  // 按客户回收
  recoverCustFn() {
    let selections = (this.$refs.refTable as any).selections;
    if (!selections.length) {
      this.$message.warning("请选择一条或多条记录");
      return;
    }
    this.recoverVisible = true;
    this.checkList = [];
  }

  // 确认按客户回收
  sureFn() {
    if (!this.checkList.length) {
      this.$message.warning("请选择回收类型");
      return;
    }
    // 回收协管客户经理时进行营销标识校验
    if (this.checkList[0] === "协管客户经理") {
      this.validaterecycleinfo(() => {
        this.execRecoverFn();
      });
      return;
    }
    this.execRecoverFn();
  }

  execRecoverFn() {
    let selections = (this.$refs.refTable as any).selections;
    let params = {
      crmCustIds: selections.map((item: any) => item.crmCustId).join(","),
      recycleType: this.checkList.length === 2 ? "" : this.checkList[0] === "主管客户经理" ? "1" : "2",
    };
    customerApi.recycleByCust(params).then((res) => {
      this.recoverVisible = false;
      this.$message.success("回收成功");
      (this.$refs.refTable as any).remoteData();
    });
  }

  // 按客户经理回收
  recoverMgrFn() {
    let selections = (this.$refs.refTable as any).selections;
    if (!selections.length) {
      this.$confirm("此操作将针对所有客户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: (action) => {
          if (action === "confirm") {
            this.showCustModal();
          }
        },
      });
      return;
    }
    this.showCustModal();
  }

  showCustModal() {
    this.selectCrmCustIds = "";
    this.showOther = false;
    this.selectionType = "checkbox";
    this.customerVisible = true;
    this.disType = "";
  }

  // 确认按客户经理回收
  sureMgrFn(data: any) {
    this.validaterecycleinfo(() => {
      let selections = (this.$refs.refTable as any).selections;
      let params = {
        crmCustIds: selections.map((item: any) => item.crmCustId).join(","),
        userIds: data.map((item: any) => item.userId).join(","),
      };
      customerApi.recycleByMgr(params).then((res) => {
        this.customerVisible = false;
        this.$message.success("回收成功");
        (this.$refs.refTable as any).remoteData();
      });
    }, data.map((item: any) => item.userId).join(";"));
  }

  // 分配历史
  allotHistoryFn(row: any) {
    this.custRow = row;
    this.historyVisible = true;
    this.allotBaseParams = {
      condition: JSON.stringify({
        crmCustId: row.crmCustId,
      }),
    };
  }
}
</script>
<style lang="scss">
.allot-dialog {
  .el-dialog__body {
    padding-top: 0;
  }
}
</style>
