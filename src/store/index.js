import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
// import user from './modules/user'
import admin from './modules/admin'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    // user,
    admin
  },
  getters
})

export default store
