export interface Photo {
  id: string;
  url: string;
}

export interface ThumbnailSliderProps {
  photos: Photo[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export interface PhotoGalleryProps {
  // Add any props if needed, currently empty as component doesn't receive props
} 