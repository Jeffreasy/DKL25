/**
 * Gallery Container Component
 * Main component for photo gallery with album selection and navigation
 *
 * @note Images should be optimized (WebP/AVIF) via image provider
 * for best loading performance
 */

import React, { memo, useState, useEffect, useCallback } from 'react';
import MainSlider from './MainImageSlider';
import ThumbnailSlider from './ThumbnailGrid';
import { usePhotoGallery } from '../hooks/usePhotoGallery';
import { albumService } from '../services/albumService';
import { photoService } from '../services/photoService';
import type { Photo, Album } from '../types';
import { trackEvent } from '@/utils/googleAnalytics';
import { cc, cn, colors } from '@/styles/shared';

interface PhotoGalleryProps {
  onModalChange?: (isOpen: boolean) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = memo(({ onModalChange }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch albums once on mount
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await albumService.fetchVisible();
        if (data && data.length > 0) {
          setAlbums(data);
          setSelectedAlbumId(data[0].id); // Select first album by default
        } else {
          setError('Geen zichtbare albums gevonden.');
          trackEvent('gallery', 'error', 'no_albums_found');
        }
      } catch (albumError) {
        console.error('Albums error:', albumError);
        setError('Fout bij ophalen van albums.');
        trackEvent('gallery', 'error', 'albums_fetch_failed');
      }
    };

    fetchAlbums();
  }, []); // Empty array - only run on mount

  // Track modal state changes separately
  useEffect(() => {
    onModalChange?.(isModalOpen);
  }, [isModalOpen, onModalChange]);

  // Preload images with cleanup
  const preloadImages = useCallback((urls: string[]) => {
    const preloadPromises: Promise<void>[] = [];

    urls.forEach(url => {
      const img = new Image();
      const promise = new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Don't fail on preload errors
        img.src = url;
      });
      preloadPromises.push(promise);
    });

    // Return promise for potential future use
    return Promise.all(preloadPromises);
  }, []);

  // Aangepaste fetchPhotos functie
  const fetchPhotos = useCallback(async () => {
    if (!selectedAlbumId) return; // Wacht tot een album geselecteerd is

    try {
      setIsLoading(true);
      setError(null);
      setPhotos([]); // Leeg foto's bij wisselen album
      setRetryCount(0); // Reset retry count

      // Use photoService to fetch photos by album
      const photosData = await photoService.fetchByAlbum(selectedAlbumId);

      if (!photosData || photosData.length === 0) {
        trackEvent('gallery', 'info', 'no_photos_found_for_album');
        setPhotos([]); // Geen foto's gekoppeld aan dit album
      } else {
        trackEvent('gallery', 'photos_loaded', `album:${selectedAlbumId}, count:${photosData.length}`);
        setPhotos(photosData);

        // Preload first few images of the new album
        const preloadUrls = photosData.slice(0, 3).map(photo => photo.url);
        preloadImages(preloadUrls);
      }

    } catch (err) {
      console.error('Error in fetchPhotos:', err);
      setError(err instanceof Error ? err.message : 'Er ging iets mis bij het ophalen van de foto\'s');
      setPhotos([]); // Maak leeg bij error
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, Math.pow(2, retryCount) * 1000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedAlbumId, retryCount, preloadImages]); // Afhankelijk van geselecteerd album

  // Fetch photos when selected album changes
  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]); // Trigger als fetchPhotos (en dus selectedAlbumId) verandert

  const {
    currentIndex,
    isAnimating,
    handlePrevious,
    handleNext,
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

  // Handler voor album selectie
  const handleAlbumSelect = (albumId: string) => {
    if (albumId !== selectedAlbumId) {
      trackEvent('gallery', 'album_select', `album:${albumId}`);
      setSelectedAlbumId(albumId);
      setCurrentIndex(0); // Reset naar eerste foto van nieuwe album
    }
  };

  // Preload next image when current index changes
  useEffect(() => {
    if (!photos.length) return;
    const nextIndex = (currentIndex + 1) % photos.length;
    preloadImages([photos[nextIndex].url]);
  }, [currentIndex, photos, preloadImages]);

  const renderContent = () => {
    // Loading state with spinner
    if (isLoading && photos.length === 0) {
      return (
        <div className={cn(cc.flex.center, 'min-h-[400px]', colors.neutral.gray[50], cc.border.rounded)}>
          <div className={cn(cc.flex.colCenter, 'gap-4')}>
            <div className={cn(cc.loading.spinner, 'w-12 h-12')} />
            <p className={cn(cc.text.muted, cc.typography.bodyNormal)}>Foto's laden...</p>
          </div>
        </div>
      );
    }
  
    // Error state with retry button
    if (error) {
      return (
        <div className={cn(cc.flex.center, 'p-8', colors.neutral.gray[50], cc.border.rounded)}>
          <div className={cn(cc.flex.colCenter, 'gap-4 max-w-md text-center')}>
            <h3 className={cn(cc.text.h4, cc.typography.semibold, colors.status.danger.text)}>
              Foto's konden niet worden geladen
            </h3>
            <p className={cn(cc.text.body, cc.text.muted)}>{error}</p>
            <button
              onClick={fetchPhotos}
              className={cn(cc.button.primary)}
              aria-label="Probeer opnieuw foto's te laden"
            >
              Opnieuw proberen
            </button>
          </div>
        </div>
      );
    }
  
    // Empty states
    if (photos.length === 0 && selectedAlbumId) {
      return (
        <p className={cn(cc.text.body, cc.text.muted, cc.flex.center, 'py-12')}>
          Geen foto's gevonden voor dit album.
        </p>
      );
    }

    if (photos.length === 0 && !selectedAlbumId) {
      return (
        <p className={cn(cc.text.body, cc.text.muted, cc.flex.center, 'py-12')}>
          Selecteer een album om foto's te bekijken.
        </p>
      );
    }

    return (
      <>
        <MainSlider
          photos={photos}
          currentIndex={currentIndex}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isAnimating={isAnimating}
          onModalChange={setIsModalOpen} // Direct doorgeven
        />
        <ThumbnailSlider
          photos={photos}
          currentIndex={currentIndex}
          onSelect={handleThumbnailSelect}
        />
      </>
    );
  };

  return (
    <section
      className={cn(cc.spacing.section, 'px-5', colors.neutral.white)}
      aria-label="Fotogalerij"
    >
      <div className={cn(cc.container.wide, 'max-w-[1200px]')}>
        {/* Album Selection Buttons */}
        {albums.length > 1 && (
          <nav
            className={cn(cc.flex.center, 'flex-wrap gap-2 mb-8')}
            aria-label="Album selectie"
          >
            {albums.map((album) => (
              <button
                key={album.id}
                onClick={() => handleAlbumSelect(album.id)}
                className={cn(
                  cc.chip.base,
                  cc.transition.colors,
                  selectedAlbumId === album.id
                    ? cc.chip.primary
                    : cn(cc.chip.secondary, 'hover:bg-gray-300')
                )}
                aria-current={selectedAlbumId === album.id ? 'page' : undefined}
                aria-label={`Selecteer album ${album.title}`}
              >
                {album.title}
              </button>
            ))}
          </nav>
        )}

        {/* Gallery Content */}
        {renderContent()}
      </div>
    </section>
  );
});

PhotoGallery.displayName = 'PhotoGallery';

export default PhotoGallery;