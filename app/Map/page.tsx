"use client";
import {
  Share,
  Layers,
  BarChart2,
  Ruler,
  Wind,
  Map as MapIcon,
  Search,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL, { Source, Layer, Popup } from "@urbica/react-map-gl";
import * as turf from "@turf/turf";
import {
  FeatureCollection,
  Polygon,
  GeoJsonProperties,
  Feature,
  Point,
  Geometry,
  LineString,
  MultiPoint,
  MultiLineString,
  Polygon as GeoPolygon,
  MultiPolygon,
} from "geojson";
import { MapMouseEvent, LngLat } from "mapbox-gl";

// Fix for EventData - create an interface based on mapbox documentation
interface EventData {
  originalEvent: MouseEvent | TouchEvent | WheelEvent;
  type: string;
  target: unknown;
  point: { x: number; y: number };
  lngLat: LngLat;
  preventDefault: () => void;
  defaultPrevented: boolean;
}

interface FasumFeature extends Feature {
  properties: {
    type?: string;
    building?: string;
    [key: string]: unknown;
  };
}

interface FasumGeoJson extends FeatureCollection {
  features: FasumFeature[];
}

// Default coordinates for Indonesia
const DEFAULT_VIEWPORT = {
  latitude: -6.515,
  longitude: 107.393,
  zoom: 14.5,
};

const MAP_SERVICE_KEY = process.env.NEXT_PUBLIC_MAPID_KEY || "";
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Type guard helper function - this can be outside the component as it's not a hook
function hasCoordinates(
  geometry: Geometry
): geometry is
  | Point
  | LineString
  | MultiPoint
  | MultiLineString
  | GeoPolygon
  | MultiPolygon {
  return geometry.type !== "GeometryCollection" && "coordinates" in geometry;
}

const MapView = () => {
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
  const [showBuffer, setShowBuffer] = useState(false);
  const [dataBuffer, setDataBuffer] = useState<FeatureCollection<
    Polygon,
    GeoJsonProperties
  > | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupInfo, setPopupInfo] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);

  // GeoJSON data states
  const [fasumData, setFasumData] = useState<FasumGeoJson | null>(null);
  const [jawaData, setJawaData] = useState<FeatureCollection | null>(null);
  const [jawaHealthData, setJawaHealthData] =
    useState<FeatureCollection | null>(null);
  const [klHealthData, setKlHealthData] = useState<FeatureCollection | null>(
    null
  );

  // Layer visibility states
  const [showFasum, setShowFasum] = useState(true);
  const [showJawa, setShowJawa] = useState(true);
  const [showJawaHealth, setShowJawaHealth] = useState(true);
  const [showKlHealth, setShowKlHealth] = useState(true);

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataStats, setDataStats] = useState({
    fasum: 0,
    jawa: 0,
    jawaHealth: 0,
    klHealth: 0,
  });

  // Fixed: Added proper type instead of any
  // Fix for the type error by creating proper type casting or adjusting function signatures

  // Fixed: Update the fetchGeoJsonData function to use generics for proper typing
  const fetchGeoJsonData = useCallback(
    async <T extends FeatureCollection>(
      endpoint: string,
      setter: (data: T) => void,
      dataType: string
    ) => {
      try {
        const response = await fetch(`/api/${endpoint}`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${dataType}: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log(`Raw ${dataType} API response:`, data);

        if (data.type === "FeatureCollection" && Array.isArray(data.features)) {
          // Filter out invalid geometries
          const validFeatures = data.features.filter(
            (feature: Feature) =>
              feature.geometry &&
              hasCoordinates(feature.geometry) &&
              feature.geometry.coordinates &&
              feature.geometry.coordinates.length > 0
          );

          console.log(
            `${dataType}: ${validFeatures.length} valid features out of ${data.features.length}`
          );

          const validGeoJson = {
            type: "FeatureCollection",
            features: validFeatures.map((feature: Feature) => ({
              type: "Feature",
              geometry: feature.geometry,
              properties: feature.properties || {},
            })),
          } as T;

          setter(validGeoJson);
          return validFeatures.length;
        } else if (Array.isArray(data)) {
          // Handle array of features
          const validFeatures = data.filter(
            (feature: Feature) =>
              feature.geometry &&
              hasCoordinates(feature.geometry) &&
              feature.geometry.coordinates &&
              feature.geometry.coordinates.length > 0
          );

          console.log(
            `${dataType} (array): ${validFeatures.length} valid features out of ${data.length}`
          );

          const validGeoJson = {
            type: "FeatureCollection",
            features: validFeatures.map((feature: Feature) => ({
              type: "Feature",
              geometry: feature.geometry,
              properties: feature.properties || {},
            })),
          } as T;

          setter(validGeoJson);
          return validFeatures.length;
        } else {
          throw new Error(
            `Invalid ${dataType} GeoJSON format received from API`
          );
        }
      } catch (error) {
        console.error(`Error fetching ${dataType}:`, error);
        throw error;
      }
    },
    [hasCoordinates]
  );
 const fitMapToBounds = useCallback(() => {
   try {
     if (!fasumData && !jawaData && !jawaHealthData && !klHealthData) return;

     // Combine all features
     const allFeatures = [
       ...(fasumData?.features || []),
       ...(jawaData?.features || []),
       ...(jawaHealthData?.features || []),
       ...(klHealthData?.features || []),
     ];

     if (allFeatures.length === 0) return;

     // Create a FeatureCollection with all features
     const allFeaturesCollection = turf.featureCollection(allFeatures);

     // Get the bounding box
     const bbox = turf.bbox(allFeaturesCollection);

     // Convert bbox to viewport
     const centerLng = (bbox[0] + bbox[2]) / 2;
     const centerLat = (bbox[1] + bbox[3]) / 2;

     // Calculate zoom level (simple approximation)
     const longitudeDelta = Math.abs(bbox[2] - bbox[0]);
     const latitudeDelta = Math.abs(bbox[3] - bbox[1]);
     const maxDelta = Math.max(longitudeDelta, latitudeDelta);
     const zoom = Math.max(5, 14 - Math.log2(maxDelta * 100));

     setViewport({
       latitude: centerLat,
       longitude: centerLng,
       zoom: zoom,
     });

     console.log("Set viewport to show all data:", {
       centerLat,
       centerLng,
       zoom,
     });
   } catch (error) {
     console.error("Error calculating viewport bounds:", error);
   }
 }, [fasumData, jawaData, jawaHealthData, klHealthData]);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stats = {
        fasum: 0,
        jawa: 0,
        jawaHealth: 0,
        klHealth: 0,
      };

      // Use the correct generic types when calling fetchGeoJsonData
      stats.fasum = await fetchGeoJsonData<FasumGeoJson>(
        "fasum",
        setFasumData,
        "fasum"
      );
      stats.jawa = await fetchGeoJsonData<FeatureCollection>(
        "jawa",
        setJawaData,
        "jawa"
      );
      stats.jawaHealth = await fetchGeoJsonData<FeatureCollection>(
        "jawa_health",
        setJawaHealthData,
        "jawa_health"
      );
      stats.klHealth = await fetchGeoJsonData<FeatureCollection>(
        "kl_health",
        setKlHealthData,
        "kl_health"
      );

      setDataStats(stats);

      // After data is loaded, fit map to bounds
      setTimeout(fitMapToBounds, 500);
    } catch (err: unknown) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [fetchGeoJsonData, fitMapToBounds]);
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const clickBuffer = useCallback((e: { lngLat: LngLat }) => {
    const pt = turf.point([e.lngLat.lng, e.lngLat.lat]);
    const pointFeatureCollection = turf.featureCollection([pt]);

    // Use string literal for units, not an object
    const buffered = turf.buffer(
      pointFeatureCollection,
      1,
      "kilometers"
    ) as FeatureCollection<Polygon>;

    setDataBuffer(buffered);
    setShowBuffer(true);
    setShowPopup(false);

    fetch("/api/spatial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "buffer",
        geometry: buffered,
        coordinates: [e.lngLat.lng, e.lngLat.lat],
        metadata: { radius: 1, units: "kilometers" },
      }),
    })
      .then((res) => {
        if (!res.ok) console.error("Failed to save buffer");
        else console.log("Buffer saved to MongoDB");
      })
      .catch((err) => console.error("Error saving buffer:", err));
  }, []);

  const handleMapClick = useCallback((e: MapMouseEvent) => {
    console.log("Map clicked:", e.lngLat);
    setPopupInfo({
      longitude: e.lngLat.lng,
      latitude: e.lngLat.lat,
    });
    setShowPopup(true);
  }, []);

  // Toggle layer visibility functions
  const toggleFasumLayer = useCallback(() => setShowFasum((prev) => !prev), []);
  const toggleJawaLayer = useCallback(() => setShowJawa((prev) => !prev), []);
  const toggleJawaHealthLayer = useCallback(
    () => setShowJawaHealth((prev) => !prev),
    []
  );
  const toggleKlHealthLayer = useCallback(
    () => setShowKlHealth((prev) => !prev),
    []
  );

  // Paint styles as memoized values to prevent rerenders
  const bufferPaint = useMemo(
    () => ({
      "fill-color": "#088",
      "fill-opacity": 0.4,
      "fill-outline-color": "#088",
    }),
    []
  );

  const fasumFillPaint = useMemo(
    () => ({
      "fill-color": [
        "match",
        ["get", "type"],
        "house",
        "#FF9900",
        "school",
        "#3388ff",
        "general",
        "#ffcc00",
        "commercial",
        "#ff6600",
        "mosque",
        "#00cc66",
        "church",
        "#9900cc",
        "hospital",
        "#ff0000",
        "#FF9900",
      ],
      "fill-opacity": 0.6,
      "fill-antialias": true,
    }),
    []
  );

  const fasumOutlinePaint = useMemo(
    () => ({
      "line-color": "#666",
      "line-width": 1,
      "line-opacity": 0.9,
    }),
    []
  );

  const jawaFillPaint = useMemo(
    () => ({
      "fill-color": "#800080",
      "fill-opacity": 0.3,
      "fill-antialias": true,
    }),
    []
  );

  const jawaOutlinePaint = useMemo(
    () => ({
      "line-color": "#000000",
      "line-width": 2,
      "line-opacity": 0.8,
    }),
    []
  );

  const jawaHealthFillPaint = useMemo(
    () => ({
      "fill-color": "#00FF00",
      "fill-opacity": 0.4,
      "fill-antialias": true,
    }),
    []
  );

  const jawaHealthOutlinePaint = useMemo(
    () => ({
      "line-color": "#006600",
      "line-width": 1,
      "line-opacity": 0.9,
    }),
    []
  );

  const klHealthFillPaint = useMemo(
    () => ({
      "fill-color": "#0000FF",
      "fill-opacity": 0.4,
      "fill-antialias": true,
    }),
    []
  );

  const klHealthOutlinePaint = useMemo(
    () => ({
      "line-color": "#000066",
      "line-width": 1,
      "line-opacity": 0.9,
    }),
    []
  );

  return (
    <div className="relative w-full h-screen bg-gray-100">
      <div className="relative w-full h-full overflow-hidden">
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg z-50">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
              <span>Loading data...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center space-x-2">
            <AlertCircle size={16} />
            <p>{error}</p>
            <button
              onClick={fetchAllData}
              className="ml-2 bg-red-200 hover:bg-red-300 rounded-full p-1"
              title="Retry loading data"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        )}

        {/* Data Statistics Panel */}
        <div className="absolute top-20 left-4 bg-white/90 p-3 rounded shadow-lg z-40 text-sm max-w-xs">
          <h4 className="font-bold mb-2">Data Statistics</h4>
          <ul className="space-y-1">
            <li>
              Fasum: {dataStats.fasum} features{" "}
              {showFasum ? "(visible)" : "(hidden)"}
            </li>
            <li>
              Jawa: {dataStats.jawa} features{" "}
              {showJawa ? "(visible)" : "(hidden)"}
            </li>
            <li>
              Jawa Health: {dataStats.jawaHealth} features{" "}
              {showJawaHealth ? "(visible)" : "(hidden)"}
            </li>
            <li>
              KL Health: {dataStats.klHealth} features{" "}
              {showKlHealth ? "(visible)" : "(hidden)"}
            </li>
            <li>
              Viewport: {viewport.latitude.toFixed(4)},{" "}
              {viewport.longitude.toFixed(4)} @ {viewport.zoom.toFixed(1)}
            </li>
          </ul>
          <button
            onClick={fitMapToBounds}
            className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Fit to Data
          </button>
        </div>

        <div className="relative w-full h-full z-0">
          <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none"></div>
          <MapGL
            style={{ width: "100%", height: "100%" }}
            mapStyle={`https://basemap.mapid.io/styles/street-new-generation/style.json?key=${MAP_SERVICE_KEY}`}
            accessToken={MAPBOX_TOKEN}
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            zoom={viewport.zoom}
            onViewportChange={setViewport}
            onClick={handleMapClick}
            onError={(e: Error) => console.error("Map error:", e)}
            onDrag={(e: EventData) => console.log("Dragging:", e)}
            dragPan
            scrollZoom
            doubleClickZoom
            dragRotate={false}
          >
            {showPopup && popupInfo && (
              <Popup
                longitude={popupInfo.longitude}
                latitude={popupInfo.latitude}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setShowPopup(false)}
              >
                <div>
                  <p>Longitude: {popupInfo.longitude.toFixed(6)}</p>
                  <p>Latitude: {popupInfo.latitude.toFixed(6)}</p>
                  <button
                    onClick={() =>
                      clickBuffer({
                        lngLat: new LngLat(
                          popupInfo.longitude,
                          popupInfo.latitude
                        ),
                      })
                    }
                    className="mt-2 bg-[#C1FF9B] hover:bg-[#A8E689] px-4 py-1 rounded text-sm"
                  >
                    Create Buffer
                  </button>
                </div>
              </Popup>
            )}

            {/* Map Layers */}
            {showBuffer && dataBuffer && (
              <Source id="buffer-data" type="geojson" data={dataBuffer}>
                <Layer id="buffer-layer" type="fill" paint={bufferPaint} />
              </Source>
            )}

            {showFasum && fasumData && (
              <Source id="fasum-data" type="geojson" data={fasumData}>
                <Layer
                  id="fasum-layer-fill"
                  type="fill"
                  paint={fasumFillPaint}
                />
                <Layer
                  id="fasum-layer-outline"
                  type="line"
                  paint={fasumOutlinePaint}
                />
              </Source>
            )}

            {showJawa && jawaData && (
              <Source id="jawa-data" type="geojson" data={jawaData}>
                <Layer id="jawa-layer-fill" type="fill" paint={jawaFillPaint} />
                <Layer
                  id="jawa-layer-outline"
                  type="line"
                  paint={jawaOutlinePaint}
                />
              </Source>
            )}

            {showJawaHealth && jawaHealthData && (
              <Source
                id="jawa-health-data"
                type="geojson"
                data={jawaHealthData}
              >
                <Layer
                  id="jawa-health-layer-fill"
                  type="fill"
                  paint={jawaHealthFillPaint}
                />
                <Layer
                  id="jawa-health-layer-outline"
                  type="line"
                  paint={jawaHealthOutlinePaint}
                />
              </Source>
            )}

            {showKlHealth && klHealthData && (
              <Source id="kl-health-data" type="geojson" data={klHealthData}>
                <Layer
                  id="kl-health-layer-fill"
                  type="fill"
                  paint={klHealthFillPaint}
                />
                <Layer
                  id="kl-health-layer-outline"
                  type="line"
                  paint={klHealthOutlinePaint}
                />
              </Source>
            )}
          </MapGL>
        </div>

        {/* Control Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button className="bg-[#C1FF9B] hover:bg-[#A8E689] text-black p-3 rounded-full shadow-lg transition-colors">
            <MapIcon size={24} />
          </button>
          <button className="bg-[#C1FF9B] hover:bg-[#A8E689] text-black p-3 rounded-full shadow-lg transition-colors">
            <Search size={24} />
          </button>
          <button
            onClick={toggleFasumLayer}
            className="bg-[#C1FF9B] hover:bg-[#A8E689] text-black p-3 rounded-full shadow-lg transition-colors"
            title={showFasum ? "Hide Building Layer" : "Show Building Layer"}
          >
            {showFasum ? <Eye size={24} /> : <EyeOff size={24} />}
          </button>
          <button
            onClick={toggleJawaLayer}
            className="bg-[#C1FF9B] hover:bg-[#A8E689] text-black p-3 rounded-full shadow-lg transition-colors"
            title={showJawa ? "Hide Jawa Layer" : "Show Jawa Layer"}
          >
            {showJawa ? <Eye size={24} /> : <EyeOff size={24} />}
          </button>
          <button
            onClick={toggleJawaHealthLayer}
            className="bg-[#C1FF9B] hover:bg-[#A8E689] text-black p-3 rounded-full shadow-lg transition-colors"
            title={
              showJawaHealth
                ? "Hide Jawa Healthcare Layer"
                : "Show Jawa Healthcare Layer"
            }
          >
            {showJawaHealth ? <Eye size={24} /> : <EyeOff size={24} />}
          </button>
          <button
            onClick={toggleKlHealthLayer}
            className="bg-[#C1FF9B] hover:bg-[#A8E689] text-black p-3 rounded-full shadow-lg transition-colors"
            title={
              showKlHealth
                ? "Hide Kalimantan Healthcare Layer"
                : "Show Kalimantan Healthcare Layer"
            }
          >
            {showKlHealth ? <Eye size={24} /> : <EyeOff size={24} />}
          </button>
        </div>

        {/* Bottom Toolbar */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white rounded-full shadow-lg px-6 py-3 flex items-center gap-8">
            <button className="text-gray-600 hover:text-black transition-colors">
              <Wind size={24} />
            </button>
            <button className="text-gray-600 hover:text-black transition-colors">
              <BarChart2 size={24} />
            </button>
            <button className="text-gray-600 hover:text-black transition-colors">
              <Layers size={24} />
            </button>
            <button className="text-gray-600 hover:text-black transition-colors">
              <Ruler size={24} />
            </button>
            <button className="text-gray-600 hover:text-black transition-colors">
              <Share size={24} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-24 right-4 bg-white p-3 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
          <h3 className="font-bold text-sm mb-2">Legend</h3>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#FF9900] opacity-60 mr-2"></div>
            <span className="text-xs">Pantai</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#3388ff] opacity-60 mr-2"></div>
            <span className="text-xs">Bukit</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#ffcc00] opacity-60 mr-2"></div>
            <span className="text-xs">Air Terjun</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#ff6600] opacity-60 mr-2"></div>
            <span className="text-xs">Curug</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#00cc66] opacity-60 mr-2"></div>
            <span className="text-xs">Goa</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#9900cc] opacity-60 mr-2"></div>
            <span className="text-xs">Waduk</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#ff0000] opacity-60 mr-2"></div>
            <span className="text-xs">Desa Wisata</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#800080] opacity-30 mr-2"></div>
            <span className="text-xs">Wisata Puncak</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#00FF00] opacity-40 mr-2"></div>
            <span className="text-xs">Kebun Teh</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#0000FF] opacity-40 mr-2"></div>
            <span className="text-xs">Wisata Lainnya</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
