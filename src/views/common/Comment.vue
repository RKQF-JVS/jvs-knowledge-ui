<template>
  <div class="communication">
    <ul style="position:relative">
      <li>
        <i class="iconfont icon-renyuan" style="color: #868ba1"></i>
        {{ pageInfo.author }}
      </li>
      <li>
        <i class="iconfont icon-yanjing" style="color: #868ba1"></i>
        {{ previewTimes }}
      </li>
      <li>
        <i class="iconfont icon-shijian" style="color: #868ba1"></i>
        {{ pageInfo.createTime }}
      </li>
      <li class="editRecord" style="margin-right:0">
        <i class="iconfont icon-icon" style="color: #868ba1;cursor:pointer;"></i>
        <span style="cursor:pointer;margin-left:5px;">编辑记录</span>
        <ul class="recordList">
          <li v-for="(item,i) in editList" :key="i">
            <span class="editName">{{item.userName}}</span>
            <span style="color:#868BA1">{{item.createTime}}</span>
          </li>
          <p v-if="!editList.length" style="text-align:center;margin-bottom:0">暂无编辑记录</p>
        </ul>
      </li>
    </ul>
    <div class="dianzan">
      <i
        :class="[
          show ? 'iconfont icon-dianzan active' : 'iconfont icon-dianzan',
        ]"
        @click="giveLike('LIBRARY', nodeInfo.id)"
      ></i>
      <p>若有收获，就点个赞吧</p>
      <figure v-for="(item, i) in likeList" :key="i" style="text-algin: center">
        <img :src="item.headImg ? item.headImg : userImg" alt="" />
        <figcaption>{{ item.realName }}</figcaption>
      </figure>
    </div>
    <h2>评论</h2>
    <div class="container">
      <p v-if="commentList.length == 0">暂无评论</p>
      <div class="commentData" v-for="(item, i) in commentList" :key="i">
        <img :src="item.headImg ? item.headImg : userImg" alt="" />
        <div style="margin-left: 70px;width:100%">
          <div style="display: flex; justify-content: space-between">
            <h3>{{ item.name }}</h3>
            <span class="rtime">{{item.createTime}}</span>
          </div>
          <p class="connt">
            {{ item.message }}
          </p>
          <i
            :class="[
              item.currentUserLike
                ? 'iconfont icon-dianzan active'
                : 'iconfont icon-dianzan',
            ]"
            @click="cmmitLick('COMMENT', item.id)"
          ></i>
          <sup>{{ item.likeTotal }}</sup>
          <span class="deleteTalk" @click="deleteMsg(item.id)" v-if="userIno.id==item.userId || userIno.id==nodeInfo.createById">
            <i class="iconfont icon-shanchu"></i>
            <span
              style="
                font-size: 16px;
                font-weight: 400;
                color: #868BA1;
                margin-left: 5px;
              "
              >删除</span
            >
          </span>
        </div>
      </div>
      <span v-if="commentList.length != 0 && size < total" @click="loadMore"
        >加载更多评论</span
      >
    </div>
    <div class="write">
      <img :src="userIno && userIno.headImg ? userIno.headImg : userImg" alt="" />
      <el-form ref="form" :model="form" :rules="rules" label-width="70px">
        <el-form-item prop="comment">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            v-model="form.comment"
            placeholder="发表评论..."
            resize="none"
            :rows="3"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">发表</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import "@/views/info/icon/iconfont.css";
