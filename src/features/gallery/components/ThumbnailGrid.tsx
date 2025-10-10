import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import type { Photo } from '../types';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { trackEvent } from '@/utils/googleAnalytics';
import debounce from 'lodash.debounce';
import { cc, cn, colors, animations } from '@/styles/shared';

interface ThumbnailSliderProps {
  photos: Photo[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

const THUMBNAIL_WIDTH = 96; // w-24
const THUMBNAIL_GAP = 8; // gap-2

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

  // Debounced versie van updateArrowVisibility
  const debouncedUpdateArrows = useMemo(() => 
    debounce(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 5); // Kleine marge
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5); // Kleine marge
    }, 150), // Debounce met 150ms
  []); // Lege dependency array

  // Gebruik de debounced functie in de effecten
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    // Roep direct aan bij mount
    debouncedUpdateArrows(); 

    scrollElement.addEventListener('scroll', debouncedUpdateArrows);
    window.addEventListener('resize', debouncedUpdateArrows);

    return () => {
      scrollElement.removeEventListener('scroll', debouncedUpdateArrows);
      window.removeEventListener('resize', debouncedUpdateArrows);
      debouncedUpdateArrows.cancel(); // Cancel debounce bij unmount
    };
  }, [debouncedUpdateArrows]);

  // Scroll to current thumbnail
  useEffect(() => {
    scrollToThumbnail(currentIndex);
  }, [currentIndex]);

  const scrollToThumbnail = useCallback((index: number) => {
    if (!scrollRef.current) return;

    const scrollContainer = scrollRef.current;
    const thumbnail = scrollContainer.children[index] as HTMLElement;
    if (!thumbnail) return;

    const containerWidth = scrollContainer.clientWidth;
    const thumbnailLeft = thumbnail.offsetLeft;
    const thumbnailWidth = thumbnail.offsetWidth;
    
    // Calculate the center position
    const targetScroll = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
    
    scrollContainer.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  }, []);

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
    <div className="relative px-12 select-none">
      {/* Scroll Buttons */}
      {showLeftArrow && (
        <button
          onClick={() => handleScroll('left')}
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 p-2 hover:bg-white',
            cc.border.circle,
            cc.shadow.lg,
            cc.transition.base,
            cc.zIndex.dropdown
          )}
          aria-label="Scroll thumbnails left"
        >
          <ChevronLeft className="text-gray-700" />
        </button>
      )}

      <div
        ref={scrollRef}
        className={`
          flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory py-2
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        `}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ 
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => {
              trackEvent('gallery', 'thumbnail_select', `photo_${index}`);
              onSelect(index);
              scrollToThumbnail(index);
            }}
            className={cn(
              'flex-none w-24 h-16 rounded-lg overflow-hidden snap-center',
              cc.transition.base,
              index === currentIndex
                ? cn('ring-2 scale-105 opacity-100', colors.primary.border, cc.shadow.lg, animations.pulseSlow)
                : 'ring-1 ring-gray-200 opacity-60 hover:opacity-80'
            )}
            aria-label={`Selecteer foto ${index + 1}`}
            aria-current={index === currentIndex}
          >
            <img
              src={photo.thumbnail_url || photo.url}
              alt={photo.alt_text || `Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              draggable={false}
              onLoad={() => trackEvent('gallery', 'thumbnail_loaded', `photo_${index}`)}
            />
          </button>
        ))}
      </div>

      {showRightArrow && (
        <button
          onClick={() => handleScroll('right')}
          className={cn(
            'absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 p-2 hover:bg-white',
            cc.border.circle,
            cc.shadow.lg,
            cc.transition.base,
            cc.zIndex.dropdown
          )}
          aria-label="Scroll thumbnails right"
        >
          <ChevronRight className="text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default React.memo(ThumbnailSlider); 