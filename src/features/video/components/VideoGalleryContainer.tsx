import React, { useCallback, useEffect, useState, useRef, memo, Suspense, lazy } from 'react';
import NavigationButton from './VideoNavButton';
import DotIndicator from './VideoIndicator';

// Lazy load heavy components
const VideoSlide = lazy(() => import('./VideoPlayer'));
import { useVideoGallery } from '@/hooks/useVideoGallery';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { useSwipe } from '@/hooks/useSwipe';
import { trackEvent } from '@/utils/googleAnalytics';
import { PRELOAD_CLEANUP_TIMEOUT } from '../constants';
import { shouldHandleKeyboardEvent } from '@/utils/eventUtils';
import { cc, cn, colors } from '@/styles/shared';

const VideoGallery: React.FC = memo(() => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const {
    videos,
    currentIndex,
    isLoading,
    error,
    handlePrevious,
    handleNext,
    setCurrentIndex,
  } = useVideoGallery();


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

    // Cleanup preload link na timeout
    const timer = setTimeout(() => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    }, PRELOAD_CLEANUP_TIMEOUT);

    // Cleanup effect - altijd opruimen bij unmount of dependency change
    return () => {
      clearTimeout(timer);
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [currentIndex, videos, isVisible]);

  const handleDotClick = useCallback((index: number) => {
    trackEvent('video_gallery', 'dot_click', `slide_${index + 1}`);
    setCurrentIndex(index);
  }, []);

  const handleVideoPlay = useCallback(() => {
    trackEvent('video_gallery', 'video_play', `slide_${currentIndex + 1}`);
  }, [currentIndex]);

  const handleVideoPause = useCallback(() => {
    trackEvent('video_gallery', 'video_pause', `slide_${currentIndex + 1}`);
  }, [currentIndex]);

  const handleVideoEnded = useCallback(() => {
    trackEvent('video_gallery', 'video_ended', `slide_${currentIndex + 1}`);
  }, [currentIndex]);

  if (isLoading) return (
    <div className={cn(cc.flex.center, 'min-h-[400px] bg-gray-50 rounded-lg')}>
      <div className="text-center">
        <div className={cn('w-12 h-12 border-4 border-t-transparent mx-auto mb-4', colors.primary.border, cc.border.circle, 'animate-spin')} />
        <p className={cn(cc.text.muted, 'text-sm')}>Video's laden...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className={cn('text-center p-8 bg-gray-50 rounded-lg', cc.text.error)}>
      <div className="max-w-md mx-auto">
        <h3 className={cn(cc.text.h3, 'mb-2')}>Video's konden niet worden geladen</h3>
        <p className="mb-4 text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className={cn(cc.button.primary, 'px-6 py-2')}
        >
          Probeer opnieuw
        </button>
      </div>
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
          <Suspense fallback={
            <div className="w-full max-w-[1280px] mx-auto">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <div className="absolute inset-0 rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
                  <div className={cn(cc.loading.spinner, 'w-12 h-12')} />
                </div>
              </div>
            </div>
          }>
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
          </Suspense>
          
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

        </div>

        {/* Thumbnails - Scrollbaar op mobiel */}
        {hasMultipleVideos && (
          <div className="relative px-4 md:px-12 -mx-4 md:mx-0">
            <div className="flex justify-start gap-2 md:gap-4 overflow-x-auto scrollbar-hide py-2 px-4 md:px-0">
              <Suspense fallback={null}>
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
              </Suspense>
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
});

VideoGallery.displayName = 'VideoGallery';

export default VideoGallery;