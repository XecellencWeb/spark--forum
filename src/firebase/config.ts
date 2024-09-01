// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5TaXar-TQ9OKbjMILReXmFt8FTNDPn_g",
  authDomain: "spark-forum-296e6.firebaseapp.com",
  projectId: "spark-forum-296e6",
  storageBucket: "spark-forum-296e6.appspot.com",
  messagingSenderId: "381097942564",
  appId: "1:381097942564:web:976c85a79021c553d702b1",
  measurementId: "G-R3C8ZXF2L3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)