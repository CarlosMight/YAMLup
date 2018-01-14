<template lang="pug">
  div.full-height(v-if='!isLoading')
    #layout-sandbox(v-if='exists').full-height
      //- Codemirro
      .panel
        codemirror(
          ref='editor'
          v-model='yaml'
          :options='codemirrorOpts')

      //- Preview
      .panel
        .error-message(v-if='errorMessage')
          pre {{errorMessage}}
        project-single(:html='preview')

    //- 404
    .container(v-else)
      blockquote.error This post does not exist.

  .container(v-else)
    spinner
</template>

<script>
  /**
   * The main YAMLup editor
   * - This is used for both edit and create
   */
  import matter from 'gray-matter'
  import {mapState} from 'vuex'
  import codemirror from '@/setup/codemirror'
  import Project from '@/util/project'
  import lockr from 'lockr'
  import uuid from 'uuid/v1'
  import markdown from '@/util/markdown'
  import PERMISSIONS from '@/config/permissions'

  export default {
    name: 'layout-sandbox',
    components: {codemirror},

    created () {
      if (this.isEditMode) {
        this.isLoading = true
        Project.get(this.projectID).then((res) => {
          if (res.project.userID === this.user.uid || res.isLocal) {
            this.isLoading = false
            this.exists = res.exists
            this.yaml = res.project.yaml
            this.projectID = res.project.ID
            this.userID = res.project.userID
            this.setPermissions()
            this.focusEditor()
          } else {
            this.$toasted.show("Sorry, you don't have permission to edit this proejct.", {type: 'error'})
            this.$router.push({name: 'singleProject', params: {id: res.project.ID}})
          }
        })
      } else {
        this.setPermissions()
        this.focusEditor()
      }
    },

    mounted () {
      this.$bus.$on('maybeSave', this.maybeSave)
      this.$bus.$on('maybeNewProject', this.maybeNewProject)
      this.focusEditor()
    },

    destroyed () {
      this.$bus.$off('maybeSave', this.maybeSave)
      this.$bus.$off('maybeNewProject', this.maybeNewProject)
    },

    data () {
      return {
        projectID: this.$route.name === 'editProject' ? this.$route.params.id : uuid(),
        // Only populated for edits
        userID: null,

        exists: true,
        // Used for the preview overlay when there's an error
        errorMessage: false,
        yaml: lockr.get('autosave') || '',
        // This is what's actually saved in the autosave, preventing broken loads
        lastValidParse: matter(''),

        isLoading: false,
        isEditMode: this.$route.name !== 'sandbox',

        codemirrorOpts: {
          mode: 'yaml-frontmatter',
          base: 'gfm',
          lineWrapping: true,
          lineNumbers: true,
          tabSize: 2,
          keyMap: 'sublime'
        }
      }
    },

    computed: mapState({
      user: 'user',

      parsed () {
        let yaml

        // Catch yaml front matter errors
        try {
          yaml = matter(this.yaml)
          this.errorMessage = false
        } catch (e) {
          this.errorMessage = e.message
        }

        // Save good changes to the autosave
        if (!this.errorMessage) {
          this.lastValidParse = yaml
          lockr.set('autosave', this.yaml)
        }

        return this.lastValidParse
      },

      preview () { return markdown.render(this.parsed.content) }
    }),

    methods: {
      /**
       * Prepare the save data
       */
      maybeSave () {
        let project = {
          ID: this.projectID,
          yaml: this.yaml,
          parsed: this.lastValidParse,
          html: this.preview,
          username: this.user.uid ? this.user.displayName : 'Anon',
          userID: this.user.uid || 'anon'
        }

        if (this.isEditMode) {
          project.created = new Date()
        } else {
          project.updated = new Date()
        }

        this.saveProject(project)
      },

      /**
       * Actually save the project, either to Firebase or localStorage
       */
      saveProject (project) {
        // Save on Firebase
        if (this.user.uid) {
          Project.save(project).then(() => {
            this.$toasted.show('Project saved!', {type: 'success'})
            this.finishSave()
          })
        // Save locally
        } else {
          let projects = lockr.get('localProjects') || {}
          projects[project.ID] = project
          lockr.set('localProjects', projects)
          this.finishSave()
        }
      },

      /**
       * Cleans up data and redirects to the post preview
       */
      finishSave () {
        this.$bus.$emit('runNotificationChecks')
        this.$router.push(`/p/${this.projectID}`)
        lockr.rm('autosave')
      },

      /**
       * Clears everything out
       */
      maybeNewProject () {
        this.yaml = ''
        this.projectID = uuid()
        lockr.rm('autosave')
      },

      focusEditor () {
        this.$nextTick(() => {
          if (this.$refs.editor) this.$refs.editor.cminstance.focus()
        })
      },

      setPermissions () {
        let perms = PERMISSIONS.none

        if (!this.isEditMode || (this.userID === this.user.uid || this.userID === 'anon')) perms = PERMISSIONS.all
        if (!this.isEditMode) perms.canDelete = false
        perms.canEdit = false

        this.$store.commit('setPermission', perms)
      }
    }
  }
</script>

<style lang="sass">
  @import "./src/assets/sass/variables"

  .vue-codemirror, .CodeMirror.CodeMirror-wrap
    height: 100%
    font-size: 13px

  #layout-sandbox
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
    #layout-sandbox
      .panel
        width: 100%
        float: none
        height: 50%

        &:last-child
</style>
