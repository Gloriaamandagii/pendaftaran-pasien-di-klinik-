import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    Timestamp,
} from "firebase/firestore";
import { X, FileText, Plus, Calendar, User } from "lucide-react";

/**
 * MedicalRecordModal - Modal untuk melihat dan menambah rekam medis pasien
 */
function MedicalRecordModal({ patient, onClose }) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        diagnosis: "",
        treatment: "",
        notes: "",
        doctor: "",
    });

    // Fetch records saat modal dibuka
    useEffect(() => {
        fetchRecords();
    }, [patient]);

    const fetchRecords = async () => {
        try {
            setLoading(true);
            const q = query(
                collection(db, "medical_records"),
                where("patientId", "==", patient.id)
            );
            const querySnapshot = await getDocs(q);
            const fetchedRecords = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Sort in JavaScript instead of Firestore (to avoid needing an index)
            fetchedRecords.sort((a, b) => {
                const dateA = a.date?.toMillis ? a.date.toMillis() : 0;
                const dateB = b.date?.toMillis ? b.date.toMillis() : 0;
                return dateB - dateA; // Descending order (newest first)
            });

            setRecords(fetchedRecords);
        } catch (error) {
            console.error("Error fetching records:", error);
            alert("❌ Gagal memuat data rekam medis: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.diagnosis || !formData.doctor) {
            alert("❌ Diagnosis dan Nama Dokter harus diisi!");
            return;
        }

        try {
            await addDoc(collection(db, "medical_records"), {
                patientId: patient.id,
                diagnosis: formData.diagnosis,
                treatment: formData.treatment,
                notes: formData.notes,
                doctor: formData.doctor,
                date: Timestamp.now(),
            });

            alert("✅ Rekam medis berhasil ditambahkan!");
            setFormData({ diagnosis: "", treatment: "", notes: "", doctor: "" });
            fetchRecords(); // Refresh list
        } catch (error) {
            console.error("Error adding record:", error);
            alert("❌ Gagal menambahkan rekam medis: " + error.message);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "-";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                {/* Header */}
                <div style={styles.header}>
                    <div>
                        <h2 style={styles.title}>
                            <FileText size={24} /> Rekam Medis Pasien
                        </h2>
                        <p style={styles.patientInfo}>
                            {patient.namaLengkap} - NIK: {patient.nik}
                        </p>
                    </div>
                    <button onClick={onClose} style={styles.closeBtn}>
                        <X size={24} />
                    </button>
                </div>

                {/* Content Grid */}
                <div style={styles.contentGrid}>
                    {/* Left: History List */}
                    <div style={styles.historySection}>
                        <h3 style={styles.sectionTitle}>
                            <Calendar size={18} /> Riwayat Kunjungan
                        </h3>
                        <div style={styles.recordsList}>
                            {loading ? (
                                <p style={styles.loadingText}>Memuat data...</p>
                            ) : records.length === 0 ? (
                                <p style={styles.emptyText}>
                                    Belum ada riwayat rekam medis untuk pasien ini.
                                </p>
                            ) : (
                                records.map((record) => (
                                    <div key={record.id} style={styles.recordCard}>
                                        <div style={styles.recordDate}>
                                            {formatDate(record.date)}
                                        </div>
                                        <div style={styles.recordContent}>
                                            <div style={styles.recordRow}>
                                                <strong>Diagnosis:</strong> {record.diagnosis}
                                            </div>
                                            {record.treatment && (
                                                <div style={styles.recordRow}>
                                                    <strong>Tindakan:</strong> {record.treatment}
                                                </div>
                                            )}
                                            {record.notes && (
                                                <div style={styles.recordRow}>
                                                    <strong>Catatan:</strong> {record.notes}
                                                </div>
                                            )}
                                            <div style={styles.recordDoctor}>
                                                <User size={14} /> {record.doctor}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right: Add New Record Form */}
                    <div style={styles.formSection}>
                        <h3 style={styles.sectionTitle}>
                            <Plus size={18} /> Tambah Catatan Baru
                        </h3>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Diagnosis *</label>
                                <input
                                    type="text"
                                    name="diagnosis"
                                    value={formData.diagnosis}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: Flu Berat"
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Tindakan/Obat</label>
                                <textarea
                                    name="treatment"
                                    value={formData.treatment}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: Paracetamol 500mg, 3x sehari"
                                    rows="3"
                                    style={styles.textarea}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Catatan Tambahan</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Catatan dokter (opsional)"
                                    rows="2"
                                    style={styles.textarea}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Nama Dokter/Staff *</label>
                                <input
                                    type="text"
                                    name="doctor"
                                    value={formData.doctor}
                                    onChange={handleInputChange}
                                    placeholder="Nama pemeriksa"
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <button type="submit" style={styles.submitBtn}>
                                <Plus size={18} /> Simpan Catatan
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

const colors = {
    primary: "#4F46E5",
    primaryDark: "#4338CA",
    secondary: "#10B981",
    danger: "#EF4444",
    text: "#1F2937",
    textLight: "#6B7280",
    border: "#E5E7EB",
    bg: "#F9FAFB",
    white: "#FFFFFF",
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
    },
    modal: {
        backgroundColor: colors.white,
        borderRadius: "16px",
        width: "100%",
        maxWidth: "1200px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "24px",
        borderBottom: `2px solid ${colors.border}`,
    },
    title: {
        margin: 0,
        fontSize: "24px",
        fontWeight: "700",
        color: colors.text,
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    patientInfo: {
        margin: "8px 0 0 0",
        fontSize: "14px",
        color: colors.textLight,
    },
    closeBtn: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "8px",
        borderRadius: "8px",
        color: colors.textLight,
        transition: "all 0.2s",
    },
    contentGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        padding: "24px",
        overflow: "hidden",
    },
    historySection: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    formSection: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    sectionTitle: {
        fontSize: "18px",
        fontWeight: "600",
        color: colors.text,
        margin: 0,
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    recordsList: {
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        paddingRight: "8px",
    },
    loadingText: {
        textAlign: "center",
        color: colors.textLight,
        padding: "40px 20px",
    },
    emptyText: {
        textAlign: "center",
        color: colors.textLight,
        padding: "40px 20px",
        backgroundColor: colors.bg,
        borderRadius: "8px",
    },
    recordCard: {
        border: `1px solid ${colors.border}`,
        borderRadius: "8px",
        padding: "16px",
        backgroundColor: colors.white,
        transition: "all 0.2s",
    },
    recordDate: {
        fontSize: "13px",
        fontWeight: "600",
        color: colors.primary,
        marginBottom: "8px",
    },
    recordContent: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    recordRow: {
        fontSize: "14px",
        color: colors.text,
        lineHeight: "1.5",
    },
    recordDoctor: {
        fontSize: "13px",
        color: colors.textLight,
        marginTop: "8px",
        display: "flex",
        alignItems: "center",
        gap: "4px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    label: {
        fontSize: "14px",
        fontWeight: "600",
        color: colors.text,
    },
    input: {
        padding: "10px 14px",
        fontSize: "14px",
        border: `1px solid ${colors.border}`,
        borderRadius: "8px",
        outline: "none",
        transition: "border-color 0.2s",
    },
    textarea: {
        padding: "10px 14px",
        fontSize: "14px",
        border: `1px solid ${colors.border}`,
        borderRadius: "8px",
        outline: "none",
        resize: "vertical",
        fontFamily: "inherit",
    },
    submitBtn: {
        padding: "12px 20px",
        backgroundColor: colors.primary,
        color: colors.white,
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        transition: "background-color 0.2s",
        marginTop: "8px",
    },
};

export default MedicalRecordModal;
