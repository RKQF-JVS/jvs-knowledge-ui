<template>
  <div class="konwledge-base-view">
    <topbar :inKeyword="topKeyword" @searchChange="allSearchChange"></topbar>
    <div class="search-box" v-if="topIsSearch">
      <searchTool :keyword="topKeyword" @openDoc="openDoc"></searchTool>
    </div>
    <div v-else class="view-content">
      <div class="view-left" :style="'width:' + treeWidth+ 'px;'">
        <!-- <i class="el-icon-s-home"></i> -->
        <h5 @click="homeClick" style="text-indent: 40px;">{{knowledgeName}}</h5>
        <h5 class="directorytitle">
          <span><i class="el-icon-menu"></i><span>目录</span></span>
          <el-popover
            v-if="addCatalogueRight"
            popper-class="hover-popver-list"
            v-model="addDictool"
            placement="right"
            width="50"
            trigger="click">
            <ul class="base-type-list">
              <li v-for="(item, index) in doc_type_list" v-if="item.type == 'directory' ? addCatalogueRight : addCatalogueRight" :key="item.name+item.icon+index" @click="addChange(null, item)">
                <i :class="item.icon"></i>
                <span>{{item.name}}</span>
              </li>
            </ul>
            <i class="addDirectory el-icon-plus" slot="reference" @click="closeLastAdd"></i>
          </el-popover>
          <!-- <i v-if="addCatalogueRight" class="addDirectory el-icon-plus" @click.stop='addChange(null, {icon: "el-icon-folder", name: "目录", type: "directory"})'></i> -->
        </h5>
        <el-tree
          class="tree-list"
          ref="nodeTree"
          :data="treeData"
          :props="defaultProps"
          accordion
          node-key="id"
          :default-expanded-keys="expandKey"
          :expand-on-click-node="false"
          @node-expand="nodeExpand"
          @node-drag-start="handleDragStart"
          @node-drag-end="handleDragEnd"
          @node-drop="handleDrop"
          :draggable="false"
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
        >
        <!-- @node-click="handleNodeClick" -->
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <!-- <i class="el-icon-tickets"></i> -->
            <img :src="getIcon(data.type)" alt=""/>
            <el-input
              ref="editInput"
              v-if="changeNode && changeNode.changeNodeShow && changeNode.id == data.id"
              size="mini"
              v-model="changeName"
              :style="'width: ' + (treeWidth - getRightWidth(data) - node.level * 20) + 'px;'"
              @keyup.enter.native="nameChange"
              @blur="nameChange"
            ></el-input>
            <span
              v-else
              @click="handleNodeClick(data, node)"
              @dblclick="editName(data)"
              class="text" :style="'width: ' + (treeWidth - getRightWidth(data) - node.level * 20) + 'px;'"
            >{{node.label}}</span>
            <span class="tree-right-tool">
              <el-popover
                v-if="enableDelete(data, more_list)"
                popper-class="hover-popver-list"
                placement="right"
                width="50"
                v-model="data.moretool"
                trigger="click">
                <ul class="base-type-list">
                  <li v-for="item in more_list" v-if="item.enable" :key="item.name+item.icon" @click.stop="moreChange(data, item)">
                    <i :class="item.icon"></i>
                    <span>{{item.name}}</span>
                  </li>
                  <li v-if="data.type == 'knowledge' && data.isOwner === true" @click.stop="moreChange(data, {name: '设置', type: 'set'})">
                    <i class="el-icon-setting"></i>
                    <span>设置</span>
                  </li>
                </ul>
                <i slot="reference" class="el-icon-more iconhover" @click="openAdd(data)"></i>
              </el-popover>
              <!-- addFileRight -->
              <el-popover
                v-if="['knowledge', 'directory'].indexOf(data.type) > -1 && addCatalogueRight"
                popper-class="hover-popver-list"
                v-model="data.addtool"
                placement="right"
                width="50"
                trigger="click">
                <ul class="base-type-list">
                  <li v-for="(item, index) in doc_type_list" :key="item.name+item.icon+index" @click="addChange(data, item)">
                    <i :class="item.icon"></i>
                    <span>{{item.name}}</span>
                  </li>
                </ul>
                <i class="el-icon-plus iconhover" slot="reference" @click="openAdd(data)"></i>
              </el-popover>
            </span>
          </span>
        </el-tree>
        <div class="divider-line" :style="'left:' + (treeWidth - 10)+'px;'" :draggable="true" @dragstart="dragstart" @dragend="dragend"></div>
      </div>
      <div class="view-right" :style="'width: calc(100% - '+ treeWidth +'px);'">
        <div class="tool-box" v-if="boolShow && boolMyInfo">
          <toolbar
            :id="konwledgeInfo.id + ''"
            :nodeInfo="konwledgeInfo"
            :hasRight="hasRight"
            @fresh="freshHandle"
          ></toolbar>
        </div>
        <!-- 文档 -->
        <div class="knowledge-box" v-if="boolShow && konwledgeInfo.type == 'knowledge'">
          <div class="base-introduce">
            <div class="info">
              <div class="intrduce">
                <!-- <img :src="konwledgeInfo.coverImage ? konwledgeInfo.coverImage : iconImg" /> -->
                <div
                  class="cover-info"
                  :style="
                    konwledgeInfo.color
                      ? 'background: ' + konwledgeInfo.color + ';'
                      : ''
                  "
                >
                  <img class="mark" :src="markImg" />
