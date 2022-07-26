<template>
  <div class="catalogview">
    <div class="top">
      <div class="left">
        <figure>
          <img src="@/views/catalogview/img/folder.png" alt="" />
          <figcaption>{{ this.nodeInfo.name }}</figcaption>
          <span>共计{{ fileNum }}篇</span>
        </figure>
        <div class="line1"></div>
        <el-input
          class="serch"
          placeholder="搜索当前目录内容"
          prefix-icon="el-icon-search"
          v-model="folderSerch"
          @keyup.enter.native="searchHandle"
        >
        </el-input>
      </div>
      <img src="@/views/catalogview/img/folder-logo.png" alt="" />
    </div>
    <div class="search-boxss" v-if="isSearch">
      <searchTool
        :id="nodeInfo.id + ''"
        :keyword="folderSerch"
        @openDoc="openDoc"
      ></searchTool>
    </div>
    <div v-else>
      <h2>最近更新</h2>
      <div class="container">
        <p v-if="updateList.length==0" style="font-size:16px">暂无更新</p>
        <div
          class="commentData"
          v-for="(item, i) in updateList"
          :key="i"
          @click="openFile(item)"
        >
          <div style="display: flex; align-items: center">
            <img :src="item.headImg ? item.headImg : userImg" alt="" />
            <div class="coContent">
              <h3>{{ item.realName }}</h3>
              <p>更新了 "{{ item.name }}"文件</p>
            </div>
          </div>
          <div class="time">
            <i class="iconfont icon-shijian" style="color: #868ba1"></i>
            {{ item.createTime }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import user from "@/views/common/img/user.png";
import { getLibEditLog } from "@/views/view/api";
import searchTool from "@/views/common/search";
import "@/views/info/icon/iconfont.css";
export default {
  props: {
    nodeInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: { searchTool },
  data() {
    return {
      userImg: user,
      folderSerch: "",
      updateList: [],
      isSearch: false,
      fileNum: 0, //文件数
    };
  },
  methods: {
    download() {
      // console.log('1')
    },
    // 搜索
    searchHandle() {
      if (this.folderSerch && this.folderSerch.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')) {
        this.isSearch = true;
      } else {
        this.isSearch = false;
      }
    },
    openDoc(item) {
      this.$emit("openDoc", item);
      this.isSearch = false;
    },
    openFile(item) {
      this.$emit("openFile", item);
    },
  },
  created() {
    let list = [];
    let run = function (data) {
      if(data){
        data.forEach((item) => {
          list.push(item);
          if (item.children) {
            run(item.children);
          }
        });
      }
    };
    run(this.nodeInfo.children);
    let newList = list.filter((item) => !item.children);
    this.fileNum = newList.length;

    getLibEditLog({ id: this.nodeInfo.id, size: 10 }).then((res) => {
      if (res.data.code == 0) {
        this.updateList = res.data.data;
      }
    });
  },
  watch: {
    folderSerch: {
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
.catalogview {
  padding: 40px;
}
.catalogview .top {
  display: flex;
  justify-content: space-between;
}
.catalogview .search-boxss{
  padding: 30px 40px;
}
.catalogview .top figure {
  display: flex;
  align-items: center;
}
.catalogview .top figure span {
  font-size: 20px;
  color: #868ba1;
  margin-left: 40px;
  white-space: nowrap;
}
figcaption {
  margin-left: 33px;
  min-width: 300px;
  max-width: 600px;
  font-size: 30px;
  font-weight: 400;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.serch {
  width: 389px;
  height: 45px;
  margin-top: 40px;
}
/deep/.serch > .el-input__inner {
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
/deep/.serch > .el-input__prefix {
  left: 15px;
}
/deep/.serch > .el-input__prefix i {
  font-size: 20px;
  line-height: 45px;
}
.line1 {
  height: 1px;
  background: #eeeeee;
  margin-top: 70px;
}
.catalogview h2 {
  font-size: 20px;
  font-weight: 500;
  margin: 30px 0;
}
.commentData {
  display: flex;
  justify-content: space-between;
  align-items: center;
  //margin-bottom: 30px;
  //background: #f6f6f6;
  padding: 10px 20px;
  cursor: pointer;
  &:hover{
    background: #EFF2F7;
  }
}
.commentData img {
  //margin-top: -24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.commentData .coContent {
  margin-left: 30px;
  width: 100%;
}
.commentData .coContent h3 {
  font-size: 20px;
  line-height: 25px;
  font-weight: 500;
  margin-bottom: 0;
}
.commentData .coContent p {
  font-size: 14px;
  line-height: 25px;
  font-weight: 400;
  margin-bottom: 0;
  //margin-top: 17px;
  width: 100%;
  color: #868ba1;
}
.commentData .time {
  font-size: 14px;
  color: #868ba1;
}
</style>
