import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Komponen Halaman Login Admin
 * Login dengan username dan password yang sudah fixed
 *
 * Credentials:
 * - Username: admin
 * - Password: admin123
 */
function Login({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Credentials admin yang fixed
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "admin123";

  // Handle submit form login
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi input
    if (!username.trim() || !password.trim()) {
      setError("Username dan password tidak boleh kosong");
      setSuccess("");
      return;
    }

    // Validasi kredensial admin
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setSuccess("✓ Login berhasil! Mengalihkan ke dashboard...");
      setError("");
      setTimeout(() => {
        onLogin();
        navigate("/dashboard");
      }, 1500);
    } else {
      setError("❌ Username atau password salah");
      setSuccess("");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🏥 Login Admin </h1>
        <p>Masukkan kredensial admin untuk mengakses dashboard</p>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Username Input */}
          <div className="form-group">
            <label htmlFor="username">👤 Username</label>
            <input
              id="username"
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError("");
                if (success) setSuccess("");
              }}
              className="form-input"
              autoFocus
              disabled={success ? true : false}
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">🔐 Password</label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
                if (success) setSuccess("");
              }}
              className="form-input"
              disabled={success ? true : false}
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
              cursor: success ? "not-allowed" : "pointer",
            }}
          >
            {success ? "⏳ Sedang login..." : "✓ Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
