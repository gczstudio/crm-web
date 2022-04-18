<template>
  
  <div class="teamMembers-container">
    <el-row :gutter="16">
      <el-col :span="5">
        <div  class="team-wrapper" :style="{height:bHeight-(isMaxScreen?125:101) + 'px'}">
          <div class="team-header">
            <span>机构</span>
            <el-button class="yu-button-text fr" icon="el-icon-plus" @click="createFn" v-permission="'createTeam'">新增团队</el-button>
          </div>
          <div class="team-title"><i class="el-icon-caret-bottom"></i>{{roleInfo ? roleInfo.orgName : ''}}</div>
          <ul class="team-cont">
            <li :class="{active: nowNode.teamId === item.teamId}" v-for="item in teamData" :key="item.teamId" @click="nodeClickFn(item)">
              {{item.teamNm}}
              <div class="btns">
                <i class="el-icon-edit" v-permission="'editTeam'" @click="editFn(item)"></i>
                <i class="el-icon-delete" v-permission="'deleteTeam'" @click="deleteFn(item)"></i>
              </div>
            </li>
          </ul>
          <Empty v-if="!teamData.length" />
        </div>
      </el-col>
      <el-col :span="19">
        <MainLayout class="yu-main-wrapper">
          <template v-slot:header>
            <el-button icon="el-icon-plus" v-permission="'createMember'" @click="createMemberFn">新增</el-button>
            <el-button icon="el-icon-delete" v-permission="'deleteMember'" @click="deleteMemberFn">删除</el-button>
          </template>
          <template v-slot:table>
            <yu-xtable ref="refTable" :data-url="dataUrl" row-number selection-type="checkbox" :dynamic-height="true" border style="margin-top: 16px" :default-load="false">
              <yu-xtable-column label="团队名称" prop="teamNm" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="员工工号" prop="mebId"  :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="员工姓名" prop="mebNm" :show-overflow-tooltip="true" sortable="custom">
                <template slot-scope="scope">
                  <div>{{scope.row.mebNm}}<i v-if="scope.row.isLeader==='1'" class="iconfont icon-renmingtuanduichang" style="margin-left: 12px"></i></div>
                </template>
              </yu-xtable-column>
              <yu-xtable-column label="团队长标识" prop="isLeader" :show-overflow-tooltip="true" data-code="YESNO" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="创建人" prop="creatorNm" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
              <yu-xtable-column label="操作" width="140" align="center" v-permission="'setLeader'">
                <template slot-scope="scope">
                  <el-button class="yu-action-btn" @click.native.prevent="checkLeaderFn(scope.row)" type="text">{{scope.row.isLeader == 1 ? '取消团队长' : '设为团队长'}}</el-button>
                </template>
              </yu-xtable-column>
            </yu-xtable>
          </template>
        </MainLayout>
      </el-col>
    </el-row>
    <yu-dialog
      :title="teamType==='edit'?'编辑团队':'新建团队'"
      :visible.sync="teamVisible"
      width="500px"
      @close="closeTeamFn"
      top="20vh"
    >
      <div>
        <yu-xform ref="teamRef" :model="formData" label-width="100px">
          <yu-xform-item label="团队名称" placeholder="团队名称" ctype="input" name="teamNm" :rules="globalRules.requiredInput30"></yu-xform-item>
        </yu-xform>
      </div>
      <div slot="footer" class="operate-btns tr">
        <el-button @click="closeTeamFn">取消</el-button>
        <el-button type="primary" @click="saveTeamFn">保存</el-button>
      </div>
    </yu-dialog>
    <CustomerModal title="添加团队成员" select-title="已选择团队成员" selection-type="checkbox" :visible.sync="memberVisible" @sure="sureMemberFn"/>
    <yu-dialog custom-class="upload-error-modal" title="成员列表" :visible.sync="errVisible" width="800px" @close="errVisible = false">
      <div class="check">
        <span class="icon iconfont icon-guanbixuanjiao"></span>
        经系统校验，以下成员已存在于其他团队，请确认是否添加？
      </div>
      <div class="yu-main-table">
        <yu-xtable :data="errTableDate" :total="errTableDate.length" :pageable="false" row-number border>
          <yu-xtable-column label="团队名称" prop="teamNm" :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="员工工号" prop="mebId"  :show-overflow-tooltip="true" sortable="custom"></yu-xtable-column>
          <yu-xtable-column label="员工姓名" prop="mebNm" :show-overflow-tooltip="true" sortable="custom">
            <template slot-scope="scope">
              <div>{{scope.row.mebNm}}<i v-if="scope.row.isLeader==='1'" class="iconfont icon-renmingtuanduichang" style="margin-left: 12px"></i></div>
            </template>
          </yu-xtable-column>
          <yu-xtable-column label="团队长标识" prop="isLeader" :show-overflow-tooltip="true" data-code="YESNO" sortable="custom"></yu-xtable-column>
        </yu-xtable>
      </div>
      <div slot="footer" class="operate-btns tr">
        <el-button @click="errVisible = false">取消</el-button>
        <el-button type="primary" @click="addteammem">确定</el-button>
      </div>
    </yu-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { backend } from '@/config'
