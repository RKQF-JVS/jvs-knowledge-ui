<template>
  <div class="doc-lib-box">
    <title-page-header @save="saveHandle" @close="close">
      <template slot="left">
        <div v-if="rowData" style="margin:0;min-width:200px;display:flex;align-items: center;">
          <el-input v-if="enableInput" size="mini" v-model="rowData.name" placeholder="请输入标题" @blur="handleInput"></el-input>
          <h4 v-else @click="enableInput=true">{{rowData.name}}</h4>
        </div>
      </template>
      <template slot="right">
        <!-- 暂时只显示 预览、保存、关闭 -->
        <p v-if="false">
          <el-tooltip effect="dark" content="浏览记录" placement="top">
            <img :src="toolIcon.viewlog" alt="" @click="viewHistory('view')" />
          </el-tooltip>
        </p>
        <p v-if="false">
          <el-tooltip effect="dark" content="文档历史版本" placement="top">
            <img :src="toolIcon.hislog" alt="" @click="viewHistory('history')"/>
          </el-tooltip>
        </p>
        <p v-if="false">
          <el-popover
            popper-class="hover-popver-list"
            v-model="showUser"
            placement="bottom"
            width="250"
            trigger="click">
            <ul class="base-type-list">
              <li v-for="item in user_list" :key="item.name+item.icon">
                <i :class="item.icon"></i>
                <span>{{item.name}}</span>
                <span style="margin-left:10px;">{{item.info}}</span>
              </li>
            </ul>
            <img slot="reference" :src="toolIcon.userIcon" alt="" style="cursor:pointer;" />
          </el-popover>
        </p>
        <p v-if="false">
          <el-tooltip effect="dark" content="" placement="top">
             <img :src="toolIcon.lock" alt="" />
          </el-tooltip>
        </p>
        <p v-if="false">
          <el-tooltip effect="dark" content="分享" placement="top">
            <img :src="toolIcon.share" alt="" />
          </el-tooltip>
        </p>
        <p>
          <el-tooltip effect="dark" content="预览" placement="top">
            <i class="el-icon-view" style="font-size: 25px;color:#353535;cursor:pointer;" @click="viewHandle"></i>
          </el-tooltip>
        </p>
      </template>
    </title-page-header>
    <div class="db-body">
      <div class="left"></div>
      <div class="right" v-if="designShow">
        <htmlDesign v-if="activeType == 'document_html'" :content="content" :rowData="rowData" @contetnChange="contetnChange"></htmlDesign>
        <excelDesign ref="sheetNode" v-if="activeType == 'document_xlsx'" :content="content" :rowData="rowData" @contetnChange="contetnChange"></excelDesign>
        <mapDesign ref="mapNode" v-if="activeType == 'document_map'" :content="content" :rowData="rowData" @contetnChange="contetnChange"></mapDesign>
        <flowDesign ref="flowNode" v-if="activeType == 'document_flow'" :content="content" :rowData="rowData" @contetnChange="contetnChange"></flowDesign>
      </div>
    </div>
    <el-dialog
      :class="{'hide-header-dialog': dialogType == 'preview'}"
      v-if="viewVisible"
      :visible.sync="viewVisible"
      :fullscreen="dialogType == 'preview' ? true : false"
      append-to-body
      :before-close="viewClose">
      <viewContainer v-if="dialogType == 'preview'" :type="activeType" :content="viewString"></viewContainer>
      <div class="viewlog-history" v-if="dialogType == 'listLog'">
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="浏览记录" name="view">
            <jvs-table :option="viewTableOption" :data="viewTableData"></jvs-table>
          </el-tab-pane>
          <el-tab-pane label="文档历史版本" name="history">
            <jvs-table :option="historyTableOption" :data="historyTableData"></jvs-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import mapDesign from './map/index'
import htmlDesign from './html/index'
import excelDesign from './excel/index'
import flowDesign from './flow/index'
import viewContainer from './show'
import {saveContent, preview, changeStatus, editLib} from './api'

