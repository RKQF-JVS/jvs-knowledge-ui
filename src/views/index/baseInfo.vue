<template>
  <div class="base-info">
    <div class="left">
      <div class="base">
        <ul>
          <li v-for="item in baseList" :key="item.name" :class="{'active': item.name == activeName}" @click="activeHandle(item)">
            <i :class="item.icon"></i>
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
      <div class="normal">
        <h4>常用的文档</h4>
        <ul>
          <li v-for="(item, index) in infoList" :key="item.name+index" :class="{'active': item.name == activeName}" @click="openItem(item)">
            <img v-if="item.coverImage" :src="item.coverImage" />
            <i v-else class="el-icon-s-management"></i> <!-- el-icon-s-order -->
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="right">
      <div class="title">
        <b>{{activeName}}</b>
      </div>
      <div class="listBox">
        <div class="list1">
          <div class="list-item addNew-item" v-if="activeName == '文档'||activeName == '我的'" @click="addNewHandle">
            <img :src="iconImg" />
            <p>
              <i class="el-icon-plus"></i>
              <span>文档</span>
            </p>
          </div>
          <div class="list-item info-item" v-for="(item, index) in infoList" :key="item.name+ index" @click="openItem(item)">
          <!-- :class="{'cover': item.coverImage}" :style="item.coverImage ? 'background-image: url('+ item.coverImage +')' : ''" -->
            <div class="top" :style="item.color ? ('background: '+ item.color + ';') : ''">
              <img class="mark" :src="markImg" />
<!--              <img class="desktop" :src="desktopImg" />-->
              <div v-if="item.shareRole === 'register'" class="tag">企业</div>
            </div>
            <div class="text">
              <h5>{{item.name}}</h5>
              <p>{{item.description}}</p>
            </div>
            <i v-if="hasRight(item)" class="delButton el-icon-delete" @click.stop="delItem(item)"></i>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="新增文档" :visible.sync="dialogVisible" top="6vh" class="dialog" :append-to-body="true" :before-close="handleClose">
      <KnowSet v-if="dialogVisible" :nodeInfo="nodeInfo" :hasRight="true" @close="closeHandle"></KnowSet>
    </el-dialog>
  </div>
