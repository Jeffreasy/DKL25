/**
 * Photo Service
 * API service for photo operations using PostgREST
 */

import type { Photo } from '../types'

const POSTGREST_URL = import.meta.env.VITE_POSTGREST_URL || '/api'

export const photoService = {
  /**
   * Fetch all visible photos
   */
  fetchVisible: async (): Promise<Photo[]> => {
    try {
      console.log('Fetching photos from:', `${POSTGREST_URL}/photos`)

      const response = await fetch(`${POSTGREST_URL}/photos`)

      if (!response.ok) {
        console.error('HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: Photo[] = await response.json()
      console.log('Fetched photos:', data)
      return data
    } catch (error) {
      console.error('Error fetching visible photos:', error)
      throw new Error('Er ging iets mis bij het ophalen van de fotos')
    }
  },

  /**
   * Fetch all photos
   */
  fetchAll: async (): Promise<Photo[]> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/photos/admin`)

      if (!response.ok) {
        console.error('HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: Photo[] = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching all photos:', error)
      throw new Error('Er ging iets mis bij het ophalen van alle fotos')
    }
  },

  /**
   * Fetch photo by ID
   */
  fetchById: async (id: string): Promise<Photo | null> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/photos/${id}`)

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        console.error('HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: Photo = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching photo by ID:', error)
      return null
    }
  },

  /**
   * Fetch photos by year
   */
  fetchByYear: async (year: number): Promise<Photo[]> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/photos?year=eq.${year}`)

      if (!response.ok) {
        console.error('HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: Photo[] = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching photos by year:', error)
      throw new Error('Er ging iets mis bij het ophalen van fotos per jaar')
    }
  },

  /**
   * Fetch photos by album
   */
  fetchByAlbum: async (albumId: string): Promise<Photo[]> => {
    try {
      // Use the albums/{id}/photos endpoint as documented in the API reference
      // Add order parameter to ensure proper ordering
      const response = await fetch(`${POSTGREST_URL}/albums/${albumId}/photos?order=order_number.asc`)

      if (!response.ok) {
        console.error('HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const photos: Photo[] = await response.json()
      return photos
    } catch (error) {
      console.error('Error fetching photos by album:', error)
      throw new Error('Er ging iets mis bij het ophalen van fotos per album')
    }
  }
}