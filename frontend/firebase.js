// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "gastronomy-food-delivery.firebaseapp.com",
  projectId: "gastronomy-food-delivery",
  storageBucket: "gastronomy-food-delivery.firebasestorage.app",
  messagingSenderId: "853519634974",
  appId: "1:853519634974:web:986c3cacdf5419ce92d40f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {app,auth}