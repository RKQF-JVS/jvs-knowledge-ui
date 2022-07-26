export default [
	{
        path: '/404',
        component: () =>
            import ( /* webpackChunkName: "page" */ '@/components/error-page/404'),
        name: '404',
        meta: {
            keepAlive: true,
            isTab: false,
            isAuth: false
        }
    },
    {
        path: '/login/callback',
        component: () =>
            import ( /* webpackChunkName: "page" */ '@/views/main/wx/login'),
        name: '微信扫码登录',
        meta: {
            keepAlive: true,
            isTab: false,
            isAuth: false
        }
    }
]
