<template>
  <div class="CustMgt-container">
    <div class="yu-main-wrapper">
      <MainLayout>
        <template v-slot:header>
          <el-button icon="el-icon-collection-tag" @click="addTagFn" v-permission="'addTag'">添加标签</el-button>
          <el-button icon="el-icon-download" @click="exportFn" v-permission="'export'">导出</el-button>
        </template>
        <template v-slot:form>
          <yu-xform ref="searchForm" :model="queryFormData" form-type="search" :search="searchFn" :need-export="true">
            <yu-xform-group :column="4">
              <yu-xform-item label="客户名称" placeholder="客户名称" ctype="input" name="custNm" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="核心客户号" placeholder="核心客户号" ctype="input" name="custId" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="统一社会信用代码" placeholder="统一社会信用代码" ctype="input" name="socialCode" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="组织机构代码" placeholder="组织机构代码" ctype="input" name="insCredCode" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="考核条线" placeholder="考核条线" ctype="select" name="busiLine" data-code="BUINESS_LINE"></yu-xform-item>
              <yu-xform-item label="主管机构" placeholder="主管机构" ctype="yufp-org-tree" name="blgOrgNm" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="主管客户经理" placeholder="主管客户经理" ctype="yufp-customer-modal" selection-type="radio" name="blgMgrNm" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="存款余额（元）" ctype="yufp-range-input" name="custBal" :rules="$validator.rangeInput"></yu-xform-item>
              <yu-xform-item label="存款日均（元）" ctype="yufp-range-input" name="deptBalAvgYear" :rules="$validator.rangeInput"></yu-xform-item>
              <yu-xform-item label="信贷余额（元）" ctype="yufp-range-input" name="xdLoanBal" :rules="$validator.rangeInput"></yu-xform-item>
              <yu-xform-item label="贷款余额（元）" ctype="yufp-range-input" name="loanBal" :rules="$validator.rangeInput"></yu-xform-item>
              <yu-xform-item label="EVA（元）" ctype="yufp-range-input" name="eva" :rules="$validator.rangeInput"></yu-xform-item>
              <yu-xform-item label="业务利润（元）" ctype="yufp-range-input" name="profitContribution" :rules="$validator.rangeInput"></yu-xform-item>
              <yu-xform-item label="FTP利润（元）" ctype="yufp-range-input" name="ftpProfitBalnc" :rules="$validator.rangeInput"></yu-xform-item>
              <yu-xform-item label="中间业务收入（元）" ctype="yufp-range-input" name="midBizInc" :rules="$validator.rangeInput"></yu-xform-item>
              <yu-xform-item label="存款付息率" unit="%" ctype="yufp-range-input" name="avgDpsRate" :rules="$validator.rangeInput"></yu-xform-item>
              <yu-xform-item label="平均贷款利率" unit="%" ctype="yufp-range-input" name="avgLneRate" :rules="$validator.rangeInput"></yu-xform-item>
              <yu-xform-item label="未销户账户数" ctype="input" name="nonCloseAcctNum" :rules="$validator.number"></yu-xform-item>
              <yu-xform-item label="客户类型" placeholder="客户类型" ctype="select" name="custType" data-code="CUST_TYPE_MIS"></yu-xform-item>
              <yu-xform-item label="企业规模" placeholder="企业规模" ctype="select" name="entScale" data-code="ENT_SCALE_MIS"></yu-xform-item>
              <!-- <yu-xform-item label="有效账户数" placeholder="有效账户数" ctype="input" name="openAcctNum" :rules="globalRules.amountInput"></yu-xform-item> -->
              <yu-xform-item
                label="国标行业（一级）"
                placeholder="国标行业（一级）"
                ctype="select"
                name="natStdIndsOne"
                :options="natStdIndsOne"
                filterable
                @change="natStdIndsOneChange"
              ></yu-xform-item>
              <yu-xform-item
                label="国标行业（二级）"
                placeholder="国标行业（二级）"
                ctype="select"
                name="natStdIndsTwo"
                :options="natStdIndsTwo"
                filterable
                @change="natStdIndsTwoChange"
              ></yu-xform-item>
              <yu-xform-item label="国标行业（三级）" placeholder="国标行业（三级）" ctype="select" name="natStdIndsThree" :options="natStdIndsThree" filterable></yu-xform-item>
              <yu-xform-item label="注册资本（元）" ctype="yufp-range-input" name="regCapital" :rules="$validator.rangeInput"></yu-xform-item>
              <yu-xform-item label="总资产（元）" ctype="yufp-range-input" name="totalAssets" :rules="$validator.rangeInput"></yu-xform-item>
              <yu-xform-item label="营业收入（元）" ctype="yufp-range-input" name="busiIncom" :rules="$validator.rangeInput"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number selection-type="checkbox" :dynamic-height="true" border>
            <yu-xtable-column label="客户名称" prop="custNm" width="250" fixed="left" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
                <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)"><i class="iconfont icon-qiyelogo"></i>{{ scope.row.custNm }}</div>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="核心客户号" prop="custId" width="120" is-num :show-overflow-tooltip="true" fixed="left" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="统一社会信用代码" prop="socialCode" width="180" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="组织机构代码" prop="insCredCode" width="130" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="考核条线" prop="busiLine" width="120" :show-overflow-tooltip="true" data-code="BUINESS_LINE" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="主管机构" prop="blgOrgNm" width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="主管客户经理" prop="blgMgrNm" width="130" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="存款余额（元）" prop="custBal" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="存款日均（元）" prop="deptBalAvgYear" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="信贷余额（元）" prop="xdLoanBal" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="贷款余额（元）" prop="loanBal" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="EVA（元）" prop="eva" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="业务利润（元）" prop="profitContribution" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="FTP利润（元）" prop="ftpProfitBalnc" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="中间业务收入（元）" prop="midBizInc" width="170" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="存款付息率（%）" prop="avgDpsRate" width="160" align="right" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="平均贷款利率（%）" prop="avgLneRate" width="170" align="right" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="未销户账户数" prop="nonCloseAcctNum" width="170" align="right" is-num :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="客户类型" prop="custType" width="120" :show-overflow-tooltip="true" data-code="CUST_TYPE_MIS"></yu-xtable-column>
            <yu-xtable-column label="企业规模" prop="entScale" width="120" :show-overflow-tooltip="true" data-code="ENT_SCALE_MIS" sortable="custom"></yu-xtable-column>
            <!-- <yu-xtable-column label="有效账户数" prop="openAcctNum" width="120" :show-overflow-tooltip="true"  is-num sortable="custom"></yu-xtable-column> -->
            <yu-xtable-column label="国标行业（一级）" prop="natStdIndsOne" width="180" :show-overflow-tooltip="true" data-code="NAT_STD_INDS1_MIS" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="国标行业（二级）" prop="natStdIndsTwo" width="160" :show-overflow-tooltip="true" data-code="NAT_STD_INDS2_MIS" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="国标行业（三级）" prop="natStdIndsThree" width="160" :show-overflow-tooltip="true" data-code="NAT_STD_INDS3_MIS" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="注册资本（元）" prop="regCapital" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="总资产（元）" prop="totalAssets" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="营业收入（元）" prop="busiIncom" width="150" align="right" format-money :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <!-- <yu-xtable-column label="是否授信客户" prop="isCreditCust" width="130" :show-overflow-tooltip="true" :options="yesNoOptions" sortable="custom"></yu-xtable-column> -->
            <yu-xtable-column label="操作" width="100" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button class="yu-action-btn" @click.native.prevent="customerViewFn(scope.row)" type="text">客户视图</el-button>
              </template>
            </yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
    <add-tag-modal :visible.sync="tagVisible" />
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import { backend } from "@/config";
import AddTagModal from "./components/AddTagModal/index.vue";
import { getIndsTree } from "@/api/common";

