<template lang="pug">
  div
    spinner(v-if='isLoading')
    div(v-else)
      .div(v-if='exists')
        .container(v-if='isLocal')
          blockquote.warning.no-margin <b>Note:</b> This is a local copy.
        project-single(v-html='html')

      .container(v-else)
        h1 Sorry, this project does not exist.
</template>

<script>
  /**
   * Displays a single project and handles loading from either the remote or local store
   */
  import Project from '@/util/project'

  export default {
    name: 'layout-single-project',

    created () {
      Project.loadSingle(this.$route.params.id).then((res) => {
        this.isLoading = false
        this.exists = res.exists
        this.html = res.project.html
        this.isLocal = res.isLocal && this.html
      })
    },

    data () {
      return {
        isLoading: true,
        isLocal: false,
        html: '',
        exists: false
      }
    }
  }
</script>

<style lang="sass">
</style>
