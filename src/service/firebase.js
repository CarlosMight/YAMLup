import firebase from 'firebase'
import firebaseOpts from '@/config/firebase'
require('firebase/firestore')

firebase.initializeApp(firebaseOpts)

export default firebase
