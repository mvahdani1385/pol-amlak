"use client";

import { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface MapData {
  allProperty: any[];
}

export default function MapComponent({ allProperty }: MapData) {
  const [locations, setLocations] = useState<any[]>([]);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const filteredLocations = allProperty.filter(
      (prop: any) => prop.latitude && prop.longitude,
    );

    setLocations(filteredLocations);
  }, [allProperty]);

  const formatNumber = (num: any) => {
    if (num == null || num === "") return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    if (locations.length > 0 && !mapRef.current) {
      const map = L.map("map").setView([35.7275, 51.3333], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      locations.forEach((prop) => {
        const marker = L.marker([prop.latitude, prop.longitude]).addTo(map);

        let popupContent = `
    <div class="popup-content">
      <h4>${prop.title}</h4>
      <h4>${prop.landArea ? 'متراژ زمین : ' : ''}${prop.landArea ?? ''}${prop.landArea ? 'متر' : ''}</h4>
  `;

        if (prop.price) {
          popupContent += `
      <h2 class="font-medium text-lg mt-3">
        قیمت کل :
        <span class="text-[var(--title)]">${formatNumber(prop.price)}</span>
      </h2>
    `;
        } else if (prop.depositPrice && prop.rentPrice) {
          popupContent += `
      <h2 class="font-medium text-lg mt-3">
        قیمت رهن :
        <span class="text-[var(--title)]">${formatNumber(prop.depositPrice)}</span>
      </h2>
      <h2 class="font-medium text-lg mt-1">
        قیمت اجاره :
        <span class="text-[var(--title)]">${formatNumber(prop.rentPrice)}</span>
      </h2>
    `;
        }

        popupContent += `
    <a href="/realestate/${prop.slug}" target="_blank" class="subBtn view-btn mt-3">مشاهده ملک</a>
    </div>
  `;

        marker.bindPopup(popupContent);
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [locations]);

  return <div id="map" className="rounded-xl" style={{ width: "100%", height: "100vh" }}></div>;
}
