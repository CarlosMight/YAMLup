import Firebase from 'firebase'
import firebaseOpts from '@/config/firebase'
require('firebase/firestore')

Firebase.initializeApp(firebaseOpts)

export default Firebase
