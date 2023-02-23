import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
