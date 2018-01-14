import firebase from '@/service/firebase'
import store from '@/store'

/**
 * Handle Firebase immediately as it requires an additional httpRequest
 */
firebase.auth().onAuthStateChanged(function (user) {
  store.commit('setUser', user || {})
})
