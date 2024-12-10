import React from 'react';
import type { Photo } from './types';
import NavigationButton from './NavigationButton';

interface MainSliderProps {
  photos: Photo[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  isAnimating: boolean;
}

const MainSlider: React.FC<MainSliderProps> = ({
  photos,
  currentIndex,
  onPrevious,
  onNext,
  isAnimating
}) => {
  return (
    <div className="relative aspect-[16/9] mb-4 rounded-2xl overflow-hidden bg-gray-100 group shadow-xl">
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          className={`
            absolute inset-0 
            transition-all duration-500 ease-out
            ${isAnimating ? 'scale-[1.02]' : 'scale-100'}
            ${index === currentIndex 
              ? 'opacity-100 visible transform-none' 
              : index < currentIndex 
                ? 'opacity-0 invisible -translate-x-full' 
                : 'opacity-0 invisible translate-x-full'
            }
          `}
        >
          <img
            src={photo.url}
            alt={photo.alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      ))}

      {/* Overlay met gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Navigation Buttons met hover effect */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between">
        <NavigationButton direction="previous" onClick={onPrevious} />
        <NavigationButton direction="next" onClick={onNext} />
      </div>
    </div>
  );
};

export default MainSlider; 