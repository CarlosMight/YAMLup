<template lang="pug">
  div
    spinner(v-if='isLoading')
    div(v-else)
      .container(v-if='isLocal && !html')
        blockquote.warning.no-margin <b>Note:</b> This is a local copy.

      .div(v-if='html')
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
        this.html = res.project.html
        this.isLocal = res.isLocal && this.html
      })
    },

    data () {
      return {
        isLoading: true,
        isLocal: false,
        html: ''
      }
    }
  }
</script>

<style lang="sass">
</style>
