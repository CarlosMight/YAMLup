<template lang="pug">
  .container
    div(v-if='projects')
      h1 My projects
      table
        thead
          tr
            th Title
        tbody
          tr(v-for='(project, id) in projects' :key=id @click='gotoProject(id)')
            td {{project.parsed.data.title || 'Untitled'}}

    div(v-else)
      //- @FIXME Add a nicer message
      h1 Whoops, looks like you don't have any projects!
</template>

<script>
  import lockr from 'lockr'

  export default {
    name: 'layout-my-projects',

    data () {
      return {
        projects: lockr.get('projects')
      }
    },

    methods: {
      gotoProject (id) {
        this.$router.push({name: 'singleProject', params: {id}})
      }
    }
  }
</script>

<style lang="sass">
  @import "./src/assets/sass/variables"

  table tbody tr
    cursor: pointer
</style>
