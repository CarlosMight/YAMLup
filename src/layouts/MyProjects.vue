<template lang="pug">
  .container.wide
    h1#title
      span(v-if='user.uid')
        img( :src='user.photoURL')
        span {{user.displayName}}'s Projects
      span(v-else) My Projects

    div(v-if='projects || autosave')
      p(v-if='autosave')
        router-link(:to='{name: "sandbox"}') You have an active autosave

      h2 Offline <sup>*</sup>
      p
        small <sup>*</sup> The following are not synced to any account, and will be cleared when you logout.

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
            td.text-right
              button.edit(@click='editProject(id)') Edit
              button.error.delete(@click='deleteProject(id)') Delete

      h2 Settings
      p
        router-link.button.error(:to='{name: "deleteAllProjects"}') Delete all projects

    div(v-else)
      //- @FIXME Add a nicer message
      blockquote.error
        p Whoops, it looks like you don't have any projects!
</template>

<script>
  import lockr from 'lockr'
  import {mapState} from 'vuex'

  export default {
    name: 'layout-my-projects',

    data () {
      return {
        projects: lockr.get('projects'),
        autosave: lockr.get('autosave')
      }
    },

    computed: mapState([
      'user'
    ]),

    methods: {
      gotoProject (id) { this.$router.push({name: 'singleProject', params: {id}}) },
      editProject (id) { this.$router.push({name: 'editProject', params: {id}}) },
      deleteProject (id) { this.$router.push({name: 'deleteProject', params: {id}}) }
    }
  }
</script>

<style lang="sass">
  @import "./src/assets/sass/variables"

  #title
    img
      margin-right: $margin-main

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
