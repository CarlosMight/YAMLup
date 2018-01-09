<template lang="pug">
  project-single(v-html='html')
</template>

<script>
  import lockr from 'lockr'

  export default {
    name: 'layout-single-project',
    data () {
      const projectID = this.$route.params.id
      const projects = lockr.get('projects')
      const project = projects ? projects[projectID] : {}
      const html = project.html || '<h1>Sorry, this project does not exist.</h1>'
      console.log(project)

      return {
        html
      }
    }
  }
</script>

<style lang="sass">
</style>