@Component({
  name: "CustMgt",
  components: {
    AddTagModal,
  },
})
export default class extends Vue {
  @Ref("searchForm") searchForm: any;
  @Ref("refTable") refTable: any;
  private dataUrl = backend.custService + "/api/custquery/managecustlist";
  private queryFormData: any = {
    regCapital: null,
    totalAssets: null,
    busiIncom: null,
  };
  private yesNoOptions = [
    { key: "1", value: "是" },
    { key: "0", value: "否" },
  ];
  private tagVisible = false;

  private natStdIndsOne = [];
  private natStdIndsTwo = [];
  private natStdIndsThree = [];

  mounted() {
    this.$checkCtr("export") && this.$exportQueue.addQueue(this.$route.path, this.exportFn);
    this.getIndsTree();
  }

  // 获取国标行业
  getIndsTree() {
    // 获取国标一级
    getIndsTree({
      condition: JSON.stringify({
        level: "1",
      }),
    }).then((res) => {
      this.natStdIndsOne = res.data.map((item: any) => {
        return {
          ...item,
          key: item.indsId,
          value: item.indsNm,
        };
      });
    });
    // 获取国标二级
    getIndsTree({
      condition: JSON.stringify({
        level: "2",
      }),
    }).then((res) => {
      this.natStdIndsTwo = res.data.map((item: any) => {
        return {
          ...item,
          key: item.indsId,
          value: item.indsNm,
        };
      });
    });
    // 获取国标三级
    getIndsTree({
      condition: JSON.stringify({
        level: "3",
      }),
    }).then((res) => {
      this.natStdIndsThree = res.data.map((item: any) => {
        return {
          ...item,
          key: item.indsId,
          value: item.indsNm,
        };
      });
    });
  }

