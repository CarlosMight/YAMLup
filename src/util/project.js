import Vue from 'vue'
import firebase from '@/service/firebase'
import lockr from 'lockr'
import {size} from 'lodash'

export default {
  /**
   * Loads a single post, first by checking firebase and then locally
   *
   * @param  {STR} postID The postID to load
   */
  loadSingle (postID) {
    return new Promise((resolve, reject) => {
      firebase.firestore().collection('project').doc(postID).get().then((doc) => {
        let projects
        let project = {}

        // Use data from firebase vs locally
        if (doc.exists) {
          project = doc.data()
        } else {
          projects = lockr.get('localProjects')
          if (projects) project = projects[postID] || {}
          console.log(projects, project, postID)
        }

        resolve({
          project,
          exists: !!size(project),
          isLocal: !doc.exists
        })
      }).catch((err) => {
        console.error(err)
        Vue.$toasted.show('There was an error getting the post.', {type: 'error'})
        reject(err)
      })
    })
  }
}
