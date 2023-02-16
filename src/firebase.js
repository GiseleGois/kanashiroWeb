// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
import 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNv6Gf32bZ1hCZPyUWOYRq5WsVSthuXrc",
  authDomain: "kanashiro-pasteis.firebaseapp.com",
  databaseURL: "https://kanashiro-pasteis-default-rtdb.firebaseio.com",
  projectId: "kanashiro-pasteis",
  storageBucket: "kanashiro-pasteis.appspot.com",
  messagingSenderId: "696012329640",
  appId: "1:696012329640:web:d841e8a347f70450c2a89d",
  measurementId: "G-G4K9FWPRCT"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };