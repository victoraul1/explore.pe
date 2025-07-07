'use client';

import { useEffect, useRef } from 'react';

interface SimpleMapProps {
  lat: number;
  lng: number;
  name: string;
}

export default function SimpleMap({ lat, lng, name }: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      // Add marker
      markerRef.current = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        title: name,
      });
    } else {
      // Update existing map
      const newCenter = { lat, lng };
      mapInstanceRef.current.setCenter(newCenter);
      markerRef.current?.setPosition(newCenter);
      markerRef.current?.setTitle(name);
    }
  }, [lat, lng, name]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}