import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
 // pastikan sudah benar path-nya

/**
 * Halaman Login Admin
 */
function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Submit Login
   */
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

      if (code === "auth/user-not-found") {
        setError("Akun tidak ditemukan. Daftar terlebih dahulu.");
      } else if (code === "auth/wrong-password") {
        setError("Password salah.");
      } else if (code === "auth/invalid-email") {
        setError("Format email tidak valid.");
      } else {
        setError("Gagal login. Cek kredensial atau koneksi.");
      }
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
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">📧 Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              disabled={loading}
              autoFocus
              className="form-input"
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setSuccess("");
              }}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">🔐 Password</label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              disabled={loading}
              className="form-input"
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
                setSuccess("");
              }}
            />
          </div>

          {/* Error */}
          {error && <p className="error-message">{error}</p>}

          {/* Success */}
          {success && <p className="success-message">{success}</p>}

          {/* Tombol */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={success || loading}
            style={{
              opacity: success ? 0.8 : 1,
              cursor: success ? "not-allowed" : "pointer",
            }}
          >
            {success ? "⏳ Sedang login..." : loading ? "•••" : "✓ Masuk"}
          </button>
        </form>

        {/* Footer */}
        <div className="register-footer">
          <p>
            Belum punya akun?{" "}
            <Link to="/register2" className="link">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
