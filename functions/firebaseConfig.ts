import firebase from 'firebase';
import "firebase/firestore";
import firebaseEnv from '../firebaseEnv'

const firebaseConfig = firebaseEnv
const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app()

export const db = firebaseApp.firestore()
export default firebaseApp
