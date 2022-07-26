import Vue from 'vue'
import VueRouter from 'vue-router'
import jvsRouter from './jvs-router'
import Store from '../store/'
import PageRouter from './page/'
import ViewsRouter from './views/'
Vue.use(VueRouter)
let Router = new VueRouter({
  // mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      }
    }
  },
  routes: [].concat([])
})
jvsRouter.install(Router, Store)
let routerTemp = [...ViewsRouter]
// 发送本地路由到服务端
let temp = []
for(let i in routerTemp) {
  temp.push({
    name: routerTemp[i].name,
    url: routerTemp[i].path
  })
}
sessionStorage.setItem('routerList', JSON.stringify(temp))
Router.addRoutes([...routerTemp, ...PageRouter])
export default Router
