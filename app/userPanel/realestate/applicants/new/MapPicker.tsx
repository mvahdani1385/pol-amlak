// "use client";

// import { useEffect, useState, useRef, memo } from "react";

// interface LatLng {
//   lat: number;
//   lng: number;
// }

// function MapPicker({ onSelect, initialLocation }: { onSelect: any; initialLocation?: { lat: number; lng: number } | null }) {
//   const [mounted, setMounted] = useState(false);
//   const mapRef = useRef<HTMLDivElement>(null);
//   const markerRef = useRef<any>(null);

//   useEffect(() => {
//     setMounted(true);
//     return () => {
//       // Cleanup if needed
//     };
//   }, []);

//   useEffect(() => {
//     if (!mounted || !mapRef.current) return;

//     // Initialize map
//     const map = new (window as any).L.Map(mapRef.current).setView([35.6892, 51.389], 13);

//     // Add tile layer
//     (window as any).L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//     }).addTo(map);

//     // Handle clicks
//     map.on("click", (e: any) => {
//       const { lat, lng } = e.latlng;

//       // Remove existing marker
//       if (markerRef.current) {
//         map.removeLayer(markerRef.current);
//       }

//       // Add new marker
//       const marker = (window as any).L.marker([lat, lng]).addTo(map);
//       markerRef.current = marker;

//       onSelect({ lat, lng });
//     });

//     // If initial location exists, show marker
//     if (initialLocation) {
//       const marker = (window as any).L.marker([initialLocation.lat, initialLocation.lng]).addTo(map);
//       markerRef.current = marker;
//       map.setView([initialLocation.lat, initialLocation.lng], 15);
//     }

//     return () => {
//       map.remove();
//     };
//   }, [mounted, onSelect, initialLocation]);

//   // Don't render on server
//   if (!mounted) return null;

//   return (
//     <div 
//       ref={mapRef} 
//       style={{ height: "400px", width: "100%", borderRadius: "8px" }}
//     />
//   );
// }

// export default memo(MapPicker);



"use client";

import { useEffect, useState, useRef, memo } from "react";
import dynamic from "next/dynamic"; // Import dynamic from next/dynamic

// Define the component as a dynamic import with SSR disabled
const DynamicMapPicker = dynamic(
  () =>
    new Promise<{ default: React.ComponentType<any> }>((resolve) => {
      import("leaflet").then((L) => {
        // Make Leaflet available globally for the component's internal logic if needed
        // or pass L directly if the component is refactored to accept it
        (window as any).L = L;
        resolve({ default: MapPickerInternal });
      });
    }),
  { ssr: false } // Crucial: disable server-side rendering
);

interface LatLng {
  lat: number;
  lng: number;
}

interface MapPickerProps {
  onSelect: (location: LatLng) => void;
  initialLocation?: LatLng | null;
}

// The actual component logic, now expecting Leaflet to be available via window.L
function MapPickerInternal({ onSelect, initialLocation }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null); // To hold the map instance

  useEffect(() => {
    // Ensure Leaflet is available
    if (!(window as any).L) {
      console.error("Leaflet is not loaded!");
      return;
    }
    const L = (window as any).L;

    // Initialize map if mapRef.current is available
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([35.6892, 51.389], 13);
      mapInstanceRef.current = map; // Store the map instance

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Handle clicks
      map.on("click", (e: any) => {
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
        const marker = L.marker([initialLocation.lat, initialLocation.lng]).addTo(map);
        markerRef.current = marker;
        map.setView([initialLocation.lat, initialLocation.lng], 15);
      }
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove(); // Use the stored instance for removal
        mapInstanceRef.current = null;
      }
    };
  }, [initialLocation, onSelect]); // Dependencies for the effect

  return (
    <div
      ref={mapRef}
      style={{ height: "400px", width: "100%", borderRadius: "8px" }}
    />
  );
}

// Export the dynamically imported component
export default memo(DynamicMapPicker);
