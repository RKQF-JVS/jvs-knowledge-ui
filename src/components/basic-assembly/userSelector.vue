<template>
  <el-dialog
    title="请选择成员"
    :visible.sync="dialogVisible"
    :before-close="closeDialog"
    append-to-body
    width="780px"
    class="user-info-list-dialog"
  >
    <div class="user-info-list" v-if="dialogVisible">
      <div class="left treeBox dept-treeBox">
        <el-tree
          ref="deptTree"
          node-key="id"
          :data="treeData"
          :props="{children: 'children',label: 'name'}"
          default-expand-all
          :loading="treeLoading"
          :expand-on-click-node="false"
          @node-click="nodeClickHandle"
        >
          <span
            class="customize-tree-node"
            slot-scope="{ node, data }"
          >
            <span :class="'customize-tree-node-label customize-tree-node-label'+node.level" :style="'width:'+((186 - (18 * node.level)) > 0 ? (186 - (18 * node.level)) : 0) +'px;'">{{ node.label }}</span>
          </span>  
        </el-tree>
      </div>
      <div class="center">
        <el-input class="search-tool" v-model="keyword" @input="searchUserHandle" clearable placeholder="输入手机号或姓名搜索" prefix-icon="el-icon-search"></el-input>
        <ul class="userlist-box userlist-box-tool">
          <li v-for="(item, index) in userOptionList" :key="'check-user-'+index" @click="changeCheck(item, index)">
            <p>
              <img v-if="item.headImg" :src="item.headImg" alt="">
              <b>{{item.realName || item.accountName}}</b>
              <span>{{item.phone}}</span>
            </p>
            <p class="check-tool">
              <span :class="{'el-checkbox': true, 'is-checked': item.checked}">
                <span :class="{'el-checkbox__input': true, 'is-checked': item.checked}">
                  <i class="el-checkbox__inner"></i>
                </span>
              </span>
            </p>
          </li>
        </ul>
      </div>
      <div class="right">
        <h4>已选：{{checkList.length}}名成员</h4>
        <ul class="userlist-box">
          <li v-for="(item, index) in checkList" :key="'check-user-'+index">
            <p>
              <img :src="item.headImg" alt="">
              <b>{{item.realName || item.accountName}}</b>
              <span>{{item.phone}}</span>
            </p>
            <p>
              <i class="el-icon-error" @click="delCheck(item, index)"></i>
            </p>
          </li>
        </ul>
      </div>
    </div>
    <el-row style="padding-top:20px;display:flex;justify-content:center;align-items:center;border-top: 1px solid #DCDFE6;">
      <jvs-button size="mini" type="primary" @click="submit">确定</jvs-button>
      <jvs-button size="mini" @click="cancel">取消</jvs-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { getDeptUserTree, searchUser } from '@/api/common'
