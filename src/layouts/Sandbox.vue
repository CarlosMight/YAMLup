<template lang="pug">
  #layout-sandbox.full-height
    .panel
      codemirror(
        ref='editor'
        v-model='yaml'
        :options='codemirrorOpts'
      )
    .panel
      .error-message(v-if='errorMessage')
        pre {{errorMessage}}
      project-single(:html='preview')
</template>

<script>
  import matter from 'gray-matter'
  import {codemirror} from 'vue-codemirror'
  import lockr from 'lockr'
  import uuid from 'uuid/v1'
  import markdown from '@/util/markdown'
  window.matter = matter

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
      let projectID = lockr.get('currentProjectID') || uuid()
      let yaml = lockr.get('autosave') || ''

      if (this.$route.name === 'editProject') {
        projectID = this.$route.params.id
        yaml = lockr.get('projects')[projectID].yaml
      }
      lockr.set('currentProjectID', projectID)

      return {
        projectID,
        yaml,
        errorMessage: false,
        lastValidParse: matter(''),
        codemirrorOpts: {
          mode: 'yaml-frontmatter',
          base: 'gfm',
          lineWrapping: true,
          lineNumbers: true
        }
      }
    },

    computed: {
      parsed () {
        let yaml

        try {
          yaml = matter(this.yaml)
          this.errorMessage = false
        } catch (e) {
          this.errorMessage = e.message
        }

        if (!this.errorMessage) {
          this.lastValidParse = yaml
          lockr.set('autosave', this.yaml)
        }

        return this.lastValidParse
      },
      preview () { return markdown.render(this.parsed.content) }
    },

    methods: {
      maybeSave () {
        const projectID = this.projectID
        let projects = lockr.get('projects') || {}
        projects[this.projectID] = {
          ID: this.projectID,
          yaml: this.yaml,
          parsed: this.lastValidParse,
          html: this.preview,
          created: projects[this.projectID] ? projects[this.projectID].created : new Date(),
          updated: projects[this.projectID] ? new Date() : ''
        }
        lockr.set('projects', projects)
        lockr.rm('autosave')

        this.$router.push(`/p/${projectID}`)
      },

      maybeNewProject () {
        this.yaml = ''
        this.projectID = uuid()
        lockr.set('currentProjectID', this.projectID)
      }
    }
  }
</script>

<style lang="sass">
  @import "./src/assets/sass/variables"

  .vue-codemirror, .CodeMirror
    height: 100%
    font-size: 13px

  .panel
    width: 50%
    height: 100%
    float: left
    position: relative
    overflow: auto

    &:last-child
      box-shadow: 0 0 3px rgba(0,0,0,0.35)

    &.has-errors
      border: 1px solid red

  .error-message
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    border: 2px solid $color-text
    padding: $padding-content

    pre
      position: relative
      font-size: 1em
      font-family: $font-mono
      font-weight: bold
      color: #fff

    &:before
      content: ''
      background: $color-text
      opacity: 0.9
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%

  @media screen and (max-width: $width-content * 1.5)
    .panel
      width: 100%
      float: none
      height: 50%

      &:last-child
</style>
