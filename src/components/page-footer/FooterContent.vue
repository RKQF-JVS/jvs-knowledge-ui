<template>
  <div class="footer-box">
    <div class="content-wrapper wrapped">
      <div class="link-box">
        <div class="link-map">
          <div class="link-item">
            <div class="link-item-img">
              <img class="logo" src="@/views/index/img/logo.png" alt="" />
              <img class="code-img" src="@/views/common/img/code.png" alt="" />
            </div>
          </div>
          <div class="link-item" style="margin-right: 200px">
            <div class="link-title">
              公司信息
            </div>
            <a target="_blank" style="margin-bottom: 0">团队介绍</a>
            <div class="company-info">
              <ul>
                <li>技术支持：13983607003</li>
              </ul>
            </div>
          </div>
          <div class="link-item">
            <div class="link-title">
              产品
            </div>
            <a v-for="(item, key) in productList" :href="item.url" :key="key" target="_blank">{{ item.label }}</a>
          </div>
          <div class="link-item">
            <div class="link-title">
              开发者
            </div>
            <a v-for="(item, key) in developers" :href="item.url" :key="key" target="_blank">{{ item.label }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FooterContent",
  data () {
    return {
      productList: [
        { label: '文档', url: 'http://knowledge.bctools.cn/' },
        { label: '会议', url: 'https://meeting.bctools.cn/' },
        { label: '邮件', url: 'http://mail.bctools.cn/' },
        { label: '开发服务平台', url: 'http://www.bctools.cn' }
      ],
      developers: [
        { label: '开放平台', url: 'http://www.bctools.cn' },
        { label: '开源地址', url: 'https://gitee.com/software-minister/jvs-knowledge-lib' },
        { label: '使用文档', url: 'http://knowledge.bctools.cn/' },
      ],
      companyList: [
        { label: '团队介绍' },
        { label: '技术支持：18996331515（微信、电话）' }
      ],
    }
  }
}
</script>

<style lang="scss">
.footer-box{
  position: relative;
  width: 100%;
  height: 320px;
  font-size: 13px;
  line-height: 18px;
  font-weight: 400;
  letter-spacing: normal;
  background-color: #282F3C;
  color: #ffffff;
  .content-wrapper{
    display: flex;
    flex-direction: column;
    .link-box{
      display: flex;
      padding: 40px 0;
      .link-map{
        //height: 200px;
        display: inline-flex;
        justify-content: space-around;
        width: 100%;
        .link-item{
          display: flex;
          flex-direction: column;
          min-width: 180px;
          margin-right: 220px;
          .yqCode{
            height: 160px;
          }
          .company-info{
            ul{
              padding: 0;
              li{
                //opacity: 0.6;
                color: #868BA1;
                line-height: 26px;
              }
            }
          }
          .link-title{
            font-size: 16px;
            line-height: 22px;
            letter-spacing: normal;
            display: flex;
            //font-weight: 800;
            margin-bottom: 12px;
          }
          a{
            color: #868BA1;
            margin-bottom: 12px;
            font-size: 13px;
            line-height: 20px;
            font-weight: 400;
            letter-spacing: normal;
            text-decoration: none;
            //opacity: 0.6;
            cursor: pointer;
          }:hover{
          opacity: 1;
                     }
        }:last-child{
        margin-right: 0;
                 }
        .link-item-img{
          text-align: center;
          .logo{
            //height: 80px;
            width: 180px;
            margin-bottom: 10px;
          }
          .code-img{
            width: 150px;
          }
        }
      }
    }
    .record-number{
      display: flex;
      //justify-content: space-between;
      flex-direction: row-reverse;
      padding: 40px 0;
      margin-right: 60px;
      .content{
        //opacity: 0.6;
        color: #868BA1;
      }
    }
  }
  .wrapped{
    margin: 0 auto;
    //width: 100%;
    max-width: 1380px;
    padding-left: 12px;
    padding-right: 12px;
  }
  .footer-info{
    position: absolute;
    bottom: 0;
    border-top: 1px solid #868BA1;
    width: 100%;
    .info-content{
      color: #868BA1;
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 60px;
      margin: 0 auto;
      max-width: 1380px;
      padding-left: 12px;
      padding-right: 12px;
      .info{
        min-width: 150px;
        margin-right: 80px;
      }
      .info-text{
        min-width: 150px;
        margin-right: 220px;
      }
      .logo{
        height: 40px;
      }
    }
  }
}
</style>
