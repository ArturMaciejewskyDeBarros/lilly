// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAI4F5lXmYyLGcePYRU0kSfkhtFdvO22Eo",
  authDomain: "lilly-dfd6c.firebaseapp.com",
  projectId: "lilly-dfd6c",
  storageBucket: "lilly-dfd6c.appspot.com",
  messagingSenderId: "155598631884",
  appId: "1:155598631884:web:9eb471e9a7cef318126369",
  measurementId: "G-032VL1XNWS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Export the Firebase auth and db objects so that they can be used elsewhere in your project
export { auth, db };
