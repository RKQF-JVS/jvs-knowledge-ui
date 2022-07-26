/**
 * 全站权限配置
 *
 */
import router from './router/router'
import store from '@/store'
import {validatenull} from '@/util/validate'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import PageRouter from './router/page/'
import ViewsRouter from './router/views/'
NProgress.configure({showSpinner: false})

const RList = [...PageRouter, ...ViewsRouter]
/**
 * 导航守卫，相关内容可以参考:
 * https://router.vuejs.org/zh/guide/advanced/navigation-guards.html
 */
router.beforeEach((to, from, next) => {
  // 缓冲设置
  if (to.meta.keepAlive === true && store.state.tags.tagList.some(ele => {
    return ele.value === to.fullPath
  })) {
    to.meta.$keepAlive = true
  } else {
    NProgress.start()
    if (to.meta.keepAlive === true && validatenull(to.meta.$keepAlive)) {
      to.meta.$keepAlive = true
    } else {
      to.meta.$keepAlive = false
    }
  }
  // 未配置的路由跳转404
  const value = to.query.src || to.fullPath
  
  if(!validatenull(value)) {
    let bool = false
    for(let i in RList) {
      if(RList[i].path == value || RList[i].path == value.split('?')[0]) {
        bool = true
      }
    }
    if(bool) {
      next()
    }else{
      next('/404')
    }
  }
})

router.afterEach(() => {
  NProgress.done()
  const title = store.getters.tag.label
  router.$jvsRouter.setTitle(title)
})
