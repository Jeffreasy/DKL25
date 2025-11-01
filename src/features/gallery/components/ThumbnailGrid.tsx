/**
 * Thumbnail Grid Component
 * Horizontal scrollable thumbnail navigation for photo gallery
 *
 * Features:
 * - Drag to scroll
 * - Auto-scroll to active thumbnail
 * - Arrow navigation buttons
 * - Responsive sizing
 */

import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import type { Photo } from '../types';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { trackEvent } from '@/utils/googleAnalytics';
import debounce from 'lodash.debounce';
import { cc, cn, colors } from '@/styles/shared';

interface ThumbnailSliderProps {
  photos: Photo[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

// Constants for thumbnail sizing
const THUMBNAIL_WIDTH = 96; // w-24 = 96px
const THUMBNAIL_GAP = 8; // gap-2 = 8px

const ThumbnailSlider: React.FC<ThumbnailSliderProps> = ({
  photos,
  currentIndex,
  onSelect
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Debounced arrow visibility update for performance
  const debouncedUpdateArrows = useMemo(() =>
    debounce(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const MARGIN = 5; // Small margin for edge detection
      setShowLeftArrow(scrollLeft > MARGIN);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - MARGIN);
    }, 150),
  []);

  // Setup scroll listeners
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    // Initial check
    debouncedUpdateArrows();

    scrollElement.addEventListener('scroll', debouncedUpdateArrows);
    window.addEventListener('resize', debouncedUpdateArrows);

    return () => {
      scrollElement.removeEventListener('scroll', debouncedUpdateArrows);
      window.removeEventListener('resize', debouncedUpdateArrows);
      debouncedUpdateArrows.cancel();
    };
  }, [debouncedUpdateArrows]);

  // Auto-scroll to center active thumbnail
  const scrollToThumbnail = useCallback((index: number) => {
    if (!scrollRef.current) return;

    const scrollContainer = scrollRef.current;
    const thumbnail = scrollContainer.children[index] as HTMLElement;
    if (!thumbnail) return;

    const containerWidth = scrollContainer.clientWidth;
    const thumbnailLeft = thumbnail.offsetLeft;
    const thumbnailWidth = thumbnail.offsetWidth;
    
    // Center the thumbnail in viewport
    const targetScroll = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
    
    scrollContainer.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    scrollToThumbnail(currentIndex);
  }, [currentIndex, scrollToThumbnail]);

  // Drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    trackEvent('gallery', 'thumbnail_scroll', direction);
    const scrollAmount = direction === 'left' ? -THUMBNAIL_WIDTH * 3 : THUMBNAIL_WIDTH * 3;
    scrollRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <nav
      className="relative px-12 select-none"
      aria-label="Thumbnail navigatie"
    >
      {/* Left scroll button */}
      {showLeftArrow && (
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2',
            'bg-white/90 hover:bg-white p-2',
            cc.border.circle,
            cc.shadow.lg,
            cc.transition.base,
            cc.zIndex.dropdown,
            colors.primary.focusRing
          )}
          aria-label="Scroll thumbnails naar links"
        >
          <ChevronLeft className="text-gray-700" aria-hidden="true" />
        </button>
      )}

      {/* Thumbnail container */}
      <div
        ref={scrollRef}
        role="list"
        className={cn(
          cc.flex.start,
          'gap-2 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory py-2',
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {photos.map((photo, index) => {
          const isActive = index === currentIndex;
          const thumbnailAlt = photo.alt_text || `Thumbnail ${index + 1}`;
          
          return (
            <button
              key={photo.id}
              type="button"
              role="listitem"
              onClick={() => {
                trackEvent('gallery', 'thumbnail_select', `photo_${index}`);
                onSelect(index);
                scrollToThumbnail(index);
              }}
              className={cn(
                'flex-none w-24 h-16 snap-center',
                cc.border.rounded,
                'overflow-hidden',
                cc.transition.base,
                isActive
                  ? cn(
                      'ring-2 scale-105 opacity-100',
                      colors.primary.border,
                      cc.shadow.lg
                    )
                  : cn(
                      'ring-1 ring-gray-200 opacity-60',
                      'hover:opacity-80 hover:ring-gray-300'
                    )
              )}
              aria-label={`Selecteer ${thumbnailAlt}`}
              aria-current={isActive}
            >
              <img
                src={photo.thumbnail_url || photo.url}
                alt={thumbnailAlt}
                loading="lazy"
                draggable={false}
                className="w-full h-full object-cover"
                onLoad={() => trackEvent('gallery', 'thumbnail_loaded', `photo_${index}`)}
              />
            </button>
          );
        })}
      </div>

      {/* Right scroll button */}
      {showRightArrow && (
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className={cn(
            'absolute right-0 top-1/2 -translate-y-1/2',
            'bg-white/90 hover:bg-white p-2',
            cc.border.circle,
            cc.shadow.lg,
            cc.transition.base,
            cc.zIndex.dropdown,
            colors.primary.focusRing
          )}
          aria-label="Scroll thumbnails naar rechts"
        >
          <ChevronRight className="text-gray-700" aria-hidden="true" />
        </button>
      )}
    </nav>
  );
};

ThumbnailSlider.displayName = 'ThumbnailSlider';

export default React.memo(ThumbnailSlider);