import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8L14t4xwlY_EBZK3SPNaSwYsj-dEUiu8",
  authDomain: "pendaftaran-pasien-klinik.firebaseapp.com",
  projectId: "pendaftaran-pasien-klinik",
  storageBucket: "pendaftaran-pasien-klinik.firebasestorage.app",
  messagingSenderId: "665500523934",
  appId: "1:665500523934:web:f745704592b0faab248a8f",
  measurementId: "G-Y7WJYNT7LW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };