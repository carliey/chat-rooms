import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAFfcvG39Oe-brfVvUasULCxjbltvLcutM",
  authDomain: "chat-rooms-cd657.firebaseapp.com",
  projectId: "chat-rooms-cd657",
  storageBucket: "chat-rooms-cd657.appspot.com",
  messagingSenderId: "208274131098",
  appId: "1:208274131098:web:57b46f62d36189dd71b723",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

//create storage reference// Create a storage reference from our storage service
const storageRef = storage.ref();
const imagesRef = storageRef.child("images");
const profilePhotosRef = storageRef.child("profile photos");
//create reference to user collection
const usersRef = db.collection("users");

export { db, auth, imagesRef, profilePhotosRef, usersRef };