import * as teamApi from '@/api/team'
@Component({
  name: 'TeamMembers',
  components: {
  }
})
export default class extends Vue {
  @Ref('refTable') refTable: any;
  @Ref('teamRef') teamRef: any;
  @Ref('mytree') mytree: any;
  private roleInfo = this.$util.getCheckedRole()
  private dataUrl = backend.teamCenter + '/api/teammember/queryteammem'
  private nowNode:any = {}
  private teamData = []
  private teamVisible = false
  private teamType = 'create'
  private formData:any = {}
  private selectMember = []
  private memberVisible = false
  private errVisible = false
  private errTableDate = []

  // 点击团队
  nodeClickFn(node: any) {
    this.nowNode = node;
    this.searchTeamMember();
  }

  created() {
    this.searchTeamFn();
  }

  // 团队列表查询
  searchTeamFn() {
    let params = {
      page: 1,
      size: 100
    }
    teamApi.queryteam(params).then(res => {
      this.teamData = res.data;
    })
  }

  // 新增团队
  createFn() {
    this.teamType = 'create';
    this.teamVisible = true;
  }

  saveTeamFn() {
    let validate = false;
    this.teamRef.validate((valid: any) => {
      if(valid) {
        validate = true;
      } 
    })
    if(!validate) return;
    // 判断一下名字是否重复
    let bool = this.teamData.every((item: any) => item.teamNm !== this.formData.teamNm)
    if(!bool) {
      this.$message.warning('团队名称重复，请重新输入');
      return;
    }
    if(this.teamType === 'create') {
      teamApi.addteam(this.formData).then(res => {
        this.$message.success('新增成功');
        this.searchTeamFn();
        this.closeTeamFn();
      })
    } else {
      teamApi.updateteam({
        ...this.nowNode,
        ...this.formData
      }).then(res => {
        this.$message.success('编辑成功');
        this.searchTeamFn();
        this.closeTeamFn();
        this.searchTeamMember();
      })
    }
  }

  closeTeamFn () {
    this.formData = {};
    this.teamRef.resetFields();
    this.teamVisible = false;
  }

  // 编辑团队名称
  editFn(item: any) {
    this.nowNode = this._.cloneDeep(item);
    this.teamType = 'edit';
    this.teamVisible = true;
    this.$set(this.formData, 'teamNm', item.teamNm);
  }

