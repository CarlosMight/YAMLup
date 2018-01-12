<template lang="pug">
  .modal-wrap
    .modal
      h1 Syncs Available
      table
        thead
          tr
            th Title
        tbody
          tr(v-for='(project, id) in projects' :key=id)
            td(@click='gotoProject(id)') {{project.parsed.data.title || 'Untitled'}}
            td.text-right
              button.success.delete(@click='uploadProject(id)') Sync
              button.error.delete(@click='deleteProject(id)') Delete
</template>

<script>
  import {mapState} from 'vuex'
  import lockr from 'lockr'

  export default {
    name: 'modal-sync-projects',

    computed: mapState([
      'user',
      'notifications'
    ]),

    data () {
      return {
        projects: lockr.get('projects')
      }
    }
  }
</script>

<style lang="sass">
</style>
