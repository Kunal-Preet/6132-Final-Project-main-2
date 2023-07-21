

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut
 } from "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';


const firebaseConfig = {
  apiKey: "AIzaSyCAaPpklYUKiQD1aDWST6USZ-jBSzL2XEg",
  authDomain: "final-85b99.firebaseapp.com",
  projectId: "final-85b99",
  storageBucket: "final-85b99.appspot.com",
  messagingSenderId: "358852154381",
  appId: "1:358852154381:web:2e82379597ad4b5807b144",
  measurementId: "G-Z1HLS0JH0C"
};

// Initialize Firebase
if (!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { 
  db, 
  auth,
  storage, 
  firebase, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut
};