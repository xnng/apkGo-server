import Vue from 'vue'
import Vuex from 'vuex'
import CreatePersistedState from 'vuex-persistedstate'
import user from './modules/user'

Vue.use(Vuex)

const vuexPersisted = new CreatePersistedState({
  reducer: vuexState => {
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
  modules: {
    user
  },
  plugins: [vuexPersisted]
})

export default store
