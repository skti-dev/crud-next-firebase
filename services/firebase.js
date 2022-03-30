import firebase from 'firebase/app'
import 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDZl-9LlNpu4fO9_0JowqPYoZPw775k_GI",
  authDomain: "crud-next-firebase-90100.firebaseapp.com",
  projectId: "crud-next-firebase-90100",
  storageBucket: "crud-next-firebase-90100.appspot.com",
  messagingSenderId: "736908588183",
  appId: "1:736908588183:web:177ce087628977046ce5d2"
}

if(!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}else {
  firebase.app()
}

const database = firebase.database()

export { database, firebase }
