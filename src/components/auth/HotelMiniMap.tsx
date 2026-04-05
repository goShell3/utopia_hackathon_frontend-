'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const hotelIcon = L.divIcon({
  className: '',
  html: `<div style="width:10px;height:10px;background:#000;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 2px #000"></div>`,
  iconAnchor: [5, 5],
});

interface Props {
  lat: number;
  lng: number;
}

export function HotelMiniMap({ lat, lng }: Props) {
  return (
    <div className="w-full h-24 overflow-hidden border border-neutral-700">
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} icon={hotelIcon} />
      </MapContainer>
    </div>
  );
}
