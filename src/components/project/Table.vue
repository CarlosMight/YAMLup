<template lang="pug">
  table
    thead
      tr
        th Title
        th Created
        th Updated
    tbody
      tr(v-for='(project, id) in projects' :key=id)
        td(@click='gotoProject(id)') {{getProp(project, 'parsed.data.title') || 'Untitled'}}
        td(@click='gotoProject(id)') {{formatDate(project.created)}}
        td(@click='gotoProject(id)') {{formatDate(project.updated)}}
        td.text-right
          button.success(v-if='showSync && user.uid' @click='syncProject(id, $event)')
            i.icon-spinner5.loader
            span Sync
          button.edit.success(@click='editProject(id)')
            i.icon-pencil
          button.error.delete(@click='deleteProject(id)')
            i.icon-bin2
</template>

<script>
  import Vue from 'vue'
  import timeago from '@/setup/timeago'
  import {get} from 'lodash'
  import {mapState} from 'vuex'
  import lockr from 'lockr'
  import Project from '@/util/project'

  /**
   * Displays a table of projects
   *
   * @prop {OBJ} projects An object containing the list of projects to show
   * @prop {BOL} showSync Shows a sync button for local projects
   */
  export default {
    name: 'project-table',

    props: [
      'projects',
      'showSync'
    ],

    computed: mapState([
      'user'
    ]),

    data () {
      return {
        localProjects: lockr.get('localProjects') || {}
      }
    },

    methods: {
      gotoProject (id) { this.$router.push({name: 'singleProject', params: {id}}) },
      editProject (id) { this.$router.push({name: 'editProject', params: {id}}) },
      deleteProject (id) { this.$router.push({name: 'deleteProject', params: {id}}) },

      formatDate: (date) => timeago.format(date),
      getProp: (obj, path) => get(obj, path),

      /**
       * Syncs a local project with the server, deleting the local copy
       * @param  {STR} id The project ID
       * @param  {EVT} ev The click event
       */
      syncProject (id, ev) {
        let btn = ev.target

        if (!btn.classList.contains('loading')) {
          let project = this.localProjects[id]

          // Update with latest user info
          btn.classList.add('loading')
          project.username = this.user.displayName
          project.userID = this.user.uid

          Project.save(project).then(() => {
            Vue.delete(this.localProjects, id)
            btn.classList.remove('loading')
            lockr.set('localProjects', this.localProjects)

            this.$toasted.show('Project synced!', {type: 'success'})
            this.$bus.$emit('recheckLocalProjects')
            this.$bus.$emit('runNotificationChecks')
          })
        }
      }
    }
  }
</script>

<style lang="sass">
</style>
