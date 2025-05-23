import { useState, useEffect, useCallback, useRef } from 'react';
import type { Photo } from '../types';

interface GalleryState {
  currentIndex: number;
  isAnimating: boolean;
  isAutoPlaying: boolean;
  touchStart: number | null;
}

export const usePhotoGallery = (photos: Photo[]) => {
  // State management met een enkele state object voor betere performance
  const [state, setState] = useState<GalleryState>({
    currentIndex: 0,
    isAnimating: false,
    isAutoPlaying: false,
    touchStart: null
  });

  // Memoized handlers
  const setCurrentIndex = useCallback((index: number) => {
    setState(prev => ({ ...prev, currentIndex: index }));
  }, []);

  const setIsAutoPlaying = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    setState(prev => ({
      ...prev,
      isAutoPlaying: typeof value === 'function' ? value(prev.isAutoPlaying) : value
    }));
  }, []);

  const handleTransition = useCallback((direction: 'next' | 'previous') => {
    setState(prev => {
      const newIndex = direction === 'next'
        ? (prev.currentIndex + 1) % photos.length
        : prev.currentIndex === 0 
          ? photos.length - 1 
          : prev.currentIndex - 1;

      return {
        ...prev,
        currentIndex: newIndex,
        isAnimating: true
      };
    });

    // Reset animation state after transition
    setTimeout(() => {
      setState(prev => ({ ...prev, isAnimating: false }));
    }, 500);
  }, [photos.length]);

  const handleNext = useCallback(() => {
    handleTransition('next');
  }, [handleTransition]);

  const handlePrevious = useCallback(() => {
    handleTransition('previous');
  }, [handleTransition]);

  // Touch handlers
  const setTouchStart = useCallback((value: number | null) => {
    setState(prev => ({ ...prev, touchStart: value }));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case ' ':
          e.preventDefault();
          setIsAutoPlaying(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, setIsAutoPlaying]);

  // Auto-play
  useEffect(() => {
    if (!state.isAutoPlaying) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [state.isAutoPlaying, handleNext]);

  return {
    currentIndex: state.currentIndex,
    isAnimating: state.isAnimating,
    isAutoPlaying: state.isAutoPlaying,
    touchStart: state.touchStart,
    setCurrentIndex,
    setIsAutoPlaying,
    handlePrevious,
    handleNext,
    setTouchStart,
  };
}; 