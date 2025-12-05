"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// FIX 100% Hydration Error
const Radar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Radar), {
  ssr: false,
});

export default function RadarPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/kunjungan", { cache: "no-store" });
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Loading grafik...</div>;
  }

  const labels = [
    "Temon", "Wates", "Panjatan", "Galur", "Lendah", "Sentolo",
    "Pengasih", "Kokap", "Girimulyo", "Nanggulan", "Kalibawang", "Samigaluh"
  ];

  const nilai = labels.map((kec) => {
    const row = data.find((d) => d.kecamatan === kec);
    return row ? row.jumlah : 0;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Jumlah Kunjungan Wisata",
        data: nilai,
        borderWidth: 2,
        backgroundColor: "rgba(75,192,192,0.3)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Grafik Radar Kunjungan Wisata Kulon Progo</h1>
      <div style={{ width: 500, marginTop: 40 }}>
        <Radar data={chartData} />
      </div>
    </div>
  );
}
