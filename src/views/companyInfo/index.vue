<template>
  <div>
    <topbar :inKeyword="topKeyword" @searchChange="allSearchChange"></topbar>
    <div class="company-page">
      <div class="member">
        <div class="member-title">企业成员</div>
        <div style="width: 100%;height: 1px;background-color: #BFBFBF;margin: 20px 0;"/>
        <div class="member-content">
          <div class="member-item" v-for="(item, key) in userList" :key="key">
            <img :src="item.headImg"/>
            <div class="realName">{{item.realName}}</div>
          </div>
        </div>
      </div>
      <div class="introduce">
        <div class="introduce-title">软件介绍</div>
        <div style="width: 100%;height: 1px;background-color: #BFBFBF;margin: 20px 0;"/>
        <div class="introduce-content">
          <div class="version">版本号：1.0.1</div>
          <h3>基础说明：</h3>
          <p>无忧企业文档主要服务客群为企业用户，解决企业内部文档编辑、知识沉淀、知识协同等痛点。</p>
          <p>项目主要采用Java开发，基础框架采用JVS（spring cloud+Vue）。</p>
          <h3>适用场景：</h3>
          <p>适用于个人、团队、企业使用，提供云笔记、个人知识沉淀、在线产品手册、团队内部知识库、在线电子教程等功能。</p>
          <p>支持SaaS模式，支持私有化部署场景。</p>
          <h3>产品特点</h3>
          <p>无忧企业文档：</p>
          <p>企业内部在线文档化管理，解决企业文档碎片化痛点，让文档管理轻松高效</p>
          <p>提供私有化部署，并支持SaaS模式与PaaS模式，满足不同场景需求。私有的才是安全的</p>
          <p>无限制使用，没有人员数量、部署方式的限制</p>
          <p>支持全代码开放，支持二次开发，可扩展更多应用</p>
          <p>超级富文本，让文档表达更加简单通透，让操作更加简单易用：</p>
          <p>简单，的文本编辑，去除传统office中复杂的编辑操作</p>
          <p>丰富，表达方式，文本中嵌入多种，脑图、画图、图表、外部服务等内容进行表达</p>
          <p>扩展，三方形态接入方式（图片保存+编辑跳转方式，ifram模式，实现万物皆可引用，在文档打开的时候，直接刷新一次外部调用的图片）</p>
          <p>记录，生命痕迹，编辑、阅读、分享、记录。</p>
          <p>模板，多种文档记录模板，快速高效</p>
          <p>搜索，支持强大的文库搜索引擎，轻松查找任何文档，任何内容</p>
          <p>企业文档协同，让文档流转变得非常简单，让团队协作成为助力：</p>
          <p>协作，团队化管理文档，引入团队或者个人成为文档的成员</p>
          <p>开放，简单直接共享，共享开关，网络直接可以访问</p>
          <p>交流，通过“@”的方式可以形成交流的点，通过评论，对文档进行评价</p>
          <p>权限，文档权限化管理，：删除、编辑、共享设置</p>
          <p>更多功能，持续更新，敬请期待。</p>
          <div class="footer">
            <p>更新日志</p>
            <p>2021-12-02</p>
            <p>修改部分UI展示图</p>
            <p>添加10多种文件格式在线预览</p>
            <p>添加软件介绍页</p>
            <p>添加知识库背景替换</p>
            <p>修复部分BUG</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getUserAll} from "../../components/api";
import topbar from "@/views/common/topbar";

export default {
  name: "index",
  components:{
    topbar
  },
  data () {
    return {
      userList: [],
      topKeyword: "",
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    allSearchChange(val) {
      this.topKeyword = val;
      if (val && val.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')) {
        this.topIsSearch = true;
      } else {
        this.topIsSearch = false;
      }
    },
    getUserList() {
      getUserAll().then(res => {
        if(res.data.code == 0) {
          this.userList = res.data.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.company-page{
  padding: 20px 40px;
  height: calc(100vh - 80px);
  overflow-y: auto;
  .member{
    padding: 20px 100px;
    .member-content{
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      //height: 500px;
      overflow-y: auto;
      .member-item{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 80px;
        height: 80px;
        margin: 10px;
        img{
          border-radius: 20px;
          width: 40px;
          height: 40px;
        }
        .realName{
          //text-align: center;
          font-size: 12px;
        }
      }
    }
  }
  .introduce{
    padding: 20px 100px;
    .introduce-content{
      .version{
        font-size: 14px;
        margin-bottom: 40px;
      }
      .footer{
        margin: 40px 0;
      }
      p{
        font-size: 14px;
        line-height: 14px;
      }
      h3{
        font-size: 16px;
        line-height: 28px;
      }
    }
  }
}
</style>
