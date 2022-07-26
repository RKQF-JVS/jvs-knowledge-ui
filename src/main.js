import 'babel-polyfill'
import 'classlist-polyfill'
import Vue from 'vue'
import axios from './router/axios'
import VueAxios from 'vue-axios'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './permission' // 权限
import './error' // 日志
import router from './router/router'
import store from './store'
import { loadStyle } from './util/util'
import { declare } from '@/views/common/draw'
import permissionMatch from './util/permision'
import openUrl from './util/url'
import loginForm from './util/login'
import * as urls from '@/config/env'
import {
  iconfontUrl,
  iconfontVersion
} from '@/config/env'
import * as filters from './filters' // 全局filter
import './styles/common.scss'
import './styles/resetAll.scss' // fixme 统一表单表格样式，自定义需要注释此代码
import './styles/reset2.0.scss' // 2.0版本ui迭代
import JsonViewer from 'vue-json-viewer'
import VueClipboard from 'vue-clipboard2'
import { ElementTiptapPlugin } from 'element-tiptap';
import 'element-tiptap/lib/index.css';
Vue.use(VueClipboard)

/**
 * 全局注册容器、组件
 * 不可删除，添加全局组件引用请修改index.js
*/ 
import './components/index'


import basicContainer from "@/components/basic-container/main";

// 注册全局容器
Vue.component("basicContainer", basicContainer);
Vue.prototype.$openLogin = loginForm.install

Vue.use(VueAxios, axios)

Vue.use(ElementUI, {
  size: 'medium',
  menuType: 'text'
})
Vue.use(JsonViewer)

Vue.use(router)

Vue.use(permissionMatch) // 权限
Vue.use(openUrl) // 打开链接 用于 预览、下载、打开地址
Vue.use(ElementTiptapPlugin, {
  lang: 'zh',
});


// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key]
})

//加载过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele))
})
declare()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  data: {
    eventBus: new Vue()
  }
}).$mount('#app')
