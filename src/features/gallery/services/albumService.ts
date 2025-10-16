/**
 * Album Service
 * API service for album operations using PostgREST
 */

import type { Album, Photo } from '../types'

const POSTGREST_URL = import.meta.env.VITE_POSTGREST_URL || '/api'

export const albumService = {
  /**
   * Fetch all visible albums
   */
  fetchVisible: async (): Promise<Album[]> => {
    try {
      console.log('Fetching albums from:', `${POSTGREST_URL}/albums`)

      const response = await fetch(`${POSTGREST_URL}/albums`)

      if (!response.ok) {
        console.error('HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: Album[] = await response.json()
      console.log('Fetched albums:', data)
      return data
    } catch (error) {
      console.error('Error fetching visible albums:', error)
      throw new Error('Er ging iets mis bij het ophalen van de albums')
    }
  },

  /**
   * Fetch all albums
   */
  fetchAll: async (): Promise<Album[]> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/api/albums/admin`)

      if (!response.ok) {
        console.error('HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: Album[] = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching all albums:', error)
      throw new Error('Er ging iets mis bij het ophalen van alle albums')
    }
  },

  /**
   * Fetch album by ID
   */
  fetchById: async (id: string): Promise<Album | null> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/api/albums/${id}`)

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        console.error('HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: Album = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching album by ID:', error)
      return null
    }
  },

  /**
   * Fetch album with photos
   */
  fetchWithPhotos: async (albumId: string): Promise<Album | null> => {
    try {
      // First get the album
      const album = await albumService.fetchById(albumId)
      if (!album) {
        return null
      }

      // Then get the photos for this album
      const response = await fetch(`${POSTGREST_URL}/api/album-photos?album_id=eq.${albumId}&order=order_number.asc`)

      if (!response.ok) {
        console.error('HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const albumPhotos = await response.json()

      // Get the actual photo data for each album photo
      const photoPromises = albumPhotos.map(async (albumPhoto: any) => {
        const response = await fetch(`${POSTGREST_URL}/api/photos?id=eq.${albumPhoto.photo_id}`)
        if (response.ok) {
          const photos = await response.json()
          return photos.length > 0 ? photos[0] : null
        }
        return null
      })

      const photos = await Promise.all(photoPromises)
      const validPhotos = photos.filter((photo): photo is Photo => photo !== null)

      return {
        ...album,
        photos: validPhotos
      }
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
      const response = await fetch(`${POSTGREST_URL}/api/albums?cover_photo_id=not.is.null`)

      if (!response.ok) {
        console.error('HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: Album[] = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching albums with covers:', error)
      throw new Error('Er ging iets mis bij het ophalen van albums met covers')
    }
  }
}