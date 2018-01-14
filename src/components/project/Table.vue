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
          button.edit(@click='editProject(id)') Edit
          button.error.delete(@click='deleteProject(id)') Delete
</template>

<script>
  import Vue from 'vue'
  import TimeAgo from 'timeago.js'
  import {get} from 'lodash'
  import {mapState} from 'vuex'
  import lockr from 'lockr'
  import firebase from '@/service/firebase'
  const timeago = TimeAgo()

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

          btn.classList.add('loading')
          project.username = this.user.displayName
          project.userID = this.user.uid

          // @TODO catch errors
          firebase.firestore().collection('project').doc(id).set(project, {merge: true}).then(() => {
            Vue.delete(this.localProjects, id)
            btn.classList.remove('loading')

            if (Object.keys(this.localProjects).length) {
              lockr.set('localProjects', this.localProjects)
            } else {
              this.$store.commit('removeNotification', 'syncLocalProjects')
              lockr.rm('localProjects')
              this.localProjects = {}
            }

            this.$bus.$emit('recheckLocalProjects')
          })
        }
      }
    }
  }
</script>

<style lang="sass">
</style>
