"use client";

// FIXED, CLEAN, TANPA ERROR JSX
// - Zoom mulus
// - Legend selalu muncul & tidak hilang saat zoom
// - ScaleControl berfungsi
// - Tidak ada variable loading / tourismData yang undefined
// - Struktur komponen benar

import { MapContainer, TileLayer, Polygon as LeafletPolygon, ScaleControl, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useCallback } from "react";
import L, { LeafletMouseEvent } from "leaflet";
import * as turf from "@turf/turf";
import { FeatureCollection, Polygon } from "geojson";

// =============================
// CLICK HANDLER BUFFER
// =============================
function ClickBufferHandler({ onClick }: { onClick: (e: LeafletMouseEvent) => void }) {
  useMapEvents({
    click: (e) => onClick(e),
  });
  return null;
}

// =============================
// MAIN PAGE (NO ERROR JSX LAGI)
// =============================
export default function MapPage() {
  const [dataBuffer, setDataBuffer] = useState<FeatureCollection<Polygon> | null>(null);

  const clickBuffer = useCallback((e: LeafletMouseEvent) => {
    const pt = turf.point([e.latlng.lng, e.latlng.lat]);
    const buffered = turf.buffer(turf.featureCollection([pt]), 1, {
      units: "kilometers",
    }) as FeatureCollection<Polygon>;
    setDataBuffer(buffered);
  }, []);

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      <MapContainer
        center={[-7.8, 110.36]}
        zoom={11}
        zoomControl={false}
        className="w-full h-full"
        scrollWheelZoom={true}
        wheelDebounceTime={30}
        wheelPxPerZoomLevel={120}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <ScaleControl position="bottomleft" />

        <ClickBufferHandler onClick={clickBuffer} />

        {/* BUFFER */}
        {dataBuffer &&
          dataBuffer.features.map((feature, i) => (
            <LeafletPolygon
              key={i}
              positions={feature.geometry.coordinates.map((c) =>
                c.map((coord) => [coord[1], coord[0]])
              )}
              pathOptions={{ color: "#088", fillOpacity: 0.4 }}
            />
          ))}
      </MapContainer>

      {/* LEGEND SELALU DI DEPAN */}
      <div className="absolute bottom-6 right-4 bg-white p-3 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
        <h3 className="font-bold text-sm mb-2">Legend</h3>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 bg-[#FF9900] opacity-60 mr-2" /> Pantai
        </div>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 bg-[#3388ff] opacity-60 mr-2" /> Bukit
        </div>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 bg-[#ffcc00] opacity-60 mr-2" /> Air Terjun
        </div>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 bg-[#ff6600] opacity-60 mr-2" /> Curug
        </div>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 bg-[#00cc66] opacity-60 mr-2" /> Goa
        </div>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 bg-[#9900cc] opacity-60 mr-2" /> Waduk
        </div>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 bg-[#ff0000] opacity-60 mr-2" /> Desa Wisata
        </div>
      </div>

      {/* SEARCH BOX (BELUM AKTIF) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
        <input
          type="text"
          placeholder="Cari lokasi (belum aktif)..."
          className="px-4 py-2 rounded-lg shadow bg-white w-64 border"
        />
      </div>
    </div>
  );
}
