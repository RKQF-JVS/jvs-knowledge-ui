import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import user from './modules/user'
import tags from './modules/tags'
import getters from './getters'
import konwledge from './modules/konwledge'
import * as globalTypes from './types/global'

Vue.use(Vuex)

const initState = {
  direction: 'forward',
  theme: 'dark', // light / dark
  // 主题风格参数
  params: {
    themeColor: '', // 主题颜色
    activeColor: '', // 激活状态颜色
    // 字体
    font: {
      size: '', // 大小
      color: '', // 颜色
    },
    // logo设置
    logo: {
      width: '240px', // 宽
      height: '64px', // 高
      fit: 'contain', // 图片显示填充方式
      color: '#1890ff', // 字体颜色
      fontSize: '16px', // 字体大小
      fontWeight: 600, // 字体粗细
      backgroundColor: '#fff', // 背景颜色
    },
    // 表单设置
    form: {
      size: 'mini', // 表单内组件的尺寸  medium / small / mini
    },
    btn: {
      size: 'mini', // 按钮的尺寸  medium / small / mini
    }
  }
}
const actions = {};
const mutations = {
  [globalTypes.UPDATE_DIRECTION](state, direction) {
    state.direction = direction;
  },
  [globalTypes.UPDATE_THEME](state, theme) {
    state.theme = theme;
  },
}

const store = new Vuex.Store({
  modules: {
    common,
    tags,
    user,
    konwledge
  },
  getters,
  actions,
  state: initState,
  mutations
})

export default store
