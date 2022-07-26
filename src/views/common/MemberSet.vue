<template>
  <div class="member-set-info">
    <div :class="{'member-list': true}">
      <div class="member-list-loading" v-if="freshLoading"></div>
      <div class="member-list-item" v-for="(item, index) in memberList" :key="'member-'+item.realName+index">
        <div class="member-list-item-text">
          <img :src="item.headImg ? item.headImg : userImg" />
          <span>{{item.realName}}</span>
          <el-select :disabled="item.role == 'owner'" :class="{'role-choose': true, 'no-choose': !item.boolChoose}" v-model="item.role" placeholder="请选择" @change="roleChange(item)">
            <el-option v-if="item.role == 'owner'" label="所有者" value="owner"></el-option>
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="成员" value="member"></el-option>
          </el-select>
<!--          <el-select v-if="item.boolChoose" :disabled="item.role == 'owner'" :class="{'role-choose': true, 'no-choose': !item.boolChoose}" v-model="item.role" placeholder="请选择" @change="roleChange(item)">-->
<!--            <el-option v-if="item.role == 'owner'" label="所有者" value="owner"></el-option>-->
<!--            <el-option label="管理员" value="admin"></el-option>-->
<!--            <el-option label="成员" value="member"></el-option>-->
<!--          </el-select>-->
<!--          <i v-else>{{item.role == 'owner' ? '所有者' : (item.role == 'admin') ? '管理员' : '成员'}}</i>-->
          <!-- <i>{{item.remark}}</i> -->
        </div>
        <div v-if="item.role != 'owner'" style="margin-right: 25px;" class="dmore">
          <el-popover
            v-model="item.active"
            placement="right"
            width="30"
            trigger="hover">
            <!-- <div class="member-more-tool">
              <span v-if="item.role != 'owner'" @click="setItem(item)">权限设置</span>
              <span @click="delItem(item, index)">删除</span>
            </div> -->
            <ul class="base-type-list">
<!--              <li v-if="item.role != 'owner'" @click="setItem(item)">-->
<!--                <i class="el-icon-setting"></i>-->
<!--                <span>权限设置</span>-->
<!--              </li>-->
              <li @click="delItem(item, index)">
                <i class="el-icon-tickets"></i>
                <span>删除</span>
              </li>
            </ul>
            <i class="el-icon-more" slot="reference" v-if="hasRight"></i>
          </el-popover>
        </div>
      </div>
    </div>
    <el-dialog
      class="dialog form-fullscreen-dialog invitation-dialog"
      title="邀请用户"
      :visible.sync="dialogVisible"
      append-to-body
      :before-close="handleClose">
      <span slot="title" class="dialogHeader">
        <div class="dialogLine"></div>
        <span>文档邀请人员</span>
      </span>
      <div class="invitation">
        <div class="invitation-top">
          <img :src="invitationImg" alt="" />
        </div>
        <div class="invitation-center">
          <div class="search">
            <el-input
              placeholder="请输入内容搜索"
              prefix-icon="el-icon-search"
              v-model="keyword"
              @keyup.enter.native="searchHandle(keyword)"
            >
            </el-input>
          </div>
          <div class="user-list">
            <p v-if="userList.length==0">未搜索到相关人员</p>
            <div class="user-list-item" v-for="(item, index) in userList" :key="'user-list-item-'+ index" @click="checkUser(item, index)">
              <el-tooltip v-if="item.realName && item.realName.length > 4" class="item" effect="light" :content="item.realName" placement="top">
                <div class="info-item">
                  <img :src="item.headImg || userImg" alt="">
                  <span>{{item.realName}}</span>
                </div>
              </el-tooltip>
              <div v-else class="item">
                <img :src="item.headImg || userImg" alt="">
                <span>{{item.realName}}</span>
              </div>
              <i class="el-icon-success checked-user" v-if="checkedList.indexOf(item.id) > -1"></i>
            </div>
          </div>
        </div>
        <div class="invitation-bottom">
          <jvs-button class="save-button" :loading="saveLoading" @click="saveHandle">保存</jvs-button>
