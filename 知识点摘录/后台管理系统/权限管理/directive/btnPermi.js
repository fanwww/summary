import store from '@/store'
/**
 * 自定义权限指令 需要配合导航守卫  在vuex存入当前页面的路由权限
 */
export default {
  inserted(el, binding, vnode) {
    // 权限标识
    var flag = binding.arg
    console.log('flag===', flag)
    if (!flag) {
      el.parentNode && el.parentNode.removeChild(el)
      throw new Error('权限标识不能为空!')
    }
    var permissionList = store.state.user.btnPermissions // vuex里存的btn按钮权限列表
    // 有权限限制要求
    if (permissionList != null && permissionList.length > 0) {
      // 为了兼容以前的代码  实际判断某个页面的按钮权限只需要判断 .add后缀即可
      // [xxList.add,xxxList.edit, zdingyi ...]
      var reg = new RegExp('.+\.' + flag + '$', 'g')
      var isPermissionExist = permissionList.some(item => {
        return item === flag || reg.test(item)
      })
      // 如果这个按钮权限不存在
      if (!isPermissionExist) {
        // 清除 按钮的dom元素
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
}
