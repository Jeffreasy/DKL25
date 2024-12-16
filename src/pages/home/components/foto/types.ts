export interface Photo {
  id: string;
  url: string;
  alt: string;
  thumbnail_url?: string;
  order_number: number;
  visible: boolean;
}

export interface PhotoGalleryProps {}

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