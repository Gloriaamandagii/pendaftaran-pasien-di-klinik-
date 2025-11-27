import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usia, setUsia] = useState("");
  const [alamat, setAlamat] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Buat akun di Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 2️⃣ Simpan data pasien ke Firestore berdasarkan UID
      await setDoc(doc(db, "pasien", user.uid), {
        uid: user.uid,
        nama: nama,
        email: email,
        usia: usia,
        alamat: alamat,
        createdAt: new Date(),
      });

      alert("Akun dan data pasien berhasil dibuat!");

    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mendaftar: " + error.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input type="text" placeholder="Nama" onChange={(e) => setNama(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <input type="number" placeholder="Usia" onChange={(e) => setUsia(e.target.value)} />
      <input type="text" placeholder="Alamat" onChange={(e) => setAlamat(e.target.value)} />
      <button type="submit">Daftar</button>
    </form>
  );
}
