<template lang="pug">
  #app-wrap.full-height
    nav
      div
        router-link(to='/')
          img(src='/static/img/favicon.png' height=40)
      .text-right
        router-link(v-if="showMyProjectsBtn" to='/my/projects') My projects
        button(@click='triggerSave') Save Locally
        button(@click='triggerNewProject') New Project
    router-view
</template>

<script>
  import lockr from 'lockr'

  export default {
    name: 'app',

    methods: {
      triggerSave () { this.$bus.$emit('maybeSave') },
      triggerNewProject () { this.$bus.$emit('maybeNewProject') }
    },

    data () {
      return {
        showMyProjectsBtn: !!lockr.get('projects')
      }
    }
  }
</script>

<style lang="sass">
  @import "./src/assets/sass/main"

  #app-wrap
    padding-top: $header-height

    > nav
      position: absolute
      z-index: 100
      top: 0
      left: 0
      height: $header-height
      width: 100%
      box-shadow: 0 0 3px rgba(0,0,0,0.35)
      background: #fff
      display: flex

      > div
        flex: 1 1 100%
        padding: $padding-main

        &:last-child
          padding: 0 $padding-main

        button, a
          color: $color-text
          display: inline-block
          text-decoration: none
          line-height: $header-height - 1
          margin-left: $margin-main
          height: 100%
          background: none
          border: none
          cursor: pointer
          border-bottom: 1px solid $color-bg
          outline: none

          &:first-child
            margin-left: 0

          &:hover, &:focus
            border-color: $color-links
</style>
