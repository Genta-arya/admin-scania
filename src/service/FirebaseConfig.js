// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyAVAa1n3KFbokVqoxgbhm8qZKXAxChfoxA",
    authDomain: "inventaris-15fde.firebaseapp.com",
    projectId: "inventaris-15fde",
    storageBucket: "inventaris-15fde.appspot.com",
    messagingSenderId: "666060624790",
    appId: "1:666060624790:web:1176b5fff172d2881bc3b7",
    measurementId: "G-WNZWRN960Z"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage and export it for use in the project
const storage = getStorage(app);

export default app;
export { storage };
