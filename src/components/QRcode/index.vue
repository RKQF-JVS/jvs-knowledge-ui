<!--  -->
<template>
  <div class='weixin'>
    <div
      class="weixincode"
      v-loading="URLLoading"
    >
      <img
        v-show="RQURL"
        :src="RQURL"
        @click="init"
      />
      <!-- <template v-if="ReqType==='bind'"> -->
      <div class="tips-box">
        <div v-if="showContent.title">{{showContent.title}}</div>
        <div v-if="showContent.content">{{bottomtext ? bottomtext :  showContent.content}}</div>
      </div>
      <!-- </template> -->
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { getQRcode, getCheck, appQrLogin, appCheck } from '@/api/login'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    loginType: { type: String, default: "" }, ReqType: { type: String, default: '' },
    bottomtext: {
      type: String,
      default: ''
    }
  },
  data () {
    // 这里存放数据
    return {
      // 二维码拿到的
      RQURL: '',
      URLLoading: false,
      isReq: false,
      getStatusSetInterval: null,
      UUID: '',
      showContent: {
        title: '',
        content: '请使用微信扫码登录'
      },
      qrType: 'weixin'
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    clear () {
      clearInterval(this.getStatusSetInterval)
    },
    init (type) {
      if (type) {
        this.qrType = type
      }
      this.showContent = {
        title: '',
        content: this.qrType == 'weixin' ? '请使用微信扫码登录' : '请使用APP扫码登录'
      }
      this.clear()
      this.isReq = false
      this.RQURL = '/auth/just/login/WECHAT_OPEN'
      // this.getQRcodeUrl()
    },
    getQRcodeUrl () {
      this.URLLoading = true
      if (this.qrType == 'weixin') {
        let query = {}
        if(this.$route && this.$route.query) {
          query = this.$route.query
        }
        getQRcode(query).then(res => {
          this.URLLoading = false
          if (res.data.code !== 500 && res.data.data) {
            this.RQURL = res.data.data.imgData
            this.UUID = res.data.data.wxUUID
            this.getStatusSetInterval = setInterval(() => {
              if (!this.isReq) {
                this.getLoginStatus()
              }
            }, 1000)
          }else{
            this.RQURL = 'https://tool.oschina.net/action/qrcode/generate?data=http%3A%2F%2F10.0.1.127%2F%23%2Flogin&output=image%2Fgif&error=L&type=0&margin=0&size=4'
          }
        }).catch(res => {
          console.log(res)
        })
      } else {
        appQrLogin().then(res => {
          this.URLLoading = false
          if (res.data.code !== 500) {
            this.RQURL = res.data.data.imgData
            this.UUID = res.data.data.appUUID
            this.getStatusSetInterval = setInterval(() => {
              if (!this.isReq) {
                this.getLoginStatus()
              }
            }, 3000)
          }
        })
      }
    },
    CheckImgExists (imgurl) {
      var ImgObj = new Image(); //判断图片是否存在  
      ImgObj.src = imgurl;
      //存在图片
      if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
        return true;
      } else {
        return false;
      }
    },
    getLoginStatus () {
      this.isReq = true
      if (this.qrType == 'weixin') {
        let time = new Date().getTime()
        getCheck({ uuid: this.UUID, '_': time }).then(res => {
          if (res.data.status === 405) {
            this.isReq = true
            clearInterval(this.getStatusSetInterval)
            this.$emit("submit", res.data.result.code, 'weixin')
          } if (res.data.status === 403) {
            clearInterval(this.getStatusSetInterval)
            this.init(this.qrType)
          } else if (res.data.status === 404) {
            this.showContent = res.data.msg
            this.isReq = false
          } else {
            this.isReq = false
          }
        }).catch(res => {
          this.isReq = false
        })
      } else {
        appCheck({ uuid: this.UUID, }).then(res => {
          // if (res.data.code == 0) {
          if (res.data.data.code == 0) {
            if (res.data.data.isLogin) {
              clearInterval(this.getStatusSetInterval)
              this.$emit("submit", {
                scanType: res.data.data.scanType,
                // userId: res.data.data.userId,
                uuid: this.UUID
              }, 'app')
            } else {
              this.isReq = false
            }
          } else {
            clearInterval(this.getStatusSetInterval)
            this.init(this.qrType)
          }
        }).catch(res => {
          this.isReq = false
        })
      }
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  },
  beforeCreate () { }, // 生命周期 - 创建之前
  beforeMount () { }, // 生命周期 - 挂载之前
  beforeUpdate () { }, // 生命周期 - 更新之前
  updated () { }, // 生命周期 - 更新之后
  beforeDestroy () { }, // 生命周期 - 销毁之前
  destroyed () { }, // 生命周期 - 销毁完成
  activated () { } // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.weixinlogin {
  width: 0;
  height: 0;
  border-top: 100px solid #c0c4cc;
  border-left: 100px solid transparent;
  position: absolute;
  top: 0;
  right: 0;
}
.weixin {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 340px;
}
.weixincode {
  // height: 300px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.tips-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  // background-color: #aca9a9;
  border-radius: 50px;
  height: 50px;
  box-sizing: border-box;
  color: #999;
}
</style>