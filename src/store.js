import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '@/service/firebase'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // Firebase user data
    user: {}
  },

  mutations: {
    setUser: (state, user) => (state.user = user),
    // @TODO Toast success
    // @TODO Catche error
    deleteUser (state) {
      if (state.user.uid) {
        state.user.delete()
        state.user = {}
      }
    },
    logout (state) {
      state.user = {}
      state.checklist = null
      firebase.auth().signOut()
      localStorage.clear()
    }
  }
})

export default store
require('@/store/user')
