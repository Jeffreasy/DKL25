import React, { useRef, useState, useCallback, useEffect } from 'react';
import type { Photo } from './types';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { trackEvent } from '@/utils/googleAnalytics';

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

  // Scroll position monitoring
  const updateArrowVisibility = useCallback(() => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    scrollElement.addEventListener('scroll', updateArrowVisibility);
    window.addEventListener('resize', updateArrowVisibility);

    return () => {
      scrollElement.removeEventListener('scroll', updateArrowVisibility);
      window.removeEventListener('resize', updateArrowVisibility);
    };
  }, [updateArrowVisibility]);

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
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all z-10"
          aria-label="Scroll thumbnails left"
        >
          <ChevronLeftIcon className="text-gray-700" />
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
            className={`
              flex-none w-24 h-16 rounded-lg overflow-hidden
              transition-all duration-300
              ${index === currentIndex 
                ? 'ring-2 ring-primary scale-105 shadow-lg opacity-100 animate-pulse-slow' 
                : 'ring-1 ring-gray-200 opacity-60 hover:opacity-80'
              }
              snap-center
            `}
            aria-label={`Selecteer foto ${index + 1}`}
            aria-current={index === currentIndex}
          >
            <img
              src={photo.thumbnail_url || photo.url}
              alt={`Thumbnail ${index + 1}`}
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
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all z-10"
          aria-label="Scroll thumbnails right"
        >
          <ChevronRightIcon className="text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default React.memo(ThumbnailSlider); 