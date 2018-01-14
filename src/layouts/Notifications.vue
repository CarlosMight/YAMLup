<template lang="pug">
  .container.wide
    h1 Notifications

    blockquote.success(v-if='!hasNotifications')
      p All notifications read!

    table(v-else)
      tr(v-for='(message, key) in notifications' :key='key')
        td.cursor-pointer(@click='triggerNotification(key)')
          blockquote.no-margin(v-html='message.message' :class='message.wrap')
</template>

<script>
  import {mapState} from 'vuex'
  import {size} from 'lodash'

  export default {
    name: 'layout-notifications',

    computed: mapState({
      user: 'user',
      notifications: 'notifications',
      hasNotifications () { return !!size(this.notifications) }
    }),

    methods: {
      triggerNotification (key) {
        let msg = this.notifications[key]
        if (msg.route) this.$router.push(msg.route)
      }
    }
  }
</script>
