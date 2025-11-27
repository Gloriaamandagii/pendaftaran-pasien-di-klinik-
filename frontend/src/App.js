import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login";
import Register2 from "./pages/register2";
import Dashboard from "./pages/dashboard";
import "./assets/css/pasien.css";

/**
 * Komponen utama App
 * Menangani routing untuk aplikasi pendaftaran pasien
 *
 * Routes:
 * - /login → Halaman Login Admin
 * - /dashboard → Halaman Dashboard Admin (protected)
 * - / → Redirect ke /login atau /dashboard
 */
function App() {
  // Status login admin
  const [user, setUser] = useState(null);

  // Handle login admin
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Rute Login Admin */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Rute Register Akun */}
        <Route path="/register2" element={<Register2 />} />

        {/* Rute Dashboard Admin */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Rute Default - Redirect ke Login atau Dashboard */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Rute 404 - Redirect ke Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