</template>
<script>
import icon from './img/icon.png'
import mark from './img/mark.png'
import desktop from './img/desktop.png'
import {getDcLibraryList, delDcLibrary,knowledgesOwner} from './api'
import KnowSet from '@/views/common/KnowSet.vue'
import { getStore } from "@/util/store.js";
export default {
  components: {KnowSet},
  data () {
    return {
      activeName: '文档',
      iconImg: icon,
      markImg: mark,
      desktopImg: desktop,
      baseList: [
        {
          icon: 'el-icon-s-custom',
          name: '我的'
        },
        {
          icon: 'el-icon-s-management',
          name: '文档'
        },
        {
          icon: 'el-icon-time',
          name: '最近使用'
        }
      ],
      infoList: [],
      dialogVisible: false,
      nodeInfo: {}
    }
  },
  methods: {
    activeHandle (item) {
      this.activeName = item.name
      if(item.name=="我的"){
        knowledgesOwner({size:1000}).then(res=>{
          if(res.data.code == 0) {
            this.infoList = res.data.data.records
          }
        })
      }else if(item.name=="文档"){
        this.getDcLibraryListHandle()
      }else if(item.name=="最近使用"){
        this.getDcLibraryListHandle()
      }
    },
    openItem (item) {
      this.$store.commit("SET_KONWLEDGE", item)
      this.$router.push({
        path: `/view?id=${item.id}`
      })
    },
    getDcLibraryListHandle () {
      getDcLibraryList({size:1000}).then(res => {
        if(res && res.data && res.data.code == 0) {
          this.infoList = res.data.data.records
        }
      })
    },
    addNewHandle () {
      this.dialogVisible = true;
    },
    handleClose () {
      this.dialogVisible = false;
    },
    closeHandle (data) {
      if(data) {
        this.handleClose()
        this.getDcLibraryListHandle()
      }
    },
    // 是否有删除权限
    hasRight (item) {
      let bool = false
      let userInfo = getStore({name: 'userInfo'})
      if(item.createById == userInfo.id) {
        bool = true
      }
      return bool
    },
    delItem (item) {
      this.$confirm('确认删除此知识库？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDcLibrary(item.id).then(res => {
          if(res.data.code == 0) {
            this.$notify({
              title: '删除成功',
              // message: '右下角弹出的消息',
              type: 'success',
              position: 'bottom-right'
            });
            // this.getDcLibraryListHandle()
            if(this.activeName=="我的"){
              knowledgesOwner({size:1000}).then(res=>{
                if(res.data.code == 0) {
                  this.infoList = res.data.data.records
                }
              })
            }else if(this.activeName=="文档"){
              this.getDcLibraryListHandle()
            }else if(this.activeName=="最近使用"){
              this.getDcLibraryListHandle()
            }
          }
        })
      }).catch(e => {})
    }
  },
  created () {
    this.getDcLibraryListHandle()
  }
}
</script>
<style lang="scss" scoped>
.base-info{
  padding: 0 6.25vw;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  height: calc(100vh - 79px);
  ul, li{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .left{
    width: 260px;
    //width: 360px;
    box-sizing: border-box;
    //border-right: 1px solid #EEEEEE;
    height: 100%;
    overflow: hidden;
    //overflow-y: auto;
    ul{
      //padding: 20px 0 30px 0;
      li{
        display: flex;
        align-items: center;
        height: 40px;
        //margin-top: 10px;
        padding-left: 33px;
        cursor: pointer;
        i{
          font-size: 18px;
          color: #868BA1;
          margin-right: 20px;
        }
        img{
          display: block;
          width: 20px;
          height: 20px;
          margin-right: 30px;
        }
        span{
          font-size: 14px;
          font-family: SourceHanSansCN-Regular;
          line-height: 25px;
          color: #222222;
          width: 100%;
          text-overflow: ellipsis;
          white-space: pre;
          overflow: hidden;
        }
      }
      .active{
        background: #EEEEEE;
        border-radius: 4px;
      }
      li:hover{
        background: #EEEEEE;
        border-radius: 4px;
      }
    }
    .base{
      //border-bottom: 1px solid #EEEEEE;
      ul{
        //padding: 30px 0;
        padding-top: 30px;
        li:nth-last-of-type(1) {
          i{
            background: #868BA1;
            color: #fff;
            border-radius: 50%;
            overflow: hidden;
            width: 28px;
            height: 22px;
            display: block;
            text-align: center;
            line-height: 22px;
          }
        }
      }
    }
    .normal{
      h4{
        //height: 22px;
        height: 30px;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular;
        line-height: 25px;
        color: #333333;
        margin: 0;
        margin-left: 33px;
        margin-top: 20px;
      }
      ul{
        //height: 500px;
        overflow-y: auto;
      }
    }
  }
  .right{
    //width: calc(100% - 160px);
    width: calc(100% - 390px);
    min-width: 980px;
    height: 100%;
    overflow: hidden;
    .title{
      height: 71px;
      border-bottom: 1px solid #EBECEE;
      b{
        display: inline-block;
        font-size: 24px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        line-height: 41px;
        color: #0F1633;
        margin-left: 40px;
        line-height: 71px;
        position: relative;
        height: 100%;
      }
      b::after{
        content: '';
        position: absolute;
        width: 100%;
        height: 7px;
        background: #3471FF;
        bottom: -4px;
        left: 0;
      }
    }
    .listBox{
      height: calc(100% - 71px);
      overflow: auto;
      .list1{
        display: flex;
        box-sizing: border-box;
        padding: 40px 0;
        align-items: center;
        flex-wrap: wrap;
        // height: calc(100% - 97px);
        // height: 100%;
        overflow: hidden;
        overflow-y: auto;
        .list-item{
          border-radius: 4px;
          overflow: hidden;
          //width: 22%;
          //width: 236px;
          width: 12.3vw;
          min-width: 220px;
          height: 9vw;
          min-height: 184px;
          //border: 1px solid #EBECEE;
          box-shadow: 0 0 8px rgba(59, 59, 59, 0.1);
          //margin: 20px 2%;
          margin: 10px;
          cursor: pointer;
          box-sizing: border-box;
        }
        .list-item:nth-of-type(4n+1) {
          //margin-left: 0;
        }
        .list-item:nth-of-type(4n) {
          //margin-right: 0;
        }
        .addNew-item{
          background: #F6F6F6;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img{
            display: block;
            width: 62px;
            height: 70px;
          }
          p{
            font-size: 20px;
            color: #868BA1;
          }
        }
        .info-item{
          position: relative;
          transition: 0.3s;
          &:hover{
            transform: translateY(-5px);
            box-shadow: 0 2px 20px rgba(59, 59, 59, 0.1);
            transition: 0.3s;
          }
          .top{
            //height: 8vw;
            min-height: 120px;
            background-image: url('./img/bg.png');
            background-repeat: no-repeat;
            position: relative;
            img{
              display: block;
            }
            .mark{
              position: absolute;
              left: 5px;
              top: 5px;
              width: 15px;
              height: 20px;
            }
            .desktop{
              width: 60px;
              height: 50px;
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              margin: auto;
            }
            .tag{
              position: absolute;
              bottom: 4px;
              right: 4px;
              padding-left: 8px;
              padding-right: 8px;
              max-width: 100%;
              height: 20px;
              line-height: 20px;
              font-size: .75rem;
              border-radius: 2px;
              background: rgba(0,0,0,.4);
              color: #fff;
              text-align: center;
              font-weight: 500;
            }
          }
          .top.cover{
            background-size: 100% 100%;
            img{
              display: none;
            }
          }
          .text{
            padding: 0 20px;
            h5, p{
              margin: 0;
              padding: 0;
            }
            h5{
              font-size: 14px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              line-height: 36px;
              color: #3d3d3d;
              width: 100%;
              text-overflow: ellipsis;
              white-space: pre;
              overflow: hidden;
              //margin-top: 15px;
            }
            p{
              //margin-top: 10px;
              font-size: 12px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: #868BA1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: pre;
              height: 20px;
              line-height: 20px;
            }
          }
          .delButton{
            position: absolute;
            top: 10px;
            right: 10px;
            color: #fff;
            font-size: 20px;
            display: none;
          }
        }
        .info-item:hover{
          .delButton{
            display: block;
          }
        }
      }
    }

  }
}
/deep/.el-dialog .el-dialog__header{
  padding: 20px;
}
/deep/.el-dialog .el-dialog__body{
  padding: 20px;
}
</style>
