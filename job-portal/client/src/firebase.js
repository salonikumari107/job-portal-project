import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Screenshot (126) se li gayi bilkul sahi config
const firebaseConfig = {
  apiKey: "AIzaSyAxyBsqEvQ-MSySTqbMh35UZhm-92g1_Wc",
  authDomain: "job-portal-web-e2957.firebaseapp.com",
  projectId: "job-portal-web-e2957",
  storageBucket: "job-portal-web-e2957.firebasestorage.app",
  messagingSenderId: "663624435056",
  appId: "1:663624435056:web:7c8221e50565ccf0d9bbb5",
  measurementId: "G-SP8VGMR8QF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Auth functionality ke liye
export const db = getFirestore(app); // Database storage ke liye