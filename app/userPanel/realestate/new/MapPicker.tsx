"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

interface LatLng {
  lat: number;
  lng: number;
}

interface MapPickerProps {
  onSelect: (location: LatLng) => void;
  initialLocation?: LatLng | null;
}

function MapPicker({ onSelect, initialLocation }: MapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    // Import Leaflet dynamically
    import("leaflet").then((L) => {
      // Fix icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Clean up existing map if any
      if (mapRef.current) {
        mapRef.current.remove();
      }

      // Create new map

      let map: L.Map | null = null;

      if (mapContainerRef.current) {
          map = L.map(mapContainerRef.current).setView(
          initialLocation ? [initialLocation.lat, initialLocation.lng] : [35.6892, 51.389],
          initialLocation ? 15 : 13
        );
      }

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map!);

      // Handle clicks
      map?.on("click", (e: any) => {
        const { lat, lng } = e.latlng;

        // Remove existing marker
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }

        // Add new marker
        const marker = L.marker([lat, lng]).addTo(map);
        markerRef.current = marker;

        onSelect({ lat, lng });
      });

      // If initial location exists, show marker
      if (initialLocation) {
        const marker = L.marker([initialLocation.lat, initialLocation.lng]).addTo(map!);
        markerRef.current = marker;
      }

      // Store map reference
      mapRef.current = map;

      // Cleanup function
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    });
  }, [initialLocation, onSelect]);

  return (
    <div
      ref={mapContainerRef}
      className="leaflet-map-container"
      style={{
        height: "250px",
        width: "100%",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        position: "relative",
        zIndex: 1
      }}
    />
  );
}

export default MapPicker;
