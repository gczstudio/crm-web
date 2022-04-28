import Vue from "vue";
import YuXform from "./yufp/form/YuXform.vue";
import YuXformItem from "./yufp/form/YuXformItem.vue";
import YuXformGroup from "./yufp/form/YuXformGroup.vue";
import YuXformItemPart from "./yufp/form/YuXformItemPart.vue";
import YuDetail from "./yufp/form/YuDetail.vue";
import YuXtable from "./yufp/table/YuXtable.vue";
import YuXtableColumn from "./yufp/table/YuXtableColumn.vue";
import SmallTab from "./yufp/SmallTab/index.vue";
import TopTable from "./yufp/TopTable/index.vue";
import ViewMore from "./yufp/ViewMore/index.vue";
import CustomTabs from "./yufp/customTab/CustomTabs.vue";
import CustomTabPane from "./yufp/customTab/CustomTabPane.vue";
import YuDialog from "./yufp/dialog/index.vue";
import YuLeftTree from "./yufp/tree/YuLeftTree.vue";
import YuLeftTreeNode from "./yufp/tree/YuLeftTreeNode.vue";
import YuExtTree from "./yufp/tree/YuExtTree.vue";
import YufpOrgTree from "./modal/YufpOrgTree.vue";
import YufpAuthOrgTree from "./modal/YufpAuthOrgTree.vue";
import ContentModal from "./ContentModal/index.vue";
import CustomerModal from "./CustomerModal/index.vue";
import YufpCustomerModal from "./CustomerModal/YufpCustomerModal.vue";
import OrgModal from "./OrgModal/index.vue";
import YufpRangeInput from "./yufp/RangeInput";
import Empty from "./Empty";
import MainLayout from "./MainLayout";
import UploadExcel from "./UploadExcel";
import YufpTreeSelect from "./YufpTreeSelect/index.vue";
import YufpTagSelector from "./YufpTagSelector/index.vue";
import CstgroupModal from "./CstgroupModal/index.vue";
import YufpCstgroupModal from "./CstgroupModal/YufpCstgroupModal.vue";
import Charts from "./Charts/index.vue";

const components = [
  YuXform,
  YuXformItem,
  YuXformGroup,
  YuXformItemPart,
  YuXtable,
  YuXtableColumn,
  YuDetail,
  SmallTab,
  TopTable,
  ViewMore,
  CustomTabs,
  CustomTabPane,
  YuDialog,
  YuLeftTree,
  YuLeftTreeNode,
  YuExtTree,
  YufpOrgTree,
  ContentModal,
  CustomerModal,
  YufpCustomerModal,
  OrgModal,
  YufpAuthOrgTree,
  YufpRangeInput,
  Empty,
  MainLayout,
  UploadExcel,
  YufpTreeSelect,
  YufpTagSelector,
  CstgroupModal,
  YufpCstgroupModal,
  Charts,
];

components.forEach((component) => {
  Vue.component(component.name, component);
});
