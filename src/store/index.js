import { createStore } from 'vuex'

export default createStore({
  state: {
    loginInfo:{
      username:null,
      gameId:null,
      shortArmy:null,
      army:null,
      union:null,
      role:null
    }
  },
  mutations: {
    handleLogin: (state, loginInfo) => {
      state.loginInfo.username = loginInfo.username;
      state.loginInfo.gameId = loginInfo.gameId;
      state.loginInfo.shortArmy = loginInfo.shortArmy;
      state.loginInfo.army = loginInfo.army;
      state.loginInfo.union = loginInfo.union;
      state.loginInfo.role = loginInfo.role;
    },
    handleLogout: (state) =>{
      state.loginInfo.username = null;
      state.loginInfo.gameId = null;
      state.loginInfo.shortArmy = null;
      state.loginInfo.army = null;
      state.loginInfo.union = null;
      state.loginInfo.role = null;
    }
  },
  actions: {

  },
  modules: {
  }
})
