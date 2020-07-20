import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import CreatePersistedState from 'vuex-persistedstate'
import global from './globalStore'
import user from './modules/user'

Vue.use(Vuex)

const vuexPersisted = new CreatePersistedState({
  reducer: vuexState => {
    // 仅持久化部分模块到 storage 中
    return {
      user: vuexState.user
    }
  },
  storage: {
    getItem: key => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
    removeItem: key => localStorage.removeItem(key)
  }
})

const store = new Vuex.Store({
  ...global,
  modules: {
    user
  },
  plugins: [vuexPersisted, createLogger()]
})

export default store
