// BELANGRIJK: Zorg ervoor dat de afbeeldingen (photos.url en photos.thumbnail_url) 
// geoptimaliseerd zijn qua grootte en formaat (bv. WebP/AVIF) via de image provider (bv. Cloudinary/Supabase Storage)
// voor de beste laadprestaties.

import React from 'react';
import MainSlider from './MainSlider';
import ThumbnailSlider from './ThumbnailSlider';
import { usePhotoGallery } from './hooks/usePhotoGallery';
import { supabase } from '@/lib/supabase';
import { useState, useEffect, useCallback } from 'react';
import type { Photo, Album } from './types';
import { trackEvent } from '@/utils/googleAnalytics';

interface PhotoGalleryProps {
  onModalChange?: (isOpen: boolean) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ onModalChange }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Haal albums op bij mount
  useEffect(() => {
    const fetchAlbums = async () => {
      const { data, error: albumError } = await supabase
        .from('albums')
        .select('*')
        .eq('visible', true)
        .order('order_number', { ascending: true });

      if (albumError) {
        console.error('Albums error:', albumError);
        setError('Fout bij ophalen van albums.');
        trackEvent('gallery', 'error', 'albums_fetch_failed');
      } else if (data && data.length > 0) {
        setAlbums(data as Album[]);
        setSelectedAlbumId(data[0].id); // Selecteer eerste album standaard
      } else {
        setError('Geen zichtbare albums gevonden.');
        trackEvent('gallery', 'error', 'no_albums_found');
      }
    };
    fetchAlbums();
  }, []); // Fetch albums only once

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

  // Aangepaste fetchPhotos functie
  const fetchPhotos = useCallback(async () => {
    if (!selectedAlbumId) return; // Wacht tot een album geselecteerd is

    try {
      setIsLoading(true);
      setError(null);
      setPhotos([]); // Leeg foto's bij wisselen album
      setRetryCount(0); // Reset retry count

      // Stap 1: Haal photo_id's en order_number op uit album_photos voor het geselecteerde album
      const { data: albumPhotosData, error: albumPhotosError } = await supabase
        .from('album_photos')
        .select('photo_id, order_number')
        .eq('album_id', selectedAlbumId)
        .order('order_number', { ascending: true }); // Sorteer hier alvast voor consistentie

      if (albumPhotosError) {
        console.error('Album photos error:', albumPhotosError);
        trackEvent('gallery', 'error', 'album_photos_fetch_failed');
        throw new Error('Fout bij het ophalen van de foto-koppelingen voor dit album');
      }

      if (!albumPhotosData || albumPhotosData.length === 0) {
        trackEvent('gallery', 'info', 'no_photos_found_for_album');
        setPhotos([]); // Geen foto's gekoppeld aan dit album
        return; // Stop hier
      }

      // Maak een mapping van photo_id naar order_number en verzamel photo_ids
      const photoOrderMap = new Map<string, number>();
      const validAlbumPhotos = albumPhotosData.filter(ap => ap.photo_id !== null);
      const photoIds: string[] = validAlbumPhotos.map(ap => {
        // We weten nu dat ap.photo_id niet null is door de filter hierboven
        photoOrderMap.set(ap.photo_id!, ap.order_number ?? 0); // Gebruik 0 als fallback voor order_number indien null
        return ap.photo_id!;
      });

      // Voorkom een lege 'in' query als er geen geldige photoIds zijn
      if (photoIds.length === 0) {
        setPhotos([]);
        trackEvent('gallery', 'info', 'no_valid_photo_ids_for_album');
        return;
      }

      // Stap 2: Haal de daadwerkelijke foto data op voor de gevonden photo_ids
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .in('id', photoIds)
        .eq('visible', true); // Extra check of de foto zelf zichtbaar is

      if (photosError) {
        console.error('Photos fetch error:', photosError);
        trackEvent('gallery', 'error', 'photos_fetch_failed');
        throw new Error('Fout bij het ophalen van de foto details');
      }

      if (!photosData || photosData.length === 0) {
        // Dit zou niet vaak moeten gebeuren als albumPhotosData wel resultaten gaf,
        // maar het kan als foto's onzichtbaar zijn gemaakt na koppelen.
        trackEvent('gallery', 'info', 'no_visible_photos_found_for_album');
        setPhotos([]);
      } else {
        // Stap 3: Sorteer de opgehaalde photosData op basis van de order_number uit albumPhotosData
        const sortedVisiblePhotos = (photosData as Photo[])
          .sort((a, b) => {
            const orderA = photoOrderMap.get(a.id) ?? Infinity; // Geef een hoge waarde als de order onbekend is
            const orderB = photoOrderMap.get(b.id) ?? Infinity;
            return orderA - orderB;
          });
        trackEvent('gallery', 'photos_loaded', `album:${selectedAlbumId}, count:${sortedVisiblePhotos.length}`);
        setPhotos(sortedVisiblePhotos);

        // Preload first few images of the new album
        const preloadUrls = sortedVisiblePhotos.slice(0, 3).map(photo => photo.url);
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
        <div className="animate-pulse">
          <div className="h-[600px] bg-gray-200 rounded-2xl mb-4" />
          <div className="flex gap-2 justify-center">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-24 h-16 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchPhotos} // Retry fetch for the current album
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Opnieuw proberen
          </button>
        </div>
      );
    }
  
    if (photos.length === 0 && selectedAlbumId) {
      return <p className="text-gray-600 text-center">Geen foto's gevonden voor dit album.</p>;
    }

    if (photos.length === 0 && !selectedAlbumId) {
      return <p className="text-gray-600 text-center">Selecteer een album.</p>;
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
    <div className="py-16 px-5 bg-white font-heading">
      <div className="max-w-[1200px] mx-auto">
        {/* Album Selectie Knoppen */}
        {albums.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {albums.map((album) => (
              <button
                key={album.id}
                onClick={() => handleAlbumSelect(album.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedAlbumId === album.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
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
};

export default PhotoGallery; 