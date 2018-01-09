<template lang="pug">
  #app-wrap.full-height
    nav
      div
        div
          router-link#logo(:to='{name: logoLink}')
            img(src='/static/img/favicon.png' height=40)
        .text-right
          router-link(to='/my/projects' :class='{active: $route.name === "myProjects"}') My projects
          button.error(v-if='isButtonVisible("delete")' @click='deleteProject')
            i.icon-bin2
          button.success(v-if='isButtonVisible("edit")' @click='editProject')
            i.icon-pencil
          button(@click='triggerNewProject')
            i.icon-file-empty
          button.success(v-if='$route.meta.canSave' @click='triggerSave')
            i.icon-floppy-disk
    router-view
</template>

<script>
  import lockr from 'lockr'
  import uuid from 'uuid/v1'

  export default {
    name: 'app',

    data () {
      return {
        logoLink: lockr.get('projects') ? 'myProjects' : 'sandbox'
      }
    },

    methods: {
      isButtonVisible (btnID) {
        switch (btnID) {
          case 'delete': return ['singleProject', 'editProject'].includes(this.$route.name)
          case 'edit': return this.$route.name === 'singleProject'
        }

        return false
      },

      triggerSave () { this.$bus.$emit('maybeSave') },

      triggerNewProject () {
        lockr.set('currentProjectID', uuid())
        this.$bus.$emit('maybeNewProject')
        this.$router.push({name: 'sandbox'})
      },

      editProject () {
        const id = this.$route.params.id
        this.$router.push({name: 'editProject', data: {id}})
      },

      deleteProject () {
        const id = this.$route.params.id
        this.$router.push({name: 'deleteProject', data: {id}})
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

      > div
        display: flex
        height: 100%

        > div
          flex: 1 1 100%
          padding: $padding-main

          &:last-child
            padding: 0 $padding-main

      button, a
        color: $color-text
        padding: $padding-main
        display: inline-block
        text-decoration: none
        line-height: $header-height - $padding-main * 2
        margin-left: $margin-main
        height: 100%
        background: none
        border: none
        cursor: pointer
        border-bottom: 1px solid $color-bg
        outline: none

        &.error
          color: $color-error
          &:hover
            border-color: $color-error

        &.success
          color: $color-success
          &:hover
            border-color: $color-success

        &:hover, &:focus, &.active
          border-color: $color-links

    #logo
      border-bottom: none
      padding: 0
</style>
