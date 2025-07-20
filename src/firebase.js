// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCbVKb3eNnxl1P8IZ07_4nYWc1K4tQ8zxM",
  authDomain: "fire-base-hosting-app.firebaseapp.com",
  projectId: "fire-base-hosting-app",
  storageBucket: "fire-base-hosting-app.firebasestorage.app",
  messagingSenderId: "677559062443",
  appId: "1:677559062443:web:d6e37d8fb1a37d5b13ccee",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
