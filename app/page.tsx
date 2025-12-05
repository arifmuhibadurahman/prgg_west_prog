"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Map as MapIcon, ArrowRight, LocateFixed, Heart } from "lucide-react";

export default function Home() {
  // --- MINI LEAFLET MAP ---
  useEffect(() => {
    const L = require("leaflet");
    require("leaflet/dist/leaflet.css");
    
    const map = L.map("mini-map", {
      center: [-7.826679, 110.164726],
      zoom: 10,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    // Geolocation Button
    const locateControl = L.control({ position: "topright" });

    locateControl.onAdd = () => {
      const btn = L.DomUtil.create("button", "locate-btn bg-white p-2 rounded shadow");
      btn.innerHTML = "📍";
      btn.style.cursor = "pointer";

      btn.onclick = () => {
        map.locate({ setView: true, maxZoom: 15 });

        map.on("locationfound", (e) => {
          L.marker(e.latlng, {
            icon: L.divIcon({
              className: "custom-marker",
              html: `<div style="font-size: 24px;">❤️</div>`,
            }),
          }).addTo(map);
        });
      };

      return btn;
    };

    locateControl.addTo(map);


    return () => {
      map.remove();
    };
  }, []);


  
  return (
    <div className="flex flex-col min-h-screen bg-[#0d9488] text-white">

      {/* Header */}
      <header className="border-b border-white/20 bg-[#0f766e]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="/logo_prgg.png" alt="Logo" width={50} height={50} />
            <span className="text-xl font-bold">Web Potensi</span>
          </div>

          <nav>
  <ul className="flex gap-8 font-medium text-white/80">
    <li><Link href="/" className="hover:text-white">BERANDA</Link></li>
    <li><Link href="/Pariwisata" className="hover:text-white">PARIWISATA</Link></li>
    <li><Link href="/Ekonomi" className="hover:text-white">EKONOMI</Link></li>
    <li><Link href="/Map" className="hover:text-white">MAP</Link></li>
    <li><Link href="/data" className="hover:text-white">DATA</Link></li>

    {/* LOGIN / ADMIN */}
    {typeof window !== "undefined" && document.cookie.includes("session=authenticated") ? (
      <>
        <li><Link href="/admin" className="hover:text-white font-bold">ADMIN</Link></li>
        <li>
          <button
            onClick={() => {
              document.cookie = "session=; Max-Age=0; path=/";
              window.location.reload();
            }}
            className="hover:text-red-300"
          >
            LOGOUT
          </button>
        </li>
      </>
    ) : (
      <li><Link href="/login" className="hover:text-white">LOGIN</Link></li>
    )}
  </ul>
</nav>

        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 bg-[#0d9488]">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl font-bold mb-6 leading-tight drop-shadow">
            Web Potensi Kulon Progo
          </h1>

          <p className="text-lg text-white/90 mb-8">
            Eksplorasi potensi pariwisata dan ekonomi berbasis GIS.  
            Menampilkan lokasi strategis, desa wisata, UMKM, hingga insight spasial.
          </p>

          <Link
            href="/Map"
            className="bg-white text-[#0f766e] px-6 py-3 rounded shadow hover:bg-gray-200 transition-colors"
          >
            Lihat Peta Interaktif →
          </Link>
        </div>
      </section>

      {/* Mini Map Section */}
      <section className="py-12 bg-[#0f766e]">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* Mini Map */}
          <div className="w-full h-[350px] rounded-xl shadow-lg overflow-hidden border-2 border-white/20">
            <div id="mini-map" className="w-full h-full" />
          </div>

          {/* Icons / Features */}
          <div className="grid grid-cols-3 gap-8">

            <div className="flex flex-col items-center text-center">
              <MapIcon size={70} className="text-teal-200 mb-4" />
              <h3 className="text-xl font-semibold">Peta Interaktif</h3>
              <p className="text-white/70 mt-2">Berbasiskan QGIS & Leaflet.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <LocateFixed size={70} className="text-teal-200 mb-4" />
              <h3 className="text-xl font-semibold">Geolocation</h3>
              <p className="text-white/70 mt-2">Temukan lokasimu di peta.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <Heart size={70} className="text-teal-200 mb-4" />
              <h3 className="text-xl font-semibold">Marker Love</h3>
              <p className="text-white/70 mt-2">Tanda lokasi favoritmu ❤️</p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#115e59] py-8 mt-auto text-gray-200">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Image src="/logo_prgg.png" alt="Logo" width={50} height={50} />
            <span className="font-semibold">Web Potensi</span>
          </div>
          <div>© {new Date().getFullYear()} PRGG. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
