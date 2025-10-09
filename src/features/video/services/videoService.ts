/**
 * Video Service
 * API service for video operations
 */

import { createApiService } from '../../../lib/api/createApiService'
import { validateVideoUrl, generateThumbnailUrl } from '../utils/videoHelpers'
import type { VideoRow, Video } from '../types'

const videoApiService = createApiService<VideoRow>({
  endpoint: 'videos',
  sortBy: 'order_number',
  sortDirection: 'asc'
})

export const videoService = {
  /**
   * Fetch all visible videos
   */
  fetchVisible: async (): Promise<Video[]> => {
    const data = await videoApiService.fetchVisible()
    return videoService.processVideos(data)
  },

  /**
   * Fetch all videos
   */
  fetchAll: async (): Promise<Video[]> => {
    const data = await videoApiService.fetchAll()
    return videoService.processVideos(data)
  },

  /**
   * Fetch video by ID
   */
  fetchById: async (id: string): Promise<Video | null> => {
    const data = await videoApiService.fetchById(id)
    if (!data) return null
    
    const processed = videoService.processVideos([data])
    return processed[0] || null
  },

  /**
   * Process videos: validate URLs and generate thumbnails
   */
  processVideos: (videos: VideoRow[]): Video[] => {
    const mappedVideos = videos.map(item => {
      // Gebruik de originele URL als deze al correct is
      const validatedUrl = item.url.includes('streamable.com/e/') 
        ? item.url 
        : validateVideoUrl(item.url, item.video_id)

      if (!validatedUrl) {
        console.error('Invalid video URL found:', item.url)
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
      } as Video
    })

    // Filter out videos with invalid URLs
    const validVideos = mappedVideos.filter(video => !!video.url)

    if (validVideos.length !== mappedVideos.length) {
      console.warn(`${mappedVideos.length - validVideos.length} video(s) overgeslagen vanwege ongeldige URLs`)
    }

    return validVideos
  }
}