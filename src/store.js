import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '@/service/firebase'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // Firebase user data
    user: {},

    /**
     * Use for queuing notifications
     * - Message objects are in the form {id, message, route}
     * @see '/components/notifications/Button'
     */
    notifications: {
      messages: {}
    }
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
    },

    /**
     * Adds a notification to the queue
     * @param {OBJ} state
     * @param {OBJ} notification The notifcation object,
     * {
     *   id,      {STR} The message ID
     *   message, {STR} The message
     *   route     {STR} The route
     * }
     */
    addNotification (state, notification) {
      state.notifications.messages[notification.id] = notification
    }
  }
})

export default store
require('@/store/user')
