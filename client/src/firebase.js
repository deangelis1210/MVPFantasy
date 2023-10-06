import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDaspMWBKVkkHz6XbuLX3d-Jfl7CQ1O0oA",
  authDomain: "mvp-fantasy-b8921.firebaseapp.com",
  projectId: "mvp-fantasy-b8921",
  storageBucket: "mvp-fantasy-b8921.appspot.com",
  messagingSenderId: "1096891221490",
  appId: "1:1096891221490:web:ab7376d07d6e382826176b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getAuth(app);