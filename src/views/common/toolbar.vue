<template>
  <div class="knowledge-tool-bar">
    <!-- , 'directory' -->
    <!-- <p v-if="['knowledge'].indexOf(nodeInfo.type) > -1">
      <el-button
        style="padding: 0;"
        type="text"
        @click="onCopy"
        v-clipboard:copy="getpageUrl(nodeInfo)"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
        size="mini"
      ><i class="el-icon-share"></i></el-button>
    </p> -->
    <p @click="peopleSet" v-if="nodeInfo.type == 'knowledge'">
      <i class="el-icon-s-custom"></i>
    </p>
    <p @click="set" v-if="nodeInfo.type == 'knowledge'">
      <i class="el-icon-s-tools"></i>
    </p>
    <el-dialog :visible.sync="dialogVisible" top="6vh" :class="{'dialog form-fullscreen-dialog': true, 'personDialog': dialogType == 'person'}" :append-to-body="true" :before-close="handleClose">
      <span slot="title" class="dialogHeader">
        <div class="dialogLine"></div>
        <span>{{ title }}</span>
        <jvs-button v-if="dialogType == 'person' && hasRight" type="primary" size="mini" style="position: absolute;right: 50px;" @click="addNewMember">
          <i class="el-icon-plus"></i>点击邀请
        </jvs-button>
        <div v-if="dialogType != 'person'" class="line-box"></div>
      </span>
      <KnowSet v-if="dialogType == 'set'" :nodeInfo="nodeInfo" :hasRight="hasRight" @close="closeHandle"></KnowSet>
      <MemberSet v-if="dialogType == 'person'" :nodeInfo="nodeInfo" :addNew="addNew" @close="closeHandle"></MemberSet>
    </el-dialog>
  </div>
</template>
<script>
import KnowSet from '@/views/common/KnowSet.vue'
import MemberSet from '@/views/common/MemberSet.vue'
export default {
  components: {KnowSet,MemberSet},
  props: {
    id: {
      type: String,
    },
    nodeInfo: {
      type: Object
    },
    hasRight: {
      type: Boolean
    }
  },
  data() {
    return {
      dialogVisible: false,
      title: "",
      dialogType: '', // share  person  set
      addNew: -1
    };
  },
  methods: {
    set() {
      this.title = "文档设置";
      this.dialogType = 'set'
      this.dialogVisible = true;
    },
    peopleSet(){
      this.title = "文档人员设置";
      this.dialogType = 'person'
      this.dialogVisible = true;
    },
    handleClose () {
      if(this.dialogType == 'person') {
        this.$emit('fresh', true)
      }
      this.dialogVisible = false;
      this.dialogType = ''
    },
    closeHandle (data) {
      if(data) {
        this.handleClose()
        this.$emit('fresh', data)
      }
    },
    addNewMember () {
      this.addNew = Math.random()
    },
    // 生成地址
    getpageUrl (row) {
      let str = location.origin
      str += (`/jvs-knowledge-ui/#/view?id=${row.id}&type=${row.type}`)
      return str
    },
    // 复制
    onCopy (e) {
      // console.log(e.text)
    },
    onError (e) {
      // console.log(e)
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.knowledge-tool-bar {
  display: flex;
  padding: 10px 0;
  background: #fff;
  box-shadow: 0 0 15px #dcdada;
  p {
    margin: 0;
    margin-left: 10px;
    border-right: 1px solid #eeeeee;
    padding-right: 10px;
    i {
      font-size: 22px;
      color: #c7c7c7;
      cursor: pointer;
    }
  }
  p:nth-last-of-type(1) {
    border: 0;
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
</style>
<style lang="scss">
.dialog{
  .el-dialog{
    .el-dialog__header{
      position: relative;
      .dialogHeader{
        .line-box{
          position: absolute;
          bottom: 0;
          left: 20px;
          width: calc(100% - 40px);
          height: 1px;
          background: #DCDFE6;
        }
      }
    }
    .el-dialog__body{
      padding: 0 20px;
      margin-top: 10px;
      padding-bottom: 30px;
    }
  }
}
.personDialog{
  .el-dialog{
    .el-dialog__header{
      .el-dialog__headerbtn{
        margin-top: 3px;
        .el-dialog__close{
          font-size: 24px;
        }
      }
    }
    .el-dialog__body{
      padding: 0 20px;
      padding-bottom: 30px;
    }
  }
}
</style>
