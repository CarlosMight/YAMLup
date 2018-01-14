<template lang="pug">
  router-link.error(v-if='notificationCount' :to='{name: "notifications"}')
    i.icon-bell
    span.notification-count {{notificationCount}}
</template>

<script>
  /**
   * This component handles all of the notification logic
   */
  import {mapState} from 'vuex'
  import lockr from 'lockr'
  import {size} from 'lodash'

  export default {
    name: 'notification-button',

    computed: mapState({
      notifications: 'notifications',
      notificationCount () { return size(this.notifications) }
    }),

    mounted () {
      this.$bus.$on('runNotificationChecks', this.runNotificationChecks)
      this.runNotificationChecks()
    },

    destroyed () {
      this.$bus.$off('runNotificationChecks', this.runNotificationChecks)
    },

    methods: {
      /**
       * The main login
       * @return {[type]} [description]
       */
      runNotificationChecks () {
        let projects = lockr.get('localProjects') || {}
        if (size(projects)) this.triggerSyncLocalProjects()
        else this.$store.commit('removeNotification', 'syncLocalProjects')
      },

      /**
       * Lets the user know that they have unsynced projects
       */
      triggerSyncLocalProjects () {
        this.$store.commit('addNotification', {
          id: 'syncLocalProjects',
          wrap: 'error',
          message: 'You have unsynced projects! <b>Click here to view them.</b>',
          onPageMessage: 'You have unsynced projects!',
          route: {name: 'myProjects'}
        })
      }
    }
  }
</script>

<style lang="sass">
  @import "./src/assets/sass/main"

  .notification-count
    position: absolute
    font-weight: bold
    top: 20px
</style>
