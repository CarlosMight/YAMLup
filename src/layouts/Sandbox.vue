<template lang="pug">
  #layout-sandbox.full-height
    .panel
      codemirror(
        ref='editor'
        v-model='yaml'
        :options='codemirrorOpts'
      )
    .panel
      project-single(:html='preview')
</template>

<script>
  import matter from 'gray-matter'
  import {codemirror} from 'vue-codemirror'
  import lockr from 'lockr'
  import uuid from 'uuid/v1'
  import markdown from '@/util/markdown'

  require('codemirror/lib/codemirror.css')
  require('codemirror/mode/yaml-frontmatter/yaml-frontmatter.js')
  require('codemirror/mode/gfm/gfm.js')

  export default {
    name: 'layout-sandbox',
    components: {codemirror},

    mounted () {
      this.$refs.editor.cminstance.focus()
      this.$bus.$on('maybeSave', this.maybeSave)
      this.$bus.$on('maybeNewProject', this.maybeNewProject)
    },

    destroyed () {
      this.$bus.$off('maybeSave', this.maybeSave)
      this.$bus.$off('maybeNewProject', this.maybeNewProject)
    },

    data () {
      const autosave = lockr.get('autosave') || {}
      const projectID = lockr.get('currentProjectID') || uuid()
      const yaml = autosave[projectID] || ''
      lockr.set('currentProjectID', projectID)

      return {
        projectID,
        yaml,
        codemirrorOpts: {
          mode: 'yaml-frontmatter',
          base: 'gfm',
          lineWrapping: true
        }
      }
    },

    watch: {
      yaml () {
        const autosave = lockr.get('autosave') || {}
        autosave[this.projectID] = this.yaml
        lockr.set('autosave', autosave)
      }
    },

    computed: {
      parsed () { return matter(this.yaml) },
      preview () { return markdown.render(this.parsed.content) }
    },

    methods: {
      maybeSave () {
        const projectID = this.projectID
        let projects = lockr.get('projects') || {}
        projects[this.projectID] = {
          ID: this.projectID,
          yaml: this.yaml,
          parsed: this.parsed,
          html: this.preview
        }
        lockr.set('projects', projects)

        this.$router.push(`/p/${projectID}`)
      },

      maybeNewProject () {
        this.projectID = uuid()
        lockr.set('currentProjectID', this.projectID)
        this.yaml = ''
      }
    }
  }
</script>

<style lang="sass">
  @import "./src/assets/sass/variables"

  .vue-codemirror, .CodeMirror
    height: 100%

  .panel
    width: 50%
    height: 100%
    float: left
    position: relative
    overflow: auto

    &:last-child
      box-shadow: 0 0 3px rgba(0,0,0,0.35)

  @media screen and (max-width: $width-content)
    .panel
      width: 100%
      float: none
      height: 50%

      &:last-child
</style>
