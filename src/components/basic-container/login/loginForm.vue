<template>
  <div>
    <el-dialog
      ref="loginComDialog"
      :modal="modal"
      :class="{'login-component-dialog': true, 'login-component-dialog-modal': modal}"
      :visible.sync="loginVisible"
      append-to-body
      :before-close="handleClose">
      <div class="jvs-loginCom" v-if="loginVisible" :style="setStyle">
        <div v-if="tenantVisible" :class="{'user-tenant-list': true}">
          <div v-if="tenantLoading" class="tenant-loading-back"></div>
          <p v-for="item in usertenantList" :key="'tenant-item'+item.id" @click="tenantLoginHandle(item)">
            <img v-if="item.icon" :src="item.icon" alt="" />
            <span v-else class="empty-logo-image">
              <i class="el-icon-office-building"></i>
            </span>
            <span>{{item.shortName}}</span>
          </p>
        </div>
        <div v-else class="login">
          <div class="login-top">
            <h5>{{formType == 'login' ? '欢迎登录' : '注册账号'}}</h5>
            <div class="top-right" v-if="formType == 'login'">
              <p class="code"></p>
              <i class="icon-erweima" v-if="loginType != 'weixin'" @click="changeType('weixin')"></i>
              <i class="el-icon-user-solid" v-if="loginType == 'weixin'" @click="changeType('namepass')"></i>
            </div>
          </div>
          <div class="login-center" v-if="!fresh">
            <!-- status-icon -->
            <el-form
              class="jvs-loginCom-form"
              :rules="loginRules"
              ref="loginForm"
              :model="loginForm"
              label-width="0"
            >
              <!-- 账号 -->
              <el-form-item
                prop="username"
                v-if="loginType == 'namepass' || loginType == 'register'"
                class="no-suffix"
              >
                <el-input
                  size="small"
                  @keyup.enter.native="handleLogin"
                  v-model="loginForm.username"
                  placeholder="请输入姓名"
                >
                  <i
                    slot="prefix"
                    class="el-icon-user-solid"
                  ></i>
                </el-input>
              </el-form-item>
              <!-- 手机号 -->
              <el-form-item
                prop="phone"
                v-if="loginType == 'phone' || formType == 'register'"
                class="no-suffix"
              >
                <el-input
                  size="small"
                  @keyup.enter.native="handleLogin"
                  v-model="loginForm.phone"
                  auto-complete="off"
                  placeholder="请输入手机号"
                >
                  <i
                    slot="prefix"
                    class="el-icon-mobile"
                  ></i>
                </el-input>
              </el-form-item>
              <!-- 密码 -->
              <el-form-item
                prop="password"
                v-if="loginType == 'namepass'"
                class="no-suffix"
              >
                <el-input
                  size="small"
                  @keyup.enter.native="handleLogin"
                  :type="passwordType"
                  v-model="loginForm.password"
                  auto-complete="off"
                  placeholder="请输入密码"
                >
                  <i
                    class="el-icon-view el-input__icon"
                    slot="suffix"
                    @click="showPassword"
                  ></i>
                  <i
                    slot="prefix"
                    class="el-icon-lock"
                  ></i>
                  <!-- icon-mima  -->
                </el-input>
              </el-form-item>

              <!-- 手机验证码 -->
              <el-form-item
                prop="code"
                v-if="loginType == 'phone' || loginType == 'register'"
                class="no-suffix"
              >
                <el-row :span="24">
                  <el-col :span="16">
                    <el-input
                      size="small"
                      @keyup.enter.native="handleLogin"
                      :maxlength="code.len"
                      v-model="loginForm.code"
                      auto-complete="off"
                      placeholder="请输入验证码"
                    >
                      <i
                        slot="prefix"
                        class="icon-yanzhengma"
                      ></i>
                    </el-input>
                  </el-col>
                  <el-col :span="8" class="code-row">
                    <el-button
                      v-if="loginType == 'register'"
                      class="codebtn"
                      size="mini"
                      :disabled="regcodeobj.disabled"
                      @click.native.prevent="getPhoneCode('regcodeobj')"
                    >{{regcodeobj.text}}</el-button>
                    <el-button
                      v-else
                      class="codebtn"
                      size="mini"
                      :disabled="yzmobj.disabled"
                      @click.native.prevent="getPhoneCode('yzmobj')"
                    >{{yzmobj.text}}</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <!-- 随机验证码 -->
              <el-form-item
                prop="namecode"
                v-if="false && loginType == 'namepass'"
                class="no-suffix"
              >
                <el-row :span="24">
                  <el-col :span="16">
                    <el-input
                      size="small"
                      @keyup.enter.native="handleLogin"
                      :maxlength="code.namecodelen"
                      v-model="loginForm.namecode"
                      auto-complete="off"
                      placeholder="请输入验证码"
                    >
                      <i
                        slot="prefix"
                        class="icon-yanzhengma"
                      ></i>
                    </el-input>
                  </el-col>
                  <el-col :span="8">
                    <div class="login-code">
                      <span
                        class="login-code-img"
                        @click="refreshCode"
                        v-if="code.type == 'text'"
                      >{{code.value}}</span>
                      <img
                        :src="code.src"
                        class="login-code-img"
                        @click="refreshCode"
                        v-else
                      />
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>



              <!-- 微信二维码登录 -->
              <div v-if="loginType == 'weixin'" @click="freshWeixin" style="width: 300px;height: 330px;position: absolute;left: 50%;margin-left: -150px;cursor:pointer;z-index: 9;">
              </div>
              <iframe id="weixinCode" v-if="loginType == 'weixin'" :src="'/auth/just/login/WECHAT_OPEN?url='+ callbackUrl" style="position: absolute;left: 50%;margin-left: -150px;cursor:pointer;width: 300px;min-height: auto;" scrolling="no"  frameborder="0" height="330"></iframe>
              <!-- <qr-code
                v-if="loginType === 'weixin' || loginType === 'app'"
                ref="QRCode"
                :ReqType="'login'"
                @submit='loginWX'
              ></qr-code> -->
              <!-- 按钮 -->
              <el-form-item>
                <el-button
                  type="primary"
                  size="small"
                  @click.native="handleLogin"
                  class="login-submit-button"
                  :loading="submitLoading"
                  v-if="formType == 'login' && loginType != 'weixin' && loginType != 'app' && loginType != 'third'"
                >登录</el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click.native="handleRegister"
                  class="login-submit-button"
                  :loading="submitLoading"
                  v-if="formType == 'register'"
                >注册</el-button>
              </el-form-item>
              <el-row v-if="loginType != 'weixin'" class="btntab">
                <p v-if="formType == 'login'">
                  <el-button
                    type="text"
                    size="small"
                    v-if="loginType != 'namepass' && hasLoginRight('password')"
                    @click.native.prevent="changeType('namepass')"
                  >账号密码</el-button>
                  <el-button
                    type="text"
                    size="small"
                    v-if="loginType != 'phone' && hasLoginRight('phone')"
                    @click.native.prevent="changeType('phone')"
                  >手机号登录</el-button>
                </p>
                <p v-else></p>
                <p>
                  <span v-if="formType == 'login'">没有账号？<jvs-button type="text" @click="changeFormType('register', 'register')">点击注册</jvs-button></span>
                </p>
              </el-row>
              <el-row class="note-text" v-if="formType == 'register'">
                <p>
                  <span>点击注册按钮将视为您同意<jvs-button type="text" @click="openRule">使用条款</jvs-button></span>
                </p>
                <p>
                  <span><jvs-button type="text" @click="changeFormType('namepass', 'login')">去登录</jvs-button></span>
                </p>
              </el-row>
              <el-row v-if="loginType != 'weixin' && formType == 'login'" class="other-type-item">
                <el-divider content-position="center">其他登录方式</el-divider>
                <p>
                  <img :src="wxImgIcon" alt="" @click="changeType('weixin')">
                </p>
              </el-row>
            </el-form>
          </div>
        </div>
        <div v-if="closeable ? true : false" class="close-button-icon">
          <i class="el-icon-circle-close" @click="handleClose"></i>
        </div>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import wxImg from './icon/wx.png'
