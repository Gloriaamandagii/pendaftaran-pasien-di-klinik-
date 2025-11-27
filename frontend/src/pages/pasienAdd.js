import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function TambahPasien() {
  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [nomorHp, setNomorHp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [keluhan, setKeluhan] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "pasien"), {
        namaLengkap: nama,
        nik: nik,
        tanggalLahir: tanggalLahir,
        nomorHp: nomorHp,
        alamat: alamat,
        keluhan: keluhan,
        createdAt: new Date()
      });

      alert("Data pasien berhasil disimpan!");

      // Reset input form
      setNama("");
      setNik("");
      setTanggalLahir("");
      setNomorHp("");
      setAlamat("");
      setKeluhan("");

    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menyimpan data pasien!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nama Lengkap"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
      />

      <input
        type="text"
        placeholder="NIK"
        value={nik}
        onChange={(e) => setNik(e.target.value)}
      />

      <input
        type="date"
        value={tanggalLahir}
        onChange={(e) => setTanggalLahir(e.target.value)}
      />

      <input
        type="text"
        placeholder="Nomor HP"
        value={nomorHp}
        onChange={(e) => setNomorHp(e.target.value)}
      />

      <textarea
        placeholder="Alamat"
        value={alamat}
        onChange={(e) => setAlamat(e.target.value)}
      ></textarea>

      <textarea
        placeholder="Keluhan"
        value={keluhan}
        onChange={(e) => setKeluhan(e.target.value)}
      ></textarea>

      <button type="submit">Kirim</button>
    </form>
  );
}