  // 国标一级改变
  natStdIndsOneChange(value: string) {
    getIndsTree({
      condition: JSON.stringify({
        parentId: value,
      }),
    }).then((res) => {
      this.natStdIndsTwo = res.data.map((item: any) => {
        return {
          ...item,
          key: item.indsId,
          value: item.indsNm,
        };
      });
      this.natStdIndsThree = [];
      this.queryFormData.natStdIndsTwo = "";
      this.queryFormData.natStdIndsThree = "";
    });
  }

  // 国标二级改变
  natStdIndsTwoChange(value: string) {
    getIndsTree({
      condition: JSON.stringify({
        parentId: value,
      }),
    }).then((res) => {
      this.natStdIndsThree = res.data.map((item: any) => {
        return {
          ...item,
          key: item.indsId,
          value: item.indsNm,
        };
      });
      this.queryFormData.natStdIndsThree = "";
    });
  }

  searchFn() {
    var queryData: any = {};
    for (let k in this.queryFormData) {
      var item = (this.queryFormData as any)[k];
      queryData[k] = Array.isArray(item) ? item.join("-") : item;
    }

    var params = {
      condition: JSON.stringify(queryData),
    };
    this.refTable.remoteData(params);
  }

  customerViewFn(row: any) {
    this.$router.push({ path: "/custInfo/custView/" + row.crmCustId, query: { crmCustId: row.crmCustId, custId: row.custId, title: "客户详情-" + row.custNm } });
  }

  addTagFn() {
    let selections = this.refTable.selections;
    if (!selections.length) {
      this.$message.warning("请至少选择一条数据！");
      return;
    }
    this.tagVisible = true;
  }

  // 导出
  exportFn(showTipModal?: boolean) {
    var queryData: any = {};
    for (let k in this.searchForm.searchModel) {
      var item = (this.searchForm.searchModel as any)[k];
      queryData[k] = Array.isArray(item) ? item.join("-") : item;
    }

    var searchQuery: any = (this as any)._.assign({}, queryData, {
      fileName: "辖内客户查询",
      queryField: this.searchForm.searchQueryField,
    });
    var apiParams = {
      url: backend.custService + "/api/custquery/exportmanagecustlist",
      params: searchQuery,
      sort: this.refTable.sort,
    };
    (this as any).$util.exportTable({
      _this: this,
      apiParams,
      showTipModal,
    });
  }
}
</script>