export default {
  name: 'user-selector',
  props: {
    autoClose: {
      type: Boolean,
      default: false
    },
    selectable: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      keyword: '', // 搜索关键词
      treeLoading: false,
      treeData: [],
      selectOneId: '',
      selectOneData: null,
      userOptionList: [],
      checkList: []
    }
  },
  methods: {
    async openDialog () {
      await this.getTreeData()
      this.dialogVisible = true
    },
    closeDialog () {
      this.dialogVisible = false
      this.selectOneId = ""
      this.selectOneData = null
      this.keyword = ""
      this.userOptionList = []
      this.checkList = []
    },
    submit () {
      this.$emit('submit', this.checkList)
      if(this.autoClose) {
        this.closeDialog()
      }
    },
    cancel () {
      this.$emit('cancel', true)
      this.closeDialog()
    },
    // 获取部门人员树
    async getTreeData () {
      this.treeLoading = true
      await getDeptUserTree().then(res => {
        if(res.data.code == 0) {
          this.treeLoading = false
          this.treeData = this.getTree(res.data.data, 1)
        }
      }).catch(e => {
        this.treeLoading = false
      })
    },
    // 递归树清掉空的childList
    getTree (tree = [], level) {
      let arr = [];
      if (tree.length !== 0) {
        tree.forEach(item => {
          let obj = {};
          obj.name = item.name;
          obj.id = item.id;
          obj.sort = item.sort
          obj.parentId = item.parentId
          obj.leaderId = item.leaderId
          obj.level = level
          if (item.children && item.children.length > 0) {
            obj.children = this.getTree(item.children, level+1);
          }
          arr.push(obj);
        });
      }
      return arr
    },
    // 查询部门下的人
    nodeClickHandle (data, node, dom) {
      if(this.selectOneId == data.id) {
        this.selectOneId = ""
        this.$refs.deptTree.setCurrentKey(null)
        this.$forceUpdate()
      }else{
        this.selectOneId = data.id
      }
      this.selectOneData = data
      this.searchUserHandle()
    },
    // 搜索成员
    searchUserHandle () {
      let obj = {}
      if(this.keyword) {
        obj.key = this.keyword
      }
      if(this.selectOneId) {
        obj.deptId = this.selectOneId
      }
      searchUser(obj).then(res => {
        if(res.data.code == 0) {
          this.userOptionList = res.data.data
          for(let i in this.userOptionList) {
            let index = this.isInArr('id', this.userOptionList[i].id, this.checkList)
            if(index > -1) {
              this.userOptionList[i].checked = true
            }
          }
        }
      })
    },
    // 已选成员
    getCheckList () {
      for(let i in this.userOptionList) {
        let index = this.isInArr('id', this.userOptionList[i].id, this.checkList)
        if(this.userOptionList[i].checked) {
          if(index == -1){
            this.checkList.push(this.userOptionList[i])
          }
        }else{
          if(index > -1){
            this.checkList.splice(index, 1)
          }
        }
      }
    },
    // 判断是否已存在数组中,存在返回index
    isInArr (attr, val, list) {
      let index = -1
      for(let i in list) {
        if(list[i][attr] == val) {
          index = i
        }
      }
      return index
    },
    // 删除已选成员
    delCheck (item, index) {
      this.checkList.splice(index, 1)
      for(let i in this.userOptionList) {
        let tix = this.isInArr('id', this.userOptionList[i].id, this.checkList)
        if(tix == -1) {
          this.userOptionList[i].checked = false
        }
      }
    },
    // 其他信息选择
    changeCheck (item, index) {
      if(!this.selectable) {
        for(let i in this.userOptionList) {
          this.userOptionList[i].checked = false
        }
      }
      let bool = item.checked || false
      this.$set(this.userOptionList[index], 'checked', !bool)
      this.getCheckList()
    }
  },
}
</script>
<style lang='scss' scoped>
.customize-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  .customize-tree-node-label{
    display: inline-block;
    overflow: hidden;
    overflow-x: auto;
  }
}
.treeBox {
  width: 250px;
  height: 58vh;
  overflow: hidden;
  overflow-y: auto;
  box-sizing: border-box;
}
.treeBox::-webkit-scrollbar{
  display: none;
}
</style>
<style lang="scss">
.user-info-list-dialog{
  .el-dialog{
    margin-top: 10vh!important;
    .el-dialog__body{
      padding: 0 20px;
      padding-bottom: 20px;
      .user-info-list{
        display: flex;
        .left, .center, .right{
          box-sizing: border-box;
          .userlist-box{
            padding: 0;
            margin: 0;
            overflow: hidden;
            overflow-y: auto;
            box-sizing: border-box;
            li{
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 10px 0;
              p{
                font-size: 14px;
                display: flex;
                align-items: center;
                margin: 0;
                img{
                  margin-right: 10px;
                  display: block;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  overflow: hidden;
                }
                b{
                  color: #333333;
                  margin-right: 25px;
                }
                span{
                  color: #868BA1;
                }
                i{
                  color: #DCDFE6;
                  font-size: 16px;
                  cursor: pointer;
                }
              }
            }
            li:hover{
              background: #f5f7fa;
            }
          }
          .userlist-box-tool{
            li{
              cursor: pointer;
              p{
                align-items: center;
              }
              .check-tool{
                margin-right: 10px;
                .el-checkbox{
                  .el-checkbox__inner{
                    border-radius: 50%;
                    width: 16px;
                    height: 16px;
                  }
                  .el-checkbox__inner::after{
                    left: 5px;
                    top: 2px;
                  }
                }
              }
            }
          }
        }
        .left{
          width: 210px;
          box-sizing: border-box;
          padding-right: 20px;
          padding-top: 13px;
          .el-tree{
            width: 100%;
            height: 100%;
          }
          .el-tree-node.is-current{
            >.el-tree-node__content{
              background-color: #F5F7FA;
            }
          }
        }
        .center{
          width: 280px;
          padding: 0 20px;
          border-left: 1px solid #DCDFE6;
          border-right: 1px solid #DCDFE6;
          box-sizing: border-box;
          .search-tool{
            margin: 20px 0;
            .el-input__inner{
              width: 240px;
              height: 40px;
              border-radius: 40px;
              background: #F5F5F5;
              border: 0;
            }
          }
          .userlist-box{
            height: calc(58vh - 60px);
          }
        }
        .right{
          padding-left: 20px;
          box-sizing: border-box;
          width: 240px;
          h4{
            font-size: 14px;
            color: #868BA1;
            font-weight: normal;
            margin: 20px 0;
          }
          .userlist-box{
            height: calc(58vh - 48px);
          }
        }
      }
    }
  }
}
</style>