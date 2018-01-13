<template lang="pug">
  .container.wide
    h1#title
      span(v-if='user.uid')
        img(:src='user.photoURL')
        span {{user.displayName}}'s Projects
      span(v-else) My Projects

    blockquote.error(v-if='notifications.syncLocalProjects' v-html='notifications.syncLocalProjects.onPageMessage')

    //- Online Projects
    //- @TODO Refactor with offline table
    div(v-if='user.uid && Object.keys(myProjects).length')
      table
        thead
          tr
            th Title
            th Created
            th Updated
        tbody
          tr(v-for='(project, id) in myProjects' :key=id)
            td(@click='gotoProject(id)') {{getProp(project, 'parsed.data.title') || 'Untitled'}}
            td(@click='gotoProject(id)') {{formatDate(project.created)}}
            td(@click='gotoProject(id)') {{formatDate(project.updated)}}
            td.text-right
              button.edit(@click='editProject(id)') Edit
              button.error.delete(@click='deleteProject(id)') Delete

    //- Local Projects
    div(v-if='hasLocalProjects')
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
          tr(v-for='(project, id) in localProjects' :key=id)
            td(@click='gotoProject(id)') {{project.parsed.data.title || 'Untitled'}}
            td(@click='gotoProject(id)') {{formatDate(project.created)}}
            td(@click='gotoProject(id)') {{formatDate(project.updated)}}
            td.text-right
              button.success(v-if='user.uid' @click='syncProject(id, $event)')
                i.icon-spinner5.loader
                span Sync
              button.edit(@click='editProject(id)') Edit
              button.error.delete(@click='deleteProject(id)') Delete

      h2 Settings
      p
        router-link.button.error(:to='{name: "deleteAllProjects"}') Delete all projects

    div(v-if='!hasLocalProjects && !(user.uid && Object.keys(myProjects).length)')
      //- @FIXME Add a nicer message
      blockquote.error
        p Whoops, it looks like you don't have any projects!
</template>

<script>
  import lockr from 'lockr'
  import {mapState} from 'vuex'
  import TimeAgo from 'timeago.js'
  import firebase from '@/service/firebase'
  import Vue from 'vue'
  import {get} from 'lodash'

  const timeago = TimeAgo()

  export default {
    name: 'layout-my-projects',

    data () {
      return {
        localProjects: lockr.get('localProjects') || {},
        autosave: lockr.get('autosave') || {}
      }
    },

    computed: mapState({
      user: 'user',
      myProjects: 'myProjects',
      notifications: 'notifications',
      hasLocalProjects () {
        return Object.keys(this.localProjects).length || Object.keys(this.autosave).length
      }
    }),

    watch: {
      user () {
        if (this.user.uid) this.loadMyProjects()
      }
    },

    created () {
      this.loadMyProjects()
    },

    methods: {
      gotoProject (id) { this.$router.push({name: 'singleProject', params: {id}}) },
      editProject (id) { this.$router.push({name: 'editProject', params: {id}}) },
      deleteProject (id) { this.$router.push({name: 'deleteProject', params: {id}}) },

      formatDate: (date) => timeago.format(date),

      syncProject (id, ev) {
        let btn = ev.target

        if (!btn.classList.contains('loading')) {
          let project = this.localProjects[id]
          const db = firebase.firestore()

          btn.classList.add('loading')
          project.username = this.user.displayName
          project.userID = this.user.uid

          // @TODO catch errors
          db.collection('project').doc(id).set(project, {merge: true}).then(() => {
            Vue.delete(this.localProjects, id)
            btn.classList.remove('loading')

            if (Object.keys(this.localProjects).length) {
              lockr.set('localProjects', this.localProjects)
            } else {
              this.$store.commit('removeNotification', 'syncLocalProjects')
              lockr.rm('localProjects')
              this.localProjects = {}
            }
          })
        }
      },

      getProp: (obj, path) => get(obj, path),

      loadMyProjects () {
        if (this.user.uid) {
          firebase.firestore().collection('project').where('userID', '==', this.user.uid).get().then((snap) => {
            let projects = {}
            snap.forEach((doc) => {
              projects[doc.data().ID] = doc.data()
            })
            this.$store.commit('setMyProjects', projects)
          })
        }
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
