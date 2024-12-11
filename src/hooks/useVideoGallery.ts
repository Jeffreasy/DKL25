import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Video } from '@/types/video';

export const useVideoGallery = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('visible', 'true')
          .order('order_number', { ascending: true });

        if (error) throw error;

        const mappedVideos: Video[] = (data || []).map(item => ({
          id: item.id,
          video_id: item.video_id,
          url: item.url,
          title: item.title,
          description: item.description,
          visible: item.visible,
          order_number: item.order_number,
          created_at: item.created_at,
          updated_at: item.updated_at,
          thumbnail_url: item.thumbnail_url || undefined
        }));

        setVideos(mappedVideos);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Er ging iets mis bij het ophalen van de videos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const handleNext = () => {
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