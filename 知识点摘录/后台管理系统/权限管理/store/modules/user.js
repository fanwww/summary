import loginApi from '@/api/login'
import router from '@/router'
import { resetRouter } from '@/router'
import Layout from '@/layout'

const getDefaultState = () => {
    return {
        asyncRoutes: [], // 当前用户拥有的权限菜单列表,构建的动态路由
        btnPermissions: [] // 页面按钮级别的路由权限
    }
}

const state = getDefaultState()

const mutations = {
    SET_ASYNC_ROUTES(state, asyncRoutes) {
        state.asyncRoutes = asyncRoutes
    },
    REMOVE_USERINFO(state) {
        state.asyncRoutes = []
        state.btnPermissions = []
        // todo 重置路由
    },
    RESET_BTN_PERMI(state, permissions) {
        state.btnPermissions = permissions
    },
    CLEAR_BTN_PEREMI(state) {
        state.btnPermissions = []
    }
}

const actions = {

    // 初始化菜单权限
    getInitMenus({ commit, state }) {
        // 利用返回的权限对象 构建路由对象
        function buildRoutes(routes, pList, pRoute) {
            for (var i = 0; i < pList.length; i++) {
                var p = pList[i]
                // 菜单
                if (p.type === 1) {
                    var route = {
                        path: p.path,
                        name: p.name
                    }
                    // 顶级路由
                    if (!p.component) {
                        route.component = Layout
                    } else {
                        // 页面路由  /content/article
                        var path = p.component.replace(/^@\/views/, '')
                        // 闭包+立即执行  防止path因为懒加载 只显示最后的值
                        // import 引入组件 不支持路径是变量
                        route.component = (path => {
                            return (resolve) => {
                                require([`@/views${path}`], resolve)
                            }
                        })(path)
                    }
                    // 重定向
                    if (p.redirect) {
                        route.redirect = p.redirect
                    }
                    if (p.meta) {
                        route.meta = JSON.parse(p.meta)
                    }
                    if (p.hidden) {
                        route.hidden = true
                    }
                    if (p.alwaysShow) {
                        route.alwaysShow = true
                    }
                    routes.push(route)
                    if (p.children && p.children.length > 0) {
                        route.children = []
                        // 递归
                        buildRoutes(route.children, p.children, route)
                    }
                } else {
                    // 按钮类型
                    delete pRoute.children
                    if (!pRoute.meta.permissionValues) {
                        pRoute.meta.permissionValues = []
                    }
                    pRoute.meta.permissionValues.push(p.permissionValue)
                }
            }
        }
        return new Promise((resolve, reject) => {
            loginApi.getInitMenus()
                .then(res => {
                    if (res.success) {
                        // asyncRoutes array
                        var routes = []
                        var pList = res.data.permissionList
                        // 构建动态路由
                        buildRoutes(routes, pList)
                        routes.push({ path: '*', redirect: '/404', hidden: true })
                        commit('SET_ASYNC_ROUTES', routes)
                        // 新增按钮显示权限bug
                        resetRouter()
                        router.addRoutes(routes)
                        resolve()
                    } else {
                        if (res.code === 20001) {
                            reject(res)
                        }
                    }
                })
        })
    }

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
