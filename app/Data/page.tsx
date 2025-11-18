"use client";

import Image from "next/image";

// Data contoh banyak kotakan, sumber data bervariasi (BPS, OSM, Geoportal Nasional, Geoportal Kabupaten, Data Asli)
const tourismData = [
  {
    name: "Pantai Parangtritis",
    type: "Pantai",
    source: "BPS",
    image: "/tourism/beach.png",
    description: "Pantai wisata populer di Bantul.",
  },
  {
    name: "Gunung Merapi",
    type: "Gunung",
    source: "OSM",
    image: "/tourism/mountain.png",
    description: "Gunung berapi aktif di Yogyakarta.",
  },
  {
    name: "Museum Sonobudoyo",
    type: "Museum",
    source: "Geoportal Nasional",
    image: "/tourism/museum.png",
    description: "Museum budaya dan sejarah Yogyakarta.",
  },
  {
    name: "Candi Prambanan",
    type: "Candi",
    source: "Geoportal Kabupaten",
    image: "/tourism/temple.png",
    description: "Candi Hindu terbesar di Indonesia.",
  },
  {
    name: "Air Terjun Sri Gethuk",
    type: "Air Terjun",
    source: "Data Asli Kabupaten",
    image: "/tourism/waterfall.png",
    description: "Air terjun indah di Gunungkidul.",
  },
  {
    name: "Desa Wisata Nglanggeran",
    type: "Desa Wisata",
    source: "Geoportal Nasional",
    image: "/tourism/village.png",
    description: "Desa wisata dengan pemandangan indah.",
  },
  {
    name: "Pantai Indrayanti",
    type: "Pantai",
    source: "BPS",
    image: "/tourism/beach.png",
    description: "Pantai pasir putih di Gunungkidul.",
  },
  {
    name: "Gunung Sumbing",
    type: "Gunung",
    source: "OSM",
    image: "/tourism/mountain.png",
    description: "Gunung tinggi dengan jalur pendakian menarik.",
  },
  {
    name: "Museum Jogja Kembali",
    type: "Museum",
    source: "Geoportal Kabupaten",
    image: "/tourism/museum.png",
    description: "Museum sejarah kemerdekaan Indonesia.",
  },
  // contoh tambahan biar lebih banyak kotakan
  {
    name: "Kebun Binatang Gembira Loka",
    type: "Kebun Binatang",
    source: "BPS",
    image: "/tourism/zoo.png",
    description: "Kebun binatang populer di Yogyakarta.",
  },
  {
    name: "Hutan Pinus Pengger",
    type: "Hutan Wisata",
    source: "OSM",
    image: "/tourism/forest.png",
    description: "Wisata hutan pinus yang sejuk dan fotogenik.",
  },
  {
    name: "Pantai Drini",
    type: "Pantai",
    source: "Geoportal Nasional",
    image: "/tourism/beach.png",
    description: "Pantai dengan pulau karang unik.",
  },
];

export default function Page() {
  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Data Pariwisata (Tanpa Basemap)</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tourismData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
          >
            {/* Gambar */}
            <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                width={150}
                height={150}
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/example-logo.png";
                }}
              />
            </div>

            <h2 className="text-lg font-bold mt-3">{item.name}</h2>
            <p className="text-sm text-gray-600">{item.type}</p>
            <p className="text-xs text-blue-600">Sumber: {item.source}</p>
            <p className="text-sm mt-2 text-gray-700">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
