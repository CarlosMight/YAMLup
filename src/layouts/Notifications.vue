<template lang="pug">
  .container.wide
    h1 Notifications
    blockquote.success
      p All notifications read!
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'layout-notifications',

    computed: mapState([
      'user',
      'notifications'
    ])
  }
</script>

<style lang="sass">
</style>
