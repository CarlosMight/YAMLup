<template lang="pug">
  .container
    div(v-if='!isLoading')
      div(v-if='projectExists')
        h1 Delete Project
        blockquote.error
          b WARNING!
          p
            | Clicking delete here will delete the project.
            b  There is currently no undo!
        p
          button(@click='cancelDelete') Cancel
          button.error(@click='deleteProject') Delete
      div(v-else)
        //- @TODO Add a nicer message
        h1 Sorry, this project does not exist.
    div(v-else)
      spinner
</template>

<script>
  import lockr from 'lockr'
  import firebase from '@/service/firebase'

  export default {
    name: 'layout-delete-project',

    created () {
      // @TODO handle error
      firebase.firestore().collection('project').doc(this.$route.params.id).get().then((doc) => {
        this.projectExists = this.isRemote = doc.exists
        this.isLoading = false

        if (!doc.exists) {
          const projects = lockr.get('localProjects')
          const project = projects ? projects[this.$route.params.id] : null
          this.projectExists = !!project
        }
      })
    },

    data () {
      return {
        isLoading: true,
        projectExists: false,
        isRemote: false
      }
    },

    methods: {
      deleteProject () {
        if (this.projectExists && this.isRemote) {
          // @FIXME refactor, this ref should already be caught above
          // @TODO add error message
          firebase.firestore().collection('project').doc(this.$route.params.id).delete().then(() => {
            this.$bus.$emit('runNotificationChecks')
            this.$router.push({name: 'myProjects'})
          })
        } else {
          let projects = lockr.get('localProjects')

          delete projects[this.$route.params.id]
          lockr.set('localProjects', projects)
          this.$bus.$emit('runNotificationChecks')
          this.$router.push({name: 'myProjects'})
        }
      },

      cancelDelete () {
        const id = this.$route.params.id
        this.$router.push({name: 'singleProject', params: {id}})
      }
    }
  }
</script>

<style lang="sass">
</style>
