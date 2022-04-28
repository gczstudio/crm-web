<template>
  <div class="CustFlex-container">
    <el-row :gutter="12">
      <el-col :span="5">
        <div class="col">
          <ul class="tabs clearfix">
            <li v-for="item in dimension" :class="{ active: activeKey === item.id }" @click="tabClickFn(item.id)" :key="item.id">{{ item.objName }}</li>
          </ul>
          <yu-left-tree
            v-if="activeKey"
            :key="activeKey"
            ref="mytree"
            class="no-border"
            :data-url="curTreeUrl"
            data-id="nodeid"
            data-label="name"
            data-pid="parentId"
            :show-checkbox="false"
            :expand-level="1"
            :highlight-current="true"
            :height="bHeight - (isMaxScreen ? 222 : 195)"
            filter-key="isEnable"
            draggable
            :allow-drop="allowDroprow"
            @node-drag-start="handleDragStart"
            @get-tree-datas="getTreeDatas"
          >
          </yu-left-tree>
        </div>
      </el-col>
      <el-col :span="19">
        <div class="col">
          <div class="flex-header clearfix">
            <div class="flex-title">查询条件</div>
            <div class="flex-date">
              <yu-xform ref="searchForm" :model="queryFormData" :search="serachFn" :reset="resetFn" form-type="search">
                <yu-xform-group :column="1">
                  <yu-xform-item label="数据日期" name="etlDate" ctype="date-picker" placeholder="数据日期" :rules="globalRules.required"></yu-xform-item>
                </yu-xform-group>
              </yu-xform>
              <el-button @click="showPlanModal" v-permission="'save'">保存方案</el-button>
              <el-button @click="planFn" v-permission="'list'">方案列表</el-button>
            </div>
          </div>
          <div class="flex-content">
            <div class="flex-form" @drop="conditionDrop($event)" @dragover="conditionDragover($event)">
              <div :class="`condition_${index}`" v-for="(item, index) in conditionList" :key="item.id">
                <yu-xform :ref="`searchRef_${index}`" :model="item" label-width="100px" :enter-search="false">
                  <div class="form-condition">
                    <el-row>
                      <el-col :span="6">{{ item.name }}</el-col>
                      <el-col :span="8"><yu-xform-item label="范围" name="ssColOp" ctype="select" :options="item.selection.options" :rules="globalRules.required"></yu-xform-item></el-col>
                      <el-col :span="8">
                        <template v-if="!['0007', '0008'].includes(item.ssColOp)">
                          <yu-xform-item
                            label="内容"
                            :name="item.prop"
                            :ctype="item.ctype"
                            :options="item.options"
                            filterable
                            :multiple="getMultiple(item)"
                            :tree-options="getTreeOptions(item)"
                            :params="item"
                            :rules="getRules(item)"
                            :selection-type="item.fieldType === '9' ? 'checkbox' : 'radio'"
                            v-bind="getOptions(item)"
                          ></yu-xform-item>
                        </template>
                      </el-col>
                      <el-col :span="2"><img src="~@/assets/images/common/icon-delete.png" alt="" @click="deleteConditionFn(index)" /></el-col>
                    </el-row>
                  </div>
                </yu-xform>
              </div>
              <Empty v-if="!conditionList.length" description="暂无数据，请从左侧树中进行拖拽" />
            </div>
            <div class="flex-line"></div>
            <div class="flex-table">
              <div class="flex-table_title">
                <el-row>
                  <el-col :span="12">显示列表</el-col>
                  <el-col :span="12">
                    <el-button class="yu-button-text" icon="el-icon-plus" v-permission="'add'" @click="addCustGroupFn">加入客户群</el-button>
                    <el-button class="yu-button-text" icon="el-icon-download" @click="exportFn" v-permission="'export'">导出</el-button>
                  </el-col>
                </el-row>
              </div>
              <div class="flex-table-cnt" @drop="columnDrop($event)" @dragover="columnDragover($event)">
                <drag-table ref="dragTable" :height="200" :columns="columnList" @change="dragColumnChangeFn" @sort-change="sortChangeFn"></drag-table>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-drawer :visible.sync="drawerVisible" direction="rtl" :modal="false" :size="256">
      <el-input placeholder="请输入关键字进行过滤" suffix-icon="el-icon-search" v-model="filterText" clearable @input="filterChangeFn"></el-input>
      <div class="plan-list" v-loading="playLoading">
        <div class="plan-item" v-for="item in planList" :key="item.id" v-debounce="() => planClickFn(item)">
          <div class="plan-title" :title="item.ssName">{{ item.ssName }}</div>
          <el-row>
            <el-col :span="12">{{ item.userName }}</el-col>
            <el-col :span="12">{{ item.orgName }}</el-col>
          </el-row>
          <i class="el-icon-close" @click.stop="deletePlanFn(item)"></i>
        </div>
        <Empty v-if="!planList.length" />
      </div>
    </el-drawer>
    <yu-dialog title="保存方案" :visible.sync="planVisible" width="500px" @close="closePlanFn" top="20vh">
      <div>
        <yu-xform ref="nameRef" :model="formData" label-width="100px">
          <yu-xform-item label="方案名称" placeholder="方案名称" ctype="input" name="name" :rules="globalRules.requiredInput30"></yu-xform-item>
        </yu-xform>
      </div>
      <div slot="footer" class="operate-btns tr">
        <el-button @click="closePlanFn">取消</el-button>
        <el-button type="primary" @click="saveFn">保存</el-button>
      </div>
    </yu-dialog>
    <CstgroupModal :loading="groupLoading" loading-title="正在加入客群" selection-type="radio" :visible.sync="cstgroupvisible" is-auth @sure="cstgroupSureFn" required />
  </div>
