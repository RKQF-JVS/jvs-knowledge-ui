import store from '@/store'
export default {
  install (Vue, options) {
    // 权限匹配
    /**
     * 
     * @param {String} str 权限标识
     */
    Vue.prototype.$permissionMatch = function (str) {
      // 超级管理员具备所有权限
      if(store.getters.userInfo.adminFlag) {
        return true
      }
      let t = false;
      if(!store.getters.permissions) {
        return false
      }
      if (store.getters.permissions.indexOf(str) == -1) {
        if (!str || str == '') {
          t = true;
        }else {
          t = false
        }
      } else {
        t = true
      }
      return t
    }
    // 根据权限标识返回对应中文名
    /**
     * 
     * @param {String} flag 权限标识
     * @param {String} text 默认文字，即匹配失败或无需匹配时的显示
     */ 
    Vue.prototype.$permissionLabel = function (flag, text) {
      let temp = text
      if(store.state.user && store.state.user.permissions) {
        let keys = Object.keys(store.state.user.permissions)
        if(keys.indexOf(flag) > -1 && store.state.user.permissions[flag]) {
          temp = store.state.user.permissions[flag]
        }
      }
      return temp
    }
  }
}