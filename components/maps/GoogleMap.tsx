'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { IGuide } from '@/models/Guide';
import GoogleMapFallback from './GoogleMapFallback';

interface GoogleMapProps {
  guides: IGuide[];
  onMarkerClick: (guide: IGuide) => void;
  selectedGuide?: IGuide | null;
}

export default function GoogleMap({ guides, onMarkerClick, selectedGuide }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          version: 'weekly',
        });

        const { Map } = await loader.importLibrary('maps');
        const { Marker, InfoWindow } = await loader.importLibrary('marker') as any;

        if (mapRef.current && !map) {
          const newMap = new Map(mapRef.current, {
            center: { lat: -9.189967, lng: -75.015152 }, // Center of Peru
            zoom: 6,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });

          setMap(newMap);
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setMapError(true);
      }
    };

    initMap();
  }, [map]);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    // Create new markers
    const newMarkers: google.maps.Marker[] = [];
    const bounds = new google.maps.LatLngBounds();

    guides.forEach(guide => {
      const marker = new google.maps.Marker({
        position: { lat: guide.lat, lng: guide.lng },
        map,
        title: guide.name,
        animation: selectedGuide?._id === guide._id ? google.maps.Animation.BOUNCE : undefined,
      });

      bounds.extend({ lat: guide.lat, lng: guide.lng });

      marker.addListener('click', () => {
        onMarkerClick(guide);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Fit map to show all markers
    if (guides.length > 0) {
      map.fitBounds(bounds);
      if (guides.length === 1) {
        map.setZoom(12);
      }
    }
  }, [map, guides, selectedGuide, onMarkerClick]);

  if (mapError) {
    return <GoogleMapFallback guides={guides} onMarkerClick={onMarkerClick} selectedGuide={selectedGuide} />;
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg"
      style={{ minHeight: '400px' }}
    />
  );
}