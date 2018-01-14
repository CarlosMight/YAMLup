<template lang="pug">
  .container.wide
    h1#title
      span(v-if='user.uid')
        img(:src='user.photoURL')
        span {{user.displayName}}'s Projects
      span(v-else) My Projects

    //- Sync notification
    blockquote.error(v-if='notifications.syncLocalProjects' v-html='notifications.syncLocalProjects.onPageMessage')

    p(v-if='autosave')
      router-link(:to='{name: "sandbox"}') You have an active autosave

    //- Online Projects
    div(v-if='!isLoading')
      project-table(v-if='user.uid' :projects='myProjects')
    spinner(v-else)

    //- Local Projects
    div(v-if='hasLocalProjects')
      a(name='offline')
      h2 Offline Projects
      p
        small <sup>*</sup> The following are not synced to any account, and will be cleared when you logout.

      project-table(:projects='localProjects' showSync=true)

      h2 Settings
      p
        router-link.button.error(:to='{name: "deleteAllProjects"}') Delete all projects

    div(v-if='!hasLocalProjects && !(user.uid && Object.keys(myProjects).length)')
      blockquote.warning
        p You don't have any projects yet.
</template>

<script>
  import {mapState} from 'vuex'
  import lockr from 'lockr'
  import {size} from 'lodash'
  import Project from '@/util/project'

  export default {
    name: 'layout-my-projects',

    data () {
      return {
        localProjects: lockr.get('localProjects') || {},
        autosave: lockr.get('autosave') || {},
        myProjects: {},
        isLoading: false
      }
    },

    computed: mapState({
      user: 'user',
      notifications: 'notifications',
      hasLocalProjects () { return size(this.localProjects) || size(this.autosave) }
    }),

    watch: {
      user () { if (this.user.uid) this.loadMyProjects() }
    },

    created () {
      this.loadMyProjects()
      this.$bus.$on('recheckLocalProjects', this.reloadLocalProjects)
    },

    methods: {
      /**
       * Load the users projects
       */
      loadMyProjects () {
        if (this.user.uid) {
          this.isLoading = true
          Project.query('userID', '==', this.user.uid).then((projects) => {
            this.isLoading = false
            this.myProjects = projects
          })
        }
      },

      reloadLocalProjects () {
        this.localProjects = lockr.get('localProjects') || {}
        this.loadMyProjects()
      }
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
