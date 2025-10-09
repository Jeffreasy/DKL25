/**
 * Photos Data Hook
 * React hook for fetching photos
 */

import { useState, useEffect } from 'react'
import { photoService } from '../services/photoService'
import type { Photo } from '../types'

interface UsePhotosReturn {
  photos: Photo[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook to fetch visible photos
 */
export const usePhotos = (): UsePhotosReturn => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPhotos = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await photoService.fetchVisible()
      setPhotos(data)
    } catch (err) {
      console.error('Error fetching photos:', err)
      setError('Er ging iets mis bij het ophalen van de foto\'s')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPhotos()
  }, [])

  return {
    photos,
    isLoading,
    error,
    refetch: fetchPhotos
  }
}

/**
 * Hook to fetch photos by year
 */
export const usePhotosByYear = (year: number): UsePhotosReturn => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPhotos = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await photoService.fetchByYear(year)
      setPhotos(data)
    } catch (err) {
      console.error('Error fetching photos by year:', err)
      setError('Er ging iets mis bij het ophalen van de foto\'s')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPhotos()
  }, [year])

  return {
    photos,
    isLoading,
    error,
    refetch: fetchPhotos
  }
}