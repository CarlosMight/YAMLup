<template lang="pug">
  .container
    div(v-if='project')
      h1 Delete Project
      blockquote.warning
        b WARNING!
        p
          | Clicking delete here will delete the project.
          b  There is currently no undo!
      p
        button.error(@click='deleteProject') Delete
    div(v-else)
      //- @TODO Add a nicer message
      h1 Sorry, this project does not exist.
</template>

<script>
  import lockr from 'lockr'

  export default {
    name: 'layout-delete-project',

    data () {
      const projects = lockr.get('projects')
      const project = projects ? projects[this.$route.params.id] : null

      return {
        project
      }
    },

    methods: {
      deleteProject () {
        let projects = lockr.get('projects')
        delete projects[this.$route.params.id]
        lockr.set('projects', projects)
        this.$router.push({name: 'myProjects'})
      }
    }
  }
</script>

<style lang="sass">
</style>
