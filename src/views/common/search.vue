<template>
  <div class="knowledge-search-com">
    <h5 v-if="listData && listData.length > 0" class="total-title">找到<b>{{listData.length}}</b>个结果</h5>
    <div v-if="!listData || listData.length == 0" class="empty-search-box">
      <span>抱歉，没有找到相关搜索内容！</span>
    </div>
    <div class="search-list" style="margin-top:30px">
      <div class="search-list-item" v-for="(item, index) in listData" :key="'search-list-item'+index+'-'+item.docId">
        <div class="search-list-item-top">
          <div>
            <img :src="getIcon(item.type) || libiconImg" @click="openItem(item)" />
            <p v-html="item.name" @click="openItem(item)"></p>
          </div>
          <div class="search-list-item-top-right">
            <div class="time-info" v-if="id">
              <p>
                <i class="el-icon-user"></i>
                <span>{{item.authorName}}</span>
              </p>
              <p>
                <i class="el-icon-time"></i>
                <span>{{item.createTime}}</span>
              </p>
            </div>
            <p v-else>{{item.knowledgeName}}</p>
          </div>
        </div>
        <section v-if="item.content!=''" v-html="item.content"></section>
        <div class="time-info" v-if="!id">
          <p>
            <i class="el-icon-user"></i>
            <span class="nameWidth">{{item.authorName}}</span>
          </p>
          <p>
            <i class="el-icon-time"></i>
            <span>{{item.createTime}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import libicon from './img/libitem.png'
import {documentSearch} from './api'
import {imgIcon} from '../my/icon/index'
export default {
  components: {},
  props: {
    keyword: {
      type: String
    },
    id: {
      type: String
    }
  },
  data () {
    return {
      libiconImg: libicon,
      listData: [],
      imgIconList: imgIcon,
    }
  },
  methods: {
    documentSearchHandle (params) {
      documentSearch(params).then(res => {
        // console.log(res)
        if(res.data.code == 0) {
          let temp = res.data.data.records
          this.listData = temp
        }
      })
    },
    searchHandle () {
      let obj = {}
      if(this.id) {
        obj.knowledgeId = this.id
      }
      if(this.keyword) {
        obj.keyword = this.keyword
      }
      let str = obj.keyword.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')
      if(str) {
        obj.keyword = str
        this.documentSearchHandle(obj)
      }
    },
    openItem (item) {
      if(this.$route.path == '/index') {
        this.$router.push({path: `/view?id=${item.knowledgeId}&docId=${item.docId}&type=${item.type}`})
      }else{
        this.$router.push({path: `/view?id=${item.knowledgeId}&docId=${item.docId}&type=${item.type}`,query:{id:item.knowledgeId,docId:item.docId,type:item.type}})
        this.$emit('openDoc', item)
      }
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
        default: src = this.imgIconList.file;break;
      }
      return src
    },
  },
  created () {
    this.searchHandle()
  },
  watch: {
    keyword: {
      handler (newVal, oldVal) {
        if(newVal != oldVal) {
          this.searchHandle()
        }
      }
    }
  }
}
</script>
<style lang="scss">
.knowledge-search-com{
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  // padding: 40px 145px;
  box-sizing: border-box;
  .total-title{
    margin: 0 0 0 20px;
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: 500;
    line-height: 20px;
    color: #333333;
    b{
      color: #0062FF;
    }
  }
  .empty-search-box{
    width: 100%;
    height: 370px;
    background-image: url('../../const/img/emptyImage.png');
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    span{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      top: calc(50% + 100px);
      width: 100%;
      height: 32px;
      line-height: 32px;
      text-align: center;
      color: #909399;
      font-size: 12px;
    }
  }
  .search-list-item{
    padding: 25px 20px;
    .search-list-item-top{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    div{
      display: flex;
      align-items: center;
      img{
        display: block;
        width: 20px;
        height: 22px;
        margin-right: 20px;
        cursor: pointer;
      }
      p{
        font-size: 18px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        line-height: 25px;
        color: #333333;
        margin: 0;
        cursor: pointer;
      }
    }
    .search-list-item-top-right{
      p{
        cursor: text;
      }
    }
    section{
      height: 50px;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      line-height: 25px;
      color: #868BA1;
      margin-top: 27px;
      width: 100%;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    em {
      color: #0062FF;
      font-style: normal;
    }
    .time-info{
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
      p{
        display: flex;
        align-items: center;
        margin-left: 30px;
        height: 25px;
        line-height: 25px;
        i, span{
          font-size: 14px;
          color: #868BA1;
        }
        i{
          margin-right: 10px;
          font-size: 16px!important;
        }
        .el-icon-user{
          font-size: 18px!important;
        }
        .nameWidth{
          width: 60px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .search-list-item:hover{
    background: #F6F6F6;
  }
}

</style>
