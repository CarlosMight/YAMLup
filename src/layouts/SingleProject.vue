<template lang="pug">
  div
    spinner(v-if='isLoading')
    div(v-else)
      project-single(v-html='html')
</template>

<script>
  import lockr from 'lockr'
  import firebase from '@/service/firebase'

  export default {
    name: 'layout-single-project',

    created () {
      // @TODO handle error
      firebase.firestore().collection('project').doc(this.$route.params.id).get().then((doc) => {
        // @FIXME Add a nicer message
        const error404 = '<h1>Sorry, this project does not exist.</h1>'

        if (doc.exists) {
          this.html = doc.data().html
        } else {
          const projects = lockr.get('localProjects')
          const project = projects ? projects[this.$route.params.id] : {}
          this.html = project ? project.html : error404
        }

        this.isLoading = false
      })
    },

    data () {
      return {
        isLoading: true,
        html: ''
      }
    }
  }
</script>

<style lang="sass">
</style>
