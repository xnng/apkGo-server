const initialState = {
  username: '',
  token: ''
}

const state = {
  ...initialState
}

const mutations = {
  clear (state) {
    Object.keys(initialState).forEach((key) => {
      state[key] = initialState[key]
    })
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
