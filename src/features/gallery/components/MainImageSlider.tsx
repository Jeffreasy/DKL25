import React, { useEffect, useRef, useState, useCallback, Suspense, lazy } from 'react';
import type { Photo } from '../types';
import NavigationButton from './GalleryNavButton';
import { useSwipe } from '@/hooks/useSwipe';
import { trackEvent } from '@/utils/googleAnalytics';
import { cc, cn, animations } from '@/styles/shared';

// Lazy load the heavy ImageModal component
const ImageModal = lazy(() => import('./ImageLightbox'));

interface MainSliderProps {
  photos: Photo[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  isAnimating: boolean;
  onModalChange?: (isOpen: boolean) => void;
}

const MainSlider: React.FC<MainSliderProps> = ({
  photos,
  currentIndex,
  onPrevious,
  onNext,
  isAnimating,
  onModalChange
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  const [isGrabbing, setIsGrabbing] = useState(false);

  // Track modal state changes
  useEffect(() => {
    if (isModalOpen) {
      trackEvent('gallery', 'modal_opened', `photo_${currentIndex}`);
    }
    onModalChange?.(isModalOpen);
  }, [isModalOpen, onModalChange, currentIndex]);

  // Gesture handling with tracking
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe({
    onSwipeLeft: () => {
      trackEvent('gallery', 'swipe', 'left');
      onNext();
    },
    onSwipeRight: () => {
      trackEvent('gallery', 'swipe', 'right');
      onPrevious();
    },
    threshold: 50
  });

  // Mouse drag handling
  const handleMouseDown = () => setIsGrabbing(true);
  const handleMouseUp = () => setIsGrabbing(false);
  const handleMouseLeave = () => setIsGrabbing(false);

  // Track image loading
  const handleImageLoad = (url: string) => {
    setImageLoaded(prev => ({ ...prev, [url]: true }));
    trackEvent('gallery', 'image_loaded', `photo_${currentIndex}`);
  };

  // Zorg ervoor dat we alleen geldige foto's tonen
  const currentPhoto = photos[currentIndex];
  if (!currentPhoto) return null;

  return (
    <>
      <div 
        ref={containerRef}
        className={cn(
          'relative aspect-[16/9] mb-4 rounded-2xl overflow-hidden bg-gray-100 group',
          cc.shadow.xl,
          isGrabbing ? 'cursor-grabbing' : 'cursor-pointer',
          'hover:shadow-2xl',
          cc.transition.base
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          trackEvent('gallery', 'open_modal', `photo_${currentIndex}`);
          setIsModalOpen(true);
        }}
        role="button"
        aria-label="Open foto in volledig scherm"
        tabIndex={0}
      >
        {/* Render only visible and adjacent slides for performance */}
        {photos.map((photo, index) => {
          // Only render current and adjacent slides
          if (Math.abs(index - currentIndex) > 1 && 
              !(index === photos.length - 1 && currentIndex === 0) && 
              !(index === 0 && currentIndex === photos.length - 1)) {
            return null;
          }

          // Skip invalid photos
          if (!photo?.url || !photo?.id) return null;

          return (
            <div
              key={photo.id}
              className={cn(
                'absolute inset-0',
                cc.transition.slow,
                'ease-out',
                isAnimating ? 'scale-[1.02]' : 'scale-100',
                index === currentIndex
                  ? 'opacity-100 visible transform-none'
                  : index < currentIndex
                    ? 'opacity-0 invisible -translate-x-full'
                    : 'opacity-0 invisible translate-x-full'
              )}
              style={{
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden'
              }}
            >
              {/* Loading placeholder */}
              {!imageLoaded[photo.url] && (
                <div className={cn('absolute inset-0 bg-gray-200', animations.pulse)} />
              )}

              <img
                src={photo.url}
                alt={photo.alt_text}
                className={`
                  w-full h-full object-cover 
                  transition-transform duration-300 
                  group-hover:scale-[1.02]
                  ${!imageLoaded[photo.url] ? 'opacity-0' : 'opacity-100'}
                `}
                loading="lazy"
                onLoad={() => handleImageLoad(photo.url)}
                style={{ 
                  willChange: 'transform',
                  transform: `translate3d(0, 0, 0)` 
                }}
              />
            </div>
          );
        })}

        {/* Overlay met gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ willChange: 'opacity' }}
        />

        {/* Navigation Buttons met hover effect */}
        <div 
          className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          <NavigationButton 
            direction="previous" 
            onClick={onPrevious}
            disabled={isAnimating}
          />
          <NavigationButton 
            direction="next" 
            onClick={onNext}
            disabled={isAnimating}
          />
        </div>

        {/* Slide counter */}
        <div 
          className={cn('absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1', cc.border.circle, cc.text.small)}
          onClick={(e) => e.stopPropagation()}
        >
          {currentIndex + 1} / {photos.length}
        </div>

        {/* Fullscreen indicator */}
        <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </div>
      </div>

      <Suspense fallback={
        <div className={cn('fixed inset-0 bg-black/50 flex items-center justify-center', cc.zIndex.modal)}>
          <div className={cn('w-12 h-12 border-4 border-white/20 border-t-white', cc.border.circle, 'animate-spin')} />
        </div>
      }>
        <ImageModal
          photo={currentPhoto}
          isOpen={isModalOpen}
          onClose={() => {
            trackEvent('gallery', 'close_modal', `photo_${currentIndex}`);
            setIsModalOpen(false);
          }}
          onNext={onNext}
          onPrevious={onPrevious}
          totalPhotos={photos.length}
          currentIndex={currentIndex}
        />
      </Suspense>
    </>
  );
};

export default React.memo(MainSlider); 