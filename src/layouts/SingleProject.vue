<template lang="pug">
  project-single(v-html='html')
</template>

<script>
  import lockr from 'lockr'

  export default {
    name: 'layout-single-project',
    data () {
      const projects = lockr.get('localProjects')
      const project = projects ? projects[this.$route.params.id] : {}
      // @FIXME Add a nicer message
      const html = project ? project.html : '<h1>Sorry, this project does not exist.</h1>'

      return {
        html
      }
    }
  }
</script>

<style lang="sass">
</style>
