'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface MultiLocationMapProps {
  locations: Location[];
}

export default function MultiLocationMap({ locations }: MultiLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || locations.length === 0) return;

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
      });

      const { Map } = await loader.importLibrary('maps');
      const { Marker } = await loader.importLibrary('marker');

      // Create map centered on Peru
      const map = new Map(mapRef.current, {
        center: { lat: -9.19, lng: -75.0152 },
        zoom: 5,
        mapTypeControl: true,
        streetViewControl: false,
      });

      mapInstanceRef.current = map;

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Create bounds to fit all markers
      const bounds = new google.maps.LatLngBounds();

      // Add markers for each location
      locations.forEach((location, index) => {
        const marker = new Marker({
          position: { lat: location.lat, lng: location.lng },
          map,
          title: location.name,
          animation: google.maps.Animation.DROP,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new google.maps.Size(40, 40),
          },
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold text-sm">${location.name}</h3>
              <p class="text-xs text-gray-600 mt-1">Lugar visitado</p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
        bounds.extend(marker.getPosition()!);
      });

      // Fit map to show all markers
      if (locations.length > 0) {
        map.fitBounds(bounds);
        // Prevent excessive zoom for single marker
        if (locations.length === 1) {
          map.setZoom(12);
        }
      }
    };

    initMap();
  }, [locations]);

  if (locations.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No hay lugares visitados registrados</p>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full rounded-lg" />;
}