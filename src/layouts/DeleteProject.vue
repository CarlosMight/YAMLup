<template lang="pug">
  .container
    div(v-if='!isLoading')
      //- Delete
      div(v-if='projectExists')
        h1 Delete Project
        blockquote.error
          b WARNING!
          p Clicking delete here will delete the project. <b>There is currently no undo!</b>
        p
          button(@click='cancelDelete') Cancel
          button.error(@click='deleteProject') Delete

      //- 404
      div(v-else)
        blockquote.error This project does not exist.
    div(v-else)
      spinner
</template>

<script>
  import lockr from 'lockr'
  import firebase from '@/service/firebase'
  import Project from '@/util/project'
  import {mapState} from 'vuex'

  export default {
    name: 'layout-delete-project',

    created () {
      Project.get(this.$route.params.id).then((res) => {
        if (res.project.userID === this.user.uid || res.isLocal) {
          this.isLoading = false
          this.projectExists = res.exists
          this.isLocal = res.isLocal
        } else {
          this.$toasted.show("Sorry, you don't have permission to delete this proejct.", {type: 'error'})
          this.$router.push({name: 'singleProject', params: {id: res.project.ID}})
        }
      })
    },

    computed: mapState([
      'user'
    ]),

    data () {
      return {
        isLoading: true,
        projectExists: false,
        isLocal: false
      }
    },

    methods: {
      deleteProject () {
        if (this.projectExists && !this.isLocal) {
          firebase.firestore().collection('project').doc(this.$route.params.id).delete().then(() => {
            this.$toasted.show('Project deleted!', {type: 'success'})
            this.$bus.$emit('runNotificationChecks')
            this.$router.push({name: 'myProjects'})
          }).catch((err) => {
            this.$toasted.show(err.message, {type: 'error'})
          })
        } else {
          let projects = lockr.get('localProjects')

          delete projects[this.$route.params.id]
          this.$toasted.show('Project deleted!', {type: 'success'})
          lockr.set('localProjects', projects)
          this.$bus.$emit('recheckLocalProjects')
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
