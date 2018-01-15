<template lang="pug">
  .container
    div
      h1 Logged out!
      blockquote Don't forget to follow me on Twitter at <a href="https://twitter.com/carlosmight">@CarlosMight</a>!
</template>

<script>
  export default {
    name: 'layout-logout',

    created () {
      this.$store.commit('logout')
      this.$store.commit('clearNotifications')
    }
  }
</script>
