export interface Photo {
  id: number;
  url: string;
  alt: string;
  thumbnail_url?: string;
}

export interface MainSliderProps {
  photos: Photo[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  isAnimating: boolean;
}

export interface ThumbnailSliderProps {
  photos: Photo[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export interface PhotoGalleryProps {
  // Add any props if needed
} 