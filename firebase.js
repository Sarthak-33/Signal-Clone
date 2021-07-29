import firebase from 'firebase/app'
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzYvFiyJHnBuMMpPcI0cmtMCFfK_5C1JI",
  authDomain: "signal-clone-3313.firebaseapp.com",
  projectId: "signal-clone-3313",
  storageBucket: "signal-clone-3313.appspot.com",
  messagingSenderId: "560802108995",
  appId: "1:560802108995:web:0366e8921b7dbeaf5266f6"
};

let app;

if (firebase.apps.length === 0){
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export {db, auth};