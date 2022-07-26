<template>
  <div class="knowledge-top-bar">
    <div class="left" @click="goHome">
      <img :src="logoImg" />
    </div>
    <div class="center" v-if="alreadyLogin">
      <el-input
        placeholder="请输入内容搜索"
        prefix-icon="el-icon-search"
        v-model="keyword"
        @keyup.enter.native="searchHandle(keyword)"
      >
      </el-input>
    </div>
    <div class="right">
<!--      <a>帮助中心</a>-->
      <jvs-button type="primary" v-if="!alreadyLogin" @click="goLogin">登录</jvs-button>
      <el-popover
        v-if="alreadyLogin"
        placement="bottom-start"
        width="50"
        trigger="hover"
      >
        <div class="top-tool-bar">
          <p v-if="false" @click="gojvs">
            <img :src="pcImg" />
            <span>进入后台</span>
          </p>
          <p @click="goCompanyInfo">
            <img :src="pcImg" />
            <span>企业信息</span>
          </p>
          <p @click="loginout">
            <img :src="outImg" />
            <span>退出登录</span>
          </p>
        </div>
        <img :src="userInfo.headImg ? userInfo.headImg : userImg" slot="reference" />
      </el-popover>
    </div>
  </div>
</template>
<script>
import logo from './img/logo.png'
import user from './img/user.png'
import pc from './img/pc.png'
import out from './img/out.png'
import { getStore } from "@/util/store.js"
import {loginoutHandle} from "@/api/login"
import eventBus from "@/util/eventBus";
export default {
  name: 'top-bar',
  props: {
    inKeyword: {
      type: String
    },
    fresh: {
      type: Boolean
    }
  },
  data () {
    return {
      logoImg: logo,
      userImg: user,
      pcImg: pc,
      outImg: out,
      keyword: '',
      alreadyLogin: false,
      userInfo: {}
    }
  },
  methods: {
    goHome () {
      if(this.$store.state.editStatus && this.$store.state.editStatus == 'ing') {
        this.$confirm('该文档存在改动, 是否保存?', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '放弃',
          type: 'warning'
        }).then(() => {
          eventBus.$emit('editSaveEvent', 'save')
          return false
        }).catch(() => {
          if(this.$route.path != '/index') {
            this.$router.push({path: '/index'})
          }else{
            this.$emit('searchClose', false)
            this.keyword = ''
          }
          this.$store.state.editStatus = 'end'
        });
      }else{
        if(this.$route.path != '/index') {
          this.$router.push({path: '/index'})
        }else{
          this.$emit('searchClose', false)
          this.keyword = ''
        }
      }
    },
    searchHandle (val) {
      if(this.$store.state.editStatus && this.$store.state.editStatus == 'ing') {
        this.$confirm('该文档存在改动, 是否保存?', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '放弃',
          type: 'warning'
        }).then(() => {
          eventBus.$emit('editSaveEvent', 'save')
          return false
        }).catch(() => {
          if(val.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')) {
            this.$emit('searchChange', val)
          }
          this.$store.state.editStatus = 'end'
        });
      }else{
        if(val.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')) {
          this.$emit('searchChange', val)
        }
      }
    },
    gojvs () {
      // location.href = location.host
      this.$openUrl(location.origin, '_self')
    },
    loginout () {
      this.$confirm("是否退出系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        loginoutHandle().then(res => {
          if(res.data.code == 0) {
            sessionStorage.clear()
            localStorage.clear()
            this.$store.dispatch("LogOut")
            if(this.$route.path != '/index') {
              this.$router.push({path: '/index'})
            }else{
              location.reload()
            }
          }
        })
      });
    },
    goLogin () {
      this.$openLogin({
        successClose: false,
        closeable: true,
        afterLogin: (dialog, res) => {
          console.log('登录提交。。。。。')
          dialog.handleClose()
          this.$emit('fresh', true)
          this.alreadyLogin = true
          this.userInfo = getStore({name: 'userInfo'})
        },
        afterRegister: () => {
          console.log('注册提交。。。。。')
        }
      })
    },
    goCompanyInfo() {
      this.$router.push({path: '/company'})
    }
  },
  created () {
    if(getStore({name: 'userInfo'}) && getStore({name: 'tenantId'})) {
      this.alreadyLogin = true
      this.userInfo = getStore({name: 'userInfo'})
    }else{
      this.alreadyLogin = false
      this.userInfo = {}
    }
    eventBus.$on("loginEvent", type => {
      switch(type) {
        case 'loginOut':
          sessionStorage.clear();
          localStorage.clear();
          this.alreadyLogin = false;
          this.userInfo = {}
          this.$forceUpdate();
          break;
        default: ;break;
      }
    });
  },
  watch: {
    keyword: {
      handler (newVal, oldVal) {
        this.searchHandle(newVal)
      }
    },
    inKeyword (newVal, oldVal) {
      if(!newVal) {
        this.keyword = ''
      }
    },
    fresh: {
      handler (newVal, oldVal) {
        if(newVal) {
          this.alreadyLogin = true
          this.userInfo = getStore({name: 'userInfo'})
        }else{
          this.alreadyLogin = false
        }
        console.log(newVal)
      }
    }
  }
}
</script>
<style lang="scss">
.knowledge-top-bar{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 50px;
  box-sizing: border-box;
  border-bottom: 1px solid #eeeeee;
  .left{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      height: 40px;
      display: block;
      cursor: pointer;
    }
  }
  .center{
    .el-input{
      width: 460px;
      height: 40px;
      .el-input__inner{
        height: 40px;
        line-height: 40px;
        border-radius: 30px;
        background: #F3F3F3;
        font-size: 14px;
        padding-left: 40px;
        border-color: #F3F3F3;
        outline: none;
      }
      .el-input__prefix{
        left: 15px;
        top: 2px;
        i{
          font-size: 20px;
          // line-height: 60px;
        }
      }
    }
  }
  .right{
    display: flex;
    align-items: center;
    a{
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      line-height: 31px;
      color: #333333;
      cursor: pointer;
    }
    .el-button{
      margin-left: 10px;
      background: #3471FF;
      font-size: 16px;
      width: 88px;
      height: 30px;
      line-height: 30px;
      padding: 0;
      span{
        display: block;
      }
    }
    img{
      display: block;
      width: 36px;
      height: 36px;
      margin-left: 20px;
      border-radius: 50%;
      overflow: hidden;
    }
  }
}
.top-tool-bar{
  padding:15px 0;
  p{
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 12px;
    margin: 0;
    line-height: 36px;
    img{
      display: block;
      width: 18px;
      //height: 18px;
      margin-right: 20px;
    }
    span{
      font-size: 16px;
      color: #222222;
    }
  }
}
.top-tool-bar p:hover{
  background: #F5F7FA;
}
.el-popper[x-placement^=right],.el-popper[x-placement^=bottom]{
  padding: 0!important;
}
</style>
