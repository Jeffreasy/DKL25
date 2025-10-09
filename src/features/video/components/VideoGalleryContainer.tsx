import React, { useCallback, useEffect, useState, useRef } from 'react';
import VideoSlide from './VideoPlayer';
import NavigationButton from './VideoNavButton';
import DotIndicator from './VideoIndicator';
import { useVideoGallery } from '@/hooks/useVideoGallery';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { useSwipe } from '@/hooks/useSwipe';
import { trackEvent } from '@/utils/googleAnalytics';
import { PRELOAD_CLEANUP_TIMEOUT } from '../constants';
import { shouldHandleKeyboardEvent } from '@/utils/eventUtils';
import { cc, cn, colors } from '@/styles/shared';

const VideoGallery: React.FC = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const {
    videos,
    isLoading,
    error,
  } = useVideoGallery();

  // Lokale navigatiefuncties die de lokale state aanpassen
  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
  }, [videos.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  }, [videos.length]);

  // Keyboard navigatie - alleen actief wanneer geen input element actief is
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!shouldHandleKeyboardEvent()) {
        return;
      }
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious]);

  // Intersection Observer voor lazy loading
  const onIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) {
      setIsVisible(true);
    }
  }, []);

  useIntersectionObserver(galleryRef, onIntersect, {
    threshold: 0.1,
    rootMargin: '100px'
  });

  // Swipe functionaliteit voor mobiel
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe({
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrevious,
    threshold: 50
  });

  // Preload alleen de *volgende* video
  useEffect(() => {
    if (!videos || videos.length <= 1 || !isVisible) return;

    const nextIndex = (currentIndex + 1) % videos.length;
    const videoToPreload = videos[nextIndex];

    if (!videoToPreload) return;

    // Check of er al een preload link voor deze video bestaat
    const existingLink = document.querySelector(`link[rel="preload"][href="${videoToPreload.url}"]`);
    if (existingLink) return; // Al aan het preloadden

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'fetch';
    link.href = videoToPreload.url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);

    // Cleanup preload link 
    const timer = setTimeout(() => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    }, PRELOAD_CLEANUP_TIMEOUT);

    // Cleanup effect
    return () => {
        clearTimeout(timer);
        // Verwijder de link direct bij cleanup 
        if (document.head.contains(link)) {
           document.head.removeChild(link);
        }
    };

  }, [currentIndex, videos, isVisible]);

  const handleDotClick = (index: number) => {
    trackEvent('video_gallery', 'dot_click', `slide_${index + 1}`);
    setCurrentIndex(index);
  };

  const handleVideoPlay = () => {
    trackEvent('video_gallery', 'video_play', `slide_${currentIndex + 1}`);
  };

  const handleVideoPause = () => {
    trackEvent('video_gallery', 'video_pause', `slide_${currentIndex + 1}`);
  };

  const handleVideoEnded = () => {
    trackEvent('video_gallery', 'video_ended', `slide_${currentIndex + 1}`);
  };

  if (isLoading) return (
    <div className={cn(cc.flex.center, 'min-h-[300px]')}>
      <div className={cn('w-12 h-12 border-4 border-t-transparent', colors.primary.border, cc.border.circle, 'animate-spin')} />
    </div>
  );
  
  if (error) return (
    <div className={cn('text-center p-4', cc.text.error)}>
      <p>Er is een fout opgetreden: {error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className={cn(cc.button.primary, 'mt-2')}
      >
        Probeer opnieuw
      </button>
    </div>
  );
  
  if (!videos?.length) return null;

  const currentVideo = videos[currentIndex];
  if (!currentVideo) return null;

  const totalVideos = videos.length;
  const hasMultipleVideos = totalVideos > 1;

  return (
    <section 
      ref={galleryRef}
      className={cn('py-8 md:py-16 px-4 md:px-5 bg-gray-50', cc.typography.heading)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-6 md:mb-12">
          <h2 className={cn(cc.text.h2, 'text-gray-900 font-bold mb-2 md:mb-3')}>
            Onze Video's
          </h2>
          <p className={cn(cc.text.h5, cc.text.muted, 'px-4')}>
            {currentVideo.description}
          </p>
        </div>

        {/* Main Video met navigatie */}
        <div className="relative mb-4 md:mb-8 group">
          <VideoSlide
            key={currentVideo.id}
            videoId={currentVideo.video_id}
            url={currentVideo.url}
            title={currentVideo.title}
            isSelected={true}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            onEnded={handleVideoEnded}
          />
          
          {/* Navigation Buttons - Verborgen op mobiel */}
          {hasMultipleVideos && (
            <div className="hidden md:flex absolute inset-x-4 top-1/2 -translate-y-1/2 items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <NavigationButton 
                direction="previous" 
                onClick={handlePrevious}
                disabled={isLoading}
              />
              <NavigationButton 
                direction="next" 
                onClick={handleNext}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Mobiele navigatie indicators */}
          {hasMultipleVideos && (
            <div className="flex md:hidden justify-center gap-2 mt-4">
              {videos.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    'w-2 h-2',
                    cc.border.circle,
                    cc.transition.base,
                    index === currentIndex ? cn(colors.primary.bg, 'w-4') : 'bg-gray-300'
                  )}
                  onClick={() => !isLoading && setCurrentIndex(index)}
                  aria-label={`Ga naar video ${index + 1}`}
                  disabled={isLoading}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnails - Scrollbaar op mobiel */}
        {hasMultipleVideos && (
          <div className="relative px-4 md:px-12 -mx-4 md:mx-0">
            <div className="flex justify-start gap-2 md:gap-4 overflow-x-auto scrollbar-hide py-2 px-4 md:px-0">
              {videos.map((video, index) => (
                <VideoSlide
                  key={video.id}
                  videoId={video.video_id}
                  url={video.url}
                  title={video.title}
                  isThumbnail
                  isSelected={index === currentIndex}
                  onClick={() => !isLoading && setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center mt-4">
          <DotIndicator
            total={videos.length}
            current={currentIndex}
            onClick={handleDotClick}
          />
        </div>
      </div>
    </section>
  );
};

export default VideoGallery; 