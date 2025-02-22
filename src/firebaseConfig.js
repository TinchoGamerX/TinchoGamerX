import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDC-ydZ1MIRcuiexBq8pFnOnAgcA2GHUqM",
  authDomain: "last-day-on-earth-app.firebaseapp.com",
  projectId: "last-day-on-earth-app",
  storageBucket: "last-day-on-earth-app.appspot.com",
  messagingSenderId: "994225541361",
  appId: "1:994225541361:web:2eb225aee9d5dd5ef99950",
  measurementId: "G-5Y9X54HFQL"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


