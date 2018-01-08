<template lang="pug">
  div.full-height
    codemirror(
      ref='editor'
      v-model='yaml'
      :options='codemirrorOpts'
    )
</template>

<script>
  import {codemirror} from 'vue-codemirror'
  require('codemirror/lib/codemirror.css')
  require('codemirror/mode/yaml-frontmatter/yaml-frontmatter.js')
  require('codemirror/mode/gfm/gfm.js')

  export default {
    name: 'layout-sandbox',
    components: {codemirror},

    data () {
      return {
        yaml: '',
        codemirrorOpts: {
          mode: 'yaml-frontmatter',
          base: 'gfm',
          lineWrapping: true
        }
      }
    }
  }
</script>

<style lang="sass">
  .vue-codemirror, .CodeMirror
    height: 100%
</style>