import QRcode from "../../QRcode/index"
import { randomLenNum } from "@/util/util";
import { getPhone, getRegPhoneCode } from "@/api/login"
export default {
  components: { 'qr-code': QRcode},
  computed: {
    setStyle () {
      let style = ''
      if(this.right) {
        style += `right:${this.right};`
      }else{
        if(this.left) {
          style += `left: ${this.left};`
        }else{
          // style += `left: calc(50% - 230px);`
          style += `right: 150px;`
        }
      }
      if(this.top) {
        style += `top:${this.top};`
      }else{
        if(this.bottom) {
          style += `bottom:${this.bottom};`
        }else{
          style += `top: calc(50% - 300px);`
        }
      }
      return style
    },
    modal () {
      if(this.hasModal) {
        return true
      }else{
        return false
      }
    }
  },
  data() {
    var validateUserName = (rule, value, callback) => {
      if (value.length > 64) {
        callback(new Error('用户名不能超过64位字符'));
      } else {
        if(/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) {
          callback();
        }else{
          callback(new Error('用户名包含中英文、数字和下划线，且不能下划线开头结尾'));
        }
      }
    };
    return {
      wxImgIcon: wxImg,
      loginVisible: false,
      loginForm: {
        username: "", // "admin",
        password: "", // "123456",
        code: "",
        redomStr: "",
        // company: 1,
        phone: '',
        wxcode: "",
        namecode: ''
      },
      loginRules: {
        username: [
          { required: true, message: " ", trigger: "blur" },
          { validator: validateUserName, trigger: 'blur' }
        ],
        password: [
          { required: true, message: " ", trigger: "blur" },
          // { min: 6, message: "密码长度最少为6位", trigger: "blur" }
        ],
        phone: [{ required: true, message: " ", trigger: "blur" }],
        code: [
          { required: true, message: " ", trigger: "blur" },
          // { min: 6, max: 6, message: " ", trigger: "blur" }
        ],
        // namecode: [
        //   { required: true, message: " ", trigger: "blur" },
        //   { min: 4, max: 4, message: " ", trigger: "blur" }
        // ],
      },
      // loginType: 'namepass',
      loginType: 'weixin',
      passwordType: "password",
      loginTypes: [],
      submitLoading: false,
      code: {
        src: "/code",
        value: "",
        len: 6,
        namecodelen: 4,
        type: "image"
      },
      yzmobj: {
        text: '发送验证码',
        time: 180,
        disabled: false
      },
      regcodeobj: {
        text: '发送验证码',
        time: 180,
        disabled: false
      },
      qrType: 'weixin',
      formType: 'login', // register
      fresh: false,
      usertenantList: [], // 用户的租户列表
      tenantVisible: false, // 租户列表展示
      tenantLoading: false,
      randomString: '',
      callbackUrl: ''
    }
  },
  methods: {
    init () {
      this.loginVisible = true
      if(this.switchTenant) {
        this.tenantVisible = true
        this.usertenantList = this.switchList
      }else{
        this.$store.dispatch("LogOut")
      }
    },
    handleClose () {
      this.submitLoading = false
      this.tenantLoading = false
      this.loginVisible = false
    },
    resetLogin () {
      this.$refs.loginForm.resetFields()
      this.fresh = true
      this.$nextTick( () => {
        this.loginForm = {
          username: "",
          password: "",
          code: "",
          redomStr: "",
          phone: '',
          wxcode: "",
          namecode: ''
        }
        this.fresh = false
      })
    },

    hasLoginRight (type) {
      let bool = false
      if(this.loginTypes.indexOf(type) > -1) {
        bool = true
      }
      bool = true // 直接给！！！！！！！！！！
      return bool
    },
    showPassword () {
      this.passwordType == ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    // 切换登录方式
    changeType (type) {
      if (type !== 'weixin' && this.$refs.QRCode) {
        this.$refs.QRCode.clear()
      }
      this.loginType = type
      this.resetLogin()
      // this.getQRcodeUrl()
    },
    // 获取验证码
    getPhoneCode (attr) {
      if(this.loginForm.phone && !this.loginForm.phone.includes(" ")){
        let func = null
        if(this.loginType == 'register') {
          func = getRegPhoneCode
        }else{
          func = getPhone
        }
        if(func) {
          func({ phone: this.loginForm.phone }).then(({ data }) => {
            // console.log(data)
            if (data.code === 0) {
              this.$set(this[attr], 'disabled', true)
              let time = this[attr].time
              let setInt = setInterval(() => {
                time--
                if (time <= 0) {
                  this.$set(this[attr], 'disabled', false)
                  clearInterval(setInt)
                  this.$set(this[attr], 'text', '发送验证码')
                } else {
                  this.$set(this[attr], 'text', (time + "s重新发送") )
                }
              }, 1000)
            }
          }).catch(err => {
            this.refreshCode();
          })
        }
      }
    },
    // 获取二维码
    getQRcodeUrl (val) {
      let _this = this
      if (this.loginType === 'weixin') {
        setTimeout(() => {
          _this.$refs.QRCode.init(_this.qrType)
        }, 1)
      }
    },
    // 刷新验证码
    refreshCode () {
      this.loginForm.code = ''
      this.loginForm.randomStr = randomLenNum(this.code.len, true)
      this.code.type === 'text'
        ? (this.code.value = randomLenNum(this.code.len))
        : (this.code.src = `${this.codeUrl}?randomStr=${this.loginForm.randomStr}`)
    },
    // 登录提交
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.$store.dispatch("LoginByUsername", Object.assign({}, this.loginForm, { loginType: this.loginType, code: this.loginType === 'namepass' ? this.loginForm.namecode : this.loginForm.code })).then((data) => {
            this.getTenantByUserList(data)
          }).catch(() => {
            this.refreshCode()
            this.submitLoading = false
          })
        }
      });
    },
    // 微信登录成功回调
    loginWX (code, type) {
      if (type == 'weixin') {
        codeGetUserInfo({ code: code }).then(({ data }) => {
          if (data.code === 0) {
            wxOpenidLogin({ openId: data.data.openid })
              .then(response => {
                const data = response.data;
                // this.$store.commit("SET_ACCESS_TOKEN", data.access_token);
                // this.$store.commit("SET_REFRESH_TOKEN", data.refresh_token);
                // this.$store.commit("SET_EXPIRES_IN", data.expires_in);
                // this.$store.commit("CLEAR_LOCK");
                // this.$store.commit("SET_USER_INFO", data.userDto);
                // this.$store.commit("SET_ROLES", data.roles || []);
                // this.$store.commit("SET_PERMISSIONS", data.permissions || []);
                // this.$store.commit("SET_TENANTId", this.loginForm.company);
                // this.$router.push({ path: this.tagWel.value });
              })
              .catch(error => {
                // this.getQRcodeUrl()
              });
          }
        })
      } else {
        appLogin(code).then(response => {
          const data = response.data;
          // this.$store.commit("SET_ACCESS_TOKEN", data.access_token);
          // this.$store.commit("SET_REFRESH_TOKEN", data.refresh_token);
          // this.$store.commit("SET_EXPIRES_IN", data.expires_in);
          // this.$store.commit("CLEAR_LOCK");
          // this.$store.commit("SET_USER_INFO", data.userDto);
          // this.$store.commit("SET_ROLES", data.roles || []);
          // this.$store.commit("SET_PERMISSIONS", data.permissions || []);
          // this.$store.commit("SET_TENANTId", this.loginForm.company);
          // this.$router.push({ path: this.tagWel.value });
        })
          .catch(error => {
            // this.getQRcodeUrl()
          });
      }
    },
    // 获取该用户下所有的租户列表
    getTenantByUserList (data) {
      // console.log(data)
      let list = []
      if(data.userDto && data.userDto.tenants) {
        list = data.userDto.tenants
        if(list.length > 0) {
          // 只有一个租户直接进去
          if(list.length == 1) {
            this.$store.commit("SET_SwitchTenant", false)
            this.setUserInfoData(data)
            if(this.successClose !== false) {
              this.handleClose()
            }
            // 后续操作
            if(this.afterLogin) {
              this.afterLogin(this.$refs.loginComDialog, data)
            }
          }else{
            this.submitLoading = false
            this.usertenantList = list
            this.$store.commit("SET_SwitchTenant", true)
            this.tenantVisible = true
          }
        }
      }
    },
    // 切换租户登录
    tenantLoginHandle (item) {
      if(item.id) {
        this.tenantLoading = true
        this.$store.dispatch('RefreshToken', item.id).then(data => {
          if(data) {
            this.setUserInfoData(data)
            if(this.successClose !== false) {
              this.handleClose()
            }
            // 后续操作
            if(this.afterLogin) {
              this.afterLogin(this.$refs.loginComDialog, data)
            }
          }else{
            this.submitLoading = false
          }
        }).catch(() => {
          this.submitLoading = false
          this.tenantLoading = false
        });
      }
    },
    // 登录成功写入数据
    setUserInfoData (data) {
      this.$store.commit("SET_ACCESS_TOKEN", data.access_token);
      this.$store.commit("SET_REFRESH_TOKEN", data.refresh_token);
      this.$store.commit("SET_EXPIRES_IN", data.expires_in);
      this.$store.commit("CLEAR_LOCK");
      this.$store.commit("SET_USER_INFO", data.userDto);
      this.$store.commit("SET_ROLES", data.roles || []);
      this.$store.commit("SET_PERMISSIONS", data.permissions || []);

      this.$store.commit("SET_TENANTId", data.userDto.tenantId);
      this.$store.commit("DEL_ALL_TAG"); // 关闭之前打开的所有tag
      this.$store.commit("SET_THEME_NAME", ""); // 清除主题
      this.$store.commit("SET_TENANTINFO", data.userDto.tenant)
    },
    // 注册
    changeFormType (type, formtype) {
      this.loginType = type
      this.formType = formtype
      this.resetLogin()
    },
    // 注册提交
    handleRegister () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.$store.dispatch("LoginByUsername", Object.assign({}, this.loginForm, { loginType: this.loginType, code: this.loginType === 'namepass' ? this.loginForm.namecode : this.loginForm.code })).then((data) => {
            this.getTenantByUserList(data)
          }).catch(() => {
            this.refreshCode()
            this.submitLoading = false
          })
        }
      });
      // if(this.afterRegister) {
      //   this.afterRegister()
      // }
    },
    // 刷新二维码
    freshWeixin () {
      $('#weixinCode').attr('src', $('#weixinCode').attr('src'))
    },
    // 使用条款
    openRule () {
      this.$openUrl('/agreement/policies.html', '_blank')
    }
  },
  created () {
    this.callbackUrl = location.origin + '/%23/login/callback'
    this.refreshCode();
    let randomStr = Math.random() + ""
    this.randomString = '/' + (randomStr.slice(2, randomStr.length))
    localStorage.setItem('loginRandom', this.randomString)
  }
}
</script>
<style lang="scss">
.login-component-dialog{
  .el-dialog{
    overflow: hidden;
    background: none;
    box-shadow: none;
    width: 100%;
    height: 100vh;
    margin: 0!important;
    .el-dialog__header{
      display: none!important;
    }
    .el-dialog__body{
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;
    }
  }
  .jvs-loginCom{
    background: #FFFFFF;
    width: 460px;
    height: 600px;
    border-radius: 10px;
    position: absolute;
    h1,h2,h3,h4,h5,p{
      margin: 0;
      padding: 0;
    }
    .login{
      padding: 0 20px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      .login-top{
        overflow: hidden;
        h5{
          font-size: 30px;
          font-family: Source Han Sans CN;
          font-weight: 500;
          line-height: 30px;
          color: #3471FF;
          margin-top: 32px;
          margin-bottom: 27px;
        }
        .top-right{
          position: absolute;
          top: 1px;
          right: 1px;
          border-radius: 0 10px 0 0;
          overflow: hidden;
          cursor: pointer;
          .code{
            width: 0;
            height: 0;
            border-top: 88px solid #868BA1;
            border-left: 88px solid transparent;
            overflow: hidden;
          }
          i{
            position: absolute;
            font-size: 26px!important;
            top: 12px;
            right: 12px;
            color: #fff;
          }
        }
      }
      .login-center{
        margin-top: 23px;
        //.login-form {
        .jvs-loginCom-form{
          margin: 10px 0;
          i {
            color: #DCDFE6;
          }
          .el-form-item__content {
            width: 100%;
          }
          .el-form-item {
            margin-bottom: 25px;
          }
          .el-input {
            input {
              text-indent: 20px;
              background: transparent;
              border: none;
              color: #BFBFBF;
              height: 60px;
              border: 1px solid #DCDFE6;
              border-radius: 0;
              border-radius: 4px;
            }
            .el-input__prefix {
              i{
                margin-left: 12px;
                display: inline-block;
                padding: 0 5px;
                line-height: 60px;
                font-size: 25px;
              }
            }
          }
          .no-suffix {
            .el-input__suffix {
              display: none;
            }
          }
          .el-form-item.is-error{
            .el-input__inner{
              border-color: #F56C6C;
            }
          }
          .login-submit-button{
            width: 100%;
            height: 50px;
            background: #3471FF;
            color: #fff;
            font-size: 22px;
          }
          .code-row{
            height: 60px;
            margin: 0;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .codebtn{
              border: 0;
            }
            .codebtn:hover{
              color: #606266;
              background: none;
            }
          }
          .btntab{
            display: flex;
            align-items: center;
            justify-content: space-between;
            p{
              width: 50%;
              .el-button, span{
                font-size: 18px;
                font-family: Source Han Sans CN;
                font-weight: 400;
              }
            }
            p:nth-last-of-type(1){
              text-align: right;
            }
          }
          .note-text{
            font-size: 18px;
            color: #868BA1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            p:nth-of-type(1){
              flex: 1;
            }
            .el-button{
              font-size: 18px;
            }
          }
          .other-type-item{
            margin-top: 25px;
            .el-divider{
              .el-divider__text{
                font-size: 18px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: #868BA1;
              }
            }
            p{
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 46px;
              img{
                display: block;
                width: 50px;
                height: 50px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
    .user-tenant-list{
      padding: 0 10px;
      position: relative;
      p{
        width: 100%;
        height: 60px;
        overflow: hidden;
        margin: 0;
        padding: 0 10px;
        margin-top: 20px;
        cursor: pointer;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        background: #fff;
        border: 1px solid #EFF2F7;
        img{
          display: block;
          width: 40px;
          height: 40px;
          border: 0;
          //background: #868BA1;
          //margin-right: 10px;
          margin: 0 30px;
        }
        span{
          display: block;
          width: 200px;
          color: #fff;
          text-align: left;
          color: #333333;
        }
        .empty-logo-image{
          display: block;
          width: 40px;
          height: 40px;
          background: #EFF2F7; // #F6F6F6;
          text-align: center;
          //margin-right: 10px;
          margin: 0 30px;
          i{
            font-size: 24px;
            line-height: 40px;
            text-align: center;
            color: #868BA1;
          }
        }
      }
      p:hover{
        background: #EFF2F7;
      }
    }
    .user-tenant-list::-webkit-scrollbar{
      display: none;
    }
    .tenant-loading-back{
      position: absolute;
      width: 100%;
      height: 560px;
      top: 0;
      left: 0;
      box-sizing: border-box;
      background-color: rgba(255, 255, 255, 0.8);
      background-image: url('../../../../public/jvs-ui-public/img/loading.gif');
      background-repeat: no-repeat;
      background-position: center;
      background-position: center;
      //background-size: 450px 360px;
      background-size: 300px 240px;
    }
    // 关闭按钮
    .close-button-icon{
      text-align: center;
      margin-top: -30px;
      i{
        font-size: 24px;
        color: #BFBFBF;
      }
    }
  }
}
.login-component-dialog-modal{
  .el-dialog{
    position: unset;
    width: 50%;
    height: auto;
    .el-dialog__body{
      width: auto;
    }
  }
}
</style>
