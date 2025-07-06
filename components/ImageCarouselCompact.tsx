'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselCompactProps {
  images: string[];
}

export default function ImageCarouselCompact({ images }: ImageCarouselCompactProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Update scroll position when index changes
  useEffect(() => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const containerWidth = scrollRef.current.clientWidth;
      const scrollPosition = (scrollWidth / images.length) * currentIndex;
      scrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, images.length]);

  // Handle scroll to update current index
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const containerWidth = scrollRef.current.clientWidth;
      const newIndex = Math.round(scrollLeft / containerWidth);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Sin imágenes</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group">
      {/* Scrollable container for mobile */}
      <div
        ref={scrollRef}
        className="w-full h-full overflow-x-auto scrollbar-hide md:overflow-hidden"
        onScroll={handleScroll}
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div className="flex h-full" style={{ width: `${images.length * 100}%` }}>
          {images.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full"
              style={{ scrollSnapAlign: 'start' }}
            >
              <img
                src={image}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Desktop navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}