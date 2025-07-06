'use client';

import { useState } from 'react';
import { IGuide } from '@/models/Guide';
import { MapPin, Star, DollarSign, ChevronDown, ChevronUp, Phone, Mail, MessageCircle, Instagram, Facebook } from 'lucide-react';
import ImageCarousel from '@/components/ImageCarousel';
import ImageCarouselCompact from '@/components/ImageCarouselCompact';

interface GuideCardCompactProps {
  guide: IGuide;
  onSelect: (guide: IGuide) => void;
  isSelected?: boolean;
}

export default function GuideCardCompact({ guide, onSelect, isSelected }: GuideCardCompactProps) {
  const [expanded, setExpanded] = useState(false);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const whatsappNumber = guide.whatsapp || guide.phone;
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  const handleInstagramClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (guide.instagram) {
      const username = guide.instagram.replace('@', '');
      window.open(`https://instagram.com/${username}`, '_blank');
    }
  };

  const handleFacebookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (guide.facebook) {
      window.open(guide.facebook, '_blank');
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div 
        className="cursor-pointer"
        onClick={() => onSelect(guide)}
      >
        <div className="aspect-video relative">
          {guide.images && guide.images.length > 0 ? (
            <ImageCarouselCompact images={guide.images} />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Sin imágenes</span>
            </div>
          )}
        </div>
        
        <div className="p-3">
          <h3 className="text-lg font-semibold mb-1">{guide.name}</h3>
          
          <div className="flex items-start gap-1 mb-2">
            <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-600 line-clamp-1">{guide.location}</span>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            {guide.price && (
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-green-600">S/ {guide.price}/hora</span>
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

      {/* Ver más button */}
      <div className="px-3 pb-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="w-full flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {expanded ? 'Ver menos' : 'Ver más'}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-3 pb-3 border-t pt-3 space-y-3">
          {/* YouTube Video */}
          {guide.youtubeEmbed && (
            <div className="-mx-3 mb-3">
              <div className="aspect-video relative">
                <iframe
                  src={guide.youtubeEmbed}
                  title={`Video de ${guide.name}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Services */}
          {guide.services && (
            <div>
              <h4 className="font-semibold text-sm mb-1">Servicios:</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{guide.services}</p>
            </div>
          )}

          {/* Contact information */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Contacto:</h4>
            
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{guide.phone}</span>
            </div>

            {guide.whatsapp && (
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {guide.whatsapp}</span>
              </button>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{guide.email}</span>
            </div>
          </div>

          {/* Social media */}
          {(guide.instagram || guide.facebook) && (
            <div className="flex gap-3 pt-2">
              {guide.instagram && (
                <button
                  onClick={handleInstagramClick}
                  className="flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700"
                >
                  <Instagram className="w-4 h-4" />
                  <span>{guide.instagram}</span>
                </button>
              )}
              
              {guide.facebook && (
                <button
                  onClick={handleFacebookClick}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}