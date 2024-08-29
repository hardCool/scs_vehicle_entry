// Import the necessary functions from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_FPQl2krPxUAyikSIsZS0YUsZD0ShbVs",
  authDomain: "testvehicleentry.firebaseapp.com",
  projectId: "testvehicleentry",
  storageBucket: "testvehicleentry.appspot.com",
  messagingSenderId: "591820370546",
  appId: "1:591820370546:web:dd928800a81967091308eb",
  measurementId: "G-DCN7GSKH58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
