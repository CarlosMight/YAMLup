<template lang="pug">
  div.full-height(v-if='!isLoading')
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
  import firebase from '@/service/firebase'

  export default {
    name: 'layout-sandbox',
    components: {codemirror},

    created () {
      if (!lockr.get('autosave')) {
        this.isLoading = true
        Project.loadSingle(this.projectID).then((res) => {
          this.isLoading = false
          this.yaml = res.project.yaml || ''
          this.focusEditor()
        })
      }
    },

    mounted () {
      this.focusEditor()
      this.$bus.$on('maybeSave', this.maybeSave)
      this.$bus.$on('maybeNewProject', this.maybeNewProject)
    },

    destroyed () {
      this.$bus.$off('maybeSave', this.maybeSave)
      this.$bus.$off('maybeNewProject', this.maybeNewProject)
    },

    data () {
      let projectID = lockr.get('currentProjectID') || uuid()

      if (this.$route.name === 'editProject') {
        projectID = this.$route.params.id
        this.isLoading = true
      }
      lockr.set('currentProjectID', projectID)

      return {
        projectID,
        yaml: lockr.get('autosave') || '',
        errorMessage: false,
        lastValidParse: matter(''),
        isLoading: false,
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
    }),

    methods: {
      maybeSave () {
        const projectID = this.projectID
        let projects = lockr.get('localProjects') || {}
        let project = projects[this.projectID] = {
          ID: this.projectID,
          yaml: this.yaml,
          parsed: this.lastValidParse,
          html: this.preview,
          created: projects[this.projectID] ? projects[this.projectID].created : new Date(),
          updated: projects[this.projectID] ? new Date() : '',
          username: this.user.uid ? this.user.displayName : 'Anon',
          userID: this.user.uid || 'anon'
        }
        lockr.rm('autosave')

        if (!this.user.uid) {
          lockr.set('localProjects', projects)
          this.$bus.$emit('runNotificationChecks')
          this.$router.push(`/p/${projectID}`)
        } else {
          const db = firebase.firestore()

          // @TODO catch errors
          db.collection('project').doc(this.projectID).set(project, {merge: true}).then(() => {
            this.$bus.$emit('runNotificationChecks')
            this.$router.push(`/p/${projectID}`)
          })
        }
      },

      maybeNewProject () {
        this.yaml = ''
        this.projectID = uuid()
        lockr.set('currentProjectID', this.projectID)
      },

      focusEditor () {
        if (this.$refs.editor) this.$refs.editor.cminstance.focus()
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
