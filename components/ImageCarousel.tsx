'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import PhotoModal from './PhotoModal';
import { IImage } from '@/models/Guide';
import { normalizeImages, getImageUrl, getImageCaption } from '@/lib/imageUtils';

interface ImageCarouselProps {
  images: (string | IImage)[];
  onClose?: () => void;
}

export default function ImageCarousel({ images, onClose }: ImageCarouselProps) {
  const normalizedImages = normalizeImages(images);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 3));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(images.length - 3, prev + 3));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const x = e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleImageClick = (index: number) => {
    if (!isDragging) {
      setModalIndex(index);
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: currentIndex * 220,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  if (!normalizedImages || normalizedImages.length === 0) {
    return null;
  }

  return (
    <div className="relative bg-gray-100 rounded-lg p-2 sm:p-4">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      <div className="relative">
        {normalizedImages.length > 3 && currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none', 
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          <div className="flex gap-4 pb-2">
            {normalizedImages.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 cursor-pointer"
                onClick={() => handleImageClick(index)}
              >
                <div className="w-40 sm:w-52">
                  <img
                    src={image.url}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-28 sm:h-36 object-cover rounded-lg shadow-sm hover:opacity-90 transition-opacity"
                    draggable={false}
                  />
                  {image.caption && (
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2 px-1">
                      {image.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {normalizedImages.length > 3 && currentIndex < normalizedImages.length - 3 && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex justify-center mt-4 gap-1">
        {normalizedImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(Math.floor(index / 3) * 3)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index >= currentIndex && index < currentIndex + 3
                ? 'bg-blue-500'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      
      {showModal && (
        <PhotoModal
          images={normalizedImages.map(img => img.url)}
          captions={normalizedImages.map(img => img.caption || '')}
          initialIndex={modalIndex}
          onClose={() => setShowModal(false)}
          canLike={false}
        />
      )}
    </div>
  );
}