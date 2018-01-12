import firebase from '@/service/firebase'
import store from '@/store'

/**
 * Handle Firebase immediately as it requires an additional httpRequest
 */
firebase.auth().onAuthStateChanged(function (user) {
  // @TODO Add a logout message
  if (user) {
    store.commit('setUser', user)
  } else {
    store.commit('setUser', {})
    localStorage.clear()
  }
})
