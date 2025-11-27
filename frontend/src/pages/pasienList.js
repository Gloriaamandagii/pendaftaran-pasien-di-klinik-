import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { deleteDoc, doc } from "firebase/firestore";

export default function PasienList() {
  const [pasien, setPasien] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const pasienRef = collection(db, "pasien");
      const snapshot = await getDocs(pasienRef);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPasien(data);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "pasien", id));
    alert("Data pasien dihapus!");
    window.location.reload();
  };

  return (
    <div>
      <h2>Daftar Pasien</h2>

      {pasien.map((p) => (
        <div key={p.id}>
          <p>Nama: {p.nama}</p>
          <p>Umur: {p.umur}</p>
          <p>Alamat: {p.alamat}</p>
          <button onClick={() => handleDelete(p.id)}>Hapus</button>
        </div>
      ))}
    </div>
  );
}
