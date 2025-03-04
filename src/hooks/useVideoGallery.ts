import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Video } from '@/types/video';

const validateVideoUrl = (url: string, videoId: string): string => {
  try {
    // Als het een Streamable URL is, zorg voor het juiste embed formaat
    if (url.includes('streamable.com')) {
      // Verwijder mogelijke '/e/' uit de URL en voeg het juiste pad toe
      const cleanVideoId = videoId.replace('e/', '');
      return `https://streamable.com/e/${cleanVideoId}`;
    }
    
    // Voor andere URLs, valideer en return
    const validUrl = new URL(url);
    return validUrl.toString();
  } catch (e) {
    console.error('Invalid video URL:', url, e);
    return '';
  }
};

const generateThumbnailUrl = (videoId: string): string => {
  // Verwijder mogelijke 'e/' uit de video ID voor de thumbnail URL
  const cleanVideoId = videoId.replace('e/', '');
  return `https://cdn-cf-east.streamable.com/image/${cleanVideoId.trim()}.jpg`;
};

export const useVideoGallery = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('videos')
          .select('*')
          .eq('visible', 'true')
          .order('order_number', { ascending: true });

        if (supabaseError) throw supabaseError;

        if (!data || data.length === 0) {
          setError('Geen videos beschikbaar');
          return;
        }

        const mappedVideos: Video[] = data.map(item => {
          // Gebruik de originele URL als deze al correct is
          const validatedUrl = item.url.includes('streamable.com/e/') 
            ? item.url 
            : validateVideoUrl(item.url, item.video_id);

          if (!validatedUrl) {
            console.error('Invalid video URL found:', item.url);
          }

          return {
            id: item.id,
            video_id: item.video_id,
            url: validatedUrl,
            title: item.title || 'Ongetitelde video',
            description: item.description || 'Geen beschrijving beschikbaar',
            visible: item.visible,
            order_number: item.order_number,
            created_at: item.created_at,
            updated_at: item.updated_at,
            thumbnail_url: item.thumbnail_url || generateThumbnailUrl(item.video_id)
          };
        });

        // Filter out videos with invalid URLs
        const validVideos = mappedVideos.filter(video => !!video.url);

        if (validVideos.length === 0) {
          setError('Geen geldige videos beschikbaar');
          return;
        }

        if (validVideos.length !== mappedVideos.length) {
          console.warn(`${mappedVideos.length - validVideos.length} video(s) overgeslagen vanwege ongeldige URLs`);
        }

        setVideos(validVideos);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Er ging iets mis bij het ophalen van de videos. Probeer het later opnieuw.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handlePrevious = () => {
    if (videos.length <= 1) return;
    setCurrentIndex(prev => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (videos.length <= 1) return;
    setCurrentIndex(prev => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  return {
    videos,
    currentIndex,
    isLoading,
    error,
    handlePrevious,
    handleNext,
    setCurrentIndex
  };
}; 