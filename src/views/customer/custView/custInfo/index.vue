<template>
  <div class="custInfo-container ml16">
    <div class="custInfo-section">
      <div class="title"><i class="iconfont icon-jibenxinxi1 vam f3"></i><span class="vam f3">基本信息</span></div>
      <div class="content">
        <yu-xform ref="baseInfForm" :model="baseInfFormData" class="yu-xform-table" label-width="160px" label-position="left" form-type="details" disabled>
          <yu-xform-group :column="4">
            <yu-xform-item label="客户名称" name="custNm" ctype="input"></yu-xform-item>
            <yu-xform-item label="核心客户号" name="custId" ctype="input" is-num></yu-xform-item>
            <yu-xform-item label="统一社会信用代码" name="socialCode" ctype="input" is-num></yu-xform-item>
            <yu-xform-item label="组织机构代码" name="insCredCode" ctype="input" is-num></yu-xform-item>
            <yu-xform-item label="成立日期" name="comEstabDate" ctype="input" is-num></yu-xform-item>
            <yu-xform-item label="注册币种" name="regCurrCd" ctype="select" data-code="CURR_CD"></yu-xform-item>
            <yu-xform-item label="注册资本（元）" name="regCapital" ctype="input" format-money></yu-xform-item>
            <yu-xform-item label="注册地址" name="regAddr" ctype="input"></yu-xform-item>
            <yu-xform-item label="法定代表人" name="legalName" ctype="input"></yu-xform-item>
            <yu-xform-item label="法定代表人证件种类" name="legalCertType" ctype="input" data-code="CERT_TYPE"></yu-xform-item>
            <yu-xform-item label="法定代表人证件号码" name="legalCertId" ctype="input" is-num></yu-xform-item>
            <yu-xform-item label="经济类型" name="economyType" ctype="select" data-code="ECONOMY_TYPE"></yu-xform-item>
            <yu-xform-item label="组织形式" name="orgForm" ctype="select" data-code="ORG_FORM"></yu-xform-item>
            <yu-xform-item label="单位隶属" name="orgBelong" ctype="input" data-code="CORP_BELONG"></yu-xform-item>
            <yu-xform-item label="经营状态" name="operStat" ctype="input" data-code="OPER_STAT" :colspan="isMaxScreen?12:8"></yu-xform-item>
            <yu-xform-item label="主营业务" name="mainBusi" ctype="input" :rowspan="isMaxScreen?6:5" :colspan="24"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </div>
    </div>
    <div class="custInfo-section mt16" v-if="show">
      <div class="title"><i class="iconfont icon-fenleixinxi vam f3"></i><span class="vam f3">分类信息</span></div>
      <div class="content">
        <yu-xform ref="baseInfForm" :model="baseInfFormData" class="yu-xform-table" label-width="160px" label-position="left" form-type="details" disabled>
          <yu-xform-group :column="4">
            <yu-xform-item label="总资产（元）" name="totalAssets" ctype="input" format-money></yu-xform-item>
            <yu-xform-item label="营业收入（元）" name="busiIncom" ctype="input" format-money></yu-xform-item>
            <yu-xform-item label="员工人数" name="empNum" ctype="input" is-num></yu-xform-item>
            <yu-xform-item label="企业规模" name="entScale" ctype="input" data-code="ENT_SCALE_MIS"></yu-xform-item>
            <yu-xform-item label="客户类型" name="custType" ctype="select" data-code="CUST_TYPE_MIS"></yu-xform-item>
            <yu-xform-item label="国标行业（一级）" name="natStdIndsOne" ctype="select"  data-code="NAT_STD_INDS_MIS"></yu-xform-item>
            <yu-xform-item label="国标行业（二级）" name="natStdIndsTwo" ctype="select"  data-code="NAT_STD_INDS_MIS"></yu-xform-item>
            <yu-xform-item label="国标行业（三级）" name="natStdIndsThree" ctype="select"  data-code="NAT_STD_INDS_MIS"></yu-xform-item>
            <yu-xform-item label="是否上市公司" name="listFlg" ctype="select" data-code="YESNO"></yu-xform-item>
            <yu-xform-item label="是否集团客户" name="groupCustFlg" ctype="select" data-code="YESNO"></yu-xform-item>
            <yu-xform-item label="是否本行股东" name="ownerFlg" ctype="select" data-code="YESNO"></yu-xform-item>
            <yu-xform-item label="是否科技型企业" name="techCorFlg" ctype="select" data-code="YESNO"></yu-xform-item>
            <yu-xform-item label="是否高新技术企业" name="hignTechFlg" ctype="select" data-code="YESNO"></yu-xform-item>
            <yu-xform-item label="是否战略新兴产业" name="stratEmerFlg" ctype="select" data-code="YESNO"></yu-xform-item>
            <yu-xform-item label="是否绿色企业" name="greenEntFlg" ctype="select" data-code="YESNO"></yu-xform-item>
            <yu-xform-item label="是否两高一剩行业" name="thorFlg" ctype="select" data-code="YESNO"></yu-xform-item>
            <yu-xform-item label="是否异地客户" name="remtCstFlg" ctype="select" data-code="YESNO"></yu-xform-item>
            <yu-xform-item label="是否网银客户" name="onbankCstFlg" ctype="select" data-code="YESNO"></yu-xform-item>
            <yu-xform-item label="有无进出口经营权" name="imptRightsFlg" ctype="select" data-code="IMPT_RIGHTS_FLG"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </div>
    </div>
    <div class="custInfo-section mt16">
      <div class="title"><i class="iconfont icon-qitaxinxi vam f3"></i><span class="vam f3">其他信息</span></div>
      <div class="content">
        <yu-xform ref="baseInfForm" :model="baseInfFormData" class="yu-xform-table" label-width="180px" label-position="left" form-type="details" disabled>
          <yu-xform-group :column="4">
            <yu-xform-item label="主管客户经理" name="blgMgrNm" ctype="input"></yu-xform-item>
            <yu-xform-item label="主管机构" name="blgOrgNm" ctype="input"></yu-xform-item>
            <yu-xform-item label="首建信贷关系日期" name="credReltDate" ctype="input" is-num></yu-xform-item>
            <yu-xform-item label="开户日期（核心）" name="openDateCore" ctype="input" is-num></yu-xform-item>
            <yu-xform-item label="开户机构（核心）" name="openOrgNmCore" ctype="input"></yu-xform-item>
            <yu-xform-item label="开户柜员（核心）" name="openContCore" ctype="input"></yu-xform-item>
            <yu-xform-item label="登记机构（信贷）" name="regOrgNmCredt" ctype="input"></yu-xform-item>
            <yu-xform-item label="即期信用评级（信贷）" name="creditGrade" ctype="input"></yu-xform-item>
            <yu-xform-item label="归属机构（信贷）" name="blgOrgNmCrdt" ctype="input"></yu-xform-item>
          </yu-xform-group>
        </yu-xform>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as customerApi from "@/api/customer";

@Component({
  name: 'CustInfo',
  components: {
  }
})
export default class extends Vue {
  private baseInfFormData = {}
  private crmCustId = this.$route.query.crmCustId as string;
  private show = false;

  created() {
    this.getCustdetailinfo();
  }

  getCustdetailinfo() {
    customerApi.getCustdetailinfo(this.crmCustId).then(res => {
      this.baseInfFormData = res.data?.[0] || {}
      this.show = true;
    })
  }

}
</script>

<style lang="scss" scoped>
  .custInfo-container {
    .custInfo-section{
      background: #FFFFFF;
      box-shadow: 0px 3px 6px  rgba(0, 0, 0, 0.2);
      border-radius: 5px;
      .title{
        padding: 16px;
        border-bottom: 1px solid #E5E5E5;
        span{
          margin-left: 8px;
          font-weight: bold;
        }
      }
      .content {
        padding: 16px;
        table {
          tr {
            td {
              line-height: 30px;
            }
            td:nth-child(1) {
              font-weight: bold;
            }
            td:nth-child(2) {
              color: #666;
              padding-left: 20px;
            }
          }
        }
      }
    }
  }
</style>
