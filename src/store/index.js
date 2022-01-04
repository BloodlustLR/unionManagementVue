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
    },
    systemInfo:{
      rate:1
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
    },
    handleSystemInfo: (state, systemInfoList) => {
      for(let item of systemInfoList){
        state.systemInfo[item.name] = item.value;
      }
    }
  },
  actions: {

  },
  modules: {
  },
  getters: {  //只依赖state中的成员去更新
    systemInfo: (state) => state.systemInfo
  }
})
