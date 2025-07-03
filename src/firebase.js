// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDoJv_5AOHv4xCXvANgPsFCuoh0oaeNzro",
  authDomain: "parking-app-5a7ad.firebaseapp.com",
  projectId: "parking-app-5a7ad",
  storageBucket: "parking-app-5a7ad.firebasestorage.app",
  messagingSenderId: "425528069666",
  appId: "1:425528069666:web:a07d9a8d2d70611636047b"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