  // 删除团队
  deleteFn(item: any) {
    this.$confirm('此操作将删除该团队, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      callback: (action) => {
        if (action === 'confirm') {
          teamApi.deleteteam({
            teamId: item.teamId
          }).then(res => {
            this.$message.success('删除成功');
            this.searchTeamFn();
            this.refTable.clearTable();
          })
        }
      }
    });
  }

  searchTeamMember() {
    this.refTable.remoteData({
      condition: JSON.stringify(this.nowNode)
    });
  }

  // 新增团队成员
  createMemberFn() {
    if(!Object.keys(this.nowNode).length) {
      this.$message.warning('请先从左侧树中选择一个团队');
      return;
    }
    this.memberVisible = true;
  }

  // 查询要添加的用户是否存在于其他团队
  querybfadd() {
    let params = {
      list: this.selectMember.map((item: any) => {
        return {
          mebId: item.userId,
        }
      })
    }
     teamApi.querybfadd(params).then(res => {
      if(res.data.length) {
        this.errVisible = true;
        this.errTableDate = res.data;
      } else {
        this.addteammem();
      }
    })
  }

  // 添加团队成员
  addteammem() {
    let params = {
      ...this.nowNode,
      list: this.selectMember.map((item: any) => {
        return {
          mebId: item.userId,
          mebNm: item.userName,
        }
      })
    }
    teamApi.addteammem(params).then(res => {
      this.memberVisible = false;
      this.$message.success('添加成功');
      this.errVisible = false;
      this.errTableDate = [];
      this.selectMember = [];
      this.searchTeamMember();
    })
  }

  // 确定添加团队成员
  sureMemberFn(data: any) {
    if(!data.length) {
      this.$message.warning('请至少选择一条数据');
      return;
    }
    this.selectMember = data;
    this.querybfadd()
  }
  
  // 删除团队成员
  deleteMemberFn() {
    let selections = this.refTable.selections;
    if(!selections.length) {
      this.$message.warning('请至少选择一条数据');
      return;
    }
    this.$confirm('此操作将删除所选的团队成员, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      callback: (action) => {
        if (action === 'confirm') {
          let params = {
            teamId: this.nowNode.teamId,
            list: selections.map((item:any)=> {
              return {
                mebId: item.mebId
              }
            })
          }
          teamApi.delteamdmem(params).then(res => {
            this.$message.success('删除成功');
            this.searchTeamMember();
          })
        }
      }
    });
  }

  // 校验是否存在团队长
  checkLeaderFn(row: any) {
    if(row.isLeader == 1) {
       this.$confirm(`是否确定取消团队长?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: (action) => {
          if (action === 'confirm') {
            this.cnlteamleader(row);
          }
        }
      });
      return;
    }
    teamApi.queryifleader({
      teamId: this.nowNode.teamId
    }).then(res => {
      if(res.data.data) {
        this.$confirm(`已存在团队长${res.data.data}，是否将其替换?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: (action) => {
            if (action === 'confirm') {
              this.setTeamLeaderFn(row);
            }
          }
        });
      } else {
        this.setTeamLeaderFn(row);
      }
    })
  }

  // 设置团队长
  setTeamLeaderFn(row: any) {
    teamApi.setteamleader({
      teamId: row.teamId,
      mebId:  row.mebId,
      isLeader: 1
    }).then(res => {
      this.$message.success('设置成功');
      this.searchTeamMember();
    })
  }

  // 取消团队长
  cnlteamleader(row: any) {
    teamApi.cnlteamleader({
      teamId: row.teamId,
      mebId:  row.mebId,
    }).then(res => {
      this.$message.success('取消成功');
      this.searchTeamMember();
    })
  }

}
</script>
<style lang="scss" scoped>
  .yu-main-wrapper {
    background: #fff;
  }
  .team-wrapper {
    background: #fff;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, .2);
    .team-header {
      span {
        font-weight: 16px;
        font-weight: bold;
      }
      padding: 12px 0 12px 12px;
      background: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, .1);
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
      li{
        cursor: pointer;
        padding: 10px 10px 10px 34px;
        .btns {
          display: none;
          float: right;
          i{
            cursor: pointer;
            padding: 0 5px;
          }
        }
        &:hover, &.active {
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
