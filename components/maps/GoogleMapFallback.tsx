'use client';

import { IGuide } from '@/models/Guide';
import { MapPin } from 'lucide-react';

interface GoogleMapFallbackProps {
  guides: IGuide[];
  onMarkerClick: (guide: IGuide) => void;
  selectedGuide?: IGuide | null;
}

export default function GoogleMapFallback({ guides, onMarkerClick, selectedGuide }: GoogleMapFallbackProps) {
  return (
    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-50" />
      
      <div className="text-center z-10 p-8 max-w-md">
        <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Mapa de Perú
        </h3>
        <p className="text-gray-600 mb-4">
          Para ver el mapa interactivo, configura tu API key de Google Maps en la consola de Google Cloud.
        </p>
        
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h4 className="font-semibold mb-2">Guías disponibles:</h4>
          <div className="max-h-40 overflow-y-auto">
            {guides.map((guide) => (
              <button
                key={guide._id}
                onClick={() => onMarkerClick(guide)}
                className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                  selectedGuide?._id === guide._id ? 'bg-blue-100' : ''
                }`}
              >
                <div className="font-medium">{guide.name}</div>
                <div className="text-sm text-gray-600">{guide.location.split(',')[0]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}