"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const pariwisataList = [
  {
    nama: "Ekonomi 1",
    gambar: "/images/1.jpg",
  },
  {
    nama: "Ekonomi 2",
    gambar: "/images/2.jpg",
  },
  {
    nama: "Ekonomi 3",
    gambar: "/images/3.jpg",
  },
  {
    nama: "Ekonomi 4",
    gambar: "/images/4.jpg",
  },
  {
    nama: "Ekonomi 5",
    gambar: "/images/5.jpg",
  },
  {
    nama: "Ekonomi 6",
    gambar: "/images/6.jpg",
  },
];

export default function PariwisataPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-8 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Potensi UMKM & Ekonomi Kabupaten Kulon Progo
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pariwisataList.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <Image
              src={item.gambar}
              alt={item.nama}
              width={600}
              height={400}
              className="object-cover w-full h-48"
            />
            <div className="p-4 text-center">
              <h2 className="text-lg font-semibold text-gray-800">{item.nama}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center mt-12 text-gray-600">
        🌿 Dukung produk lokal dan UMKM Kabupaten Kulon Progo untuk ekonomi berkelanjutan.
      </p>
    </div>
  );
}