import { useState, useEffect, useCallback } from 'react';
import type { Photo } from '../types';

export const usePhotoGallery = (photos: Photo[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handlePrevious = useCallback(() => {
    setIsAnimating(true);
    setCurrentIndex(prev => (prev === 0 ? photos.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  }, [photos.length]);

  const handleNext = useCallback(() => {
    setIsAnimating(true);
    setCurrentIndex(prev => (prev === photos.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious]);

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(handleNext, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, handleNext]);

  return {
    currentIndex,
    isAnimating,
    isAutoPlaying,
    setIsAutoPlaying,
    handlePrevious,
    handleNext,
    touchStart,
    setTouchStart,
    setCurrentIndex
  };
}; 