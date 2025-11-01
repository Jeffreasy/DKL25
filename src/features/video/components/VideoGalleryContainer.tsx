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
import { cc, cn, colors, animations } from '@/styles/shared';

const VideoGallery: React.FC = memo(() => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Debug: Log isPlaying changes
  useEffect(() => {
    console.log('🎬 isPlaying state changed to:', isPlaying);
    console.log('🎨 Thumbnails should be:', isPlaying ? 'HIDDEN' : 'VISIBLE');
  }, [isPlaying]);

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
    setIsPlaying(false); // Reset playing state when switching videos
  }, [setCurrentIndex]);

  const handleVideoPlay = useCallback(() => {
    console.log('handleVideoPlay called, setting isPlaying to true');
    trackEvent('video_gallery', 'video_play', `slide_${currentIndex + 1}`);
    setIsPlaying(true);
  }, [currentIndex, setIsPlaying]);

  const handleVideoPause = useCallback(() => {
    console.log('handleVideoPause called, setting isPlaying to false');
    trackEvent('video_gallery', 'video_pause', `slide_${currentIndex + 1}`);
    setIsPlaying(false);
  }, [currentIndex, setIsPlaying]);

  const handleVideoEnded = useCallback(() => {
    console.log('handleVideoEnded called, setting isPlaying to false');
    trackEvent('video_gallery', 'video_ended', `slide_${currentIndex + 1}`);
    setIsPlaying(false);
  }, [currentIndex, setIsPlaying]);

  const handleThumbnailClick = useCallback((index: number) => {
    if (!isLoading) {
      setCurrentIndex(index);
      setIsPlaying(false);
      trackEvent('video_gallery', 'thumbnail_click', `slide_${index + 1}`);
    }
  }, [isLoading, setCurrentIndex]);

  if (isLoading) return (
    <div className={cn(
      cc.flex.center,
      'min-h-[500px]',
      'bg-gradient-to-br from-gray-50 via-white to-blue-50/30',
      'rounded-2xl',
      animations.fadeIn
    )}>
      <div className="text-center">
        <div className="relative mb-6">
          <div className={cn(
            'w-16 h-16 border-4 border-t-transparent mx-auto',
            colors.primary.border,
            cc.border.circle,
            'animate-spin'
          )} />
          <div className={cn(
            'absolute inset-0 w-16 h-16 mx-auto',
            'bg-primary/10 rounded-full blur-xl',
            animations.pulse
          )} />
        </div>
        <p className={cn(cc.text.h6, colors.primary.text, 'font-semibold')}>
          Video's laden...
        </p>
        <p className={cn(cc.text.bodySmall, cc.text.muted, 'mt-2')}>
          Een moment geduld
        </p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className={cn(
      'text-center p-12',
      'bg-gradient-to-br from-red-50 to-gray-50',
      'rounded-2xl',
      cc.shadow.lg,
      animations.fadeIn
    )}>
      <div className="max-w-md mx-auto">
        <div className={cn(
          'w-20 h-20 mx-auto mb-6 rounded-full',
          'bg-red-100 border-2 border-red-200',
          cc.flex.center
        )}>
          <span className="text-4xl">⚠️</span>
        </div>
        <h3 className={cn(cc.text.h3, 'mb-3 text-gray-900')}>
          Video's konden niet worden geladen
        </h3>
        <p className={cn(cc.text.body, 'mb-6 text-gray-600')}>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className={cn(
            cc.button.primary,
            'px-8 py-3',
            cc.shadow.lg,
            'hover:shadow-xl'
          )}
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
      className={cn(
        'py-16 md:py-24 px-4 md:px-6 lg:px-8',
        'bg-gradient-to-br from-gray-50 via-white to-blue-50/20',
        cc.typography.heading
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto">
        {/* Title Section - Professioneler */}
        <div className={cn('text-center mb-12 md:mb-16', animations.fadeIn)}>
          <div className="inline-block mb-4">
            <span className={cn(
              cc.badge.primary,
              'px-4 py-2 text-sm font-semibold uppercase tracking-wide',
              cc.shadow.sm
            )}>
              Video Galerij
            </span>
          </div>
          <h2 className={cn(
            cc.text.h2,
            'text-gray-900 mb-4',
            'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text'
          )}>
            Onze Video's
          </h2>
          <p className={cn(
            cc.text.h6,
            'text-gray-600 max-w-2xl mx-auto px-4',
            'leading-relaxed'
          )}>
            {currentVideo.description}
          </p>
        </div>

        {/* Main Video Container met geïntegreerde thumbnails */}
        <div className={cn('relative mb-8 md:mb-12 group w-full max-w-[1280px] mx-auto', animations.fadeIn)}>
          {/* Main Video Player */}
          <Suspense fallback={
            <div className="w-full max-w-[1280px] mx-auto">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <div className={cn(
                  'absolute inset-0 rounded-2xl overflow-hidden',
                  cc.shadow.xl,
                  'bg-gradient-to-br from-gray-100 to-gray-200',
                  cc.flex.center
                )}>
                  <div className={cn(cc.loading.spinner, 'w-16 h-16')} />
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
              ignoreFirstPlay={true}
            />
          </Suspense>
          
          {/* Navigation Buttons - Verdwijnen tijdens afspelen */}
          {hasMultipleVideos && (
            <div className={cn(
              'hidden md:flex absolute inset-x-6 top-1/2 -translate-y-1/2',
              'items-center justify-between pointer-events-none z-30',
              'transition-all duration-500',
              isPlaying
                ? 'opacity-0 pointer-events-none'
                : 'opacity-90 group-hover:opacity-100'
            )}>
              <div className="pointer-events-auto">
                <NavigationButton
                  direction="previous"
                  onClick={handlePrevious}
                  disabled={isLoading}
                />
              </div>
              <div className="pointer-events-auto">
                <NavigationButton
                  direction="next"
                  onClick={handleNext}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Thumbnail Overlay - BINNEN de video player */}
          {hasMultipleVideos && !isPlaying && (
            <div
              className={cn(
                'absolute bottom-0 left-0 right-0 z-20',
                'bg-gradient-to-t from-black via-black/80 to-transparent',
                'pt-20 pb-6 px-4 md:px-6',
                animations.fadeIn
              )}
            >
              <div className={cn(
                'bg-white/10 backdrop-blur-md rounded-xl p-3',
                'border border-white/20',
                'pointer-events-auto'
              )}>
                <div className={cn(
                  'flex justify-center gap-3 md:gap-4',
                  'overflow-x-auto scrollbar-hide',
                  'snap-x snap-mandatory'
                )}>
                  <Suspense fallback={null}>
                    {videos.map((video, index) => (
                      <div key={video.id} className="snap-start">
                        <VideoSlide
                          videoId={video.video_id}
                          url={video.url}
                          title={video.title}
                          isThumbnail
                          isSelected={index === currentIndex}
                          onClick={() => handleThumbnailClick(index)}
                        />
                      </div>
                    ))}
                  </Suspense>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Dot Indicators - Professioneler */}
        <div className={cn('flex justify-center', animations.fadeIn)}>
          <DotIndicator
            total={videos.length}
            current={currentIndex}
            onClick={handleDotClick}
          />
        </div>

        {/* Video Counter */}
        {hasMultipleVideos && (
          <div className={cn(
            'text-center mt-6',
            cc.text.small,
            'text-gray-500 font-medium',
            animations.fadeIn
          )}>
            Video {currentIndex + 1} van {totalVideos}
          </div>
        )}
      </div>
    </section>
  );
});

VideoGallery.displayName = 'VideoGallery';

export default VideoGallery;