import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Register2() {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama.trim() || !email.trim() || !password.trim()) {
      setError("Nama, email, dan password tidak boleh kosong");
      setSuccess("");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("✓ Pendaftaran berhasil! Silakan login.");
      setError("");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/email-already-in-use") {
        setError("Email sudah terdaftar. Silakan gunakan email lain.");
      } else if (code === "auth/invalid-email") {
        setError("Format email tidak valid.");
      } else if (code === "auth/weak-password") {
        setError("Password terlalu lemah. Minimal 6 karakter.");
      } else {
        setError("Gagal mendaftar. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Buat Akun Baru</h1>
        <p>Daftarkan akun Anda untuk melanjutkan</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="nama">Nama</label>
            <input
              id="nama"
              type="text"
              placeholder="Masukkan nama Anda"
              value={nama}
              onChange={(e) => {
                setNama(e.target.value);
                setError("");
                setSuccess("");
              }}
              className="form-input"
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">📧 Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setSuccess("");
              }}
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">🔐 Password</label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
                setSuccess("");
              }}
              className="form-input"
              disabled={loading}
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || success}
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>
        <div className="register-footer">
          <p>
            Sudah punya akun?{" "}
            <Link to="/login" className="link">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register2;
