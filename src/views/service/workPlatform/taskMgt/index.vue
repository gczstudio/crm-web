<template>
  <div class="custLevel-container">
    <div class="yu-main-wrapper">
      <MainLayout>
        <template v-slot:header>
          <el-button icon="el-icon-download" @click="exportFn" v-permission="'export'">导出</el-button>
        </template>
        <template v-slot:form>
          <yu-xform ref="searchForm" class="search" :model="queryFormData" related-table-name="refTable" form-type="search" :need-export="true" :reset="resetFn">
            <yu-xform-group :column="4">
              <yu-xform-item label="任务类型" placeholder="任务类型" name="taskType" ctype="select" :options="taskTypeOptions" :clearable="false"></yu-xform-item>
              <yu-xform-item label="客户名称" placeholder="客户名称" ctype="input" name="custName" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="开始日期" name="dateStart" ctype="date-picker" placeholder="开始日期" :picker-options="startPickerOptions"></yu-xform-item>
              <yu-xform-item label="结束日期" name="dateEnd" ctype="date-picker" placeholder="结束日期" :picker-options="endPickerOptions"></yu-xform-item>
              <yu-xform-item label="考核条线" placeholder="考核条线" name="busiLine" ctype="select" data-code="BUINESS_LINE"></yu-xform-item>
              <yu-xform-item label="管户机构" placeholder="管户机构" ctype="yufp-org-tree" name="blgOrgBrchNo"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number :base-params="baseParams" :dynamic-height="true" border>
            <yu-xtable-column label="客户名称" prop="custName" min-width="230" fixed="left" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
                <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)">
                  <i class="iconfont icon-qiyelogo"></i>
                  {{scope.row.custName}}
                </div>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="核心客户号" prop="custId" width="120" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="期初余额（万元）" width="160" :show-overflow-tooltip="true" prop="openBal" format-money align="right" sortable="custom">
              <template slot-scope="scope">
                <span class="num">{{$util.formatMoney(scope.row.openBal / 10000)}}</span>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="期末余额（万元）" width="160" align="right" format-money prop="closeBal" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
                <span class="num">{{$util.formatMoney(scope.row.closeBal / 10000)}}</span>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="变动金额（万元）" prop="chgAmt" width="180" align="right" format-money sortable="custom" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span class="num">{{$util.formatMoney(scope.row.chgAmt / 10000)}}</span>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="变动原因" prop="reason" min-width="200" :show-overflow-tooltip="true"></yu-xtable-column>
            <yu-xtable-column label="变动时间" prop="etlDate" width="150" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="考核条线" prop="busiLine" width="120" data-code="BUINESS_LINE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="国标行业" prop="indsType" width="150" data-code="NAT_STD_INDS_MIS" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <!-- <yu-xtable-column label="客户类型" prop="custType" width="120" data-code="CUST_TYPE" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column> -->
            <yu-xtable-column label="企业规模" prop="entScale" width="120" data-code="ENT_SCALE_MIS" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="开户机构" v-if="!isMgr" prop="openOrgNm" width="150" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
            <yu-xtable-column v-if="!isMgr" label="管户机构" prop="blgOrgBarchNm" width="120" :show-overflow-tooltip="true"></yu-xtable-column>
            <yu-xtable-column v-if="!isMgr" label="客户经理" prop="blgMgrNm" width="120" :show-overflow-tooltip="true"></yu-xtable-column>
            <yu-xtable-column label="操作" width="150" fixed="right" align="center" is-num>
              <template slot-scope="scope">
                <el-button class="yu-action-btn" @click.native.prevent="showDetailFn(scope.row.id, 1)" type="text">查看</el-button>
                <el-button class="yu-action-btn" @click.native.prevent="showDetailFn(scope.row.id, 2)" type="text" v-permission="'edit'">填报</el-button>
              </template>
            </yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
    <detail :visible.sync="visible" :id="curId" :type="type" />
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import { backend } from '@/config'
import moment from "moment";
import { ServiceModule } from "@/store/modules/service";
import Detail from "./detail.vue";

@Component({
  name: "CustLevel",
  components: {
    Detail
  }
})
export default class extends Vue {
  @Ref('searchForm') searchForm: any;
  @Ref('refTable') refTable: any;
  private dataUrl = backend.workService + "/api/cstrmdmng/cstrmdlist"
  private dataDt = sessionStorage.getItem('dataDt');
  private isMgr: boolean = (this as any).$util.getCheckedRole().roleCode === "R300201";
  private taskTypeOptions: any = [
    {key: '1', value: '客户级动账提醒'}
  ]
  private queryFormData:any = {
    taskType: '1'
  }

  private baseParams = {
    condition: JSON.stringify({
       taskType: '1'
    })
  }

  private startPickerOptions = {
    disabledDate: (time: Date) => {
      if ((this.queryFormData as any).dateEnd) {
        return time.getTime() >= new Date((this.queryFormData as any).dateEnd).getTime();
      }
    }
  }

  private endPickerOptions = {
    disabledDate: (time: Date) => {
      if ((this.queryFormData as any).dateStart) {
        return time.getTime() <= new Date((this.queryFormData as any).dateStart).getTime() - 86400000;
      }
    }
  }

  private visible = false;
  private curId = "";
  private type = 1;


  mounted () {
    this.$checkCtr('export') && this.$exportQueue.addQueue(this.$route.path, this.exportFn)
  }

  resetFn() {
    this.queryFormData = {}
  }

  customerViewFn(row: any) {
    this.$router.push({
      path: "/custInfo/custView/" + row.crmCustId,
      query: {
        crmCustId: row.crmCustId,
        custId: row.custId,
        title: "客户详情-" + row.custName,
      },
    });
  }

  showDetailFn(id: string, type: number) {
    this.visible = true;
    this.curId = id;
    this.type = type;
  }

  exportFn (showTipModal?:boolean) {
    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      fileName: '动账提醒-客户级',
      queryField: this.searchForm.searchQueryField
    });
    var apiParams = {
      url: backend.workService + '/api/cstrmdmng/exportcstrmdlist',
      params: searchQuery,
      sort: this.refTable.sort
    };
    (this as any).$util.exportTable({
      _this: this,
      apiParams,
      showTipModal
    });
  }

}
</script>