import viewlog from '@/views/my/icon/操作记录.png'
import hislog from '@/views/my/icon/历史记录.png'
import userIcon from '@/views/my/icon/成员管理.png'
import lock from '@/views/my/icon/锁定.png'
import share from '@/views/my/icon/分享.png'
import save from '@/views/my/icon/保存.png'
import back from '@/views/my/icon/返回.png'
export default {
  components: {
    htmlDesign, viewContainer,excelDesign,mapDesign,flowDesign
  },
  props: {
    rowData: {
      type: Object
    }
  },
  data() {
    return {
      showUser: false, // 管理人员
      user_list: [
        {icon: "el-icon-folder", name: "smileforlast", info: "自己"},
        {icon: "el-icon-document", name: "smileforlast", info: "正在编辑中"},
        {icon: "el-icon-notebook-2", name: "smileforlast", info: ""},
        {icon: "icon-liucheng11", name: "smileforlast", type: ""},
        {icon: "icon-liucheng", name: "smileforlast", info: ""}
      ],
      enableInput: false,
      activeType: "", // 当前文档类型
      viewString: "", // 预览的字符串数据
      viewVisible: false,
      dialogType: "", // 弹框类型
      activeName: "view", // 浏览记录  文档历史版本
      viewTableData: [], // 浏览记录
      viewTableOption: {
        addBtn: false,
        menu: false,
        column: [
          {
            label: "",
            prop: ""
          }
        ]
      },
      historyTableData: [], // 历史版本
      historyTableOption: {
        addBtn: false,
        menu: false,
        column: [
          {
            label: "",
            prop: ""
          }
        ]
      },
      disabledSave: false, // 是否可以保存
      content: "",
      designShow: false,
      toolIcon: {
        viewlog: viewlog,
        hislog: hislog,
        userIcon: userIcon,
        lock: lock,
        share: share,
        save: save,
        back: back
      }
    }
  },
  methods: {
    handleInput(){
      if(this.rowData.name==""){
        this.enableInput=true;
        this.renameHandle()
      }else{
        this.enableInput=false;
        this.renameHandle()
      }
    },
    close () {
      this.changeStatusHandle(false)
      this.$emit('close', true)
    },
    // 预览
    viewHandle () {
      switch (this.activeType) {
        case 'document_html':
          if(this.viewString==''){
            this.viewString=this.content
          }
          break;
        case 'document_xlsx':
          this.viewString=JSON.parse(this.viewString)
          break;
        case 'document_map':
          let viewdata=this.$refs.mapNode.mind.getAllDataString()
          this.viewString=JSON.parse(viewdata)
          break;
        case 'document_flow':
          let viewdata1=this.$refs.flowNode.getVal()
          this.viewString=JSON.parse(viewdata1)
          break;
        default:
          break;
      }
      // if(this.activeType == 'document_xlsx'){
      //   if(typeof(this.viewString)=='string'){
      //     this.viewString=JSON.parse(this.viewString)
      //   }
      // }else if(this.activeType == 'document_map'){
      //   this.viewString=this.$refs.mapNode.mind.getAllDataString()
      //   if(typeof(this.viewString)=='string'){
      //     this.viewString=JSON.parse(this.viewString)
      //   }
      // }
      // console.log(this.viewString,"66666666666666666")
      this.dialogType = 'preview'
      this.viewVisible = true
    },
    // 富文本内容change html
    contetnChange (str) {
      if(this.rowData.type=='document_xlsx'){
        this.viewString = JSON.stringify(str)
      }else{
        this.viewString = str
      }
    },
    // 关闭预览
    viewClose () {
      // console.log(this.$refs.flowNode.getVal(),'qqqqqqqqq')
      if(this.rowData.type=='document_xlsx'){
        this.$refs.sheetNode.content=this.viewString
        this.$refs.sheetNode.cj();
      }
      if(this.rowData.type=='document_map'){
        this.$refs.mapNode.content=this.viewString
        this.$refs.mapNode.cj();
      }
      this.viewVisible = false
      // console.log(this.$refs.flowNode.getVal(),'wwwwwwwwwwww')
    },
    // 游览记录  文档历史版本
    viewHistory (type) {
      this.dialogType = 'listLog'
      this.activeName = type
      this.viewVisible = true
    },
    tabClick (tab) {
      this.activeName = tab.name
    },
    // 保存
    saveHandle () {
      if(this.activeType == 'document_map'){
        this.viewString=this.$refs.mapNode.mind.getAllDataString()
      }
      if(this.activeType == 'document_flow'){
        // console.log(this.$refs.flowNode.getVal())
        this.viewString=this.$refs.flowNode.getVal()
      }
      if(!this.disabledSave) {
        saveContent(this.rowData.id, {content: this.viewString}).then(res => {
          if(res.data.code == 0) {
            this.$message.success("保存成功")
          }
        })
      }
    },
    // 拉取数据
    getData () {
      preview(this.rowData.id).then(res => {
        if(res.data.code == 0 && res.data.data) {
          if(res.data.data.content && res.data.data.content.startsWith("{")) {
            let resData=JSON.parse(res.data.data.content).content
            // console.log(resData)
            if(resData.startsWith("[")){
              this.content = JSON.parse(resData)
              // console.log('1')
            }else if(resData.startsWith("{")){
              this.content = JSON.parse(resData)
              // console.log('2')
            }else{
              this.content = resData
            }
          }else{
            this.content = ""
          }
          if(res.data.data.type == "read") {
            this.disabledSave = true
          }else{
            this.disabledSave = false
          }
        }
        this.designShow = true
      })
    },
    // 编辑状态切换
    changeStatusHandle(bool) {
      changeStatus(this.rowData.id, bool).then(res => {
        if(res.data.code == 0) {
          // this.$messge.success("编辑状态")
          // this.disabledSave = false
        }
      })
    },
    // 重命名
    renameHandle () {
      editLib(this.rowData).then(res => {
        if(res.data.code == 0) {
          this.$message.success("重命名成功")
        }
      })
    }
  },
  created () {
    this.changeStatusHandle(true)
    this.activeType = this.rowData.type
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
.doc-lib-box{
  // padding: 0 8px;
  box-sizing: border-box;
  height: 100%;
  .db-body{
    margin-top: 10px;
    background-image: url('../../../src/styles/loading.gif');
    background-repeat: no-repeat;
    background-position: center;
    //background-size: 450px 360px;
    background-size: 300px 240px;
    display: flex;
    height: calc(100% - 50px);
    .left{}
    .right{
      flex: 1;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      background: #F7F7FA;
      // padding-top: 10px;
      box-sizing: border-box;
    }
  }
}
.base-type-list{
  padding: 0;
  margin: 0;
  li{
    display: flex;
    align-items: center;
    margin: 0;
    margin-bottom: 10px;
    cursor: pointer;
    padding: 5px 10px;
    i{
      margin-right: 10px;
    }
  }
  li:hover{
    background: #F5F7FA;
  }
  li:nth-last-of-type(1) {
    margin-bottom: 0;
  }
}
</style>
<style lang="scss">
.hide-header-dialog{
 .el-dialog__header{
   padding: 0;
 }
 .el-dialog__body{
  height: 100%;
  padding: 30px 20px 0 20px;
 }
}
.title-page-header{
  margin-top:0px;
}
.ant-modal-wrap{
    z-index: 9999;
}
.lt{
  width: 38px!important;
}
.le5le-topology .menus .back{
    display: none;
}
.le5le-topology .menus>div>div:first-child,.le5le-topology .menus>div>div:last-child{
    display: none;
}
.le5le-topology .menus>div{
  display: flex;
  justify-content: center!important;
}
.le5le-topology .materials .navs .nav-tab span:first-child{
    display: none;
}
.le5le-topology .materials .navs .nav-tab span:last-child{
    display: none;
}
iframe{
  width: 100%;
  min-height: 500px;
}
</style>
