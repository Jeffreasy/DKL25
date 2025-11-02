/**
 * Video Service
 * API service for video operations via backend
 */

import { apiClient } from '../../../services/api/apiClient';
import { API_ENDPOINTS } from '../../../services/api/endpoints';
import { validateVideoUrl, generateThumbnailUrl } from '../utils/videoHelpers';
import type { VideoRow, Video } from '../types';

export const videoService = {
  /**
   * Fetch all visible videos
   */
  fetchVisible: async (): Promise<Video[]> => {
    try {
      const data = await apiClient.get<VideoRow[]>(API_ENDPOINTS.videos);
      const processedVideos = videoService.processVideos(data);
      return processedVideos;
    } catch (error) {
      console.error('Error fetching visible videos:', error);
      throw new Error('Er ging iets mis bij het ophalen van de videos');
    }
  },

  /**
   * Fetch all videos (requires admin permission)
   */
  fetchAll: async (): Promise<Video[]> => {
    try {
      const data = await apiClient.get<VideoRow[]>(API_ENDPOINTS.videos);
      const processedVideos = videoService.processVideos(data);
      return processedVideos;
    } catch (error) {
      console.error('Error fetching all videos:', error);
      throw new Error('Er ging iets mis bij het ophalen van alle videos');
    }
  },

  /**
   * Fetch video by ID
   */
  fetchById: async (id: string): Promise<Video | null> => {
    try {
      const data = await apiClient.get<VideoRow>(`${API_ENDPOINTS.videos}/${id}`);
      const processedVideos = videoService.processVideos([data]);
      return processedVideos.length > 0 ? processedVideos[0] : null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching video by ID:', error);
      return null;
    }
  },

  /**
   * Process videos: validate URLs and generate thumbnails
   */
  processVideos: (videos: VideoRow[]): Video[] => {
    const mappedVideos = videos.map(item => {
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
        visible: item.visible ?? true,
        order_number: item.order_number ?? 0,
        created_at: item.created_at,
        updated_at: item.updated_at,
        thumbnail_url: item.thumbnail_url || generateThumbnailUrl(item.video_id),
        alt: item.title || 'Video thumbnail'
      } as Video;
    });

    // Filter out videos with invalid URLs
    const validVideos = mappedVideos.filter(video => !!video.url);

    if (validVideos.length !== mappedVideos.length) {
      console.warn(`${mappedVideos.length - validVideos.length} video(s) overgeslagen vanwege ongeldige URLs`);
    }

    return validVideos;
  }
};