// src/pages/dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Home,
  Send,
  Plus,
  Menu,
  X,
  User,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  LogOut,
  Trash2,
  Eye,
  Edit,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import MedicalRecordModal from "../components/MedicalRecordModal";

/**
 * Komponen Halaman Dashboard Admin Klinik
 * Dashboard untuk mengelola pendaftaran pasien
 *
 * Catatan perubahan (non-fungsional):
 * - Menambahkan useEffect untuk menyuntikkan stylesheet (aman di React)
 * - Menambahkan beberapa className agar responsive CSS bekerja
 * - Tidak mengubah alur/logika Anda sama sekali
 */

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();

  // UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState(null);

  // Data state
  const [patients, setPatients] = useState([]);
  const patientsCollectionRef = collection(db, "patients");

  // Fetch data from Firestore
  const getPatients = async () => {
    try {
      const data = await getDocs(patientsCollectionRef);
      setPatients(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    getPatients();
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    namaLengkap: "",
    nik: "",
    alamat: "",
    tanggalLahir: "",
    nomorHp: "",
    keluhan: "",
  });

  // Styles/colors (dipertahankan sebagai inline style object)
  const colors = {
    primary: "rgb(59 130 246)",
    primaryDark: "rgb(37 99 235)",
    danger: "rgb(239 68 68)",
    dangerDark: "rgb(220 38 38)",
    edit: "rgb(245 158 11)",
    editDark: "rgb(217 119 6)",
    info: "rgb(99 102 241)", // Indigo
    infoDark: "rgb(79 70 229)",
    background: "rgb(243 244 246)",
    surface: "#FFFFFF",
    textPrimary: "rgb(17 24 39)",
    textSecondary: "rgb(107 114 128)",
    borderColor: "rgb(229 231 235)",
    statusWaiting: "rgb(234 179 8)", // Yellow
    statusChecking: "rgb(59 130 246)", // Blue
    statusFinished: "rgb(34 197 94)", // Green
  };

  const styles = {
    colors,
    container: {
      minHeight: "100vh",
      backgroundColor: colors.background,
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
    },
    navbar: {
      backgroundColor: colors.surface,
      borderBottom: `1px solid ${colors.borderColor}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    navContent: {
      maxWidth: "1600px",
      margin: "0 auto",
      padding: "16px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    logo: {
      fontSize: "1.4rem",
      fontWeight: "800",
      color: colors.primary,
    },
    logoText: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    navRight: {
      display: "flex",
      gap: "16px",
      alignItems: "center",
    },
    navButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 20px",
      backgroundColor: colors.primary,
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.2s ease-in-out",
    },
    logoutBtn: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 20px",
      backgroundColor: colors.danger,
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.2s ease-in-out",
    },
    mobileMenuBtn: {
      display: "none",
      background: "none",
      border: "none",
      color: colors.primary,
      cursor: "pointer",
      fontSize: "24px",
    },
    mobileMenu: {
      display: "none",
      borderTop: `1px solid ${colors.borderColor}`,
      padding: "12px 20px",
      gap: "10px",
      flexDirection: "column",
      backgroundColor: colors.primary,
    },
    mainContent: {
      flex: 1,
      maxWidth: "1600px",
      margin: "0 auto",
      padding: "40px 30px",
      width: "100%",
    },
    pageTitle: {
      fontSize: "2.25rem",
      color: colors.textPrimary,
      marginBottom: "30px",
      fontWeight: "800",
    },
    statsSection: {
      marginBottom: "40px",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "24px",
    },
    statCard: {
      backgroundColor: colors.surface,
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      display: "flex",
      gap: "20px",
      alignItems: "center",
      transition: "all 0.3s ease",
      border: `1px solid ${colors.borderColor}`,
    },
    statIcon: {
      fontSize: "2.5rem",
      padding: "10px",
      borderRadius: "50%",
      backgroundColor: `${colors.primary}1A`,
      color: colors.primary,
    },
    statInfo: {
      flex: 1,
    },
    statNumber: {
      fontSize: "2rem",
      fontWeight: "700",
      color: colors.primary,
    },
    statLabel: {
      fontSize: "0.9rem",
      color: colors.textSecondary,
      marginTop: "5px",
    },
    chartSection: {
      backgroundColor: colors.surface,
      padding: "40px",
      borderRadius: "16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      marginBottom: "40px",
      border: `1px solid ${colors.borderColor}`,
    },
    formSection: {
      backgroundColor: colors.surface,
      padding: "40px",
      borderRadius: "16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      marginBottom: "40px",
      border: `1px solid ${colors.borderColor}`,
    },
    formHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      borderBottom: `2px solid ${colors.borderColor}`,
      paddingBottom: "20px",
    },
    formTitle: {
      fontSize: "1.75rem",
      color: colors.textPrimary,
      margin: 0,
      fontWeight: "700",
    },
    closeFormBtn: {
      background: "transparent",
      border: "none",
      color: colors.textSecondary,
      cursor: "pointer",
      fontSize: "28px",
      transition: "color 0.2s ease",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "25px",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      fontSize: "0.9rem",
      fontWeight: "600",
      color: colors.textPrimary,
    },
    input: {
      padding: "12px 16px",
      border: `1px solid ${colors.borderColor}`,
      borderRadius: "8px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.2s ease",
      color: colors.textPrimary,
      backgroundColor: `${colors.background}80`,
    },
    textarea: {
      padding: "12px 16px",
      border: `1px solid ${colors.borderColor}`,
      borderRadius: "8px",
      fontSize: "1rem",
      fontFamily: "inherit",
      resize: "vertical",
      transition: "all 0.2s ease",
      color: colors.textPrimary,
      backgroundColor: `${colors.background}80`,
    },
    formActions: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
      marginTop: "20px",
    },
    submitBtn: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 28px",
      backgroundColor: colors.primary,
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.2s ease-in-out",
      fontSize: "1rem",
    },
    cancelBtn: {
      padding: "12px 28px",
      backgroundColor: "transparent",
      color: colors.textSecondary,
      border: `1px solid ${colors.borderColor}`,
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.2s ease-in-out",
      fontSize: "1rem",
    },
    patientSection: {
      backgroundColor: colors.surface,
      padding: "40px",
      borderRadius: "16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      border: `1px solid ${colors.borderColor}`,
    },
    sectionHeader: {
      marginBottom: "30px",
    },
    sectionTitle: {
      fontSize: "1.75rem",
      color: colors.textPrimary,
      margin: "0 0 5px 0",
      fontWeight: "700",
    },
    sectionSubtitle: {
      fontSize: "1rem",
      color: colors.textSecondary,
      margin: 0,
    },
    searchContainer: {
      marginBottom: "20px",
    },
    searchInput: {
      width: "100%",
      padding: "12px 16px",
      border: `1px solid ${colors.borderColor}`,
      borderRadius: "8px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.2s ease",
      backgroundColor: `${colors.background}80`,
    },
    tableContainer: {
      overflowX: "auto",
      border: `1px solid ${colors.borderColor}`,
      borderRadius: "12px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "0.95rem",
    },
    tableHeader: {
      backgroundColor: colors.background,
    },
    th: {
      padding: "16px",
      textAlign: "left",
      fontWeight: "600",
      color: colors.textSecondary,
      textTransform: "uppercase",
      fontSize: "0.8rem",
      letterSpacing: "0.5px",
    },
    tableRow: {
      borderBottom: `1px solid ${colors.borderColor}`,
      transition: "background-color 0.2s ease",
    },
    td: {
      padding: "16px",
      color: colors.textSecondary,
      verticalAlign: "middle",
    },
    actionButtons: {
      display: "flex",
      gap: "8px",
    },
    actionBtn: {
      padding: "8px",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    viewBtn: {
      padding: "8px",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
    },
    historyBtn: {
      padding: "8px",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.info,
    },
    editBtn: {
      padding: "8px",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.edit,
    },
    deleteBtn: {
      padding: "8px",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.danger,
    },
    emptyState: {
      padding: "60px 20px",
      textAlign: "center",
      backgroundColor: colors.background,
      borderRadius: "12px",
      border: `1px dashed ${colors.borderColor}`,
    },
    emptyStateText: {
      fontSize: "1.1rem",
      color: colors.textSecondary,
      margin: 0,
    },
    footer: {
      backgroundColor: "#FFFFFF",
      color: colors.textSecondary,
      textAlign: "center",
      padding: "20px",
      marginTop: "auto",
      borderTop: `1px solid ${colors.borderColor}`,
    },
    footerText: {
      margin: 0,
      fontSize: "0.9rem",
    },
  };

  // Inject responsive stylesheet once (safe in React)
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.setAttribute("data-generated", "dashboard-styles");
    styleSheet.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

      @media (max-width: 768px) {
        .nav-right {
          display: none !important;
        }
        
        .mobile-menu-btn {
          display: block !important;
        }
        
        .mobile-menu {
          display: flex !important;
        }

        .main-content {
          padding: 20px 15px !important;
        }

        .page-title {
          font-size: 1.8rem !important;
        }

        .form-section, .patient-section {
          padding: 20px !important;
        }
      }
      
      input:focus, textarea:focus {
        outline: none;
        border-color: ${colors.primary} !important;
        box-shadow: 0 0 0 3px ${colors.primary}40;
      }

      tr:last-child {
        border-bottom: none;
      }

      tr:hover {
        background-color: ${colors.background} !important;
      }

      .close-form-btn:hover {
        color: ${colors.danger} !important;
      }

      .status-select {
        padding: 6px 12px;
        border-radius: 20px;
        border: none;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        color: white;
        appearance: none;
        -webkit-appearance: none;
        text-align: center;
        transition: all 0.2s ease;
      }

      .status-select:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      // cleanup on unmount
      if (styleSheet && styleSheet.parentNode) styleSheet.parentNode.removeChild(styleSheet);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // -----------------------
  // Form handling
  // -----------------------
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.namaLengkap.trim()) return "Nama lengkap tidak boleh kosong";
    if (!formData.nik.trim()) return "NIK tidak boleh kosong";
    if (formData.nik.trim().length !== 16) return "NIK harus 16 digit";
    if (!formData.alamat.trim()) return "Alamat tidak boleh kosong";
    if (!formData.tanggalLahir) return "Tanggal lahir tidak boleh kosong";
    if (!formData.nomorHp.trim()) return "Nomor HP tidak boleh kosong";
    if (!/^(\+62|0)[0-9]{9,12}$/.test(formData.nomorHp.trim()))
      return "Nomor HP tidak valid";
    if (!formData.keluhan.trim()) return "Keluhan pasien tidak boleh kosong";
    return "";
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      namaLengkap: "",
      nik: "",
      alamat: "",
      tanggalLahir: "",
      nomorHp: "",
      keluhan: "",
    });
  };

  const handleToggleForm = () => {
    if (showForm && !editingId) {
      setShowForm(false);
    } else {
      setEditingId(null);
      setFormData({
        namaLengkap: "",
        nik: "",
        alamat: "",
        tanggalLahir: "",
        nomorHp: "",
        keluhan: "",
      });
      setShowForm(true);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      alert("❌ " + error);
      return;
    }

    try {
      if (editingId) {
        const patientDoc = doc(db, "patients", editingId);
        await updateDoc(patientDoc, formData);
        alert("✅ Data pasien berhasil diupdate!");
      } else {
        await addDoc(patientsCollectionRef, {
          ...formData,
          status: "Waiting", // Default status
          tglDaftar: new Date().toISOString().split("T")[0],
        });
        alert("✅ Pasien berhasil ditambahkan!");
      }
      getPatients(); // Refresh data
      handleCancelForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("❌ Terjadi kesalahan saat menyimpan data: " + error.message);
    }
  };

  // -----------------------
  // Actions: edit / delete / logout / status
  // -----------------------
  const handleStatusChange = async (id, newStatus) => {
    try {
      const patientDoc = doc(db, "patients", id);
      await updateDoc(patientDoc, { status: newStatus });
      // Optimistic update or refresh
      setPatients((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("❌ Gagal mengubah status: " + error.message);
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data pasien ini?")) {
      try {
        const patientDoc = doc(db, "patients", id);
        await deleteDoc(patientDoc);
        getPatients(); // Refresh data
        alert("✅ Data pasien berhasil dihapus!");
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert("❌ Terjadi kesalahan saat menghapus data.");
      }
    }
  };

  const handleEditClick = (patient) => {
    setEditingId(patient.id);
    setFormData({
      namaLengkap: patient.namaLengkap,
      nik: patient.nik,
      alamat: patient.alamat,
      tanggalLahir: patient.tanggalLahir,
      nomorHp: patient.nomorHp,
      keluhan: patient.keluhan,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      onLogout();
      navigate("/login");
    }
  };

  // -----------------------
  // Derived values / stats
  // -----------------------
  // Guard filter for empty string fields to avoid runtime errors
  const filteredPatients = patients.filter((patient) => {
    const name = (patient.namaLengkap || "").toLowerCase();
    const nik = (patient.nik || "");
    const hp = (patient.nomorHp || "");
    const term = searchTerm.toLowerCase();
    return (
      name.includes(term) || nik.includes(searchTerm) || hp.includes(searchTerm)
    );
  });

  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];

  const todayPatients = patients.filter((p) => p.tglDaftar === todayISO).length;

  const weekPatients = patients.filter((p) => {
    const patientDate = new Date(p.tglDaftar);
    const diffTime = Math.abs(today - patientDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  const monthPatients = patients.filter((p) => {
    const patientDate = new Date(p.tglDaftar);
    return (
      patientDate.getMonth() === today.getMonth() &&
      patientDate.getFullYear() === today.getFullYear()
    );
  }).length;

  const avgAge =
    patients.length > 0
      ? (
        patients.reduce((acc, p) => {
          const birthDate = new Date(p.tanggalLahir);
          const age = today.getFullYear() - birthDate.getFullYear();
          return acc + age;
        }, 0) / patients.length
      ).toFixed(1)
      : 0;

  const getPieChartData = () => {
    const data = patients.reduce((acc, patient) => {
      const keluhan = patient.keluhan || "Lainnya";
      const existing = acc.find((item) => item.name === keluhan);
      if (existing) {
        existing.value++;
      } else {
        acc.push({ name: keluhan, value: 1 });
      }
      return acc;
    }, []);
    return data;
  };

  const pieChartData = getPieChartData();
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  // -----------------------
  // Render
  // -----------------------
  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.logo}>
            <span style={styles.logoText}>🏥 Pendaftaran Pasien Klinik</span>
          </div>

          {/* Desktop Menu */}
          <div style={styles.navRight} className="nav-right">
            <button
              style={styles.navButton}
              onClick={handleToggleForm}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = styles.colors.primaryDark)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = styles.colors.primary)
              }
            >
              <Plus size={20} />
              <span style={{ marginLeft: "8px" }}>Pasien Baru</span>
            </button>
            <button
              style={styles.logoutBtn}
              onClick={handleLogout}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = styles.colors.dangerDark)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = styles.colors.danger)
              }
            >
              <LogOut size={20} />
              <span style={{ marginLeft: "8px" }}>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            style={styles.mobileMenuBtn}
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div style={styles.mobileMenu} className="mobile-menu">
            <button
              style={{ ...styles.navButton, width: "100%" }}
              onClick={() => {
                handleToggleForm();
                setIsMobileMenuOpen(false);
              }}
            >
              <Plus size={20} /> Pasien Baru
            </button>
            <button
              style={{ ...styles.logoutBtn, width: "100%" }}
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div style={styles.mainContent} className="main-content">
        {/* Statistik Section */}
        <section style={styles.statsSection}>
          <h1 style={styles.pageTitle} className="page-title">
            Statistik Pendaftaran Pasien
          </h1>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>👥</div>
              <div style={styles.statInfo}>
                <div style={styles.statNumber}>{patients.length}</div>
                <div style={styles.statLabel}>Total Pasien</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>📅</div>
              <div style={styles.statInfo}>
                <div style={styles.statNumber}>{todayPatients}</div>
                <div style={styles.statLabel}>Pasien Hari Ini</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🗓️</div>
              <div style={styles.statInfo}>
                <div style={styles.statNumber}>{weekPatients}</div>
                <div style={styles.statLabel}>Pasien Minggu Ini</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>📈</div>
              <div style={styles.statInfo}>
                <div style={styles.statNumber}>{monthPatients}</div>
                <div style={styles.statLabel}>Pasien Bulan Ini</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🎂</div>
              <div style={styles.statInfo}>
                <div style={styles.statNumber}>{avgAge}</div>
                <div style={styles.statLabel}>Rata-rata Usia Pasien</div>
              </div>
            </div>
          </div>
        </section>

        {/* Chart Section */}
        <section style={styles.chartSection}>
          <h2 style={styles.sectionTitle}>Distribusi Keluhan Pasien</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={(entry) => `${entry.name} (${entry.value})`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>

        {/* Form Pendaftaran Pasien Baru */}
        {showForm && (
          <section style={styles.formSection} className="form-section">
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>
                {editingId ? "✏️ Edit Data Pasien" : "📝 Daftar Pasien Baru"}
              </h2>
              <button
                style={styles.closeFormBtn}
                onClick={handleCancelForm}
                className="close-form-btn"
                aria-label="Tutup form"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nama Lengkap *</label>
                  <input
                    type="text"
                    name="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={handleFormChange}
                    placeholder="Masukkan nama lengkap"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>NIK (16 digit) *</label>
                  <input
                    type="text"
                    name="nik"
                    value={formData.nik}
                    onChange={handleFormChange}
                    placeholder="Masukkan NIK 16 digit"
                    maxLength="16"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Tanggal Lahir *</label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleFormChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Nomor HP *</label>
                  <input
                    type="tel"
                    name="nomorHp"
                    value={formData.nomorHp}
                    onChange={handleFormChange}
                    placeholder="08123456789"
                    style={styles.input}
                  />
                </div>

                <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
                  <label style={styles.label}>Alamat *</label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleFormChange}
                    placeholder="Masukkan alamat lengkap"
                    rows="3"
                    style={styles.textarea}
                  />
                </div>

                <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
                  <label style={styles.label}>Keluhan Pasien *</label>
                  <textarea
                    name="keluhan"
                    value={formData.keluhan}
                    onChange={handleFormChange}
                    placeholder="Jelaskan keluhan atau gejala"
                    rows="3"
                    style={styles.textarea}
                  />
                </div>
              </div>

              <div style={styles.formActions}>
                <button
                  type="submit"
                  style={styles.submitBtn}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = styles.colors.primaryDark)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = styles.colors.primary)
                  }
                >
                  {editingId ? (
                    <>
                      <CheckCircle size={18} /> Simpan Perubahan
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Daftarkan Pasien
                    </>
                  )}
                </button>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={handleCancelForm}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = styles.colors.borderColor)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  Batal
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Daftar Pasien */}
        <section style={styles.patientSection} className="patient-section">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>📋 Daftar Pasien Terdaftar</h2>
            <p style={styles.sectionSubtitle}>
              Total: {filteredPatients.length} pasien
            </p>
          </div>

          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="🔍 Cari berdasarkan nama, NIK, atau nomor HP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Patients Table */}
          {filteredPatients.length > 0 ? (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>No</th>
                    <th style={styles.th}>Nama Pasien</th>
                    <th style={styles.th}>NIK</th>
                    <th style={styles.th}>Nomor HP</th>
                    <th style={styles.th}>Keluhan</th>
                    <th style={styles.th}>Tgl Daftar</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient, index) => (
                    <tr key={patient.id} style={styles.tableRow}>
                      <td style={styles.td}>{index + 1}</td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: "600", color: colors.textPrimary }}>
                          {patient.namaLengkap}
                        </div>
                        <div style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                          NIK: {patient.nik}
                        </div>
                      </td>
                      <td style={styles.td}>{patient.nik}</td>
                      <td style={styles.td}>{patient.nomorHp}</td>
                      <td style={styles.td}>{patient.keluhan}</td>
                      <td style={styles.td}>{patient.tglDaftar}</td>
                      <td style={styles.td}>
                        {user?.role === "admin" ? (
                          <select
                            className="status-select"
                            value={patient.status || "Waiting"}
                            onChange={(e) =>
                              handleStatusChange(patient.id, e.target.value)
                            }
                            style={{
                              backgroundColor:
                                (patient.status || "Waiting") === "Waiting"
                                  ? colors.statusWaiting
                                  : (patient.status || "Waiting") === "Checking"
                                    ? colors.statusChecking
                                    : colors.statusFinished,
                            }}
                          >
                            <option value="Waiting" style={{ color: "black" }}>
                              Waiting
                            </option>
                            <option value="Checking" style={{ color: "black" }}>
                              Checking
                            </option>
                            <option value="Finished" style={{ color: "black" }}>
                              Finished
                            </option>
                          </select>
                        ) : (
                          <span
                            style={{
                              padding: "6px 12px",
                              borderRadius: "20px",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                              color: "white",
                              backgroundColor:
                                (patient.status || "Waiting") === "Waiting"
                                  ? colors.statusWaiting
                                  : (patient.status || "Waiting") === "Checking"
                                    ? colors.statusChecking
                                    : colors.statusFinished,
                            }}
                          >
                            {patient.status || "Waiting"}
                          </span>
                        )}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button
                            style={styles.historyBtn}
                            onClick={() => setSelectedPatientForHistory(patient)}
                            title="Rekam Medis"
                            onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              styles.colors.infoDark)
                            }
                            onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                              styles.colors.info)
                            }
                          >
                            <FileText size={16} />
                          </button>
                          <button
                            style={styles.editBtn}
                            onClick={() => handleEditClick(patient)}
                            title="Edit Data"
                            onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              styles.colors.editDark)
                            }
                            onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                              styles.colors.edit)
                            }
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            style={styles.deleteBtn}
                            onClick={() => handleDeletePatient(patient.id)}
                            title="Hapus"
                            onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              styles.colors.dangerDark)
                            }
                            onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                              styles.colors.danger)
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p style={styles.emptyStateText}>
                {searchTerm
                  ? "❌ Pasien tidak ditemukan"
                  : "📭 Belum ada pasien terdaftar"}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2025 Aplikasi Pendaftaran Pasien - Aplikasi Sehat. Semua Hak
          Dilindungi
        </p>
      </footer>

      {/* Medical Record Modal */}
      {selectedPatientForHistory && (
        <MedicalRecordModal
          patient={selectedPatientForHistory}
          onClose={() => setSelectedPatientForHistory(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
