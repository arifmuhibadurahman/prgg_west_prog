import React from "react";
import Image from "next/image";

// Contoh sumber data per kategori
const dataSources = [
  {
    name: "Pantai",
    color: "#FF9900",
    opacity: 0.6,
    source: "Kementerian Kelautan dan Perikanan (KKP)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Logo_Kementerian_Kelautan_dan_Perikanan.png",
  },
  {
    name: "Bukit",
    color: "#3388ff",
    opacity: 0.6,
    source: "Badan Informasi Geospasial (BIG)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/09/Logo_BIG.png",
  },
  {
    name: "Air Terjun",
    color: "#ffcc00",
    opacity: 0.6,
    source: "Dinas Pariwisata Provinsi",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Logo_Kemenparekraf.png",
  },
  {
    name: "Curug",
    color: "#ff6600",
    opacity: 0.6,
    source: "Kementerian Lingkungan Hidup dan Kehutanan",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/80/Logo_KLHK.png",
  },
  {
    name: "Goa",
    color: "#00cc66",
    opacity: 0.6,
    source: "Balai Konservasi Sumber Daya Alam (BKSDA)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/10/Logo_BKSDA.png",
  },
  {
    name: "Waduk",
    color: "#9900cc",
    opacity: 0.6,
    source: "Kementerian PUPR",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Logo_PUPR.png",
  },
  {
    name: "Desa Wisata",
    color: "#ff0000",
    opacity: 0.6,
    source: "Kementerian Pariwisata (Kemenparekraf)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Logo_Kemenparekraf.png",
  },
  {
    name: "Wisata Puncak",
    color: "#800080",
    opacity: 0.3,
    source: "Dinas Pariwisata Kabupaten/Kota",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Logo_Kemenparekraf.png",
  },
  {
    name: "Kebun Teh",
    color: "#00FF00",
    opacity: 0.4,
    source: "PT Perkebunan Nusantara / Dinas Perkebunan",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/74/Logo_PTPN.png",
  },
  {
    name: "Wisata Lainnya",
    color: "#0000FF",
    opacity: 0.4,
    source: "Data gabungan dari Dinas Pariwisata",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Logo_Kemenparekraf.png",
  },
];

export default function MapLegendWithNavbar() {
  return (
    <div className="relative w-full h-full">
      {/* NAVBAR Sumber Data */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-30 px-4 py-2 flex items-center justify-between">
        <h2 className="font-bold text-lg">Sumber Data Objek Wisata</h2>
      </nav>

      {/* Sidebar sumber data */}
      <div className="fixed top-14 left-0 w-64 bg-white shadow-xl h-full overflow-y-auto z-20 p-4">
        <h3 className="font-bold text-base mb-4">Daftar Sumber Data</h3>
        {dataSources.map((item) => (
          <div key={item.name} className="mb-4 p-3 border rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <Image
                src={item.logo}
                alt="logo"
                width={32}
                height={32}
                className="object-contain mr-2"
              />
              <span className="font-semibold text-sm">{item.source}</span>
            </div>
            <div className="flex items-center mb-1">
              <div
                className="w-4 h-4 mr-2"
                style={{ backgroundColor: item.color, opacity: item.opacity }}
              ></div>
              <span className="text-xs">{item.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Legend di kanan */}
      <div className="absolute bottom-24 right-4 bg-white p-3 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
        <h3 className="font-bold text-sm mb-2">Legend</h3>

        {dataSources.map((item) => (
          <div key={item.name} className="flex items-center mb-1">
            <div
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: item.color, opacity: item.opacity }}
            ></div>
            <span className="text-xs">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
