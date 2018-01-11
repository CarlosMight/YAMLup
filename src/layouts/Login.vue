<template lang="pug">
  .container
    h1 Login
    blockquote.warning
      p Thanks for your interest in YAMLup! I'm still developing this app to use myself and nothing is really finalized. I super recommend <b>not</b> using this app yet.
      p - <a href="https://twitter.com/carlosmight">Carlos Ramos</a>

    p
      b Login with<sup>*</sup>&nbsp;
      button(@click='twitterLogin') Twitter

    p
      small <sup>*</sup> More login providers coming soon
</template>

<script>
  import firebase from '@/service/firebase'

  export default {
    name: 'layout-login',

    methods: {
      twitterLogin () {
        let provider = new firebase.auth.TwitterAuthProvider()
        this.isLoading = true

        firebase.auth().signInWithPopup(provider)
          // @TODO Let's add a welcome message if result.additionalUserInfo.isNewUser
          // @TODO We should make stay connected opt-in: https://firebase.google.com/docs/auth/web/auth-state-persistence
          .then((result) => {
            this.$store.commit('setUser', result.user)
          })
          // @TODO Let's toast the error message (test by turning off connection or temp disabling authorized domains)
          .catch((err) => {
            console.error(err)
          })
          .then(() => {
            this.isLoading = false
            this.$router.push({name: 'myProjects'})
          })
      }
    }
  }
</script>

<style lang="sass">
</style>
