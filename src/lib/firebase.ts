// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "brand-clarity-compass-v8p37",
  appId: "1:439135907485:web:6c877249944d1ad18aae74",
  storageBucket: "brand-clarity-compass-v8p37.firebasestorage.app",
  apiKey: "AIzaSyDD6vOsTM02ik0Wif-kXlN-KM5x6pieY-o",
  authDomain: "brand-clarity-compass-v8p37.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "439135907485"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
