// BELANGRIJK: Zorg ervoor dat de afbeeldingen (photos.url en photos.thumbnail_url)
// geoptimaliseerd zijn qua grootte en formaat (bv. WebP/AVIF) via de image provider (bv. Cloudinary/Supabase Storage)
// voor de beste laadprestaties.

import React, { memo } from 'react';
import MainSlider from './MainImageSlider';
import ThumbnailSlider from './ThumbnailGrid';
import { usePhotoGallery } from '../hooks/usePhotoGallery';
import { albumService } from '../services/albumService';
import { photoService } from '../services/photoService';
import { useState, useEffect, useCallback } from 'react';
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

  // Combined effect for initial data loading and modal state tracking
  useEffect(() => {
    // Fetch albums on mount
    const fetchAlbums = async () => {
      try {
        const data = await albumService.fetchVisible();
        if (data && data.length > 0) {
          setAlbums(data);
          setSelectedAlbumId(data[0].id); // Selecteer eerste album standaard
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

    // Notify parent component of modal state changes
    onModalChange?.(isModalOpen);
  }, [isModalOpen, onModalChange]); // Only re-run when modal state or callback changes

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
    if (isLoading && photos.length === 0) { // Toon skeleton alleen bij initiële load of album switch
      return (
        <div className={cn(cc.flex.center, 'min-h-[400px] bg-gray-50 rounded-lg')}>
          <div className="text-center">
            <div className={cn('w-12 h-12 border-4 border-t-transparent mx-auto mb-4', colors.primary.border, cc.border.circle, 'animate-spin')} />
            <p className={cn(cc.text.muted)}>Foto's laden...</p>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className={cn('text-center p-8 bg-gray-50 rounded-lg', cc.text.error)}>
          <div className="max-w-md mx-auto">
            <h3 className={cn(cc.text.h3, 'mb-2')}>Foto's konden niet worden geladen</h3>
            <p className={cn(cc.text.body, 'mb-4 text-gray-600')}>{error}</p>
            <button
              onClick={fetchPhotos}
              className={cn(cc.button.primary, 'px-6 py-2')}
            >
              Opnieuw proberen
            </button>
          </div>
        </div>
      );
    }
  
    if (photos.length === 0 && selectedAlbumId) {
      return <p className={cn(cc.text.muted, 'text-center')}>Geen foto's gevonden voor dit album.</p>;
    }

    if (photos.length === 0 && !selectedAlbumId) {
      return <p className={cn(cc.text.muted, 'text-center')}>Selecteer een album.</p>;
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
    <div className={cn('py-16 px-5 bg-white', cc.typography.heading)}>
      <div className={cn(cc.container.wide, 'max-w-[1200px]')}>
        {/* Album Selectie Knoppen */}
        {albums.length > 1 && (
          <div className={cn(cc.flex.center, 'flex-wrap gap-2 mb-8')}>
            {albums.map((album) => (
              <button
                key={album.id}
                onClick={() => handleAlbumSelect(album.id)}
                className={cn(
                  'px-4 py-2',
                  cc.border.circle,
                  cc.text.small,
                  cc.transition.colors,
                  selectedAlbumId === album.id
                    ? cn(colors.primary.bg, 'text-white', cc.shadow.md)
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
                aria-current={selectedAlbumId === album.id ? 'page' : undefined}
              >
                {album.title}
              </button>
            ))}
          </div>
        )}

        {renderContent()}

      </div>
    </div>
  );
});

PhotoGallery.displayName = 'PhotoGallery';

export default PhotoGallery;