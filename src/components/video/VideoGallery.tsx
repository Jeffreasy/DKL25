import React, { useCallback, useEffect, useState, useRef } from 'react';
import VideoSlide from './VideoSlide';
import NavigationButton from './NavigationButton';
import { useVideoGallery } from '@/hooks/useVideoGallery';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { useSwipe } from '@/hooks/useSwipe';

const VideoGallery: React.FC = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const {
    videos,
    currentIndex,
    isLoading,
    error,
    handlePrevious,
    handleNext,
    setCurrentIndex
  } = useVideoGallery();

  // Keyboard navigatie
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Preload volgende video
  useEffect(() => {
    if (!videos.length) return;
    const nextIndex = (currentIndex + 1) % videos.length;
    const prevIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1;
    
    // Preload next and previous videos
    [nextIndex, prevIndex].forEach(index => {
      const video = videos[index];
      if (!video) return;
      
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = video.url;
      document.head.appendChild(link);
      
      // Cleanup preload link after 5 seconds
      setTimeout(() => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      }, 5000);
    });
  }, [currentIndex, videos]);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  if (error) return (
    <div className="text-center p-4 text-red-600">
      <p>Er is een fout opgetreden: {error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
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
      className="py-8 md:py-16 px-4 md:px-5 bg-gray-50 font-heading"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl md:text-[clamp(2rem,4vw,2.75rem)] text-gray-900 font-bold mb-2 md:mb-3">
            Onze Video's
          </h2>
          <p className="text-base md:text-[clamp(1rem,2.5vw,1.25rem)] text-gray-600 px-4">
            {currentVideo.description}
          </p>
        </div>

        {/* Main Video met navigatie */}
        <div className="relative mb-4 md:mb-8 group">
          <VideoSlide
            videoId={currentVideo.video_id}
            url={currentVideo.url}
            title={currentVideo.title}
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
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-primary w-4' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentIndex(index)}
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
      </div>
    </section>
  );
};

export default VideoGallery; 