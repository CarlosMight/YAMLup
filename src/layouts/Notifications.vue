<template lang="pug">
  .container.wide
    h1 Notifications

    blockquote.success(v-if='!notifications.messages')
      p All notifications read!

    table(v-else)
      tr(v-for='(message, key) in notifications.messages' :key='key')
        td.cursor-pointer(@click='triggerNotification(key)')
          blockquote.no-margin(v-html='message.message' :class='message.wrap')
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'layout-notifications',

    computed: mapState([
      'user',
      'notifications'
    ]),

    methods: {
      triggerNotification (key) {
        let msg = this.notifications.messages[key]
        if (msg.route) this.$router.push(msg.route)
      }
    }
  }
</script>

<style lang="sass">
</style>
