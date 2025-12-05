"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [kecamatan, setKecamatan] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [data, setData] = useState([]);

  const daftarKecamatan = [
    "Temon", "Wates", "Panjatan", "Galur", "Lendah", "Sentolo",
    "Pengasih", "Kokap", "Girimulyo", "Nanggulan",
    "Kalibawang", "Samigaluh",
  ];

  async function loadData() {
    const res = await fetch("/api/kunjungan");
    setData(await res.json());
  }

  async function tambahData() {
    await fetch("/api/kunjungan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kecamatan,
        jumlah: Number(jumlah),
      }),
    });

    setKecamatan("");
    setJumlah("");

    loadData();
  }

  async function hapus(id: string) {
    await fetch("/api/kunjungan", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadData();
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        background: "#f3f4f6",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ color: "#1e3a8a" }}>Admin — CRUD Kunjungan Wisata</h1>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "white",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          display: "flex",
          gap: "10px",
        }}
      >
        {/* SELECT KECAMATAN */}
        <select
          value={kecamatan}
          onChange={(e) => setKecamatan(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #94a3b8",
            flex: 1,
          }}
        >
          <option value="">Pilih Kecamatan</option>
          {daftarKecamatan.map((kec) => (
            <option key={kec} value={kec}>
              {kec}
            </option>
          ))}
        </select>

        {/* INPUT JUMLAH */}
        <input
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
          placeholder="Jumlah kunjungan"
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #94a3b8",
            flex: 1,
          }}
        />

        <button
          onClick={tambahData}
          style={{
            background: "#2563eb",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Tambah
        </button>
      </div>

      <h2 style={{ marginTop: "30px", color: "#334155" }}>Data Kunjungan</h2>

      <table
        style={{
          width: "100%",
          marginTop: "10px",
          background: "white",
          borderCollapse: "collapse",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <thead style={{ background: "#1e3a8a", color: "white" }}>
          <tr>
            <th style={{ padding: "10px" }}>Kecamatan</th>
            <th style={{ padding: "10px" }}>Jumlah</th>
            <th style={{ padding: "10px" }}>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.map((d: any, i: number) => (
            <tr
              key={d._id}
              style={{
                background: i % 2 === 0 ? "#f8fafc" : "white",
                textAlign: "center",
              }}
            >
              <td style={{ padding: "10px" }}>{d.kecamatan}</td>
              <td style={{ padding: "10px" }}>{d.jumlah}</td>
              <td style={{ padding: "10px" }}>
                <button
                  onClick={() => hapus(d._id)}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    padding: "6px 10px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
