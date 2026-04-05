'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's broken default icon refs in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export type Venue = {
  name: string;
  city: string;
  lat: number;
  lng: number;
  capacity?: number;
  isPrimary?: boolean;
};

type HotelLocation = {
  city: string;
  lat: number;
  lng: number;
};

interface Props {
  venues: Venue[];
  hotel: HotelLocation;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function hotelIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;background:#000;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 2px #000"></div>`,
    iconAnchor: [7, 7],
  });
}

function venueIcon(isPrimary?: boolean) {
  const color = isPrimary ? '#7C3AED' : '#6B7280';
  return L.divIcon({
    className: '',
    html: `<div style="width:10px;height:10px;background:${color};border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 2px ${color}"></div>`,
    iconAnchor: [5, 5],
  });
}

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  React.useEffect(() => {
    if (positions.length > 1) {
      map.fitBounds(L.latLngBounds(positions), { padding: [48, 48] });
    } else if (positions.length === 1) {
      map.setView(positions[0], 12);
    }
  }, [map, positions]);
  return null;
}

export function EventMap({ venues, hotel }: Props) {
  const allPositions: [number, number][] = [
    [hotel.lat, hotel.lng],
    ...venues.map(v => [v.lat, v.lng] as [number, number]),
  ];

  return (
    <div className="space-y-3">
      <div className="border border-neutral-100 overflow-hidden" style={{ height: 320, isolation: 'isolate' }}>
        <MapContainer
          center={[hotel.lat, hotel.lng]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <FitBounds positions={allPositions} />

          {/* Hotel marker */}
          <Marker position={[hotel.lat, hotel.lng]} icon={hotelIcon()}>
            <Popup>
              <span className="text-xs font-bold">Your Hotel</span>
              <br />
              <span className="text-xs text-gray-500">{hotel.city}</span>
            </Popup>
          </Marker>

          {/* Venue markers + lines */}
          {venues.map(v => {
            const distKm = haversineKm(hotel.lat, hotel.lng, v.lat, v.lng);
            return (
              <React.Fragment key={`${v.lat}-${v.lng}`}>
                <Polyline
                  positions={[[hotel.lat, hotel.lng], [v.lat, v.lng]]}
                  pathOptions={{ color: v.isPrimary ? '#7C3AED' : '#9CA3AF', weight: 1.5, dashArray: '4 4' }}
                />
                <Marker position={[v.lat, v.lng]} icon={venueIcon(v.isPrimary)}>
                  <Popup>
                    <span className="text-xs font-bold">{v.name}</span>
                    <br />
                    <span className="text-xs text-gray-500">{v.city}</span>
                    <br />
                    <span className="text-xs text-gray-400">{distKm.toFixed(1)} km from your hotel</span>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>

      {/* Distance list */}
      <div className="space-y-1">
        {venues.map(v => {
          const distKm = haversineKm(hotel.lat, hotel.lng, v.lat, v.lng);
          return (
            <div key={`${v.lat}-${v.lng}`} className="flex items-center justify-between px-3 py-2 bg-neutral-50 border border-neutral-100">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${v.isPrimary ? 'bg-violet-600' : 'bg-neutral-400'}`} />
                <div>
                  <p className="text-xs font-black italic uppercase tracking-tight">{v.name}</p>
                  <p className="technical-label text-[9px] text-neutral-400">{v.city}{v.capacity ? ` · cap. ${v.capacity.toLocaleString()}` : ''}</p>
                </div>
              </div>
              <span className="text-xs font-black italic text-neutral-600">{distKm.toFixed(1)} km</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
