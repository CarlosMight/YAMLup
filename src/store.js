import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '@/service/firebase'
import PERMISSIONS from '@/config/permissions'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // Permissions
    permission: PERMISSIONS.none,

    // Firebase user data
    user: {},

    /**
     * Use for queuing notifications
     * - Message objects are in the form {id, message, route}
     * @see '/components/notifications/Button'
     */
    notifications: {}
  },

  mutations: {
    setUser: (state, user) => (state.user = user),
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
      Vue.set(state.notifications, notification.id, notification)
    },

    /**
     * Removes a notification from the queue
     *
     * @param  {OBJ} state
     * @param  {STR} id    The message id
     */
    removeNotification (state, id) {
      let notices = Object.assign({}, state.notifications)
      delete notices[id]
      state.notifications = notices
    },

    /**
     * Sets a permission
     *
     * @param {OBJ} state
     * @param {OBJ} permissions The {perm: val} set, which is merged with the existing permissions
     */
    setPermission (state, permissions) {
      state.permission = Object.assign({}, state.permission, permissions)
    },

    /**
     * Clears the permissions
     */
    clearPermission (state) {
      state.permission = Object.assign({}, state.permission, PERMISSIONS.none)
    }
  }
})

export default store
require('@/store/user')
