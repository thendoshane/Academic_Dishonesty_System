// Firebase scripts
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
apiKey: "AIzaSyA9d78x1She0sBMzZ4bLFDWT5njYNRa8gQ",
authDomain: "academic-dishonesty.firebaseapp.com",
projectId: "academic-dishonesty",
storageBucket: "academic-dishonesty.appspot.com",
messagingSenderId: "951390234868",
appId: "1:951390234868:web:97ee9943f76436ddc516a1",
measurementId: "G-TS6W0RGWMS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);