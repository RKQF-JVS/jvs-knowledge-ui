export default [
  {
    path: "/page",
    name: "首页",
    component: () =>
      import(/* webpackChunkName: "page" */ "@/views/index/page"),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/',
    name: '首页',
    redirect: '/index'
  },
  {
    path: "/index",
    name: "首页",
    component: () =>import(/* webpackChunkName: "page" */ "@/views/index/index"),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/view",
    name: "预览",
    component: () =>
      import(/* webpackChunkName: "page" */ "@/views/view/index"),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/catalogview",
    name: "目录",
    component: () =>
      import(/* webpackChunkName: "page" */ "@/views/catalogview/index.vue"),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/info",
    name: "详情",
    component: () =>
      import(/* webpackChunkName: "page" */ "@/views/info/index.vue"),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/company",
    name: "企业信息",
    component: () =>
      import(/* webpackChunkName: "page" */ "@/views/companyInfo/index.vue"),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
];
