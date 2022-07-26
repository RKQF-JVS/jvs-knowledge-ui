<template>
  <div>
    <div class="infoZhan" v-if="infoShow" :style="'width:calc(100% - '+ treeWidth +'px );'"></div>
    <iframe id="mainIframe" v-if="previewSrc" class="iframe" :src="previewSrc" ref="iframe"></iframe>
    <div class="contInfo" v-if="boolShow && !previewSrc">
      <Tiptap
        @contetnChange="contetnChange"
        v-if="
          nodeInfo.type == 'document_html' &&
          typeof content == 'string' &&
          type == 'edit'
        "
        :content="content"
      ></Tiptap>
      <LuckySheet
        @contetnChange="contetnChange"
        v-if="
          nodeInfo.type == 'document_xlsx' &&
          typeof content == 'object' &&
          type == 'edit'
        "
        :content="content"
      ></LuckySheet>
      <MindElixir
        ref="mapNode"
        v-if="
          nodeInfo.type == 'document_map' &&
          typeof content == 'object' &&
          type == 'edit'
        "
        :content="content"
      ></MindElixir>
      <Topology
        ref="flowNode"
        v-if="
          nodeInfo.type == 'document_flow' &&
          typeof content == 'object' &&
          type == 'edit'
        "
        :content="content"
      ></Topology>
      <viewContainer
        v-if="type == 'read'"
        :type="nodeInfo.type"
        :content="nodeInfo.type == 'document_map'||nodeInfo.type == 'document_flow'?content:null"
        :tipcont="nodeInfo.type == 'document_html'?tipcontent:null"
        :excelcont="nodeInfo.type == 'document_xlsx'?excelcontent:null"
      ></viewContainer>
      <div
        class="other"
        v-if="
          !(
            nodeInfo.type == 'document_html' ||
            nodeInfo.type == 'document_xlsx' ||
            nodeInfo.type == 'document_map' ||
            nodeInfo.type == 'document_flow'
          )
        "
      >
        <div>
          <figure>
<!--            <img src="@/views/info/img/file.png" alt="" />-->
            <img src="@/views/my/icon/other.png" alt="" />
            <figcaption>{{ nodeInfo.name }}</figcaption>
          </figure>
<!--          <el-button class="btns" type="primary" @click="download"-->
<!--            >下载文件</el-button-->
<!--          >-->
          <el-button v-if="nodeInfo.content || previewUrl" size="small" type="primary" @click="handlePreview">预览文件</el-button>
          <el-upload
            v-else
            class="upload-demo"
            :action="`/mgr/document//dcLibrary/upload/${nodeInfo.id}`"
            :data="paramData"
            :headers="header"
            :on-success="handleSuccess"
            :before-remove="beforeRemove"
            :show-file-list="false"
            :file-list="fileList">
            <el-button size="small" style="margin-left: 16px;" type="primary">点击上传</el-button>
          </el-upload>
          <div class="upload-explain">
            <p>支持word excel ppt，pdf等办公文档</p>
            <p>支持txt,java,php,py,md,js,css等所有纯文本</p>
            <p>支持jpg，jpeg，png，gif等图片预览（翻转，缩放，镜像）</p>
            <p>支持mp3，mp4，flv等多媒体文件预览</p>
          </div>
<!--          <div class="lines"></div>-->
<!--          <p>-->
<!--            文档只能处理识别部分文件格式，或特定格式，其它格式将无法处理。请在本地使用专业软件打开。-->
<!--          </p>-->
        </div>
        <img src="@/views/info/img/logor.png" alt="" />
      </div>
    </div>
    <Comment :nodeInfo="nodeInfo" :pageInfo="pageInfo"></Comment>
    <i
      class="iconfont icon-fanhuidingbu"
      @click="handleScrollTop"
      v-show="gotop"
    ></i>
  </div>
