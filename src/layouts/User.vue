<template lang="pug">
  .container.wide
    project-table(:projects='projects' hideEdits=true)
</template>

<script>
  import Project from '@/util/project'

  export default {
    name: 'layout-user',

    created () {
      Project.query('userID', '==', this.$route.params.id).then((res) => {
        this.projects = res
      })
    },

    data () {
      return {
        projects: {},
        isLoading: true
      }
    }
  }
</script>

<style lang="sass">
</style>
