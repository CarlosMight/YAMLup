import Vue from 'vue'
import firebase from '@/service/firebase'
import lockr from 'lockr'
import {size} from 'lodash'

export default {
  /**
   * Loads a single post, first by checking firebase and then locally
   *
   * @param  {STR} postID The postID to load
   * @return {PRM} returns a promise with the post data
   */
  get (postID) {
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
        }

        resolve({
          project,
          exists: !!size(project),
          isLocal: !doc.exists
        })
      }).catch((err) => {
        Vue.toasted.show(err.message, {type: 'error'})
        reject(err)
      })
    })
  },

  /**
   * Saves a project
   * @param  {OBJ} project The project object (must have an ID)
   * @return {PRM}         The firebase promise
   */
  save (project) {
    return new Promise((resolve, reject) => {
      firebase.firestore().collection('project').doc(project.ID).set(project, {merge: true}).then(() => {
        resolve()
      }).catch((err) => {
        Vue.toasted.show(err.message, {type: 'error'})
        reject(err)
      })
    })
  },

  /**
   * Queries the database for a project matching the criteria
   * @param  {ANY} where The left side of a comparison
   * @param  {STR} how   How to compare ('==', '<', '>', etc)
   * @param  {ANY} what  The right side of the comparison
   * @return {PRM}       Returns a promise containing a set of projects
   */
  query (left, compare, right) {
    return new Promise((resolve, reject) => {
      firebase.firestore().collection('project').where(left, compare, right).get().then((snap) => {
        let projects = {}
        snap.forEach((doc) => {
          projects[doc.data().ID] = doc.data()
        })
        resolve(projects)
      }).catch((err) => {
        Vue.toasted.show(err.message, {type: 'error'})
        reject(err)
      })
    })
  }
}
