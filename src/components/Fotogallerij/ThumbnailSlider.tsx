import React, { useRef } from 'react';
import type { Photo } from './types';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface ThumbnailSliderProps {
  photos: Photo[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

const ThumbnailSlider: React.FC<ThumbnailSliderProps> = ({
  photos,
  currentIndex,
  onSelect
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToThumbnail = (index: number) => {
    if (!scrollRef.current) return;
    const thumbnail = scrollRef.current.children[index] as HTMLElement;
    if (thumbnail) {
      thumbnail.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -200 : 200;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative px-12">
      {/* Scroll Buttons */}
      <button
        onClick={() => handleScroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all"
        aria-label="Scroll thumbnails left"
      >
        <ChevronLeftIcon className="text-gray-700" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory py-2"
        style={{ scrollBehavior: 'smooth' }}
      >
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => {
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
            `}
          >
            <img
              src={photo.url}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      <button
        onClick={() => handleScroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all"
        aria-label="Scroll thumbnails right"
      >
        <ChevronRightIcon className="text-gray-700" />
      </button>
    </div>
  );
};

export default ThumbnailSlider; 