/**
 * Album Service
 * API service for album operations
 */

import { createApiService } from '../../../lib/api/createApiService'
import { supabase } from '../../../lib/supabase'
import type { AlbumRow, Album, Photo } from '../types'

const albumApiService = createApiService<any>({
  endpoint: 'albums',
  sortBy: 'order_number',
  sortDirection: 'asc'
})

export const albumService = {
  /**
   * Fetch all visible albums
   */
  fetchVisible: async (): Promise<Album[]> => {
    const data = await albumApiService.fetchVisible()
    return data as Album[]
  },

  /**
   * Fetch all albums
   */
  fetchAll: async (): Promise<Album[]> => {
    const data = await albumApiService.fetchAll()
    return data as Album[]
  },

  /**
   * Fetch album by ID
   */
  fetchById: async (id: string): Promise<Album | null> => {
    const data = await albumApiService.fetchById(id)
    return data as Album | null
  },

  /**
   * Fetch album with photos
   */
  fetchWithPhotos: async (albumId: string): Promise<Album | null> => {
    try {
      // Fetch album
      const { data: album, error: albumError } = await supabase
        .from('albums')
        .select('*')
        .eq('id', albumId)
        .single()

      if (albumError) throw albumError
      if (!album) return null

      // Fetch photos for this album
      const { data: albumPhotos, error: photosError } = await supabase
        .from('album_photos')
        .select(`
          order_number,
          photos (*)
        `)
        .eq('album_id', albumId)
        .order('order_number', { ascending: true })

      if (photosError) throw photosError

      // Extract and map photos
      const photos = (albumPhotos || [])
        .map((ap: any) => ap.photos)
        .filter(Boolean) as Photo[]

      return {
        ...album,
        photos,
        photo_count: photos.length
      } as Album
    } catch (error) {
      console.error('Error fetching album with photos:', error)
      return null
    }
  },

  /**
   * Fetch all albums with cover photos
   */
  fetchWithCovers: async (): Promise<Album[]> => {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select(`
          *,
          cover_photo:photos!albums_cover_photo_id_fkey (*)
        `)
        .eq('visible', true)
        .order('order_number', { ascending: true })

      if (error) throw error

      return (data || []) as Album[]
    } catch (error) {
      console.error('Error fetching albums with covers:', error)
      return []
    }
  }
}