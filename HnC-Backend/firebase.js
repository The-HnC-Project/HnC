import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { config } from "dotenv";
config();
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { encrypt } from "./util.js";
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: "the-hnc-129a2.firebaseapp.com",
  projectId: "the-hnc-129a2",
  storageBucket: "the-hnc-129a2.appspot.com",
  messagingSenderId: "216435927604",
  appId: "1:216435927604:web:9cdac98b77d1b51231b861",
  measurementId: "G-QXN5WKZ3VX",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);


export default db;