</template>
<script>
import Tiptap from "@/views/common/Tiptap.vue";
import LuckySheet from "@/views/common/LuckySheet.vue";
import MindElixir from "@/views/common/MindElixir.vue";
import Topology from "@/views/common/Topology.vue";
import Comment from "@/views/common/Comment.vue";
import { preview, queryMember, saveContent } from "@/views/common/api";
import viewContainer from "@/views/common/show.vue";
import { getStore } from "@/util/store.js";
import eventBus from "@/util/eventBus";
import store from "@/store";
import {Base64} from "js-base64";
export default {
  props: {
    nodeInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    treeWidth: {
      type: Number
    }
  },
  components: {
    Tiptap,
    LuckySheet,
    MindElixir,
    Topology,
    Comment,
    viewContainer,
  },
  data() {
    return {
      previewSrc: null,
      header: {
        "Authorization": 'Bearer ' + store.getters.access_token
      },
      paramData: {
      }, // 上传参数
      fileList: [],
      dialogVisible: false,
      title: "",
      infos: {},
      content: null,
      tipcontent:null,
      excelcontent:null,
      boolShow: false,
      infoShow:false,
      pageInfo: {},
      userIno: {},
      type: "read",
      viewString: "",
      gotop: false,
      scrollHeight: 100,
      scrollTop: 0,
      previewUrl: null,
    };
  },
  methods: {
    handlePreview() {
      const urlTemp = this.nodeInfo.content || this.previewUrl
      let url = Base64.encode(urlTemp)
      // this.$openUrl(`http://file.preview.jvs.bctools.cn/onlinePreview?url=${url}`, "_blank")
      this.previewSrc = `http://file.preview.jvs.bctools.cn/onlinePreview?url=${url}`
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleSuccess(response, file, fileList) {
      this.$message.success('上传成功！')
      this.$emit('refreshTree')
      this.previewUrl = response.data
      const urlTemp = this.nodeInfo.content || this.previewUrl
      let url = Base64.encode(urlTemp)
      this.previewSrc = `http://file.preview.jvs.bctools.cn/onlinePreview?url=${url}`
    },
    // 滚动事件
    handleScroll(e) {
      const that = this;
      const scrollTop =
        document.getElementsByClassName("view-right")[0].scrollTop;
      that.scrollTop = scrollTop;
      that.scrollTop > this.scrollHeight
        ? (this.gotop = true)
        : (this.gotop = false);
    },
    // 点击回到顶部事件
    handleScrollTop() {
      const that = this;
      const timer = setInterval(() => {
        const ispeed = Math.floor(-that.scrollTop / 5);
        document.getElementsByClassName("view-right")[0].scrollTop =
          that.scrollTop + ispeed;
        if (that.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 16);
    },
    contetnChange (str) {
      if (this.nodeInfo.type == "document_xlsx") {
        this.viewString = JSON.stringify(str);
      } else {
        this.viewString = str;
      }
      if(this.nodeInfo.type == 'document_html') {
        this.$store.state.editStatus = 'ing'
      }else{
        this.$store.state.editStatus = 'end'
      }
    },
    // 保存
    async saveHandle() {
      if (this.nodeInfo.type == "document_map") {
        this.viewString = this.$refs.mapNode.mind.getAllDataString();
      }
      if (this.nodeInfo.type == "document_flow") {
        this.viewString = this.$refs.flowNode.getVal();
      }
      await saveContent(this.nodeInfo.id, { content: this.viewString }).then( (res) => {
        if (res.data.code == 0) {
          this.$store.state.editStatus = 'end'
          this.$notify({
            title: "保存成功",
            // message: '右下角弹出的消息',
            type: "success",
            position: "bottom-right",
          });
        }
      });
    },
    handleEvent(e) {
      if (
        e.keyCode == 83 &&
        (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
      ) {
        e.preventDefault();
        if (this.type == "edit") {
          return this.saveHandle();
        } else {
          return false;
        }
      }
    },
    // 判断权限
    jurisdiction(id) {
      // 人员列表
      queryMember(id, {size: 1000}).then((res) => {
        if (res.data.code == 0) {
          let list = res.data.data.records;
          list.forEach((item) => {
            if (item.userId == this.userIno.id) {
              if (item.role != "member") {
                this.type = "edit";
              }
            }
          });
        }
      });
      if(this.userIno && this.userIno.id==this.nodeInfo.createById){
        this.type = "edit";
      }
    },
    // 拉取数据
    getData() {
      this.infoShow = true;
      preview(this.nodeInfo.id).then((res) => {
        if (res.data.code == 0 && res.data.data) {
          this.pageInfo = res.data.data;
          if (res.data.data.content && res.data.data.content.startsWith("{")) {
            let resData = JSON.parse(res.data.data.content).content;
            if (resData.startsWith("[")) {
              this.content = JSON.parse(resData);
              this.excelcontent= JSON.parse(resData)
            } else if (resData.startsWith("{")) {
              this.content = JSON.parse(resData);
            } else {
              this.content = resData;
              this.tipcontent = resData;
            }
          } else {
            this.content = "";
          }
          if (!this.content) {
            if (this.nodeInfo.type == "document_xlsx") {
              this.content = [];
            }
            if (
              ["document_map", "document_flow"].indexOf(this.nodeInfo.type) > -1
            ) {
              this.content = {};
            }
          }
          this.boolShow = true;
          this.infoShow = false;
        }
        if (typeof this.content != "string") {
          this.viewString = JSON.stringify(this.content);
        } else {
          this.viewString = this.content;
        }
        this.infoShow = false;
      });
      const urlTemp = this.nodeInfo.content || this.previewUrl
      if(urlTemp) {
        let url = Base64.encode(urlTemp)
        this.previewSrc = `http://file.preview.jvs.bctools.cn/onlinePreview?url=${url}`
      }
    },
    download() {
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, true); // 注册滚动事件
    document.addEventListener("keydown", this.handleEvent);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll, true);
    document.removeEventListener("keydown", this.handleEvent);
  },
  created() {
    this.getData();
    this.userIno = getStore({ name: "userInfo" });
    this.jurisdiction(this.nodeInfo.knowledgeId);
    this.handleScrollTop()
    eventBus.$off("editSaveEvent")
    eventBus.$on("editSaveEvent", type => {
      switch(type) {
        case 'save':
          this.saveHandle()
          break;
        default: ;break;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.iframe{
  width: 100%;
  height: calc(100vh - 80px);
  border: none;
}
.infoZhan{
  width: 100%;
  height: 100%;
  position: fixed;
  background-image: url('../../styles/loading.gif');
  background-repeat: no-repeat;
  background-position: center;
  //background-size: 450px 360px;
  background-size: 300px 240px;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999999;
}
.other {
  padding: 40px 40px 0;
  display: flex;
  justify-content: space-between;
  img{
    width: 475px; height: 324px;
  }
  .upload-explain{
    margin-left: 16px;
    p{
      font-size: 14px;
      line-height: 14px;
      margin: 10px 0;
    }
  }
}
.other figure {
  display: flex;
  align-items: center;
  img {
    width: 150px;
    height: auto;
  }
}
figcaption {
  margin-left: 34px;
  font-size: 30px;
  font-weight: 400;
}
.btns {
  width: 180px;
  height: 50px;
  margin-top: 45px;
}
.lines {
  display: block;
  width: 680px;
  height: 1px;
  background: #eeeeee;
  margin-top: 70px;
}
.other p {
  width: 680px;
  font-size: 16px;
  font-weight: 400;
  margin-top: 20px;
  color: #868ba1;
}
.icon-fanhuidingbu {
  font-size: 55px;
  color: #868ba1;
  position: fixed;
  bottom: 25px;
  right: 21px;
  cursor: pointer;
}
.icon-fanhuidingbu:hover {
  color: #a5abc0;
}
</style>
