/**
 * Main Image Slider Component
 * Primary image display with navigation and modal support
 *
 * Features:
 * - Touch/swipe gestures
 * - Click to open fullscreen modal
 * - Lazy loading for performance
 * - Image preloading
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { Photo } from '../types';
import NavigationButton from './GalleryNavButton';
import ImageModal from './ImageLightbox';
import { useSwipe } from '@/hooks/useSwipe';
import { trackEvent } from '@/utils/googleAnalytics';
import { cc, cn } from '@/styles/shared';

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
        role="button"
        tabIndex={0}
        aria-label="Open foto in volledig scherm"
        className={cn(
          'relative aspect-[16/9] mb-4 group',
          cc.border.rounded,
          'rounded-2xl overflow-hidden',
          'bg-gray-100',
          cc.shadow.xl,
          'hover:shadow-2xl',
          cc.transition.base,
          isGrabbing ? 'cursor-grabbing' : 'cursor-pointer'
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
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            trackEvent('gallery', 'open_modal_keyboard', `photo_${currentIndex}`);
            setIsModalOpen(true);
          }
        }}
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
              {/* Loading skeleton */}
              {!imageLoaded[photo.url] && (
                <div className={cn(cc.loading.skeleton, 'absolute inset-0')} />
              )}

              <img
                src={photo.url}
                alt={photo.alt_text}
                loading="lazy"
                onLoad={() => handleImageLoad(photo.url)}
                className={cn(
                  'w-full h-full object-cover',
                  cc.transition.transform,
                  'group-hover:scale-[1.02]',
                  !imageLoaded[photo.url] ? 'opacity-0' : 'opacity-100'
                )}
                style={{
                  willChange: 'transform',
                  transform: 'translate3d(0, 0, 0)'
                }}
              />
            </div>
          );
        })}

        {/* Hover gradient overlay */}
        <div
          className={cn(
            cc.overlay.gradient,
            'opacity-0 group-hover:opacity-100',
            cc.transition.fast
          )}
          style={{ willChange: 'opacity' }}
          aria-hidden="true"
        />

        {/* Navigation buttons */}
        <div
          className={cn(cc.flex.between, 'absolute inset-x-4 top-1/2 -translate-y-1/2')}
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

        {/* Photo counter */}
        <div
          className={cn(
            cc.badge.base,
            'absolute bottom-4 left-4',
            'bg-black/50 text-white',
            cc.border.circle
          )}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Foto ${currentIndex + 1} van ${photos.length}`}
        >
          {currentIndex + 1} / {photos.length}
        </div>

        {/* Fullscreen expand icon */}
        <div
          className={cn(
            'absolute top-4 right-4 p-2',
            'bg-black/50 text-white',
            cc.border.circle,
            'opacity-0 group-hover:opacity-100',
            cc.transition.fast
          )}
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </div>
      </div>

      {/* Modal - Direct render for debugging */}
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
    </>
  );
};

export default React.memo(MainSlider); 