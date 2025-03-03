import React, { useEffect, useState, useCallback } from 'react';
import type { Photo } from './types';
import { useSwipe } from '@/hooks/useSwipe';

interface ImageModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  totalPhotos?: number;
  currentIndex?: number;
}

const ImageModal: React.FC<ImageModalProps> = ({ 
  photo, 
  isOpen, 
  onClose,
  onNext,
  onPrevious,
  totalPhotos,
  currentIndex
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isClosing, setIsClosing] = useState(false);

  // Swipe handling voor mobiel
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe({
    onSwipeLeft: onNext,
    onSwipeRight: onPrevious,
    onSwipeDown: () => handleClose(),
    onSwipeUp: () => handleClose(),
    threshold: 50,
  });

  const handleClose = useCallback(() => {
    setIsClosing(true);
    // Wacht op de fade-out animatie voordat we echt sluiten
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  }, [onClose]);

  // Keyboard navigatie
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          onPrevious?.();
          break;
        case 'ArrowRight':
          onNext?.();
          break;
        case ' ':
          e.preventDefault();
          setIsZoomed(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose, onNext, onPrevious]);

  // Reset states wanneer foto verandert
  useEffect(() => {
    setIsZoomed(false);
    setScale(1);
    setDragPosition({ x: 0, y: 0 });
    setIsLoading(true);
  }, [photo?.url]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isZoomed) {
      setIsZoomed(false);
      setScale(1);
      setDragPosition({ x: 0, y: 0 });
    } else {
      setIsZoomed(true);
      setScale(2);
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setDragPosition({
        x: (rect.width * (1 - scale) * x),
        y: (rect.height * (1 - scale) * y)
      });
    }
  }, [isZoomed, scale]);

  if (!isOpen || !photo) return null;

  return (
    <div 
      className={`
        fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm
        transition-all duration-200
        ${isOpen && !isClosing ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
      `}
      onClick={handleClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button overlay - top */}
      <div 
        className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/50 to-transparent"
        onClick={handleClose}
      />

      <div 
        className="relative w-full h-full p-4 md:p-8 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 hover:scale-110 group"
          aria-label="Sluit afbeelding"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 transform transition-transform duration-200 group-hover:rotate-90" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation buttons */}
        {onPrevious && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrevious(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 hover:scale-110 hover:translate-x-[-4px]"
            aria-label="Vorige foto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {onNext && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 hover:scale-110 hover:translate-x-[4px]"
            aria-label="Volgende foto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Image container */}
        <div 
          className="flex-1 flex items-center justify-center overflow-hidden"
          style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}
          <img
            src={photo.url}
            alt={photo.alt}
            onLoad={handleImageLoad}
            onClick={handleImageClick}
            className={`
              max-h-full max-w-full object-contain select-none
              transition-all duration-300 ease-out
              ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
              ${isClosing ? 'scale-95' : ''}
            `}
            style={{ 
              transform: `translate3d(${dragPosition.x}px, ${dragPosition.y}px, 0) scale(${scale})`,
              filter: 'drop-shadow(0 0 20px rgba(0, 0, 0, 0.3))',
              willChange: 'transform'
            }}
          />
        </div>

        {/* Info bar */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4 text-white">
          {/* Counter */}
          {totalPhotos && currentIndex !== undefined && (
            <div className="px-4 py-2 bg-black/50 rounded-full text-sm backdrop-blur-sm">
              {currentIndex + 1} / {totalPhotos}
            </div>
          )}
          
          {/* Caption */}
          {photo.alt && (
            <div className="px-4 py-2 bg-black/50 rounded-lg text-center max-w-2xl backdrop-blur-sm">
              {photo.alt}
            </div>
          )}

          {/* Controls info */}
          <div className="px-4 py-2 bg-black/50 rounded-full text-sm hidden md:block backdrop-blur-sm">
            ← → navigatie | spatie voor zoom | esc of klik buiten om te sluiten
          </div>
        </div>

        {/* Close button overlay - bottom */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent"
          onClick={handleClose}
        />
      </div>
    </div>
  );
};

export default ImageModal; 