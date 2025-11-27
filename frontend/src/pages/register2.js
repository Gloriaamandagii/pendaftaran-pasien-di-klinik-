import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";


function Register2() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nama, setNama] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !nama.trim()) {
      setError("Semua field wajib diisi.");
      setSuccess("");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Buat akun di Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2️⃣ Simpan data tambahan ke Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        nama,
        email,
        role: "staff",
        createdAt: new Date(),
      });

      setSuccess("Akun berhasil dibuat!");
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      const code = err.code;

      if (code === "auth/email-already-in-use")
        setError("Email sudah terdaftar.");
      else if (code === "auth/invalid-email")
        setError("Format email tidak valid.");
      else if (code === "auth/weak-password")
        setError("Password minimal 6 karakter.");
      else setError("Gagal mendaftar.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Daftar Akun Baru</h1>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>

        <p>
          Sudah punya akun? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register2;
