'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  onClose?: () => void;
}

export default function ImageCarousel({ images, onClose }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: currentIndex * 220,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative bg-gray-100 rounded-lg p-4">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      <div className="relative">
        {images.length > 3 && currentIndex > 0 && (
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
            {images.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-52 h-36"
              >
                <img
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-sm"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {images.length > 3 && currentIndex < images.length - 3 && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex justify-center mt-4 gap-1">
        {images.map((_, index) => (
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
    </div>
  );
}