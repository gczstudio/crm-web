<template>
  <div class="birthdayRemind-container">
    <div class="yu-main-wrapper">
      <MainLayout>
        <template v-slot:header>
          <el-button icon="el-icon-setting" @click="paramsSetFn" v-permission="'paramsSet'">参数设置</el-button>
          <el-button icon="el-icon-download" @click="exportFn" v-permission="'export'">导出</el-button>
        </template>
        <template v-slot:form>
          <yu-xform ref="searchForm" class="search" :model="queryFormData" related-table-name="refTable" form-type="search" :need-export="true">
            <yu-xform-group :column="4">
              <yu-xform-item label="提醒大类" placeholder="提醒大类" name="remindType" ctype="select" :options="remindTypeOptions" :clearable="false" @change="remindTypeChange"></yu-xform-item>
              <yu-xform-item label="提醒小类" placeholder="提醒小类" name="remindSType" ctype="select" :options="remindSTypeOptions" :clearable="false" @change="remindSTypeChange"></yu-xform-item>
              <yu-xform-item label="客户名称" placeholder="客户名称" ctype="input" name="custName" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="核心客户号" placeholder="核心客户号" ctype="input" name="custId" :rules="globalRules.input"></yu-xform-item>
              <!-- <yu-xform-item label="高管类型" placeholder="高管类型" ctype="select" name="seniorType" data-code="SENIOR_TYPE" filterable></yu-xform-item> -->
              <yu-xform-item label="主管客户经理" placeholder="主管客户经理" ctype="yufp-customer-modal" selection-type="radio" name="mgrId" :rules="globalRules.input"></yu-xform-item>
              <yu-xform-item label="开始日期" name="dateStart" ctype="date-picker" placeholder="生日" :picker-options="startPickerOptions"></yu-xform-item>
              <yu-xform-item label="结束日期" name="dateEnd" ctype="date-picker" placeholder="生日" :picker-options="endPickerOptions"></yu-xform-item>
            </yu-xform-group>
          </yu-xform>
        </template>
        <template v-slot:table>
          <yu-xtable ref="refTable" :data-url="dataUrl" row-number :base-params="baseParams" :dynamic-height="true" border :default-load="false">
            <yu-xtable-column label="客户名称" prop="custName" width="280" fixed="left" :show-overflow-tooltip="true" sortable="custom">
              <template slot-scope="scope">
                <div class="yu-table__company" @click.prevent="customerViewFn(scope.row)">
                  <i class="iconfont icon-qiyelogo"></i>
                  {{scope.row.custName}}
                </div>
              </template>
            </yu-xtable-column>
            <yu-xtable-column label="核心客户号" prop="custId" min-width="120" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="企业规模" prop="entScale" min-width="120" :show-overflow-tooltip="true" sortable="custom" data-code="ENT_SCALE_MIS"></yu-xtable-column>
            <yu-xtable-column label="考核条线" prop="busiLine" min-width="120" :show-overflow-tooltip="true" sortable="custom" data-code="BUINESS_LINE"></yu-xtable-column>
            <yu-xtable-column label="高管类型" prop="seniorType" min-width="120" :show-overflow-tooltip="true" sortable="custom" data-code="SENIOR_TYPE"></yu-xtable-column>
            <yu-xtable-column label="高管名称" prop="seniorName" min-width="120" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="生日" prop="seniorBirthday" min-width="120" :show-overflow-tooltip="true" is-num sortable="custom"></yu-xtable-column>
            <yu-xtable-column label="主管客户经理" prop="mgrName" min-width="120" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          </yu-xtable>
        </template>
      </MainLayout>
    </div>
    <content-modal :visible.sync="contentVisible">
      <template slot-scope="scope">
        <params-set :instance="scope" />
      </template>
    </content-modal>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from "vue-property-decorator";
import { backend } from '@/config'
import moment from "moment";
import { ServiceModule } from "@/store/modules/service";
import ParamsSet from '../paramsSet/index.vue'

@Component({
  name: "BirthdayRemind",
  components: {
    ParamsSet
  }
})
export default class extends Vue {
  @Ref('searchForm') searchForm: any;
  @Ref('refTable') refTable: any;
  private dataUrl = backend.workService + "/api/warntype/querybirth";
  private contentVisible = false;

  private queryFormData:any = {
    remindType: '03',
    remindSType: '0301'
  }

  private baseParams = {
    condition: JSON.stringify({
      remindType: '03',
      remindSType: '0301',
      isMark: '1'
    })
  }

  private startPickerOptions = {
    disabledDate:  (time: Date) => {
      var dateEnd = (this.queryFormData as any).dateEnd;
      return dateEnd && (time.getTime() >= moment(dateEnd).valueOf() || time.getTime() < moment(dateEnd).startOf('year').valueOf())
    }
  }

  // 不可跨年操作
  private endPickerOptions = {
    disabledDate: (time: Date) => {
      var dateStart = (this.queryFormData as any).dateStart;
      return dateStart && (time.getTime() <= moment(dateStart).valueOf() - 86400000 || time.getTime() > moment(dateStart).endOf('year').valueOf());
    }
  }

  get remindTypeOptions() {
    return ServiceModule.remindOptions.map((item: any) => {
      return {
        key: item.remindCategoryId,
        value: item.remindCategoryNm
      }
    })
  }

  get remindSTypeOptions() {
    return (ServiceModule.remindOptions.find((item:any) => item.remindCategoryId==='03') as any)?.childList.map((item: any) => {
      return {
        key: item.remindSubclassId,
        value: item.remindSubclassNm
      }
    })
  }

  get isMark() {
    return ServiceModule.isMark;
  }

  @Watch('isMark')
  onIsMarkChange() {
    this.isMark === '2' && this.searchFn()
  }

  mounted() {
    this.searchFn()
    this.$checkCtr('export') && this.$exportQueue.addQueue(this.$route.path, this.exportFn)
  }

  searchFn() {
    this.refTable.remoteData({
      condition:JSON.stringify({
        isMark: this.isMark
      })
    }, true, () => {
      ServiceModule.SET_IS_MARK('1')
    })
  }

  // 参数设置
  paramsSetFn() {
    this.contentVisible = true;
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

  // 大类变化
  remindTypeChange(value: string) {
    ServiceModule.SET_REMIND_TYPE(value)
    let remindSType = (ServiceModule.remindOptions.find((item:any) => item.remindCategoryId===value) as any)?.childList[0].remindSubclassId
    ServiceModule.SET_REMIND_S_TYPE(remindSType)
  }

  // 小类变化
  remindSTypeChange(value: string) {
    ServiceModule.SET_REMIND_S_TYPE(value)
  }

  exportFn (showTipModal?:boolean) {
    var searchQuery: any = (this as any)._.assign({}, this.searchForm.searchModel, {
      fileName: '客户高管生日提醒',
      queryField: this.searchForm.searchQueryField,
      isMark: this.isMark
    });
    var apiParams = {
      url: backend.workService + '/api/warntype/exportquerybirth',
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
