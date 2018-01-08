<template lang="pug">
  #layout-sandbox.full-height
    .panel
      codemirror(
        ref='editor'
        v-model='yaml'
        :options='codemirrorOpts'
      )
    .panel
      .content-width(v-html='preview')
</template>

<script>
  import matter from 'gray-matter'
  import {codemirror} from 'vue-codemirror'
  import lockr from 'lockr'

  require('codemirror/lib/codemirror.css')
  require('codemirror/mode/yaml-frontmatter/yaml-frontmatter.js')
  require('codemirror/mode/gfm/gfm.js')

  const markdown = require('markdown-it')({
    html: true
  })

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
  .vue-codemirror, .CodeMirror
    height: 100%

  .panel
    width: 50%
    height: 100%
    float: left
</style>
