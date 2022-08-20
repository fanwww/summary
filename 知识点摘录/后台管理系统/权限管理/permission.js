import router from './router'
// import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, clearUserCache } from '@/utils/myAuth'
// import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

import store from '@/store'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start()

    // set page title
    document.title = getPageTitle(to.meta.title)
    //     // shtest
    // next()
    // return
    // 获取token
    var token = getToken()

    if (token) {
        // 如果有token 且跳往 登录页面,则默认跳向主页
        if (to.path === '/login') {
            next('/')
            NProgress.done()
            return
        }
        // 判断权限
        if (store.state.user.asyncRoutes.length > 0) {
            // 把当前页面的路由权限存入vuex
            if (to.meta && to.meta.permissionValues) {
                store.commit('user/RESET_BTN_PERMI', to.meta.permissionValues)
            }
            next()
        } else {
            // 重新获取
            await store.dispatch('user/getInitMenus')
                .then(res => {
                    // 把当前页面的路由权限存入vuex
                    if (to.meta && to.meta.permissionValues) {
                        store.commit('user/RESET_BTN_PERMI', to.meta.permissionValues)
                    }

                    next(to.path)
                }).catch(err => {
                    // 如果code等于20001说明 路由有脏数据,需要初始化一次
                    if (err.code === 20001) {
                        Message.error('权限动态路由出错,请在资源管理初始化路由')
                        next()
                    } else {
                        Message.error('权限动态路由出错')
                        clearUserCache()
                        next('/login')
                    }
                    NProgress.done()
                })
        }
    } else {
        console.log('没有token')
        // 清下页面权限
        store.commit('user/CLEAR_BTN_PEREMI')
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next('/login')
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})
