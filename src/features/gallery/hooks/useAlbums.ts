/**
 * Albums Data Hook
 * React hook for fetching albums
 */

import { useState, useEffect } from 'react'
import { albumService } from '../services/albumService'
import type { Album } from '../types'

interface UseAlbumsReturn {
  albums: Album[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook to fetch visible albums
 */
export const useAlbums = (): UseAlbumsReturn => {
  const [albums, setAlbums] = useState<Album[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAlbums = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await albumService.fetchVisible()
      setAlbums(data)
    } catch (err) {
      console.error('Error fetching albums:', err)
      setError('Er ging iets mis bij het ophalen van de albums')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAlbums()
  }, [])

  return {
    albums,
    isLoading,
    error,
    refetch: fetchAlbums
  }
}

/**
 * Hook to fetch albums with cover photos
 */
export const useAlbumsWithCovers = (): UseAlbumsReturn => {
  const [albums, setAlbums] = useState<Album[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAlbums = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await albumService.fetchWithCovers()
      setAlbums(data)
    } catch (err) {
      console.error('Error fetching albums with covers:', err)
      setError('Er ging iets mis bij het ophalen van de albums')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAlbums()
  }, [])

  return {
    albums,
    isLoading,
    error,
    refetch: fetchAlbums
  }
}

/**
 * Hook to fetch a single album with photos
 */
export const useAlbumWithPhotos = (albumId: string | null) => {
  const [album, setAlbum] = useState<Album | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAlbum = async () => {
    if (!albumId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = await albumService.fetchWithPhotos(albumId)
      setAlbum(data)
    } catch (err) {
      console.error('Error fetching album with photos:', err)
      setError('Er ging iets mis bij het ophalen van het album')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAlbum()
  }, [albumId])

  return {
    album,
    isLoading,
    error,
    refetch: fetchAlbum
  }
}