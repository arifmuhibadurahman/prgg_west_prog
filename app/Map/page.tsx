"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { LeafletMouseEvent } from "leaflet";
import buffer from "@turf/buffer";
import { point, featureCollection } from "@turf/helpers";
import { FeatureCollection, Polygon } from "geojson";

// Dynamic import untuk react-leaflet (WAJIB AGAR AMAN DI VERCEL)
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const ScaleControl = dynamic(
  () => import("react-leaflet").then((m) => m.ScaleControl),
  { ssr: false }
);
const LeafletPolygon = dynamic(
  () => import("react-leaflet").then((m) => m.Polygon),
  { ssr: false }
);
const useMapEvents = dynamic(
  () => import("react-leaflet").then((m) => m.useMapEvents),
  { ssr: false }
);

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
// MAIN PAGE — SIAP DEPLOY DI VERCEL
// =============================
export default function MapPage() {
  const [dataBuffer, setDataBuffer] = useState<FeatureCollection<Polygon> | null>(null);

  const clickBuffer = useCallback((e: LeafletMouseEvent) => {
    const pt = point([e.latlng.lng, e.latlng.lat]);
    const fc = featureCollection([pt]);

    const buffered = buffer(fc, 1, {
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
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <ScaleControl position="bottomleft" />
        <ClickBufferHandler onClick={clickBuffer} />

        {/* BUFFER RESULT */}
        {dataBuffer &&
          dataBuffer.features.map((feature, index) => {
            const coords = feature.geometry.coordinates.map((poly) =>
              poly.map((coord) => [coord[1], coord[0]])
            );
            return (
              <LeafletPolygon
                key={index}
                positions={coords}
                pathOptions={{ color: "#088", fillOpacity: 0.4 }}
              />
            );
          })}
      </MapContainer>

      {/* LEGEND */}
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
      </div>

      {/* SEARCH BOX */}
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
