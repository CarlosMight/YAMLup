import firebase from '@/service/firebase'
import lockr from 'lockr'

export default {
  /**
   * Loads a single post, first by checking firebase and then locally
   *
   * @param  {STR} postID The postID to load
   */
  loadSingle (postID) {
    return new Promise((resolve, reject) => {
      firebase.firestore().collection('project').doc(postID).get().then((doc) => {
        // @FIXME Add a nicer message
        const error404 = '<h1>Sorry, this project does not exist.</h1>'
        let message = ''
        let isError = false

        // Use data from firebase vs locally
        if (doc.exists) {
          message = doc.data().html
        } else {
          const projects = lockr.get('localProjects')
          const project = projects ? projects[postID] : {}

          if (project && project.html) {
            message = project.html
          } else {
            isError = true
            message = error404
          }
        }

        resolve({
          message,
          isError,
          isLocal: !doc.exists
        })
      }).catch((err) => {
        console.error(err)
        this.$toasted.show('There was an error getting the post.', {type: 'error'})
        reject(err)
      })
    })
  }
}
