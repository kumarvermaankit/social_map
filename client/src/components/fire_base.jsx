import firebase from "firebase/app"
import "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyCKv3tYJBx6hE1OwinWicZ7z_35C-lwLrI",
  authDomain: "socialmap-86dc8.firebaseapp.com",
  projectId: "socialmap-86dc8",
  storageBucket: "socialmap-86dc8.appspot.com",
  messagingSenderId: "142020299424",
  appId: "1:142020299424:web:0f17d140e093b17e3217c5",
  measurementId: "G-TGKP5CSW6E"
};


firebase.initializeApp(firebaseConfig)

const storage = firebase.storage();

export { storage, firebase as default }