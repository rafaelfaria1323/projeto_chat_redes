import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAyrBcj5Dqeh5yb3V0FIYHS0Wcbosd9Lwc",
  authDomain: "chat-fire-7d63f.firebaseapp.com",
  databaseURL: "https://chat-fire-7d63f.firebaseio.com",
  projectId: "chat-fire-7d63f",
  storageBucket: "chat-fire-7d63f.appspot.com",
  messagingSenderId: "691038644982",
  appId: "1:691038644982:web:ed1d49b873ba5fac5e9ad7",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