<!--          <jvs-button class="save-button" @click="allCheck">全选</jvs-button>-->
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import user from './img/user.png'
import invitation from './img/invitation.png'
import {queryMember, setMemberRole, addMember, delMember} from './api'
import {getUserList} from '@/components/api'
import { getStore } from "@/util/store.js";
import {getUserAll} from "../../components/api";
export default {
  name: 'member-set',
  props: {
    nodeInfo: {
      type: Object
    },
    addNew: {
      type: Number
    }
  },
  data () {
    return {
      more_list: [
        {icon: "el-icon-setting", name: "权限设置"},
        {icon: "el-icon-tickets", name: "删除"},
      ],
      userImg: user,
      invitationImg: invitation,
      memberList: [],
      dialogVisible: false,
      userOption: {
        cancal: false,
        column: [
          {
            label: '选择用户',
            prop: 'userid',
            type: 'user',
            multiple: true,
            allowinput: false
          }
        ]
      },
      currentItem: {},
      keyword: '',
      userList: [],
      checkedList: [],
      alreadyIn: [],
      saveLoading: false,
      freshLoading: false,
      hasRight: false,
      allUserId: []
    }
  },
  methods: {
    queryMemberHandle (id) {
      queryMember(id, {size: 1000}).then(res => {
        if(res.data.code == 0) {
          this.checkedList = []
          this.alreadyIn = []
          this.memberList = res.data.data.records
          let userInfo = getStore({name: 'userInfo'})
          for(let i in this.memberList) {
            if(this.checkedList.indexOf(this.memberList[i].userId) == -1) {
              this.checkedList.push(this.memberList[i].userId + '')
              this.alreadyIn.push(this.memberList[i].userId + '')
            }
            if(this.memberList[i].userId == userInfo.id) {
              this.hasRight = this.memberList[i].role == 'owner' ? true : false
            }
          }
        }
      })
    },
    setItem (item) {
      this.currentItem.boolChoose = false
      item.active = false
      item.boolChoose = true
      this.currentItem = item
    },
    roleChange (item) {
      setMemberRole(this.nodeInfo.id, item.userId, item.role).then(res => {
        if(res.data.code == 0) {
          this.$notify({
            title: '设置成功',
            // message: '右下角弹出的消息',
            type: 'success',
            position: 'bottom-right'
          });
          this.currentItem.boolChoose = false
          this.$forceUpdate()
        }
      })
    },
    delItem (item, index) {
      this.$confirm('确认删除该成员', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.freshLoading = true
        delMember(this.nodeInfo.id, item.userId).then(res => {
          if(res.data.code == 0) {
            this.$notify({
              title: '删除成功',
              // message: '右下角弹出的消息',
              type: 'success',
              position: 'bottom-right'
            });
            this.freshLoading = false
            this.memberList.splice(index, 1)
            this.queryMemberHandle(this.nodeInfo.id)
          }
        }).catch(e => {
          this.freshLoading = false
        })
      }).catch(e => {})
    },
    handleClose () {
      this.dialogVisible = false
    },
    searchHandle () {
      // let obj = {
      //   size: 1000,
      //   current: 1
      // }
      // if(this.keyword) {
      //   obj.realName = this.keyword
      // }
      // getUserList(obj).then(res => {
      //   if(res.data.code == 0) {
      //     this.userList = res.data.data.records
      //     this.allUserId = []
      //     for(let i in this.userList) {
      //       this.allUserId.push(this.userList[i].id)
      //     }
      //     // console.log('人员列表',this.userList)
      //   }
      // })
      let obj = {}
      if(this.keyword) {
        obj.key = this.keyword
      }
      getUserAll(obj).then(res => {
        if(res.data.code == 0) {
          this.userList = res.data.data
          this.allUserId = []
          for(let i in this.userList) {
            this.allUserId.push(this.userList[i].id)
          }
          // console.log('人员列表',this.userList)
        }
      })
    },
    checkUser (item, index) {
      if(this.alreadyIn.indexOf(item.id) == -1) { // 已有成员不做操作
        if(this.checkedList.indexOf(item.id) == -1) {
          if (this.checkedList.length > 19) {
            this.$message.warning('最多只能选择20人')
            return
          }
          this.checkedList.push(item.id)
        }else{
          let ix = this.checkedList.indexOf(item.id)
          if(ix > -1) {
            this.checkedList.splice(ix, 1)
          }
        }
      }
    },
    saveHandle () {
      this.saveLoading = true
      addMember({documentId: this.nodeInfo.id, userIds: this.checkedList}).then(res => {
        if(res.data.code == 0) {
          this.$notify({
              title: '保存成功',
              // message: '右下角弹出的消息',
              type: 'success',
              position: 'bottom-right'
            });
          this.saveLoading = false
          this.handleClose()
          this.queryMemberHandle(this.nodeInfo.id)
        }
      })
    },
    allCheck () {
      if(this.checkedList.length == this.allUserId.length) {
        this.checkedList = []
      }else{
        this.checkedList = JSON.parse(JSON.stringify(this.allUserId))
      }
    }
  },
  created () {
    if(this.nodeInfo && this.nodeInfo.id) {
      this.queryMemberHandle(this.nodeInfo.id)
    }
  },
  watch: {
    addNew: {
      handler (newVal, oldVal) {
        if(newVal > -1) {
          this.searchHandle()
          this.dialogVisible = true
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.member-set-info{
  border-top: 1px solid #DCDFE6;
  position: relative;
  .member-list{
    max-height: 610px;
    overflow: hidden;
    overflow-y: auto;
    .member-list-item{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
      height: 48px;
      box-sizing: border-box;
      overflow: hidden;
      .member-list-item-text{
        width: 80%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-left: 10px;
        img{
          display: block;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span, i{
          width: 100px;
          font-size: 14px;
          font-family: SourceHanSansCN-Regular;
          line-height: 25px;
          color: #333333;
          margin-left: 20px;
        }
        span{
          width: 150px;
        }
      }
      .dmore{
        display: none;
      }
    }
    .member-list-item:hover{
      background: #F6F6F6;
    }
    .member-list-item:hover .dmore{
      display: block;
    }
  }
  .member-list-loading{
    width: 100%;
    height: 100%;
    position: absolute;
    background-image: url('../../styles/loading.gif');
    background-repeat: no-repeat;
    background-position: center;
    //background-size: 450px 360px;
    background-size: 300px 240px;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 9;
  }
}
.dialogHeader {
  display: flex;
  font-size: 20px;
  font-family: SourceHanSansCN-Regular;
  color: #333333;
}
.dialogHeader span {
  margin-left: 20px;
  font-size: 20px;
}
.dialogLine {
  width: 4px;
  height: 30px;
  background: #4b90ee;
  border-radius: 2px;
}
.invitation{
  .invitation-top {
    border-top: 1px solid #DCDFE6;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 208px;
    img{
      display: block;
    }
  }
  .invitation-bottom{
    margin-top: 20px;
    overflow: hidden;

    .save-button{
      width: 72px;
      height: 32px;
      background: #0062FF;
      border-radius: 4px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      line-height: 32px;
      color: #FFFFFF;
      text-align: center;
      float: right;
      cursor: pointer;
      padding: 0;
      margin-left: 10px;
    }
  }
}
</style>
<style lang="scss">
.base-type-list{
  padding: 0;
  margin: 10px 0;
  li{
    display: flex;
    align-items: center;
    margin: 0;
    margin-bottom: 10px;
    cursor: pointer;
    padding: 5px 10px;
    i{
      margin-right: 10px;
      font-size: 14px!important;
    }
  }
  li:hover{
    background: #F5F7FA;
  }
  li:nth-last-of-type(1) {
    margin-bottom: 0;
  }
}
.member-list-item-text{
  .role-choose{
    // margin: 0 50px;
    width: 120px;
    .el-input__inner{
      font-size: 14px;
      font-family: SourceHanSansCN-Regular;
      line-height: 25px;
      color: #333333;
      background: rgba(0,0,0,0);
    }
    .is-disabled{
      .el-input__inner{
        background: rgba(0,0,0,0);
        cursor: text;
      }
    }
  }
  .role-choose.no-choose{
    .el-input__inner{
      border: 0;
    }
    .el-input__suffix{
      display: none;
    }
  }
}
.invitation-dialog{
  .el-dialog{
    margin-top: 60px!important;
    .el-dialog__header{
      height: auto!important;
    }
    .el-dialog__header::before{
      display: none;
    }
    .el-dialog__body{
      padding: 0 20px;
      padding-bottom: 30px;
      margin-top: 10px;
    }
  }
}
.invitation-center{
  .search{
    .el-input{
      width: 100%;
      height: 45px;
      .el-input__inner{
        height: 45px;
        line-height: 45px;
        border-radius: 10px;
        background: #F3F3F3;
        font-size: 16px;
        padding-left: 40px;
        border-color: #F3F3F3;
        outline: none;
      }
      .el-input__prefix{
        left: 15px;
        i{
          font-size: 20px;
          line-height: 45px;
        }
      }
    }
  }
  .user-list{
    // padding: 0 130px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    height: 380px;
    overflow: hidden;
    overflow-y: auto;
    align-items: flex-start;
    position: relative;
    p{
       font-size:18px;
       width: 200px;
       height: 100px;
       position: absolute;
       top: 50%;
       left: 50%;
       margin-top: -50px;
       margin-left: -100px;
    }
    .user-list-item{
      width: calc( calc(100% - 320px) / 6 );
      margin: 20px 32px;
      position: relative;
      .item{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        cursor: pointer;
        height: 100%;
      }
      img{
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }
      span{
        font-size: 14px;
        font-family: SourceHanSansCN-Regular;
        line-height: 25px;
        color: #333333;
        text-align: center;
        width: 100%;
        height: 25px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: pre;
        margin-top: 10px;
        display: block;
      }
      .checked-user{
        font-size: 24px;
        color: #0062FF;
        position: absolute;
        right: 0px;
        top: 0px;
      }
    }
    .user-list-item:nth-of-type(6n+1) {
      margin-left: 0;
    }
    .user-list-item:nth-of-type(6n) {
      margin-right: 0;
    }
  }
}
</style>
