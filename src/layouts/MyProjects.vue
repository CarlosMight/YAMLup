<template lang="pug">
  .container
    div(v-if='projects || autosave')
      h1 My projects

      p(v-if='autosave')
        router-link(:to='{name: "sandbox"}') You have an active autosave

      table
        thead
          tr
            th Title
            th Created
            th Updated
        tbody
          tr(v-for='(project, id) in projects' :key=id)
            td(@click='gotoProject(id)') {{project.parsed.data.title || 'Untitled'}}
            td(@click='gotoProject(id)') {{project.created}}
            td(@click='gotoProject(id)') {{project.updated}}
            td.delete(@click='deleteProject(id)') Delete
            td.edit(@click='editProject(id)') Edit

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
        projects: lockr.get('projects'),
        autosave: lockr.get('autosave')
      }
    },

    methods: {
      gotoProject (id) { this.$router.push({name: 'singleProject', params: {id}}) },
      editProject (id) { this.$router.push({name: 'editProject', params: {id}}) },
      deleteProject (id) { this.$router.push({name: 'deleteProject', params: {id}}) }
    }
  }
</script>

<style lang="sass">
  @import "./src/assets/sass/variables"

  table tbody tr
    cursor: pointer

  td.edit
    color: $color-success
    font-weight: bold

    &:hover
      background: $color-success
      color: #fff

  td.delete
    color: $color-error
    font-weight: bold

    &:hover
      background: $color-error
      color: #fff
</style>
