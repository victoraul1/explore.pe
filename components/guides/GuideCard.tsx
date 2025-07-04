'use client';

import { IGuide } from '@/models/Guide';
import { MapPin, Phone, Mail, Star, DollarSign, Instagram } from 'lucide-react';

interface GuideCardProps {
  guide: IGuide;
  onSelect: (guide: IGuide) => void;
  isSelected?: boolean;
}

export default function GuideCard({ guide, onSelect, isSelected }: GuideCardProps) {
  const extractVideoId = (url: string) => {
    const match = url.match(/embed\/([^?]+)/);
    return match ? match[1] : '';
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all hover:shadow-xl ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onSelect(guide)}
    >
      <div className="aspect-video relative">
        <iframe
          src={guide.youtubeEmbed}
          title={`Video de ${guide.name}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{guide.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{guide.category}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{guide.location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">{guide.phone}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">{guide.email}</span>
          </div>
          
          {guide.instagram && (
            <div className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{guide.instagram}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          {guide.price && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-600">${guide.price}/día</span>
            </div>
          )}
          
          {guide.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{guide.rating.stars}</span>
              <span className="text-gray-500 text-sm">({guide.rating.count})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}