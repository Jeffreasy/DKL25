/**
 * Video Service
 * API service for video operations using PostgREST
 */

import { validateVideoUrl, generateThumbnailUrl } from '../utils/videoHelpers'
import type { VideoRow, Video } from '../types'

const POSTGREST_URL = import.meta.env.VITE_POSTGREST_URL || 'https://dklemailservice.onrender.com'

export const videoService = {
  /**
   * Fetch all visible videos
   */
  fetchVisible: async (): Promise<Video[]> => {
    try {
      console.log('Fetching videos from:', `${POSTGREST_URL}/api/videos`)

      const response = await fetch(`${POSTGREST_URL}/api/videos`)

      if (!response.ok) {
        console.error('HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: VideoRow[] = await response.json()
      console.log('Fetched video data:', data)

      const processedVideos = videoService.processVideos(data)
      return processedVideos
    } catch (error) {
      console.error('Error fetching visible videos:', error)
      throw new Error('Er ging iets mis bij het ophalen van de videos')
    }
  },

  /**
   * Fetch all videos
   */
  fetchAll: async (): Promise<Video[]> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/api/videos/admin`)

      if (!response.ok) {
        console.error('HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: VideoRow[] = await response.json()
      const processedVideos = videoService.processVideos(data)
      return processedVideos
    } catch (error) {
      console.error('Error fetching all videos:', error)
      throw new Error('Er ging iets mis bij het ophalen van alle videos')
    }
  },

  /**
   * Fetch video by ID
   */
  fetchById: async (id: string): Promise<Video | null> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/api/videos/${id}`)

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        console.error('HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: VideoRow = await response.json()
      const processedVideos = videoService.processVideos([data])
      return processedVideos.length > 0 ? processedVideos[0] : null
    } catch (error) {
      console.error('Error fetching video by ID:', error)
      return null
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