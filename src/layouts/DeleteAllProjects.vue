<template lang="pug">
  .container
    div(v-if='localProjects')
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
      h1 Sorry, you don't have any projects to delete.
</template>

<script>
  import lockr from 'lockr'

  export default {
    name: 'layout-delete-all-projects',

    data () {
      const projects = lockr.get('localProjects')

      return {
        projects
      }
    },

    methods: {
      deleteProject () {
        lockr.rm('autosave')
        lockr.rm('localProjects')
        this.$router.push({name: 'myProjects'})
      },

      cancelDelete () {
        this.$router.push({name: 'myProjects'})
      }
    }
  }
</script>

<style lang="sass">
</style>
