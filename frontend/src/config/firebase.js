/**
 * Konfigurasi Firebase
 * File ini dapat digunakan untuk integrasi dengan Firebase
 *
 * Untuk menggunakan Firebase:
 * 1. Install firebase: npm install firebase
 * 2. Buat project di https://console.firebase.google.com
 * 3. Salin konfigurasi dari Firebase Console
 * 4. Replace firebaseConfig dengan data asli Anda
 */

// Konfigurasi Firebase (Dummy - ganti dengan data asli Anda)
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyHereReplaceWithYourKey",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456",
};

// Import Firebase (Uncomment ketika sudah install)
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// Export services (Uncomment ketika sudah install)
// export { auth, db };

// Untuk saat ini, export object kosong sebagai placeholder
export const firebase = {
  config: firebaseConfig,
  message:
    "Firebase belum dikonfigurasi. Uncomment kode di atas untuk mengaktifkan.",
};
