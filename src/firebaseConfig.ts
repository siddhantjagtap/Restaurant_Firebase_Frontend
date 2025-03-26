// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, Firestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase config for bo-tai project
const firebaseConfigBoTai = {
  apiKey: "AIzaSyBEGOee5V-A1JPEDFM0qDHvZ35BzSi36j8", // Replace with the correct API key
  authDomain: "bo-tai-5d1e7.firebaseapp.com",
  projectId: "bo-tai-5d1e7",
};

// Firebase config for Swan project
const firebaseConfigSwan = {
  apiKey: "AIzaSyBZIjQQInUDwGlBTuWYhgbLTzFwG20tU3A", // Verify this API key as well
  authDomain: "swan-a3516.firebaseapp.com",
  projectId: "swan-a3516",
};

// Initialize both Firebase projects
const boTaiApp = initializeApp(firebaseConfigBoTai, "boTai");
const swanApp = initializeApp(firebaseConfigSwan, "swan");

// Firestore instances
const dbBoTai: Firestore = getFirestore(boTaiApp);
const dbSwan: Firestore = getFirestore(swanApp);

// Firebase Auth instance
const auth = getAuth(boTaiApp);

export { dbBoTai, dbSwan, collection, getDocs, boTaiApp, auth };