/**
 * wyQAQ
 * 1396871452@qq.com
 */
import Vue from 'vue'
export default {
  install (Vue, options) {
    // 打开链接 用于 预览、下载、打开地址
    Vue.prototype.$openUrl=function (url, type) {
      let typeTemp='_blank'
      if (type) {
        typeTemp=type
      }
      if (url) {
        let link=document.createElement('a')
        link.style.display='none'
        link.target=typeTemp
        link.href=url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }
}