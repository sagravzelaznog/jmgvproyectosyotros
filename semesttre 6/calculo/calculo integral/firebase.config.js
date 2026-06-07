// firebase.config.js
// Configuración de Firebase para Cálculo Integral

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWi_ko-0i-esAuNiO5EIQe-gThnQ1-iaM",
  authDomain: "calculointegral-2601b.firebaseapp.com",
  projectId: "calculointegral-2601b",
  storageBucket: "calculointegral-2601b.firebasestorage.app",
  messagingSenderId: "818910932073",
  appId: "1:818910932073:web:b7e2e4bbd4033d250386f8",
  measurementId: "G-BBH4XLGFM3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Export for use in other files
export { app, analytics, auth, db, firebaseConfig };