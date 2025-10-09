/**
 * Photo Service
 * API service for photo operations
 */

import { createApiService } from '../../../lib/api/createApiService'
import type { PhotoRow, Photo } from '../types'

const photoApiService = createApiService<PhotoRow>({
  endpoint: 'photos',
  sortBy: 'created_at',
  sortDirection: 'desc'
})

export const photoService = {
  /**
   * Fetch all visible photos
   */
  fetchVisible: async (): Promise<Photo[]> => {
    const data = await photoApiService.fetchVisible()
    return data as Photo[]
  },

  /**
   * Fetch all photos
   */
  fetchAll: async (): Promise<Photo[]> => {
    const data = await photoApiService.fetchAll()
    return data as Photo[]
  },

  /**
   * Fetch photo by ID
   */
  fetchById: async (id: string): Promise<Photo | null> => {
    const data = await photoApiService.fetchById(id)
    return data as Photo | null
  },

  /**
   * Fetch photos by year
   */
  fetchByYear: async (year: number): Promise<Photo[]> => {
    const data = await photoApiService.fetchAll({
      filter: { year, visible: true }
    })
    return data as Photo[]
  },

  /**
   * Fetch photos by album
   */
  fetchByAlbum: async (albumId: string): Promise<Photo[]> => {
    // This would need a join query - implement based on your needs
    // For now, return empty array
    return []
  }
}