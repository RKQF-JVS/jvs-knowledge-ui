import { getStore, removeStore, setStore } from '@/util/store'
const konwledge = {
  state: {
    konwledgeInfo: getStore({ name: 'konwledgeInfo' }),
  },
  actions: {},
  mutations: {
    SET_KONWLEDGE: (state, konwledgeInfo) => {
      state.konwledgeInfo = konwledgeInfo
      setStore({
        name: 'konwledgeInfo',
        content: state.konwledgeInfo,
        type: 'session'
      })
    }
  }
}
export default konwledge
