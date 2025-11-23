import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

/**
 * Komponen Halaman Pendaftaran Pasien
 * Form untuk registrasi pasien baru
 *
 * Fields:
 * - Nama Lengkap
 * - NIK (Nomor Identitas Kependudukan)
 * - Alamat
 * - Tanggal Lahir
 * - Nomor HP
 * - Keluhan Pasien
 * - Tombol Submit
 */
function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaLengkap: "",
    nik: "",
    alamat: "",
    tanggalLahir: "",
    nomorHp: "",
    keluhan: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Validasi form
  const validateForm = () => {
    if (!formData.namaLengkap.trim()) {
      return "Nama lengkap tidak boleh kosong";
    }
    if (!formData.nik.trim()) {
      return "NIK tidak boleh kosong";
    }
    if (formData.nik.trim().length !== 16) {
      return "NIK harus 16 digit";
    }
    if (!formData.alamat.trim()) {
      return "Alamat tidak boleh kosong";
    }
    if (!formData.tanggalLahir) {
      return "Tanggal lahir tidak boleh kosong";
    }
    if (!formData.nomorHp.trim()) {
      return "Nomor HP tidak boleh kosong";
    }
    if (!/^(\+62|0)[0-9]{9,12}$/.test(formData.nomorHp.trim())) {
      return "Nomor HP tidak valid";
    }
    if (!formData.keluhan.trim()) {
      return "Keluhan pasien tidak boleh kosong";
    }
    return "";
  };

  // Handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    // Simulasi submit ke backend
    console.log("Data Pendaftaran:", formData);

    // Tampilkan pesan sukses
    setSuccess(
      "Pendaftaran berhasil! Silakan login dengan data yang telah terdaftar."
    );
    setError("");

    // Reset form
    setFormData({
      namaLengkap: "",
      nik: "",
      alamat: "",
      tanggalLahir: "",
      nomorHp: "",
      keluhan: "",
    });

    // Redirect ke login setelah 2 detik
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Daftar Sebagai Pasien</h1>
        <p className="register-subtitle">
          Isi form di bawah untuk mendaftar sebagai pasien baru
        </p>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Nama Lengkap */}
          <div className="form-group">
            <label htmlFor="namaLengkap">
              Nama Lengkap <span className="required">*</span>
            </label>
            <input
              id="namaLengkap"
              type="text"
              name="namaLengkap"
              placeholder="Masukkan nama lengkap Anda"
              value={formData.namaLengkap}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* NIK */}
          <div className="form-group">
            <label htmlFor="nik">
              NIK (Nomor Identitas Kependudukan){" "}
              <span className="required">*</span>
            </label>
            <input
              id="nik"
              type="text"
              name="nik"
              placeholder="Masukkan NIK 16 digit Anda"
              maxLength="16"
              value={formData.nik}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Alamat */}
          <div className="form-group">
            <label htmlFor="alamat">
              Alamat <span className="required">*</span>
            </label>
            <textarea
              id="alamat"
              name="alamat"
              placeholder="Masukkan alamat lengkap Anda"
              rows="3"
              value={formData.alamat}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Tanggal Lahir */}
          <div className="form-group">
            <label htmlFor="tanggalLahir">
              Tanggal Lahir <span className="required">*</span>
            </label>
            <input
              id="tanggalLahir"
              type="date"
              name="tanggalLahir"
              value={formData.tanggalLahir}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Nomor HP */}
          <div className="form-group">
            <label htmlFor="nomorHp">
              Nomor HP <span className="required">*</span>
            </label>
            <input
              id="nomorHp"
              type="tel"
              name="nomorHp"
              placeholder="Masukkan nomor HP (contoh: 08123456789)"
              value={formData.nomorHp}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Keluhan Pasien */}
          <div className="form-group">
            <label htmlFor="keluhan">
              Keluhan Pasien <span className="required">*</span>
            </label>
            <textarea
              id="keluhan"
              name="keluhan"
              placeholder="Jelaskan keluhan atau gejala yang Anda alami"
              rows="4"
              value={formData.keluhan}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Error Message */}
          {error && <p className="error-message">{error}</p>}

          {/* Success Message */}
          {success && <p className="success-message">{success}</p>}

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary">
            Daftar
          </button>
        </form>

        {/* Link ke Login */}
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

export default Register;
