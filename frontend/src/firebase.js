// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "webeliteblog.firebaseapp.com",
  projectId: "webeliteblog",
  storageBucket: "webeliteblog.firebasestorage.app",
  messagingSenderId: "684225666503",
  appId: "1:684225666503:web:79f2eb09245ba49f544de2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);