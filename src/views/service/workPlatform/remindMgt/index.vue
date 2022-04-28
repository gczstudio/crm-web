<template>
  <div class="RemindMgt-container">
    <!-- 动账提醒 -->
    <!-- 大额动账提醒 -->
    <AcctLevel v-if="remindType === '010101'" />
    <!-- 到期提醒 -->
    <!-- 存款到期提醒 -->
    <DepositeMaturity v-if="remindType === '020201'" />
    <!-- 贷款到期提醒 -->
    <LoanDue v-if="remindType === '020202'" />
    <!-- 生日提醒 -->
    <!-- 客户高管生日提醒 -->
    <CustMgrBirthday v-if="remindType === '030301'" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Ref } from "vue-property-decorator";
import AcctLevel from "./acctChangeRemind/acctLevel.vue";
import DepositeMaturity from "./expireRemind/depositeMaturity.vue";
import LoanDue from "./expireRemind/loanDue.vue";
import CustMgrBirthday from "./birthdayRemind/custMgrBirthday.vue";
import { ServiceModule } from "@/store/modules/service";
import * as serviceApi from "@/api/service";
@Component({
  name: "RemindMgt",
  components: {
    AcctLevel,
    DepositeMaturity,
    LoanDue,
    CustMgrBirthday,
  },
})
export default class extends Vue {
  get remindType() {
    return `${ServiceModule.remindType}${ServiceModule.remindSType}`;
  }

  @Watch("$route", { immediate: true })
  private onRouteChange() {
    const { remindcategoryid, remindsubclassid, isflag, isMark } = this.$route.params;
    if (isflag) {
      ServiceModule.SET_REMIND_TYPE(remindcategoryid);
      ServiceModule.SET_REMIND_S_TYPE(remindsubclassid);
      isMark && ServiceModule.SET_IS_MARK(isMark);
    }
  }

  created() {
    serviceApi.queryretype({}).then((res) => {
      ServiceModule.SET_REMIND_OPTIONS(res.data);
    });
  }

  destroyed() {
    ServiceModule.SET_REMIND_TYPE("01");
    ServiceModule.SET_REMIND_S_TYPE("0101");
  }
}
</script>
