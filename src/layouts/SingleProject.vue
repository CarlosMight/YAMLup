<template lang="pug">
  div
    spinner(v-if='isLoading')
    div(v-else)
      .div(v-if='exists')
        .container(v-if='isLocal')
          blockquote.warning.no-margin <b>Note:</b> This is a local copy.
        project-single(v-html='project.html')

      .container(v-else)
        h1 Sorry, this project does not exist.
</template>

<script>
  /**
   * Displays a single project and handles loading from either the remote or local store
   */
  import Project from '@/util/project'
  import {mapState} from 'vuex'

  export default {
    name: 'layout-single-project',

    created () {
      Project.get(this.$route.params.id).then((res) => {
        this.isLoading = false
        this.exists = res.exists
        this.project = res.project
        this.isLocal = res.isLocal

        this.setPermissions()
      })
    },

    computed: mapState([
      'user'
    ]),

    data () {
      return {
        isLoading: true,
        isLocal: false,
        project: {},
        exists: false
      }
    },

    methods: {
      setPermissions () {
        let canEdit = false
        let canDelete = false

        if (this.project.userID === this.user.uid || this.isLocal) {
          canEdit = true
          canDelete = true
        }

        this.$store.commit('setPermission', {
          canEdit,
          canDelete
        })
      }
    }
  }
</script>
