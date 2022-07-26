<template>
  <div class="knowledge-index-page">
    <div v-if="systemJud">
      <p class="phoneSym">手机端暂不支持</p>
    </div>
    <div v-else>
      <topbar :fresh="fresh" @searchChange="searchChange" @searchClose="(boler)=>isSearch=boler" @fresh="freshHandle"></topbar>
      <div class="search-box" v-if="isSearch">
        <searchTool :keyword="keyword"></searchTool>
      </div>
      <div v-else>
        <baseInfo v-if="alreadyLogin"></baseInfo>
        <pageInfo v-else @fresh="freshHandle"></pageInfo>
      </div>
    </div>
    <el-dialog
      title="完善信息"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <jvs-form ref="phoneForm" :option="phoneOption" :formData="phoneForm" @submit="bindPhoneHandle">
        <template slot="codeForm">
          <div style="display:flex;align-items:center;">
            <el-input size="mini" v-model="phoneForm.code"></el-input>
            <jvs-button size="mini" style="margin-left: 10px;" :disabled="timeCountor != 300" @click="getPhoneCode">{{timeCountor != 300 ? (timeCountor +'s后重试') : '获取验证码'}}</jvs-button>
          </div>
        </template>
      </jvs-form>
    </el-dialog>
  </div>
</template>
<script>
import topbar from '@/views/common/topbar'
import store from '@/store'
import pageInfo from './page'
import baseInfo from './baseInfo'
import {isMobile} from '@/util/validate'
import searchTool from '@/views/common/search'
import { getStore } from "@/util/store.js";
import eventBus from "@/util/eventBus";
import { bindPhone, sendPhoneCode } from '@/api/newDesign'
export default {
  components: {topbar, pageInfo, baseInfo, searchTool},
  data () {
    var validatePhoneReg = (rule, value, callback) => {
      if(isMobile(value)) {
        callback();
      }else{
        callback(new Error('请输入正确的手机号'));
      }
    };
    return {
      systemJud:false,
      alreadyLogin: false,
      isSearch: false,
      keyword: '',
      fresh: false,
      dialogVisible: false,
      form: {},
      timeCountor: 300,
      timer: null,
      phoneForm: {},
      phoneOption: {
        cancal: false,
        submitLoading: false,
        column: [
          {
            label: '姓名',
            prop: 'name',
            rules: [
              { required: true, message: '请输入姓名', trigger: 'blur' },
            ]
          },
          {
            label: '手机号',
            prop: 'phone',
            rules: [
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { validator: validatePhoneReg, trigger: 'blur'}
            ]
          },
          {
            label: '验证码',
            prop: 'code',
            formSlot: true,
            rules: [
              { required: true, message: '请输入验证码', trigger: 'blur' }
            ]
          }
        ]
      },
    }
  },
  methods: {
    // 获取手机验证码
    getPhoneCode () {
      this.$refs.phoneForm.$refs.ruleForm.validateField('phone', (msg) => {
        if(msg == '') {
          if(this.timer) {
            clearInterval(this.timer)
            this.timeCountor = 300
          }
          let _this = this
          this.timer = setInterval(() => {
            _this.timeCountor -= 1
            if(_this.timeCountor == 0) {
              clearInterval(_this.timer)
              _this.timeCountor = 300
            }
          }, 1000);
          sendPhoneCode(this.phoneForm.phone).then(res => {}).catch(err => {
            if(this.timer) {
              clearInterval(this.timer)
            }
            this.timeCountor = 300
          })
        }
      })
    },
    // 绑定手机
    bindPhoneHandle (form) {
      this.phoneOption.submitLoading = true
      bindPhone(form).then(res => {
        if(res.data.code == 0) {
          store.dispatch('RefreshToken', store.getters.tenantId).then(res => {
            if (res) {
              this.setUserInfoData(res)
              location.reload()
              this.$message.success('绑定手机成功')
              this.phoneOption.submitLoading = false
              this.dialogVisible = false
              if(this.timer) {
                clearInterval(this.timer)
                this.timeCountor = 300
              }
            }
            // console.log(res)
          }).catch(e => {
          })
        }else{
          this.phoneOption.submitLoading = false
        }
      }).catch(e => {
        this.phoneOption.submitLoading = false
      })
    },
    // 登录成功写入数据
    setUserInfoData (data) {
      // this.$store.commit("SET_ACCESS_TOKEN", data.access_token);
      // this.$store.commit("SET_REFRESH_TOKEN", data.refresh_token);
      // this.$store.commit("SET_EXPIRES_IN", data.expires_in);
      // this.$store.commit("CLEAR_LOCK");
      this.$store.commit("SET_USER_INFO", data.userDto);
      // this.$store.commit("SET_ROLES", data.roles || []);
      // this.$store.commit("SET_PERMISSIONS", data.permissions || []);
      //
      // this.$store.commit("SET_TENANTId", data.userDto.tenantId);
      // this.$store.commit("DEL_ALL_TAG"); // 关闭之前打开的所有tag
      // this.$store.commit("SET_THEME_NAME", ""); // 清除主题
      // this.$store.commit("SET_TENANTINFO", data.userDto.tenant)
    },
    handleSubmit() {},
    handleClose() {
      this.dialogVisible = false
    },
    searchChange (val) {
      this.keyword = val
      if(val) {
        this.isSearch = true
      }else{
        this.isSearch = false
      }
    },
    // 判断是否手机端
    isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag;
    },
    // 刷新
    freshHandle (bool) {
      this.alreadyLogin = bool
      this.fresh = bool
      if (getStore({name: 'userInfo'})) {
        const user = JSON.parse(JSON.stringify(getStore({name: 'userInfo'})))
        if (!user.phone) {
          this.dialogVisible = true
        }
      }
    }
  },
  created () {
    if (getStore({name: 'userInfo'})) {
      const user = JSON.parse(JSON.stringify(getStore({name: 'userInfo'})))
      if (!user.phone) {
        this.dialogVisible = true
      }
    }
    if(getStore({name: 'userInfo'}) && getStore({name: 'tenantId'})) {
      this.alreadyLogin = true
    }
    if (this.isMobile()) {
      this.systemJud=true
    } else {
      this.systemJud=false
    }
    eventBus.$off("loginEvent")
    eventBus.$on("loginEvent", type => {
      switch(type) {
        case 'loginOut':
          sessionStorage.clear();
          localStorage.clear();
          this.alreadyLogin = false;
          this.$forceUpdate();
          break;
        default: ;break;
      }
    });
  },
  beforeDestory () {
    eventBus.$off("loginEvent")
  },
}
</script>
<style lang="scss" scoped>
.phoneSym{
  text-align: center;
  margin-top: 60%;
  color: #ec6d6d;
}
.knowledge-index-page{
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
.knowledge-index-page .search-box{
  padding: 40px 145px;
}

.get_code {
  line-height: 36px;
  color: #3471FF;
  cursor: pointer;
  margin-right: 5px;
  font-size: 14px;
}
</style>
