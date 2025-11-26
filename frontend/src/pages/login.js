import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

/**
 * Komponen Halaman Login Admin
 */
function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");        // changed: email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email dan password tidak boleh kosong");
      setSuccess("");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("✓ Login berhasil! Mengalihkan ke dashboard...");
      setError("");
      setTimeout(() => {
        onLogin?.();
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/user-not-found") setError("Akun tidak ditemukan. Daftar terlebih dahulu.");
      else if (code === "auth/wrong-password") setError("Password salah.");
      else if (code === "auth/invalid-email") setError("Format email tidak valid.");
      else setError("Gagal login. Cek kredensial atau koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🏥 Login Elang DevOps</h1>
        <p>Masukkan email dan password untuk mengakses dashboard</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">📧 Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); setSuccess(""); }}
              className="form-input"
              autoFocus
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
              onChange={(e) => { setPassword(e.target.value); setError(""); setSuccess(""); }}
              className="form-input"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && <p className="error-message">{error}</p>}

          {/* Success Message */}
          {success && <p className="success-message">{success}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={success ? true : false}
            style={{
              opacity: success ? 0.8 : 1,
              cursor: success ? "not-allowed" : "pointer",            }}          >            {success ? "⏳ Sedang login..." : "✓ Masuk"}          </button>        </form>      </div>    </div>  );}export default Login;