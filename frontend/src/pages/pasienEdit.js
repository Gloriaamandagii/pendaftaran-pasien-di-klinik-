import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useParams } from "react-router-dom";

export default function PasienEdit() {
  const { id } = useParams();
  const [nama, setNama] = useState("");
  const [umur, setUmur] = useState("");
  const [alamat, setAlamat] = useState("");

  // Fetch data awal
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "pasien", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setNama(data.nama);
        setUmur(data.umur);
        setAlamat(data.alamat);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    await updateDoc(doc(db, "pasien", id), {
      nama: nama,
      umur: umur,
      alamat: alamat,
    });

    alert("Data pasien diperbarui!");
    window.location.href = "/pasien-list";
  };

  return (
    <form onSubmit={handleUpdate}>
      <input value={nama} onChange={(e) => setNama(e.target.value)} />
      <input value={umur} onChange={(e) => setUmur(e.target.value)} />
      <input value={alamat} onChange={(e) => setAlamat(e.target.value)} />

      <button type="submit">Simpan</button>
    </form>
  );
}