</template>

<script>
import DragTable from "./components/DragTable";
import { backend } from "@/config";
import { getCheckedRole } from "@/utils";
import * as customerApi from "@/api/customer";
export default {
  name: "CustFlex",
  components: {
    DragTable,
  },
  data() {
    let roleInfo = getCheckedRole();
    return {
      dimension: [],
      activeKey: "",
      roleInfo: roleInfo,
      treeUrl: backend.custService + "/api/ocrmfcifqdbcol/prepare?id=",
      curTreeUrl: "",
      queryFormData: {
        etlDate: sessionStorage.getItem("dataDt"),
      },
      dragnode: {},
      conditionList: [
        // {
        //   name: "客户名称",  // 属性名
        //   selection: {       // 范围下拉框
        //     options: [{key:'1',value: '是'}, {key:'2',value: '否'}],
        //   },
        //   ctype: "input",         // 内容类型
        //   options: [],
        //   prop: "custName",
        // }
      ],
      columnList: [],
      drawerVisible: false,
      filterText: "",
      planVisible: false,
      formData: {},
      planList: [],
      originTreeMap: {},
      searchParams: {},
      playLoading: false,
      cstgroupvisible: false,
      groupLoading: false,
    };
  },
  created() {
    this.getTabs();
  },
  mounted() {
    this.$lookup.reg("NUM_DATABOX,TEXTBOX,RADIO_COMBOBOX,TAG_COMBOBOX,SINGLE_INCLUDEBOX,EQUAL_BOX");
    this.$checkCtr("export") && this.$exportQueue.addQueue(this.$route.path, this.exportFn);
  },
  watch: {
    activeKey: function (newVal, oldVal) {
      this.resetFn();
    },
  },
  methods: {
    getMultiple(item) {
      if (item.ctype === "select") {
        return true;
      }
      return false;
    },
    getOptions(item) {
      if (item.fieldType === "10") {
        let levels = {
          NAT_STD_INDS_ONE: "1",
          NAT_STD_INDS_TWO: "2",
          NAT_STD_INDS_THREE: "3",
        };
        return {
          orgLevel: levels[item.colNameE],
        };
      }
      return {};
    },
    getTreeOptions(item) {
      if (item.fieldType === "7" && item.ctype === "yufp-org-tree") {
        return {
          showCheckbox: true,
          checkStrictly: false,
        };
      }
      if (item.fieldType === "10") {
        return {
          showCheckbox: true,
          treeKey: "indstree",
          dataUrl: backend.custService + "/api/ocrmfcifqdbcol/indstree",
          dataId: "indsId",
          dataLabel: "indsNm",
          dataPid: "parentId",
          expandLevel: 1,
          level: "level",
          checkStrictly: true,
        };
      }
    },
    getTabs() {
      customerApi.showtab().then((res) => {
        this.dimension = res.data;
        let activeKey = res.data?.[0].id;
        this.activeKey = activeKey;
        this.curTreeUrl = this.treeUrl + activeKey;
      });
    },
    tabClickFn(key) {
      this.activeKey = key;
      this.curTreeUrl = this.treeUrl + key;
    },
    resetFn() {
      this.conditionList = [];
      this.columnList = [];
      this.searchParams = {};
    },
    sortChangeFn({ column, givenOrder }) {
      this.serachFn(
        {
          givenOrder,
          ...column,
        },
        "sort"
      );
    },
    isNum(item) {
      return ["NUMBER", "DECIMAL", "INTEGER"].includes(item.colType);
    },
    isMoney(item) {
      return item.isMoneyData === "true";
    },
    // 获取输入内容的校验规则
    getRules(item) {
      if (this.isNum(item)) {
        return [
          { required: true, message: "字段不能为空" },
          { validator: this.$validator.float, message: "数字类型错误" },
          { max: 30, message: "输入信息不能超过30个字", trigger: "blur" },
        ];
      }

      if (item.ctype === "input") {
        return this.globalRules.requiredInput;
      }

      return this.globalRules.required;
    },
    //查询
    serachFn(data, type) {
      if (!this.validateForm()) return;
      let conditionAttrs = [],
        results = [],
        tagDateFlag = null;
      let hasTagDate = false;
      this.conditionList.forEach((item, index) => {
        if (item.name === "标签日期") {
          tagDateFlag = "1";
          hasTagDate = true;
        }
        conditionAttrs.push({
          SS_COL_ITEM: item.nodeId,
          SS_COL_OP: item.ssColOp,
          SS_COL_VALUE: Array.isArray(item[item.prop]) ? item[item.prop].join(",") : item[item.prop] || "",
          SS_COL_GJOIN: "and",
          SS_COL_JOIN: "",
          SS_COL_GORDER: index,
          SS_COL_ORDER: "",
        });
      });

      // 没有拖拽标签日期，默认传导航栏-数据日期
      if (!hasTagDate) {
        conditionAttrs.push({
          SS_COL_ITEM: this.activeKey == 1000 ? 10164 : 10329,
          SS_COL_OP: "0002",
          SS_COL_VALUE: sessionStorage.getItem("dataDt"),
          SS_COL_GJOIN: "and",
          SS_COL_JOIN: "",
          SS_COL_GORDER: conditionAttrs.length + 1,
          SS_COL_ORDER: "",
        });
      }

      this.columnList.forEach((item, index) => {
        let sortType = "0";
        if (data) {
          let sortOptions = {
            asc: "1",
            desc: "2",
          };
          if (item.prop === data.property) {
            sortType = sortOptions[data.givenOrder] || "0";
          }
        }
        results.push({
          columnId: item.nodeId,
          sortType: sortType, // 0: 不排序  1: asc  2: desc
          columnTotle: "0",
        });
      });

      let params = {
        conditionAttrs,
        results,
        etlDate: this.queryFormData.etlDate,
        tagDateFlag,
        objId: this.activeKey,
      };

      this.searchParams = params;

      this.$refs.dragTable.remoteData({
        condition: JSON.stringify(params),
      });

      !type && this.$refs.dragTable.clearSort();
    },
    /**
     * 指标树操作
     */
    allowDroprow() {
      return false;
    },
    /**
     * 拖拽开始
     */
    handleDragStart(node, ev) {
      this.dragnode = node;
    },
    // 条件拖拽
    conditionDrop(event) {
      if (!this.dragnode?.childNodes?.length) {
        this.addConditionOrColumnFn({
          node: this.dragnode.data,
          type: "condition",
        });
      }
    },
    conditionDragover(event) {
      event.preventDefault();
    },
    // 添加操作
    addConditionOrColumnFn({ node, type, index }) {
      if (!node) return;
      customerApi.showcoltype({ condition: JSON.stringify({ id: node.nodeid }) }).then((res) => {
        let col = res.data[0];
        col.isTimesDrag = node.isTimesDrag;
        if (type === "condition") {
          this.addConditionFn(col);
        } else {
          this.addColumnFn({ col, index });
        }
      });
    },
    // 添加查询条件
    addConditionFn(col, flag) {
      // flag 方案列表回显
      if (flag) {
        col.id = col.ssColItem;
      }
      if (col.isTimesDrag === "false") {
        let bool = this.conditionList.some((item) => item.nodeId === col.id);
        if (bool) {
          this.$message.warning("该条件只能选择一次！");
          return;
        }
      }
      let condition = {
        id: this.$util.genUUID(),
        nodeId: col.id,
        name: col.colNameC, // 属性名
        selection: {
          // 范围下拉框
          options: [],
        },
        ctype: "input", // 内容类型
        options: [],
        prop: this.tranformColName(col.colNameE),
        colNameE: col.colNameE,
        ssId: col.ssId,
        colType: col.colType,
        isMoneyData: col.isMoneyData,
        fieldType: col.fieldType,
      };
      if (flag) {
        // 下拉框的将值处理成数组
        if (["4", "6", "8"].includes(col.fieldType)) {
          condition[condition.prop] = col.ssColValue ? col.ssColValue.split(",") : null;
        } else {
          condition[condition.prop] = col.ssColValue;
        }
        condition.ssColOp = col.ssColOp;
      }

      if (col.notes) {
        this.$lookup.bind(col.notes, (lookup) => {
          col.options = lookup;
          condition = { ...condition, ...this.getScopeOptions(col) };
          this.conditionList.push(condition);
        });
      } else {
        condition = { ...condition, ...this.getScopeOptions(col) };
        this.conditionList.push(condition);
      }

      !flag && this.addColumnFn({ col, formCondition: true });
    },
    // 删除查询条件
    deleteConditionFn(index) {
      this.conditionList.splice(index, 1);
    },
    // 显示列拖拽
    columnDrop(event) {
      if (!this.dragnode?.childNodes?.length) {
        let targetIndex = event.target.classList[1] ? event.target.classList[1].split("_")[1] : "";
        this.addConditionOrColumnFn({
          node: this.dragnode.data,
          type: "column",
          index: targetIndex,
        });
      }
    },
    columnDragover(event) {
      event.preventDefault();
    },
    dragColumnChangeFn(columns) {
      this.columnList = columns;
    },
    /**
     * flag: 点击某个方案回显
     * formCondition： 是否来自添加条件的时候，添加的column
     */
    addColumnFn({ col, index, flag, formCondition }) {
      // 客群名称不能加入列
      if (col.isResultCol === "false") return;
      // 判断表头不能显示重复的
      let bool = this.columnList.some((item) => item.originId === col.id || item.originId === col.relColId);
      if (bool) return;
      if (col.notes && !formCondition) {
        this.$lookup.reg(col.notes);
      }
      let column = {
        nodeId: col.relColId || col.id,
        label: col.colNameC,
        prop: this.tranformColName(flag ? col.colNameE : col.relColNameE || col.colNameE),
        width: col.colNameC.length * 15 + 90,
        originId: col.id,
        dataCode: col.notes,
        colType: col.colType,
        isMoneyData: col.isMoneyData,
        notes: col.notes,
      };
      var data = this._.cloneDeep(this.columnList);
      if (index) {
        data.splice(index, 0, column);
      } else {
        data.push(column);
      }
      this.columnList = data;
      this.dragnode = {};
    },
    showPlanModal() {
      // 校验
      if (!this.validateForm()) return;
      this.planVisible = true;
    },
    validateForm() {
      if (!this.conditionList.length) {
        this.$message.warning("请添加查询条件");
        return false;
      }
      if (!this.columnList.length) {
        this.$message.warning("请添加查询字段");
        return false;
      }
      var _this = this;

      // 搜索条件表单校验
      let bool = this.conditionList
        .map((item, index) => {
          let validate = false;
          _this.$refs["searchRef_" + index][0].validate((valid) => {
            if (valid) {
              validate = true;
            }
          });
          return validate;
        })
        .every((item) => item);
      return bool;
    },
    // 获取范围的下拉值
    getScopeOptions(data) {
      const { colType, fieldType, options, fName } = data;
      const textOptions = this.$lookup.find("TEXTBOX");
      const numDataOptions = this.$lookup.find("NUM_DATABOX");
      const selectOptions = this.$lookup.find("RADIO_COMBOBOX");
      const tagOptions = this.$lookup.find("TAG_COMBOBOX");
      const singleOptions = this.$lookup.find("SINGLE_INCLUDEBOX");
      const equalOptions = this.$lookup.find("EQUAL_BOX");
      let item = {};
      let selection = {
        options: [],
      };
      if (colType == "VARCHAR2") {
        // 文本框
        selection.options = textOptions;
      } else if (colType == "NUMBER" || colType == "DECIMAL" || colType == "INTEGER") {
        // 数字框
        selection.options = numDataOptions;
      } else if (colType == "DATE" || colType == "TIMESTMP") {
        // 日期框
        selection.options = numDataOptions;
      }

      switch (fieldType) {
        case "1": // 文本框
          selection.options = textOptions;
          item.ctype = "input";
          break;
        case "2": // 数字框
          selection.options = numDataOptions;
          item.ctype = "input";
          break;
        case "3": // 日期框
          selection.options = numDataOptions;
          item.ctype = "date-picker";
          break;
        case "4": // 下拉框
          selection.options = selectOptions;
          item.ctype = "select";
          item.options = options;
          break;
        case "5": // 单选框
          item.ctype = "select";
          item.options = options;
          break;
        case "6": // 多选框
          item.ctype = "select";
          item.options = options;
          break;
        case "7": // 多选框
          item.ctype = fName;
          selection.options = item.ctype === "yufp-org-tree" ? tagOptions : selection.options;
          break;
        case "8": //标签
          selection.options = tagOptions;
          item.ctype = fName;
          break;
        case "9": //客户群
          selection.options = singleOptions;
          item.ctype = fName;
          break;
        case "10": //国标行业
          selection.options = tagOptions;
          item.ctype = "yufp-org-tree";
          break;
        case "11": //标签日期
          selection.options = equalOptions;
          item.ctype = "date-picker";
          break;
      }

      return {
        ...item,
        selection,
      };
    },
    //转换为驼峰命名
    tranformColName(name) {
      let ename = name.toLowerCase().split("_");
      for (var k = 1; k < ename.length; k++) {
        ename[k] = ename[k].charAt(0).toUpperCase() + ename[k].substring(1);
      }
      return ename.join("");
    },
    // 保存方案
    saveFn() {
      let validate = false;
      this.$refs.nameRef.validate((valid) => {
        if (valid) {
          validate = true;
        }
      });

      if (!validate) return;

      let connDataObj = {
        ssType: "1",
        ssName: this.formData.name,
        id: "1",
        topNum: "",
        ssResult: "",
        ssSort: "",
        objId: this.activeKey,
      };
      let nodeData = [];

      this.columnList.forEach((item, index) => {
        connDataObj.ssResult += item.nodeId;
        connDataObj.ssSort += "1";
        if (index != this.columnList.length - 1) {
          connDataObj.ssResult += ",";
          connDataObj.ssSort += ",";
        }
      });

      this.conditionList.forEach((item, index) => {
        // 查询条件
        nodeData.push({
          ssColItem: item.nodeId, // nodeid值
          ssColOp: item.ssColOp, // 操作符的值
          ssColValue: Array.isArray(item[item.prop]) ? item[item.prop].join(",") : item[item.prop] || "", // 属性值
          ssColGjoin: "and", // 连接符 and / or
          ssColJoin: "", // 子节点
          ssColGorder: index, // 顺序
          ssColOrder: "0",
          ssId: "1",
        });
      });

      let params = {
        connData: [connDataObj],
        nodeData,
      };

      customerApi.checkssolution({ ssName: this.formData.name }).then((res) => {
        if (res.data?.length) {
          this.$confirm("该方案已存在，是否更新当前方案？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            callback: (action) => {
              if (action === "confirm") {
                params.connData[0].id = this.conditionList[0].ssId;
                this.updatescol(params);
              }
            },
          });
        } else {
          this.savescol(params);
        }
      });
    },
    // 保存方案
    savescol(params) {
      customerApi.savescol(params).then((res) => {
        this.$message.success("保存成功！");
        this.planVisible = false;
      });
    },
    // 更新方案
    updatescol(params) {
      customerApi.updatescol(params).then((res) => {
        this.$message.success("更新成功！");
        this.planVisible = false;
      });
    },
    filterChangeFn(planFn) {
      this.getColList(this.filterText);
    },
    // 查询方案列表
    getColList(name) {
      this.playLoading = true;
      let params = {
        condition: JSON.stringify({
          ssName: name,
        }),
      };
      customerApi.getColList(params).then((res) => {
        this.playLoading = false;
        this.planList = res.data;
      });
    },
    closePlanFn() {
      this.planVisible = false;
      this.$refs.nameRef.resetFields();
    },
    // 方案列表
    planFn() {
      this.drawerVisible = true;
      this.getColList();
    },
    getTreeDatas(data) {
      data.map((item) => {
        this.originTreeMap[item.nodeid] = item;
      });
    },
    // 方案列表明细
    planClickFn({ id, objId }) {
      this.conditionList = [];
      this.columnList = [];
      // 渲染条件
      if (objId != this.activeKey) {
        this.activeKey = objId;
        this.tabClickFn(objId);
      }
      customerApi.getSsolutiondetail({ ssId: id }).then((res) => {
        this.drawerVisible = false;
        let data = res.data;
        data.conditionAttrs.map((item) => {
          this.addConditionFn(item, true);
        });
        let lookupCodes = [];

        data.results.map((item) => {
          this.addColumnFn({
            col: item,
            flag: true,
          });
          if (item.notes) lookupCodes.push(item.notes);
        });

        // 请求所有的字典
        lookupCodes.length && this.$lookup.reg(lookupCodes.join(","));
      });
    },
    // 删除方案
    deletePlanFn(data) {
      this.$confirm("此操作将删除该方案, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: (action) => {
          if (action === "confirm") {
            customerApi.deletescol({ ids: data.id }).then((res) => {
              this.$message.success("删除成功！");
              this.planFn();
            });
          }
        },
      });
    },
    // 加入客群
    addCustGroupFn() {
      let refTable = this.$refs.dragTable.$refs?.refTable;
      if (!refTable?.pageTotal) return;
      if (refTable?.selections?.length) {
        this.$confirm("是否将勾选的客户加入客户群！", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: (action) => {
            if (action === "confirm") {
              this.cstgroupvisible = true;
            }
          },
        });
        return;
      }
      this.$confirm("是否将所有的客户加入客户群！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: (action) => {
          if (action === "confirm") {
            this.cstgroupvisible = true;
          }
        },
      });
    },
    cstgroupSureFn(data) {
      let refTable = this.$refs.dragTable.$refs?.refTable;
      let selections = refTable?.selections;
      this.groupLoading = true;
      // 加入勾选客户
      if (selections?.length) {
        let params = {
          custGroupId: data[0].custGroupId,
          custGroupNm: data[0].custGroupNm,
          list: selections.map((item) => {
            return {
              crmCustId: item.crmCustIdBase,
              custNm: item.custNameBase,
            };
          }),
        };
        customerApi.addcrowdmem(params).then((res) => {
          this.$message.success("加入客户群成功！");
          this.cstgroupvisible = false;
          this.groupLoading = false;
        });
        return;
      }
      // 加入所有客户
      let params = {
        condition: JSON.stringify({
          ...this.searchParams,
          custGroupId: data[0].custGroupId,
          custGroupNm: data[0].custGroupNm,
        }),
      };
      customerApi.addalltocustgroup(params).then((res) => {
        this.$message.success("加入客户群成功！");
        this.cstgroupvisible = false;
        this.groupLoading = false;
      });
    },
    // 导出
    exportFn(showTipModal) {
      if (!Object.keys(this.searchParams).length) return;
      let columns = [],
        queryField = "";
      columns = this.columnList.map((item) => {
        const { label, prop, isMoneyData, notes } = item;
        return {
          header: label,
          field: prop,
          isMoneyData,
          notes,
        };
      });

      queryField = this.conditionList
        .map((item) => {
          const {
            name,
            prop,
            ssColOp,
            selection: { options },
          } = item;
          return `${name}${this.$lookup.convertKey(options, ssColOp)}${item[prop] || ""}`;
        })
        .join(",");

      let total = this.$refs.dragTable.$refs.refTable.pageTotal;
      var searchQuery = this._.assign({}, this.searchParams, {
        columns,
        total,
        fileName: "客户灵活查询",
        queryField,
      });
      var apiParams = {
        url: backend.custService + "/api/ocrmfcifqdbcol/exportresult",
        params: searchQuery,
      };

      // if(total > 70000) {
      //   this.$message.warning("最多可导出70000条数据！");
      //   return;
      // }

      this.$util.exportTable({
        _this: this.$refs.dragTable,
        apiParams,
        showTipModal,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.CustFlex-container {
  ::v-deep .el-form-item__error {
    z-index: 1;
    top: 92%;
  }
  .tabs {
    position: relative;
    height: 32px;
    line-height: 32px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
    li {
      float: left;
      width: 50%;
      font-size: 15px;
      color: #666;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
      &.active {
        // background: $blue;
        color: #fff;
        font-weight: bold;
      }
    }
  }
  .col {
    background: #fff;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  }
  .flex-content {
    height: calc(100vh - 182px);
    overflow: auto;
  }
  .flex-header {
    padding: 8px 20px 8px 10px;
    background: #fff;
    border-bottom: 1px solid #d8d8d8;
    .flex-title {
      float: left;
      margin-top: 12px;
      font-size: 15px;
      font-weight: bold;
    }
    ::v-deep.flex-date {
      float: right;
      .yu-xform {
        width: 500px;
        display: inline-block;
        vertical-align: middle;
        .yu-xform-content--search {
          width: calc(100% - 160px);
        }
        .el-form-item {
          margin-bottom: 0px;
        }
        .yu-xform-btns {
          bottom: 4px;
        }
      }
      .el-button {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
  .flex-form {
    min-height: 215px;
    padding: 10px;
    background: #fff;
    .form-condition {
      margin-bottom: 4px;
      background: #e8e8e8;
      .el-col {
        position: relative;
      }
      .el-col:nth-child(1) {
        padding-left: 10px;
        padding-top: 10px;
      }
      .el-col:nth-child(2),
      .el-col:nth-child(3) {
        padding: 0 10px;
      }
      img {
        cursor: pointer;
        position: absolute;
        top: 10px;
      }
      .form-required {
        color: red;
        position: absolute;
        left: 60px;
        top: 15px;
      }
    }
    ::v-deep.yu-xform {
      .el-form-item {
        margin-bottom: 0;
      }
      .el-select__tags {
        flex-wrap: nowrap !important;
        overflow: hidden;
        & > span {
          display: flex;
          flex-wrap: nowrap;
        }
      }
    }
  }
  .flex-line {
    height: 10px;
    background: #efefef;
  }
  .flex-table {
    background: #fff;
    .flex-table_title {
      & > span {
        display: flex;
        flex-wrap: nowrap;
      }
      padding: 10px;
      .el-col:nth-child(1) {
        font-size: 15px;
        font-weight: bold;
      }
      .el-col:nth-child(2) {
        text-align: right;
      }
    }
  }
  ::v-deep .el-drawer {
    .el-drawer__header {
      display: none;
    }
    height: calc(100vh - 165px);
    top: 165px;
    .el-drawer__body {
      padding: 16px 10px;
    }
  }
  .plan-list {
    .plan-item {
      cursor: pointer;
      position: relative;
      margin-top: 8px;
      padding: 20px 8px;
      border: 1px solid #a8a8a8;
      border-radius: 2px;
      transition: all 0.3s;
      .plan-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 15px;
        margin-bottom: 14px;
      }
      .el-icon-close {
        display: none;
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 20px;
        cursor: pointer;
      }
      &:hover {
        background: #00a4db;
        color: #fff;
        .el-icon-close {
          display: block;
        }
      }
    }
  }
}

@media screen and (max-width: 1680px) {
  .CustFlex-container {
    ::v-deep .el-form-item__error {
      z-index: 1;
      top: 100%;
    }
    .flex-content {
      height: calc(100vh - 150px);
    }
    .flex-header {
      .flex-title {
        margin-top: 6px;
      }
      ::v-deep.flex-date {
        .yu-xform {
          .yu-xform-content--search {
            width: calc(100% - 150px);
          }
          .yu-xform-btns {
            bottom: 0;
          }
        }
      }
    }
    .flex-form {
      .form-condition {
        padding: 4px 0;
        .el-col:nth-child(1) {
          padding-left: 10px;
          padding-top: 8px;
        }
        .form-required {
          top: 9px;
        }
        img {
          top: 3px;
        }
      }
    }
    ::v-deep .el-drawer {
      .el-drawer__header {
        display: none;
      }
      height: calc(100vh - 137px);
      top: 137px;
      .el-drawer__body {
        padding: 16px 10px;
      }
    }
  }
}
</style>
