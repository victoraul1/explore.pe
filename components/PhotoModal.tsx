'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

interface PhotoModalProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
  onLike?: (index: number) => void;
  likes?: number[];
  canLike?: boolean;
}

export default function PhotoModal({ 
  images, 
  initialIndex, 
  onClose, 
  onLike,
  likes = [],
  canLike = true 
}: PhotoModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLiked, setIsLiked] = useState<boolean[]>(new Array(images.length).fill(false));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleLike = () => {
    const newLiked = [...isLiked];
    newLiked[currentIndex] = !newLiked[currentIndex];
    setIsLiked(newLiked);
    if (onLike) {
      onLike(currentIndex);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Image container */}
      <div className="relative max-w-6xl max-h-[90vh] mx-4">
        <img
          src={images[currentIndex]}
          alt={`Imagen ${currentIndex + 1}`}
          className="max-w-full max-h-[90vh] object-contain"
        />

        {/* Like button */}
        {canLike && (
          <button
            onClick={handleLike}
            className={`absolute bottom-4 right-4 p-3 rounded-full transition-all ${
              isLiked[currentIndex] 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart 
              className={`w-6 h-6 ${isLiked[currentIndex] ? 'fill-current' : ''}`} 
            />
          </button>
        )}

        {/* Like count */}
        {likes[currentIndex] > 0 && (
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full">
            {likes[currentIndex]} {likes[currentIndex] === 1 ? 'like' : 'likes'}
          </div>
        )}
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}