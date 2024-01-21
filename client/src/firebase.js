// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-a6c69.firebaseapp.com",
  projectId: "mern-blog-a6c69",
  storageBucket: "mern-blog-a6c69.appspot.com",
  messagingSenderId: "119824101234",
  appId: "1:119824101234:web:517a4763fa2bb2660737eb",
  measurementId: "G-XNWX4642VR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);