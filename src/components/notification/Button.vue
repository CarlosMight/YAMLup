<template lang="pug">
  router-link.error(v-if='Object.keys(notifications).length' :to='{name: "notifications"}')
    i.icon-bell
</template>

<script>
  import {mapState} from 'vuex'
  import lockr from 'lockr'

  export default {
    name: 'notification-button',

    computed: mapState({
      notifications: 'notifications'
    }),

    mounted () {
      let projects = lockr.get('projects') || {}
      if (Object.keys(projects).length) {
        this.$store.commit('addNotification', {
          id: 'syncLocalProjects',
          wrap: 'error',
          message: 'You have unsynced messages! <b>Click here to view them.</b>',
          onPageMessage: 'You have unsynced messages!',
          route: {name: 'myProjects'}
        })
      }
    }
  }
</script>

<style lang="sass">
</style>