import user from "@/views/common/img/user.png";
import {
  readNumber,
  getLike,
  giveGood,
  getComment,
  leaveMsg,
  delMsg,
  editLog
} from "@/views/common/api";
import { getStore } from "@/util/store.js";
export default {
  components: {},
  props: {
    nodeInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    pageInfo: {
      type: Object,
      default: () =>{
        return {};
      },
    },
  },
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('输入内容不能为空'));
      }else if($.trim(value)==''){
        return callback(new Error('输入内容不能为空'));
      }else{
        callback();
      }
    }
    return {
      userImg: user,
      form: {
        comment: "",
      },
      previewTimes: null, //预览次数
      likeList: [], //点赞列表
      editList:[],   //编辑列表
      commentList: [], //评论列表
      total: null, //评论总条数
      // userId:null,       //当前用户ID
      userIno: {},
      show: false,
      size: 5, //页条数
      rules: {
        comment: [
          { validator: checkAge, trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    // 删除留言
    deleteMsg(id){
      this.$confirm('确定要删除此评论吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        delMsg(id).then(res=>{
          if(res.data.code==0){
            this.getTalk(this.nodeInfo.id)
          }
        })
      }).catch(e=>{})
    },
    // 加载更多
    loadMore() {
      this.size += 5;
      this.getTalk(this.nodeInfo.id);
    },
    // 评论点赞方法
    cmmitLick(type, id) {
      giveGood({ bizType: type, bizResourceId: id }).then((res) => {
        if (res.data.code == 0) {
          this.getTalk(this.nodeInfo.id);
        }
      });
    },
    // 文件点赞方法
    giveLike(type, id) {
      giveGood({ bizType: type, bizResourceId: id }).then((res) => {
        if (res.data.code == 0) {
          this.getL({ bizType: "LIBRARY", bizResourceId: this.nodeInfo.id });
        }
      });
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
          if (valid) {
            // 添加留言
            let query = {
              knowledgeId: this.nodeInfo.id,
              message: this.form.comment,
            };
            leaveMsg(query).then((res) => {
              if (res.data.code == 0) {
                this.getTalk(this.nodeInfo.id);
                this.form.comment = "";
              }
            });
          } else {
            return false;
          }
        });
    },
    //获取文件已读次数
    readN(num) {
      readNumber(num).then((res) => {
        if (res.data.code == 0) {
          this.previewTimes = res.data.data;
        }
      });
    },
    // 获取文档编辑记录
    editData(num){
      editLog({id:num,size:1000}).then((res)=>{
        if (res.data.code == 0) {
          this.editList = res.data.data.records;
        }
      })
    },
    // 获取文件点赞列表
    getL(query) {
      getLike(query).then((res) => {
        if (res.data.code == 0) {
          this.likeList = res.data.data;
          if (this.likeList.length > 0) {
            for(var i=0;i<this.likeList.length;i++){
              if (this.likeList[i].userId == this.userIno.id) {
                this.show = true;
                break;
              } else {
                this.show = false;
              }
            }
          } else {
            this.show = false;
          }
        }
      });
    },
    //获取文档留言分页
    getTalk(num) {
      getComment(num, { size: this.size, currentPage: 1 }).then((res) => {
        if (res.data.code == 0) {
          this.commentList = res.data.data.records;
          this.total = res.data.data.total;
        }
      });
    },
  },
  created() {
    this.userIno = getStore({ name: "userInfo" });
    this.readN(this.nodeInfo.id);
    this.editData(this.nodeInfo.id);
    this.getL({ bizType: "LIBRARY", bizResourceId: this.nodeInfo.id });
    this.getTalk(this.nodeInfo.id);
  },
};
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  margin-bottom: 0;
}
.communication {
  font-size: 14px;
  padding: 40px 40px 78px;
  border-top: 1px solid #eeeeee;
}
.communication>ul>li {
  display: inline-block;
  margin-right: 80px;
}
.recordList{
  position: absolute;
  z-index: 1;
  top: 0;
  display: none;
  vertical-align:text-top;
  padding: 10px 0;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  width: 300px;
  max-height: 230px;
  background: #FFFFFF;
  overflow: auto;
}
.communication .recordList li{
  display: flex;
  justify-content: space-between;
  line-height: 36px;
  font-size: 14px;
  font-family: SourceHanSansCN-Regular;
  padding: 0 20px;
}
.communication .recordList .editName{
  color: #333333;
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.communication .recordList li:hover{
  background: #F6F6F6;
}
.communication .editRecord:hover .recordList{
  display: inline-block;
}
.dianzan {
  text-align: center;
}
.dianzan .icon-dianzan {
  display: inline-block;
  margin-top: 90px;
  font-size: 50px;
  line-height: 70px;
  color: #ebecee;
  cursor: pointer;
}
.dianzan .active {
  color: rgb(6, 101, 255);
}
.dianzan p {
  font-size: 16px;
  color: #868ba1;
  margin-top: 20px;
  margin-bottom: 40px;
}
.dianzan figure {
  display: inline-block;
  margin: 0 20px;
}
.dianzan img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.communication h2 {
  margin: 60px 0 30px 0;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
}
.container > span {
  color: #0062ff;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
}
.commentData {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
}
.commentData .icon-dianzan {
  color: #ebecee;
  font-size: 20px;
  cursor: pointer;
}
.commentData .active {
  color: rgb(6, 101, 255);
}
.commentData .icon-shanchu {
  font-size: 20px;
  margin-left: 20px;
}
.commentData img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position:absolute;
  top: 0;
  left: 0;
}
.commentData .connt {
  max-width: 1454px;
  word-wrap: break-word;
  font-size: 16px;
  line-height: 26px;
  color: #868ba1;
  margin-bottom: 15px;
}
.commentData .rtime {
  font-size: 16px;
  color: #868ba1;
}
.commentData h3 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 9px;
}
.commentData .deleteTalk{
  cursor: pointer;
  color: #EBECEE;
}
.commentData .deleteTalk:hover{
  color: #868BA1;
}
.write {
  margin-top: 30px;
}
.write > img {
  float: left;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-textarea {
  width: 1000px;
}
</style>
