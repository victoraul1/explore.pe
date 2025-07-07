'use client';

import { useEffect, useRef, useState } from 'react';

interface SimpleMapProps {
  lat: number;
  lng: number;
  name: string;
}

export default function SimpleMap({ lat, lng, name }: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) {
        console.log('Map ref not ready');
        return;
      }

      console.log('Initializing map with:', { lat, lng, name });

      try {
        // Initialize map
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

        console.log('Map initialized successfully');
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
      }
    };

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      console.log('Google Maps already loaded');
      initMap();
    } else {
      console.log('Waiting for Google Maps to load...');
      // Wait for Google Maps to load
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          console.log('Google Maps loaded!');
          clearInterval(checkInterval);
          initMap();
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.google || !window.google.maps) {
          console.error('Google Maps failed to load after 10 seconds');
          setMapError(true);
        }
      }, 10000);
    }
  }, [lat, lng, name]);

  if (mapError) {
    return (
      <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Error al cargar el mapa</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100">
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '300px' }} />
    </div>
  );
}