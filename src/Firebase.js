// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQMgOcpmxygGHJqrc45OsUSLVf4GEayGo",
  authDomain: "misa-misa-a92a7.firebaseapp.com",
  projectId: "misa-misa-a92a7",
  storageBucket: "misa-misa-a92a7.appspot.com",
  messagingSenderId: "319266671283",
  appId: "1:319266671283:web:d736ef0498c53779a97ec6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);