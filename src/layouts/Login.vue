<template lang="pug">
  .container
    h1 Login
    blockquote.error
      p Thanks for your interest in YAMLup! I'm still developing this app to use myself and nothing is really finalized. I super recommend <b>not</b> using this app yet.
      p - <a href="https://twitter.com/carlosmight">Carlos Ramos</a>

    p
      b Login with<sup>*</sup>&nbsp;
      button.twitter-button(@click='twitterLogin')
        i.icon-twitter
        |  Twitter

    p
      small <sup>*</sup> More login providers coming soon
</template>

<script>
  import firebase from '@/service/firebase'
  import {mapState} from 'vuex'

  export default {
    name: 'layout-login',

    watch: {
      user (user) {
        if (user && user.uid) {
          this.$router.push({name: 'myProjects'})
        }
      }
    },

    mounted () {
      if (this.user.uid) {
        this.$router.push({name: 'myProjects'})
      }
    },

    computed: mapState([
      'user'
    ]),

    methods: {
      twitterLogin () {
        let provider = new firebase.auth.TwitterAuthProvider()
        this.isLoading = true

        firebase.auth().signInWithPopup(provider)
          // @TODO Let's add a welcome message if result.additionalUserInfo.isNewUser
          // @TODO We should make stay connected opt-in: https://firebase.google.com/docs/auth/web/auth-state-persistence
          .then((result) => {
            this.$store.commit('setUser', result.user)
            this.$router.push({name: 'myProjects'})
          })
          // @TODO Let's toast the error message (test by turning off connection or temp disabling authorized domains)
          .catch((err) => {
            console.error(err)
            this.$toasted.show('An error occured while logging in, please try again.', {type: 'error'})
          })
          .then(() => {
            this.isLoading = false
          })
      }
    }
  }
</script>

<style lang="sass">
</style>
