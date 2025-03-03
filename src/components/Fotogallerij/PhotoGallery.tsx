import React from 'react';
import MainSlider from './MainSlider';
import ThumbnailSlider from './ThumbnailSlider';
import { usePhotoGallery } from './hooks/usePhotoGallery';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { supabase } from '@/lib/supabase';
import { useState, useEffect, useCallback } from 'react';
import type { Photo } from './types';
import type { Database } from '@/types/supabase';

// Define types for the join query results
type PhotoJoinResult = {
  order_number: number;
  photos: Photo;
}

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

      // Log the current database state
      console.log('Fetching data...');

      // Get the visible album
      const { data: albumData, error: albumError } = await supabase
        .from('albums')
        .select('*')
        .eq('visible', true)
        .maybeSingle();

      if (albumError) {
        console.error('Album error:', albumError);
        throw new Error('Fout bij het ophalen van het album');
      }

      console.log('Album data:', albumData);

      if (!albumData) {
        throw new Error('Geen zichtbaar album gevonden');
      }

      // First check if photos exist
      const { data: photoCheckData, error: photoCheckError } = await supabase
        .from('photos')
        .select('id, url, visible')
        .in('id', [
          'e1350a21-3d42-4252-bc56-5d9ce264ff41',
          '4059d3cf-0e92-44c2-bbfa-93235dc19eae',
          '5d350384-2f7f-41bb-98ea-386e33e40c35',
          '0334c63c-230a-46c7-b87d-3f4a5cc946c0',
          '245ddf1a-61ab-4b64-b8b2-13d5079d6592',
          '7431c540-2aa5-42db-b5c5-df55a17856ae',
          '8a4d5c20-ea73-4336-8c6b-af7a197ef7c2',
          '3acaeca2-aa51-4cd6-9fad-7b20b607cba7',
          '6fd90008-f1ca-4e3d-9915-32b914208239',
          'af027789-d718-4899-88b2-d8f0814b73ee',
          '8f6ee2f2-2270-40fb-9c91-ace741bf7796'
        ]);

      console.log('Photo check data:', photoCheckData);
      if (photoCheckError) {
        console.error('Photo check error:', photoCheckError);
      }

      // Get photos for this album using the join table
      const { data: photosData, error: photosError } = await supabase
        .from('album_photos')
        .select(`
          order_number,
          photo_id,
          photos (
            id,
            url,
            alt,
            visible,
            created_at,
            updated_at
          )
        `)
        .eq('album_id', albumData.id)
        .order('order_number', { ascending: true });

      if (photosError) {
        console.error('Photos error:', photosError);
        throw new Error('Fout bij het ophalen van de foto\'s');
      }

      // Add detailed logging
      console.log('Raw photos data:', photosData);
      console.log('Album ID being used:', albumData.id);
      console.log('Photo IDs in join table:', photosData?.map(item => item.photo_id));
      
      // Check if any photos are null
      const nullPhotos = photosData?.filter(item => !item.photos);
      if (nullPhotos?.length > 0) {
        console.log('Found null photos:', nullPhotos);
      }

      if (!photosData || photosData.length === 0) {
        throw new Error('Geen foto\'s gevonden in dit album');
      }

      // Filter visible photos and clean up the join data
      const visiblePhotos = (photosData as unknown as PhotoJoinResult[])
        .filter(item => {
          if (!item.photos) {
            console.log('Skipping null photo item:', item);
            return false;
          }
          if (!item.photos.visible) {
            console.log('Skipping invisible photo:', item.photos);
            return false;
          }
          return true;
        })
        .map(item => ({
          ...item.photos,
          order_number: item.order_number
        })) as Photo[];
      console.log('Visible photos:', visiblePhotos);

      if (visiblePhotos.length === 0) {
        throw new Error('Geen zichtbare foto\'s gevonden in dit album');
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
    isAutoPlaying,
    setIsAutoPlaying,
    handlePrevious,
    handleNext,
    touchStart,
    setTouchStart,
    setCurrentIndex
  } = usePhotoGallery(photos);

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

  // Touch handlers met type safety
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      setTouchStart(touch.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touch = e.touches[0];
    if (touch) {
      const touchEnd = touch.clientX;
      const diff = touchStart - touchEnd;
      if (Math.abs(diff) > 50) {
        diff > 0 ? handleNext() : handlePrevious();
        setTouchStart(null);
      }
    }
  };

  return (
    <section 
      className="py-16 px-5 bg-white font-heading"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Title Section met nieuwe animaties */}
      <div className="text-center mb-12 relative pb-8 animate-fade-in">
        <h2 className="text-[clamp(2rem,4vw,2.75rem)] text-gray-900 font-semibold mb-3">
          Bekijk onze Foto's
        </h2>
        <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-gray-600 mb-4">
          De Koninklijke Loop 2024
        </p>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60px] h-[3px] bg-gradient-45 from-primary to-primary-light rounded-full" />
      </div>

      {/* Gallery Container met controls */}
      <div className="max-w-[1200px] mx-auto">
        <div className="relative">
          <MainSlider
            photos={photos}
            currentIndex={currentIndex}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isAnimating={isAnimating}
            onModalChange={setIsModalOpen}
          />

          {/* Auto-play control */}
          <button
            onClick={() => setIsAutoPlaying((prev: boolean) => !prev)}
            className="absolute bottom-4 right-4 z-10 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all"
            aria-label={isAutoPlaying ? 'Pause slideshow' : 'Start slideshow'}
          >
            {isAutoPlaying ? (
              <PauseIcon className="w-6 h-6 text-gray-700" />
            ) : (
              <PlayArrowIcon className="w-6 h-6 text-gray-700" />
            )}
          </button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ 
                width: `${(currentIndex / (photos.length - 1)) * 100}%`,
                transition: isAutoPlaying ? 'width 5s linear' : 'width 0.3s ease-out'
              }}
            />
          </div>
        </div>

        <ThumbnailSlider
          photos={photos}
          currentIndex={currentIndex}
          onSelect={setCurrentIndex}
        />

        {/* Keyboard controls info */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Gebruik de pijltjestoetsen om te navigeren, spatiebalk voor autoplay</p>
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery; 