import React from 'react';
import MainSlider from './MainSlider';
import ThumbnailSlider from './ThumbnailSlider';
import { usePhotoGallery } from './hooks/usePhotoGallery';
import { supabase } from '@/lib/supabase';
import { useState, useEffect, useCallback } from 'react';
import type { Photo } from './types';
import { trackEvent } from '@/utils/googleAnalytics';

interface PhotoGalleryProps {
  onModalChange?: (isOpen: boolean) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ onModalChange }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Notify parent component of modal state changes
  useEffect(() => {
    onModalChange?.(isModalOpen);
  }, [isModalOpen, onModalChange]);

  // Preload images
  const preloadImages = useCallback((urls: string[]) => {
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  // Fetch photos with retry mechanism
  const fetchPhotos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch visible photos ordered by order_number
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .eq('visible', true)
        .order('order_number', { ascending: true });

      if (photosError) {
        console.error('Photos error:', photosError);
        trackEvent('gallery', 'error', 'photos_fetch_failed');
        throw new Error('Fout bij het ophalen van de foto\'s');
      }

      if (!photosData || photosData.length === 0) {
        trackEvent('gallery', 'error', 'no_photos_found');
        throw new Error('Geen foto\'s gevonden');
      }

      // Track successful photo load
      trackEvent('gallery', 'photos_loaded', `count:${photosData.length}`);

      // Use photos as they come from the database (they already have order_number)
      const visiblePhotos = photosData as Photo[];

      if (visiblePhotos.length === 0) {
        throw new Error('Geen zichtbare foto\'s gevonden');
      }

      setPhotos(visiblePhotos);

      // Preload first few images
      const preloadUrls = visiblePhotos.slice(0, 3).map(photo => photo.url);
      preloadImages(preloadUrls);

    } catch (err) {
      console.error('Error in fetchPhotos:', err);
      setError(err instanceof Error ? err.message : 'Er ging iets mis bij het ophalen van de foto\'s');
      
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, Math.pow(2, retryCount) * 1000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [retryCount, preloadImages]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const {
    currentIndex,
    isAnimating,
    handlePrevious,
    handleNext,
    touchStart,
    setTouchStart,
    setCurrentIndex
  } = usePhotoGallery(photos);

  // Track navigation
  const handleNavigation = (direction: 'previous' | 'next') => {
    trackEvent('gallery', 'navigation', direction);
    direction === 'previous' ? handlePrevious() : handleNext();
  };

  // Track thumbnail selection
  const handleThumbnailSelect = (index: number) => {
    trackEvent('gallery', 'thumbnail_select', `index:${index}`);
    setCurrentIndex(index);
  };

  // Preload next image when current index changes
  useEffect(() => {
    if (!photos.length) return;
    const nextIndex = (currentIndex + 1) % photos.length;
    preloadImages([photos[nextIndex].url]);
  }, [currentIndex, photos, preloadImages]);

  if (isLoading) {
    return (
      <div className="py-16 px-5 bg-white font-heading">
        <div className="max-w-[1200px] mx-auto">
          {/* Skeleton loader */}
          <div className="animate-pulse">
            <div className="h-[600px] bg-gray-200 rounded-2xl mb-4" />
            <div className="flex gap-2 justify-center">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-24 h-16 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 px-5 bg-white font-heading text-center">
        <div className="max-w-[600px] mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setRetryCount(0);
              fetchPhotos();
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Opnieuw proberen
          </button>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="py-16 px-5 bg-white font-heading text-center">
        <p className="text-gray-600">Geen foto's beschikbaar</p>
      </div>
    );
  }

  return (
    <div className="py-16 px-5 bg-white font-heading">
      <div className="max-w-[1200px] mx-auto">
        <MainSlider
          photos={photos}
          currentIndex={currentIndex}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isAnimating={isAnimating}
          onModalChange={onModalChange}
        />
        <ThumbnailSlider
          photos={photos}
          currentIndex={currentIndex}
          onSelect={handleThumbnailSelect}
        />
      </div>
    </div>
  );
};

export default PhotoGallery; 