<!--                  <img class="desktop" :src="desktopImg" />-->
                </div>
                <div>
                  <h5>{{ konwledgeInfo.name }}</h5>
                  <section>{{ konwledgeInfo.description }}</section>
                </div>
              </div>
              <div class="search">
                <el-input
                  placeholder="请输入内容搜索"
                  prefix-icon="el-icon-search"
                  v-model="keyword"
                  @keyup.enter.native="searchHandle"
                >
                </el-input>
              </div>
            </div>
            <img class="infoImage" :src="infoImg" />
          </div>
          <div class="search-boxs" v-if="isSearch">
            <searchTool
              :id="konwledgeInfo.id + ''"
              :keyword="keyword"
              @openDoc="openDoc"
            ></searchTool>
          </div>
          <div v-else>
            <div class="person-list">
              <h5>协作人员 ({{ personList.length }}人)</h5>
              <div>
                <p
                  class="person-list-item"
                  v-for="(item, index) in personList"
                  :key="item.realName + '-persion' + index"
                >
                  <img :src="item.headImg ? item.headImg : userImg" />
                  <span>{{ item.realName }}</span>
                </p>
              </div>
            </div>
            <div class="lasted-update">
              <h5>最新动态</h5>
              <div class="lasted-update-list">
                <h4
                  v-if="!updateList || updateList.length == 0"
                  style="font-size: 16px; margin: 5px 0px"
                >
                  暂无更新
                </h4>
                <div
                  class="lasted-update-list-item"
                  v-for="(item, index) in updateList"
                  :key="'update-item' + index + '-' + item.name"
                  @click="openItem(item)"
                >
                  <p>
                    <!-- :src="docitemImg"  -->
                    <img :src="getIcon(item.type)" />
                    <span>{{ item.name }}</span>
                  </p>
                  <p class="right-tip-info">
                    <span>{{ item.createTime }}</span>
                    <span>{{ item.realName }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 目录 -->
        <div
          class="directory-box"
          v-if="boolShow && konwledgeInfo.type == 'directory'"
        >
          <directoryView
            :nodeInfo="konwledgeInfo"
            :treeWidth="treeWidth"
            @openDoc="openDoc"
            @openFile="openItem"
          ></directoryView>
        </div>
        <div
          class="file-box"
          v-if="
            boolShow &&
            ['knowledge', 'directory'].indexOf(konwledgeInfo.type) == -1
          "
        >
          <fileView :nodeInfo="konwledgeInfo" :treeWidth="treeWidth" @refreshTree="refreshTree"></fileView>
        </div>
      </div>
    </div>
    <el-dialog
      :width="dialogType == 'setting' ? '60%' : '50%'"
      :fullscreen="dialogType == 'setting' ? true : false"
      :class="{'form-fullscreen-dialog': dialogType == 'setting', 'dialog': true}"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <span slot="title" class="dialogHeader">
        <div class="dialogLine"></div>
        <span>{{title}}</span>
      </span>
      <!-- 新增 知识库  树形操作 -->
      <jvs-form v-if="dialogVisible && ['knowledge', 'directory', 'document_html', 'document_xlsx', 'document_map', 'document_flow'].indexOf(dialogType) > -1" :option="baseFormOption" :formData="baseForm" @submit="baseSubmit"></jvs-form>
    </el-dialog>
  </div>
</template>
<script>
import eventBus from "@/util/eventBus";
import topbar from "@/views/common/topbar";
import icon from "./img/docicon.png";
import info from "./img/docinfo.png";
import user from "@/views/common/img/user.png";
import docitem from "./img/docitem.png";
import toolbar from "@/views/common/toolbar";
import searchTool from "@/views/common/search";
import directoryView from "@/views/catalogview/index";
import fileView from "@/views/info/index";
import mark from "@/views/index/img/mark.png";
import desktop from "@/views/index/img/desktop.png";
import {pageList, dcLibTree, addLib, delLib, editLib, preview, queryUser, addmember, modifyRole, delmember} from './diclibApi'
import {
  getLibTree,
  getLibEditLog,
  getLibMember,
  getDocumentList,
} from "./api";
import { getStore } from "@/util/store";
import {imgIcon} from '../my/icon/index'
export default {
  components: { topbar, toolbar, searchTool, directoryView, fileView },
  data() {
    return {
      knowledgeName:"",
      clickTimer:null,
      xjname:"未命名文件",
      sendQuery:{},
      myInfo:{},
      boolMyInfo:false,
      iconImg: icon,
      infoImg: info,
      userImg: user,
      docitemImg: docitem,
      markImg: mark,
      desktopImg: desktop,
      id: "",
      keyword: "",
      defaultProps: {
        children: "children",
        label: "name",
      },
      konwledgeInfo: {},
      treeData: [],
      personList: [],
      updateList: [],
      isSearch: false, // false
      expandKey: [],
      topIsSearch: false,
      topKeyword: "",
      boolShow: true,
      imgIconList: imgIcon,
      currentId: '',
      currentNode: null,
      treeWidth: 310,
      more_list: [
        // {icon: "el-icon-document", name: "复制链接", type: 'copy'},
        {icon: "el-icon-tickets", name: "删除", type: 'del'},
        // {icon: "el-icon-tickets", name: "导出", type: 'export'},
        // {icon: "el-icon-tickets", name: "重命名", type: 'rename'},
        // {icon: "el-icon-tickets", name: "上传文件", type: 'rename'}
      ],
      doc_type_list: [
        {icon: "el-icon-folder", name: "文件夹", type: "directory"},
        {icon: "el-icon-document", name: "文本文档", type: "document_html"},
        {icon: "el-icon-notebook-2", name: "表格文档", type: "document_xlsx"},
        {icon: "icon-liucheng11", name: "脑图文档", type: "document_map"},
        {icon: "icon-liucheng", name: "流程文档", type: "document_flow"},
        {icon: "el-icon-folder-opened", name: "其他文档", type: "document_unrecognized"},
      ],
      selectType: "", // 表单操作选择的类型
      opType: "", // 操作类型  区分 新增  或 修改
      title: "",
      dialogVisible: false, // 弹框
      baseForm: {},
      dialogType: "", // 弹框类型
      addMess: "", // 提示信息
      baseFormOption: {
        cancal: false,
        column: [
          {
            label: "知识库名",
            prop: "name",
            rules: [
              { required: true, message: '请输入知识库名', trigger: 'blur' },
            ]
          },
          {
            label: "描述",
            prop: "description",
            rules: [
              { required: false, message: '请输入描述', trigger: 'blur' },
            ]
          }
        ]
      },
      hasRight: false,
      addCatalogueRight: false,
      addFileRight: false,
      lastAdd: null,
      originName: '',
      changeName: '',
      changeNode: null,
      addDictool: false
    };
  },
  methods: {
    refreshTree() {
      this.getLibTreeHandle(this.id);
    },
    async init (oprate) {
      if(this.$route.query) {
          if (this.$route.query && this.$route.query.id) {
            this.id = this.$route.query.id;
            this.currentId = this.id
            if(oprate && oprate == 'home') {
              this.initKonwledge()
            }else{
              if(this.$route.query.docId) {
                this.konwledgeInfo = {
                  type: this.$route.query.type,
                  knowledgeId: this.id,
                  id: this.$route.query.docId
                }
                await this.getLibMemberHandle(this.id);
                this.getLibTreeHandle(this.id, {openId: this.$route.query.docId});
              }else{
                this.initKonwledge()
              }
            }
          }
        }
    },
    async initKonwledge () {
      if (getStore({ name: "konwledgeInfo" })) {
        this.konwledgeInfo = getStore({ name: "konwledgeInfo" });
        this.boolMyInfo=false
        if(this.myInfo){
          if(this.myInfo.id==this.konwledgeInfo.createById){
            this.boolMyInfo=true
          }
        }
      }else{
        this.konwledgeInfo = {
          type: this.$route.query.type,
          id: this.id
        }
      }
      await this.getLibMemberHandle(this.id);
      this.getLibEditLogHandle({ id: this.id, size: 10 });
      this.getLibTreeHandle(this.id);
      this.boolShow = true;
    },
    // 点击节点
    handleNodeClick (data, node) {
      if(this.$store.state.editStatus && this.$store.state.editStatus == 'ing') {
        this.$confirm('该文档存在改动, 是否保存?', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '放弃',
          type: 'warning'
        }).then(() => {
          this.getItemOfTree(this.$refs.nodeTree.children, this.currentId)
          this.$refs.nodeTree.setCurrentNode(this.currentNode)
          this.expandKey = [this.currentNode.parentId]
          eventBus.$emit('editSaveEvent', 'save')
          return false
        }).catch(() => {
          this.changeNodeHandle(data, node)
          this.$store.state.editStatus = 'end'
        });
      }else{
        this.changeNodeHandle(data, node)
      }
    },
    changeNodeHandle (data, node) {
      if(window.luckysheet) {
        window.luckysheet.exitEditMode()
      }
      let _this=this
      if (this.clickTimer) {
        window.clearTimeout(this.clickTimer);
        this.clickTimer = null;
      }
      this.clickTimer = window.setTimeout(function() {
        _this.boolShow = false;
        _this.$set(_this, 'konwledgeInfo', JSON.parse(JSON.stringify(data)))
        _this.currentId = data.id
        _this.keyword = "";
        if (data.type == "knowledge") {
          _this.getLibMemberHandle(data.id);
          _this.getLibEditLogHandle({ id: data.id, size: 10 });
        }
        if (["directory"].indexOf(data.type) > -1) {
          _this.nodeExpand(data, node);
        }
        _this.$nextTick(() => {
          _this.boolShow = true;
        });
      }, 300);
    },
    nodeExpand(data, node, self) {
      return false;
      if (["knowledge", "directory"].indexOf(data.type) > -1) {
        let hasFile = false;
        if (data.children && data.children.length > 0) {
          for (let d in data.children) {
            if (
              ["knowledge", "directory"].indexOf(data.children[d].type) == -1
            ) {
              hasFile = true;
            }
          }
        }
        getDocumentList(data.id).then((res) => {
          if (res.data.code == 0) {
            if (res.data.data && res.data.data.length > 0) {
              if (!data.children || data.children.length == 0) {
                data.children = res.data.data;
              } else {
                for (let r in res.data.data) {
                  let bool = true;
                  for (let c in data.children) {
                    console.log(
                      res.data.data[r].id,
                      data.children[c].id,
                      res.data.data[r].id == data.children[c].id
                    );
                    if (res.data.data[r].id == data.children[c].id) {
                      bool = false;
                    }
                  }
                  if (bool) {
                    data.children.push(res.data.data[r]);
                  }
                }
              }
            }
            for (let i in data.children) {
              this.$refs.nodeTree.append(data.children[i], node);
            }
            node.expanded = true;
            this.$forceUpdate();
          }
        });
      }
    },
    // 获取树形结构
    getLibTreeHandle (id, openNode) {
      getLibTree(id).then((res) => {
        if (res.data.code == 0) {
          this.knowledgeName=res.data.data[0].name
          if(res.data.data && res.data.data.length > 0 && res.data.data[0].children) {
            this.$store.commit("SET_KONWLEDGE", res.data.data[0])
            this.treeData = res.data.data[0].children
          }
          this.formatTreeData(this.treeData, 1);
          this.$nextTick(() => {
            if(openNode) {
              this.getItemOfTree(this.$refs.nodeTree.children, openNode.openId)
              this.$refs.nodeTree.setCurrentNode(this.currentNode)
              this.expandKey = [this.currentNode.parentId]
            }
          })
        }
      });
    },
    // 格式化树形，添加level
    formatTreeData(list, level) {
      for (let i in list) {
        list[i].level = level;
        if (list[i].children && list[i].children.length > 0) {
          this.formatTreeData(list[i].children, level + 1);
        }
      }
    },
    // 人员列表
    async getLibMemberHandle (id) {
      await getLibMember(id,{size:10000}).then((res) => {
        if (res.data.code == 0) {
          this.personList = res.data.data.records;
          let userInfo = getStore({name: 'userInfo'})
          this.addCatalogueRight=false
          for(let i in this.personList) {
            if(this.personList[i].userId == userInfo.id) {
              this.hasRight = this.personList[i].role == 'owner' ? true : false
              this.addCatalogueRight = (['owner', 'admin'].indexOf(this.personList[i].role) > -1) ? true : false
              this.addFileRight = true
            }
          }
        }
      });
    },
    // 更新记录
    async getLibEditLogHandle(params) {
      await getLibEditLog(params).then((res) => {
        if (res.data.code == 0) {
          this.updateList = res.data.data;
        }
      });
    },
    // 搜索
    searchHandle() {
      if (this.keyword && this.keyword.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')) {
        this.isSearch = true;
      } else {
        this.isSearch = false;
      }
    },
    // 回到首页
    homeClick () {
      if(this.$store.state.editStatus && this.$store.state.editStatus == 'ing') {
        this.$confirm('该文档存在改动, 是否保存?', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '放弃',
          type: 'warning'
        }).then(() => {
          eventBus.$emit('editSaveEvent', 'save')
          if(this.$store.state.editStatus != 'ing') {
            this.goHome()
          }
          return false
        }).catch(() => {
          this.goHome()
          this.$store.state.editStatus = 'end'
        });
      }else{
        this.goHome()
      }
    },
    goHome() {
      // this.$router.push({ path: "/index" });
      this.boolShow = false;
      this.init('home')
    },
    allSearchChange(val) {
      this.topKeyword = val;
      if (val && val.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')) {
        this.topIsSearch = true;
      } else {
        this.topIsSearch = false;
      }
    },
    freshHandle(data) {
      if (typeof data == "boolean") {
        this.getLibTreeHandle(this.konwledgeInfo.id);
        this.getLibMemberHandle(this.konwledgeInfo.id);
        this.getLibEditLogHandle({ id: this.konwledgeInfo.id, size: 10 });
      } else {
        this.$set(this, "konwledgeInfo", data);
        this.$store.commit("SET_KONWLEDGE", data)
        this.knowledgeName = data.name
      }
    },
    openDoc (item) {
      this.$set(this.konwledgeInfo, 'type', item.type)
      this.$set(this.konwledgeInfo, 'knowledgeId', item.knowledgeId)
      this.$set(this.konwledgeInfo, 'id', item.docId)
      this.isSearch = false
      this.topIsSearch = false
      this.$set(this, 'keyword', '')
      this.$set(this, 'topKeyword', '')
      this.init()
    },
    getIcon (type) {
      let src = ""
      switch(type) {
        case 'directory': src = this.imgIconList.file;break;
        case 'document_html': src = this.imgIconList.world;break;
        case 'document_xlsx': src = this.imgIconList.excel;break;
        case 'document_map': src = this.imgIconList.naotu;break;
        case 'document_flow': src = this.imgIconList.flow;break;
        case 'document_image': src = this.imgIconList.tupian;break;
        case 'document_txt': src = this.imgIconList.txt;break;
        case 'document_ppt': src = this.imgIconList.ppt;break;
        case 'document_unrecognized': src = this.imgIconList.other;break;
        default: src = this.imgIconList.file;break;
      }
      return src
    },
    openItem (item) {
      this.$set(this.konwledgeInfo, 'type', item.type)
      this.$set(this.konwledgeInfo, 'knowledgeId', this.id)
      this.$set(this.konwledgeInfo, 'id', item.docId)
      this.getItemOfTree(this.$refs.nodeTree.children, item.docId)
      this.$refs.nodeTree.setCurrentNode(this.currentNode)
      this.expandKey = [this.currentNode.parentId]
    },
    getItemOfTree (list, id) {
      for(let i in list) {
        if(list[i].id == id) {
          this.currentNode = list[i]
        }
        if(list[i].children) {
          this.getItemOfTree(list[i].children, id)
        }
      }
    },
    dragstart (e) {
      // console.log(e)
    },
    dragend (e) {
      if(e.pageX < 310) {
        this.treeWidth = 310
      }else if(e.pageX > 500) {
        this.treeWidth = 500
      }else{
        this.treeWidth = e.pageX
      }
    },
    openAdd (node) {
      this.addDictool=false
      if(this.lastAdd) {
        this.lastAdd.addtool = false
        this.lastAdd.moretool = false
      }
      this.lastAdd = node
    },
    closeLastAdd () {
      if(this.lastAdd) {
        this.lastAdd.moretool=false
      }
    },
    addChange (node, item) {
      this.selectType = item.type
      if(node) {
        node.addtool = false
        this.currentNodeData = node
        // this.addBaseHandle(node.type, item.name, 'add')
        if(this.selectType=="directory"){
          this.xjname="未命名文件夹"
        }else{
          this.xjname="未命名文件"
        }
        this.sendQuery ={fileType:this.selectType,id:this.currentNodeData.id,name:this.xjname}
      }else{
        this.currentNode = null
        // this.addBaseHandle('knowledge', item.name, 'add')
        if(this.selectType=="directory"){
          this.xjname="未命名文件夹"
        }else{
          this.xjname="未命名文件"
        }
        this.sendQuery ={fileType:this.selectType,id:this.id,name:this.xjname}
      }
      addLib(this.sendQuery).then(res => {
        if(res.data.code == 0) {
          this.addDictool=false
          this.$notify({
            title: ("新建"+ this.addMess +"成功"),
            // message: '右下角弹出的消息',
            type: 'success',
            position: 'bottom-right'
          });
          this.handleClose()
          let openNode = null
          if(res.data.data) {
            openNode = {
              openId: res.data.data.id
            }
          }
          this.getLibTreeHandle(this.id, openNode);
          this.$set(this, 'konwledgeInfo', JSON.parse(JSON.stringify(res.data.data)))
          this.boolShow=false
          this.$nextTick(() => {
            this.boolShow=true
          })
        }
      })
    },
    moreChange (node, item) {
      node.moretool = false
      let str = '文件？'
      if(node.type == 'directory') {
        str = '目录？目录下所有文件将被删除！'
      }
      // 删除
      if(item.type == 'del') {
        this.$confirm(`确定要删除此${str}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delLib(node.id).then(res => {
            if(res.data.code == 0) {
              this.$notify({
                title: '删除成功',
                // message: '右下角弹出的消息',
                type: 'success',
                position: 'bottom-right'
              });
              this.getLibTreeHandle(this.id);
              this.goHome()
              if(this.currentNode.id == node.id) {
                this.currentNode = null
              }
            }
          })
        }).catch(e => {})
      }
      if(item.type == 'rename') {
        this.currentNodeData = node
        let mess = ""
        switch(node.type) {
          case 'directory': mess = "文件夹";break;
          case 'document_html': mess = "文本文档";break;
          case 'document_xlsx': mess = "表格文档";break;
          case 'document_map': mess = "脑图文档";break;
          case 'document_flow': mess = "流程文档";break;
          case 'document_image': mess = "图片";break;
          case 'document_txt': mess = "文本";break;
          case 'document_ppt': mess = "ppt";break;
          default: mess = "知识库";break;
        }
        this.addBaseHandle(node.type, mess, 'edit')
        this.title = '重命名'
      }
      // 复制链接
      if(item.type == 'copy') {
        preview(node.id).then(res => {
          if(res.data.code == 0) {
            // this.$openUrl(`/mgr/document/dcLibrary/preview/document/${node.id}`, "_blank")
          }
        }).catch(e => {
          node.moretool = false
        })

      }
      // 导出
      if(item.type == 'export') {
        //
      }
      // 设置
      if(item.type == 'set') {
        this.currentRow = node
        this.setHandle()
        this.title = '设置'
      }
    },
    enableDelete (node, list) {
      let bool = true
      let userInfo = getStore({name: 'userInfo'})
      for(let i in list) {
        let tb = true
        if(this.addCatalogueRight) {
          tb = true
        }else{
          if(node.createById && node.createById == userInfo.id) {
            tb = true
          }else{
            tb = false
          }
          tb = false // 成员只能查看，不可编辑、新增、删除
        }
        list[i].enable = tb
        bool = (bool && tb)
      }
      return bool
    },
    addBaseHandle (type, mess, op) {
      this.dialogType = type
      this.addMess = mess
      this.opType = op
      this.title = '新建' + mess
      this.baseFormOption.column.filter(it => {
        if(it.prop == "name") {
          it.label = mess + "名称"
          it.rules = [{ required: true, message: `请输入${mess}名称`, trigger: 'blur' }]
        }
      })
      if(this.opType == 'edit' && this.currentNodeData && this.currentNodeData.name) {
        this.baseForm = {
          description:this.currentNodeData.description,
          name: this.currentNodeData.name
        }
        this.title = '编辑' + mess
      }
      this.dialogVisible = true
    },
    handleClose () {
      this.dialogVisible = false
      this.baseForm = {}
      this.setTab = "doc"
      this.searchUserName = ""
      this.userData = []
      this.settingForm = {
        shareRole: "user",
        share: false
      }
      this.currentNodeData = null
      this.selectType = ""
      this.title = ""
      this.openNode = null
    },
    baseSubmit (form) {
      if(this.opType == 'add') {
        let obj = JSON.parse(JSON.stringify(form))
        if(this.currentNodeData) {
          obj.id = this.currentNodeData.id
        }else{
          obj.id = this.id
        }
        if(this.selectType) {
          obj.fileType = this.selectType
        }
        // addLib(obj).then(res => {
        //   if(res.data.code == 0) {
        //     this.$notify({
        //       title: ("新建"+ this.addMess +"成功"),
        //       // message: '右下角弹出的消息',
        //       type: 'success',
        //       position: 'bottom-right'
        //     });
        //     this.handleClose()
        //     let openNode = null
        //     if(res.data.data) {
        //       openNode = {
        //         openId: res.data.data.id
        //       }
        //     }
        //     this.getLibTreeHandle(this.id, openNode);
        //   }
        // })
      }
      if(this.opType == 'edit') {
        let obj = JSON.parse(JSON.stringify(this.currentNodeData))
        obj.name = form.name
        obj.description = form.description
        editLib(obj).then(res => {
          if(res.data.code == 0) {
            this.$notify({
              title: ("重命名"+ this.addMess +"成功"),
              // message: '右下角弹出的消息',
              type: 'success',
              position: 'bottom-right'
            });
            this.handleClose()
            this.getLibTreeHandle(this.id);
          }
        })
      }
    },
    getRightWidth (data) {
      let w = 95
      if(['knowledge', 'directory'].indexOf(data.type) > -1) {
        if(!this.enableDelete(data, this.more_list)) { // 没有更多
          w = w - 30
        }
      }else{
        if(this.enableDelete(data, this.more_list)) {
          w = 65
        }else{
          w = 35
        }
      }
      return w
    },
    // 双击修改名称
    editName (data) {
      if (this.clickTimer) {
        window.clearTimeout(this.clickTimer);
        this.clickTimer = null;
      }
      let bool = true
      let userInfo = getStore({name: 'userInfo'})
      if(this.addCatalogueRight) {
        bool = true
      }else{
        if(data.createById && data.createById == userInfo.id) {
          bool = true
        }else{
          bool = false
        }
      }
      if(bool) {
        this.originName = JSON.parse(JSON.stringify(data)).name
        if(this.changeNode) {
          this.changeNode.changeNodeShow = false
        }
        data.changeNodeShow = true
        this.changeNode = data
        this.changeName = data.name
      }
      this.$nextTick(() => {
        this.$refs.editInput.focus()
      })
    },
    nameChange () {
      if(this.changeName == this.originName) {
        this.changeNode = null
        this.changeName = ''
        this.originName = ''
      }else{
        let obj = JSON.parse(JSON.stringify(this.changeNode))
        obj.name = this.changeName
        editLib(obj).then(res => {
          if(res.data.code == 0) {
            this.$notify({
              title: ("重命名"+ this.addMess +"成功"),
              // message: '右下角弹出的消息',
              type: 'success',
              position: 'bottom-right'
            });
            this.getLibTreeHandle(this.id, {openId: obj.id})
            this.konwledgeInfo = obj
            this.changeNode = null
            this.changeName = ''
            this.originName = ''
          }
        }).catch(e => {
          this.changeNode = null
          this.changeName = ''
          this.originName = ''
        })
      }
    },
    /**
     * 拖拽树形
     * 监听各状态
    **/
    handleDragStart(node, ev) {
      console.log('drag start', node);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      // console.log('tree drag end: ', dropNode && dropNode.label, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (['knowledge', 'directory'].indexOf(dropNode.data.type) === -1) {
        return type !== 'inner';
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      // 判断节点能否被拖拽
      return true
    }
  },
  created() {
    this.init()
    this.myInfo = getStore({ name: "userInfo" });
    if(this.myInfo){
      if(this.myInfo.id==this.konwledgeInfo.createById){
        this.boolMyInfo=true
      }
    }
  },
  watch: {
    keyword: {
      handler(newVal, oldVal) {
        if(newVal && newVal.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')) {
          this.isSearch = true;
        }else{
          this.isSearch = false;
        }
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.base-type-list li{
  margin-bottom: 0;
  line-height: 26px;
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
</style>
<style lang="scss">
.konwledge-base-view {
  height: 100%;
  overflow-y: auto;
  .search-box{
    padding: 40px 145px;
  }
  .view-content {
    height: calc(100vh - 79px);
    display: flex;
    overflow: hidden;
    .view-left {
      width: 310px;
      box-sizing: border-box;
      // border-right: 1px solid #eeeeee;
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
      // padding-left: 33px;
      padding-top: 15px;
      position: relative;
      h5 {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 16px;
        font-family: SourceHanSansCN-Regular;
        line-height: 25px;
        margin-bottom: 20px;
        //margin-left: -20px;
        cursor: pointer;
        text-indent: 20px;
        color: #333333;
      }
      .directorytitle{
        display: flex;
        align-items: center;
        justify-content: space-between;
        span{
          text-indent: 20px;
          i{
            margin-right: 5px;
            color: #868BA1;
          }
        }
        .addDirectory{
          margin-right: 34px;
        }
      }
      .tree-list{
        height: calc(100% - 85px);
        padding: 0 20px;
      }
      .el-tree-node.is-current{
        >.el-tree-node__content{
          background: #F5F7FA;
        }
        .el-tree-node:not(.is-expanded) span:not(.el-tree-node__expand-icon){
          color: #333333;
        }
      }
      .custom-tree-node {
        padding-right: 50px;
        display: flex;
        align-items: center;
        width: 100%;
        .el-input--mini .el-input__inner{
          border: none;
          font-size: 18px;
        }
        i {
          color: #868ba1;
          font-size: 20px;
          margin-right: 10px;
        }
        img{
          display: block;
          //width: 16px;
          //height: 20px;
          width: 0;
          margin-right: 10px;
        }
        span.text {
          font-size: 14px;
          font-family: SourceHanSansCN-Regular;
          line-height: 25px;
          color: #222222;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: pre;
        }
        .tree-right-tool{
          display: none;
          i{
            font-size: 16px;
            margin-left: 5px;
          }
        }
      }
      .custom-tree-node:hover{
        .tree-right-tool{
          display: block;
        }
      }
      .divider-line{
        position: fixed;
        width: 10px;
        background: #eeeeee;
        height: 100%;
        left: 310px;
        height: calc(100%);
        top: 79px;
        cursor: e-resize;
        z-index: 1;
      }
    }
    .view-left::-webkit-scrollbar{
      display: none;
    }
    .view-right {
      width: calc(100% - 310px);
      height: calc(100vh - 79px);
      overflow: hidden;
      overflow-y: auto;
      position: relative;
      .tool-box {
        position: fixed;
        top: 110px;
        right: 30px;
      }
      .knowledge-box{
        .search-boxs{
          padding: 30px 40px;
        }
      }
      .base-introduce {
        display: flex;
        padding-top: 60px; // 85px;
        border-bottom: 1px solid #ebecee;
        padding-bottom: 40px;
        justify-content: space-between;
        .info {
          padding-left: 40px;
          .intrduce {
            display: flex;
            img {
              display: block;
              width: 204px;
              height: 160px;
              margin-right: 33px;
            }
            .cover-info {
              border-radius: 4px;
              width: 204px;
              height: 160px;
              background-image: url("../index/img/bg.png");
              background-repeat: no-repeat;
              position: relative;
              margin-right: 33px;
              img {
                display: block;
              }
              .mark {
                position: absolute;
                left: 5px;
                top: 5px;
                width: 15px;
                height: 20px;
              }
              .desktop {
                width: 80px;
                height: 70px;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                margin: auto;
              }
            }
            div {
              h5 {
                margin: 0;
                font-size: 22px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                line-height: 54px;
                color: #333333;
              }
              section {
                min-width: 300px;
                max-width: 600px;
                font-size: 16px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                line-height: 25px;
                color: #868ba1;
                margin-top: 10px;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
              }
            }
          }
          .search {
            margin-top: 55px;
            .el-input {
              width: 389px;
              height: 45px;
              .el-input__inner {
                height: 45px;
                font-size: 16px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                line-height: 27px;
                color: #868ba1;
                padding-left: 40px;
                border-color: #f3f3f3;
                border-radius: 30px;
                outline: none;
                background: #f3f3f3;
              }
              .el-input__prefix {
                left: 15px;
                i {
                  font-size: 20px;
                  line-height: 45px;
                }
              }
            }
          }
        }
        .infoImage {
          width: 460px;
          height: 288px;
          margin-right: 150px;
        }
      }
      .person-list {
        padding: 40px 40px 26px 40px;
        h5 {
          font-size: 20px;
          font-family: Source Han Sans CN;
          font-weight: 500;
          line-height: 20px;
          color: #333333;
          margin-top: 0;
          // margin-bottom: 25px;
        }
        div {
          display: flex;
          align-items: center;
          margin-top: 16px;
          flex-wrap: wrap;
          .person-list-item {
            width: 60px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: 10px 32px;
            img {
              display: block;
              width: 40px;
              height: 40px;
              margin-bottom: 10px;
              border-radius: 50%;
              overflow: hidden;
            }
            span{
              width: 100%;
              text-align: center;
              font-size: 14px;
              color: #333333;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
          }
          // .person-list-item:nth-of-type(1) {
          //   margin-left: 0;
          // }
          // .person-list-item:nth-last-of-type(1) {
          //   margin-right: 0;
          // }
        }
      }
      .lasted-update {
        padding: 0 40px;
        h5 {
          font-size: 20px;
          font-family: Source Han Sans CN;
          font-weight: 500;
          color: #333333;
          margin: 0;
          line-height: 20px;
        }
        .lasted-update-list {
          margin: 22px 0;
          .lasted-update-list-item {
            margin: 0;
            line-height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
            font-size: 14px;
            cursor: pointer;
            p {
              display: flex;
              align-items: center;
              margin: 0;
              img {
                display: block;
                width: 18px;
                height: 20px;
                margin-right: 27px;
              }
            }
            .right-tip-info {
              color: #868ba1;
              span:nth-last-of-type(1) {
                margin-left: 100px;
                width: 60px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          .lasted-update-list-item:hover {
            background: #f6f6f6;
          }
        }
      }
    }
  }
}
.el-tiptap-editor .ProseMirror {
  font-size: 18px;
}
.el-tiptap-editor__menu-bubble{
  width: 300px;
  flex-wrap: wrap;
}
.el-tiptap-editor__menu-bar{
  border: none;
}
.el-tiptap-editor__menu-bar:before{
  display: none;
}
.el-tiptap-editor>.el-tiptap-editor__content{
  border: none;
}
.el-tiptap-editor__content .iframe__embed{
  border: 1px solid #FFFFFF;
}
.el-tiptap-editor__content .iframe__embed:hover{
  border: 1px solid #c0bfbf;
}
</style>
