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

  // Performance monitoring
  const performanceRef = useRef({
    lastTransitionTime: 0,
    transitionCount: 0,
    averageTransitionTime: 0
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
    const start = performance.now();
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

    // Track transition performance
    const duration = performance.now() - start;
    const { transitionCount, averageTransitionTime } = performanceRef.current;
    performanceRef.current = {
      lastTransitionTime: duration,
      transitionCount: transitionCount + 1,
      averageTransitionTime: (averageTransitionTime * transitionCount + duration) / (transitionCount + 1)
    };

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

  // Auto-play with performance monitoring
  useEffect(() => {
    if (!state.isAutoPlaying) return;

    const interval = setInterval(() => {
      const start = performance.now();
      handleNext();
      const duration = performance.now() - start;

      // Log if transition takes too long
      if (duration > 16.67) { // More than 1 frame at 60fps
        console.warn(`Slow transition detected: ${duration.toFixed(2)}ms`);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [state.isAutoPlaying, handleNext]);

  // Expose performance metrics
  const getPerformanceMetrics = useCallback(() => ({
    lastTransitionTime: performanceRef.current.lastTransitionTime,
    averageTransitionTime: performanceRef.current.averageTransitionTime,
    transitionCount: performanceRef.current.transitionCount
  }), []);

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
    getPerformanceMetrics
  };
}; 