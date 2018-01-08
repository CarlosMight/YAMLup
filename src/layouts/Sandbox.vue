<template lang="pug">
  #layout-sandbox.full-height
    .panel
      codemirror(
        ref='editor'
        v-model='yaml'
        :options='codemirrorOpts'
      )
    .panel
      #layout-sandbox-preview.content-width(v-html='preview')
</template>

<script>
  import matter from 'gray-matter'
  import {codemirror} from 'vue-codemirror'
  import lockr from 'lockr'
  import markdown from '@/util/markdown'

  require('codemirror/lib/codemirror.css')
  require('codemirror/mode/yaml-frontmatter/yaml-frontmatter.js')
  require('codemirror/mode/gfm/gfm.js')

  export default {
    name: 'layout-sandbox',
    components: {codemirror},

    mounted () {
      this.$refs.editor.cminstance.focus()
    },

    data () {
      const autosaves = lockr.get('autosave') || ['']

      return {
        yaml: autosaves[0],
        codemirrorOpts: {
          mode: 'yaml-frontmatter',
          base: 'gfm',
          lineWrapping: true
        }
      }
    },

    watch: {
      yaml () {
        lockr.set('autosave', [this.yaml])
      }
    },

    computed: {
      parsed () { return matter(this.yaml) },
      preview () { return markdown.render(this.parsed.content) }
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

  #layout-sandbox-preview
    padding: $padding-main

  @media screen and (max-width: $width-content)
    .panel
      width: 100%
      float: none
      height: 50%

      &:last-child
</style>
