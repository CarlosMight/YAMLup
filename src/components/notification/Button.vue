<template lang="pug">
  router-link.error(v-if='hasNotifications' :to='{name: "notifications"}')
    i.icon-bell
</template>

<script>
  import {mapState} from 'vuex'
  import lockr from 'lockr'

  export default {
    name: 'notification-button',

    computed: mapState({
      notifications: 'notifications',

      hasNotifications () {
        return !!Object.keys(this.notifications.messages).length
      }
    }),

    mounted () {
      if (lockr.get('projects')) {
        this.$store.commit('addNotification', {
          id: 'syncLocalProjects',
          wrap: 'error',
          message: 'You have unsynced messages! <b>Click here to view them.</b>',
          route: {name: 'myProjects'}
        })
      }
    }
  }
</script>

<style lang="sass">
</style>
