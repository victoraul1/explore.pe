'use client';

import { IGuide } from '@/models/Guide';
import { MapPin, Star, DollarSign } from 'lucide-react';

interface GuideCardCompactProps {
  guide: IGuide;
  onSelect: (guide: IGuide) => void;
  isSelected?: boolean;
}

export default function GuideCardCompact({ guide, onSelect, isSelected }: GuideCardCompactProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
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
      
      <div className="p-3">
        <h3 className="text-lg font-semibold mb-1">{guide.name}</h3>
        
        <div className="flex items-start gap-1 mb-2">
          <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-600 line-clamp-1">{guide.location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          {guide.price && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-green-600" />
              <span className="text-sm font-semibold text-green-600">${guide.price}/día</span>
            </div>
          )}
          
          {guide.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{guide.rating.stars}</span>
              <span className="text-gray-500 text-xs">({guide.rating.count})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}