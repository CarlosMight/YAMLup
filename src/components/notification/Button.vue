<template lang="pug">
  router-link.error(v-if='hasNotifications' :to='{name: "notifications"}')
    i.icon-bell
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
      hasNotifications: () => { return Object.keys(this.notifications || {}).length }
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
</style>
