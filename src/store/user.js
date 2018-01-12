import firebase from '@/service/firebase'
import store from '@/store'

/**
 * Handle Firebase immediately as it requires an additional httpRequest
 */
firebase.auth().onAuthStateChanged(function (user) {
  // @TODO Add a logout message
  if (user) {
    const db = firebase.firestore()
    store.commit('setUser', user)

    // @TODO catch errors
    db.collection('project').where('userID', '==', user.uid).get().then((snap) => {
      let projects = {}
      snap.forEach((doc) => {
        projects[doc.data().ID] = doc.data()
      })

      store.commit('setMyProjects', projects)
    })
  } else {
    store.commit('setUser', {})
    localStorage.clear()
  }
})
