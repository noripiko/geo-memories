import React, { useState, useEffect } from 'react';
import { TravelPhoto } from '../../types/travel';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoLightboxProps {
  currentPhoto: TravelPhoto | null;
  photos: TravelPhoto[];
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  currentPhoto,
  photos,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentPhoto && photos.length > 0) {
      const idx = photos.findIndex((p) => p.id === currentPhoto.id);
      if (idx !== -1) setCurrentIndex(idx);
    }
  }, [currentPhoto, photos]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos]);

  if (!isOpen || photos.length === 0) return null;

  const photo = photos[currentIndex] || photos[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white bg-slate-900/60 hover:bg-slate-900 rounded-full transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev / Next controls */}
      {photos.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2.5 text-white/80 hover:text-white bg-slate-900/60 hover:bg-slate-900 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2.5 text-white/80 hover:text-white bg-slate-900/60 hover:bg-slate-900 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Image Viewport */}
      <div className="flex flex-col items-center justify-center max-w-5xl max-h-[85vh] p-4">
        <img
          src={photo.url}
          alt={photo.caption || '旅の写真'}
          referrerPolicy="no-referrer"
          className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
        />
        {photo.caption && (
          <p className="mt-3 text-sm text-slate-300 font-medium text-center bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800">
            {photo.caption} ({currentIndex + 1} / {photos.length})
          </p>
        )}
      </div>
    </div>
  );
};
