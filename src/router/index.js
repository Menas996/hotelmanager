import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import admin from '../store/module/admin'

Vue.use(VueRouter)

const routes = [{
        //首页
        path: '/',
        //设置路由元信息
        meta: { title: "Bing酒店管理系统" },
        component: () =>
            import ("@v/Index.vue")
    }, {
        //登录页
        path: '/login',
        meta: { title: "登录页" },
        component: () =>
            import ('@v/Login.vue')
    },
    //后台管理布局页
    {
        path: '/layout',
        meta: { title: "Bing酒店管理系统" },
        component: () =>
            import ('@v/Layout.vue'),
        //配置嵌套路由
        children: [{
                path: '',
                meta: { title: "" },
                component: () =>
                    import ('@v/user/Home.vue')
            },
            {
                path: 'message',
                meta: { title: "系统消息" },
                component: () =>
                    import ('@v/user/Message.vue')


            },
            {
                path: 'email',
                meta: { title: "电子邮件" },
                component: () =>
                    import ('@v/user/Email.vue')


            },
            {
                path: 'mine',
                meta: { title: "个人中心" },
                component: () =>
                    import ('@v/user/Mine.vue')


            },
            {
                path: 'resetpwd',
                meta: { title: "修改密码" },
                component: () =>
                    import ('@v/user/ResetPwd.vue')


            },
            {
                //角色
                path: 'role',
                meta: { title: "角色管理", permission: [1] },
                component: () =>
                    import ('@v/role/RoleList.vue')
            }, {
                //账号
                path: 'admin',
                meta: { title: "账号管理" },
                component: () =>
                    import ('@v/admin/Admin.vue')

            }, {
                //客房类型
                path: 'roomtype',
                meta: { title: "客房类型管理", permission: [1] },
                component: () =>
                    import ('@v/roomType/RoomType.vue')
            }, {
                //客房类型
                path: 'room',
                meta: { title: "客房管理" },
                component: () =>
                    import ('@v/room/Room.vue')
            }, {
                //顾客管理
                path: "guest",
                meta: { title: "顾客管理" },
                component: () =>
                    import ('@v/guest/Guest.vue')


            }, {
                path: "permission",
                meta: { title: '权限管理', permission: [1] },
                component: () =>
                    import ('@v/permission/Permission.vue')
            }
        ]
    },
    {
        //*号，表示剩余的全部情况
        path: "*",
        component: () =>
            import ('@v/Error404.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


//路由前置守卫
router.beforeEach((to, from, next) => {
        //显示加载进度条


        NProgress.start()
        if (to.meta && to.meta.title) {
            document.title = to.meta.title
        }
        if (to.meta && to.meta.permission) {
            if (to.meta.permission.includes(parseInt(sessionStorage.getItem('roleId')))) {
                next()
            } else {
                router.push('/layout')
            }
        } else {
            next()
        }


    })
    //路由后置守卫
router.afterEach((to, from) => {
    NProgress.done()
})

export default router