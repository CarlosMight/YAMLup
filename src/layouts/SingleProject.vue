<template lang="pug">
  div
    spinner(v-if='isLoading')
    div(v-else)
      .container(v-if='isLocal && !isError')
        blockquote.warning.no-margin <b>Note:</b> This is a local copy.
      project-single(v-html='html')
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
        this.isError = res.isError
        this.isLocal = res.isLocal
        this.html = res.message
      })
    },

    data () {
      return {
        isLoading: true,
        isLocal: false,
        isError: false,
        html: ''
      }
    }
  }
</script>

<style lang="sass">
</style>
