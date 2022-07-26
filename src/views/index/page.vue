<template>
  <div class="not-login-page">
    <div class="banner">
      <div class="text-desc">
        <h4>企业内部在线文档</h4>
        <section>
          解决企业文档碎片化痛点，支持私有化部署，支持SaaS模式与PaaS模式，支持二次开发，可扩展应用
        </section>
        <jvs-button type="primary" :round="true" @click="goLogin">立即登录</jvs-button>
      </div>
    </div>
    <div class="entry">
      <div class="title">
        <h5>产品价值</h5>
        <span
          >超级富文本，让文档表达更加简单通透，让操作更加简单易用</span
        >
      </div>
      <div class="list">
        <div class="list-item" v-for="item in entryList" :key="item.title">
          <img :src="item.img" />
          <p>
            <b>{{ item.title }}</b>
            <span>{{ item.text }}</span>
          </p>
        </div>
      </div>
      <div class="bottom">
        <img :src="bottomImg" />
        <div>
          <h5>文档协同，让文档流转非常简单</h5>
          <p>协作：团队高效协作</p>
          <p>分享：多种分享模式</p>
          <p>交流：支持“@”与评论</p>
          <p>权限：文档权限化管理</p>
        </div>
      </div>
    </div>
    <FooterContent/>
  </div>
</template>
<script>
import note from "./img/note.png";
import pro from "./img/pro.png";
import doc from "./img/doc.png";
import sucai from "./img/sucai.png";
import yun from "./img/yun.png";
import caozuo from "./img/caozuo.png";
import img from "./img/img.png";
import FooterContent from "../../components/page-footer/FooterContent";
export default {
  components: {FooterContent},
  data() {
    return {
      entryList: [
        {
          img: note,
          title: "简单",
          text: "去除传统office中复杂的编辑",
        },
        {
          img: pro,
          title: "丰富",
          text: "脑图、画图、图表、甘特图等",
        },
        {
          img: doc,
          title: "扩展",
          text: "支持三方形态接内容入方式",
        },
        {
          img: sucai,
          title: "记录",
          text: "生命痕迹，编辑、阅读、分享",
        },
        {
          img: yun,
          title: "模板",
          text: "多种文档记录模板，快速高效",
        },
        {
          img: caozuo,
          title: "搜索",
          text: "提供强大的文库内容搜索引擎",
        },
      ],
      bottomImg: img,
    };
  },
  methods: {
    goLogin() {
      this.$openLogin({
        successClose: false,
        closeable: true,
        afterLogin: (dialog, res) => {
          console.log('登录提交。。。。。')
          dialog.handleClose()
          this.$emit('fresh', true)
        },
        afterRegister: () => {
          console.log('注册提交。。。。。')
        }
      })
    },
  },
};
</script>
<style lang="scss">
.not-login-page {
  width: 100%;
  .banner {
    height: 39vw;
    background-image: url("./img/banner.png");
    background-repeat: no-repeat;
    background-size: 100%;
    position: relative;
    display: flex;
    align-items: center;
    .text-desc {
      //position: absolute;
      //left: 260px;
      //top: 219px;
      margin-left: 10vw;
      h4 {
        font-size: 42px;
        color: #0f1633;
        line-height: 82px;
        margin: 0;
        font-family: Source Han Sans CN;
        font-weight: 500;
      }
      section {
        width: 482px;
        font-size: 24px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        line-height: 41px;
        color: #0f1633;
      }
      .el-button {
        width: 180px;
        height: 50px;
        background: linear-gradient(129deg, #3471ff 0%, #5386ff 100%);
        border-radius: 25px;
        margin-top: 58px;
        padding: 0;
        span {
          font-size: 20px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          line-height: 34px;
          color: #ffffff;
        }
      }
    }
  }
  .entry {
    margin-top: 100px;
    .title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 30px;
      h5 {
        width: 200px;
        margin: 0;
        text-align: center;
        height: 36px;
        font-size: 36px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        line-height: 61px;
        color: #0f1633;
        border-bottom: 10px solid #3471ff;
        margin-bottom: 30px;
      }
      span {
        font-size: 22px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        line-height: 37px;
        color: #868ba1;
      }
    }
    .list {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      .list-item {
        //width: 650px;
        //height: 250px;
        //width: 580px;
        //height: 180px;
        width: 30vw;
        height: 18vh;
        background: #f4f6fb;
        //border-radius: 0px 80px 0px 80px;
        border-radius: 0 8vh 0 8vh;
        display: flex;
        align-items: center;
        margin: 0 50px;
        margin-top: 30px;
        justify-content: space-around;
        img {
          display: block;
          //width: 110px;
          //height: 110px;
          width: 10vh;
          //margin-left: 50px;
        }
        p {
          //margin-left: 100px;
          display: flex;
          flex-direction: column;
          b {
            font-size: 24px;
            //font-size: 30px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            line-height: 51px;
            color: #0f1633;
          }
          span {
            //font-size: 24px;
            font-size: 18px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            line-height: 41px;
            color: #868ba1;
          }
        }
      }
    }
    .bottom {
      margin-top: 100px;
      margin-bottom: 50px;
      height: 400px;
      display: flex;
      padding: 0 40px;
      //justify-content: center;
      justify-content: space-around;
      align-items: center;
      img {
        display: block;
        width: 28.125vw;
        //height: 333px;
        //margin-right: 166px;
      }
      div {
        width: 710px;
        margin: 0;
        h5,
        p {
          margin: 0;
        }
        h5 {
          display: block;
          //height: 42px;
          font-size: 42px;
          font-family: Source Han Sans CN;
          font-weight: 500;
          line-height: 60px;
          color: #0f1633;
          letter-spacing: 5px;
          margin-bottom: 30px;
        }
        p {
          display: block;
          font-size: 24px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          line-height: 41px;
          color: #868ba1;
          letter-spacing: 5px;
        }
      }
    }
  }
}
</style>
