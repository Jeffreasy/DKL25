/**
 * Video Gallery Hook
 * React hook for fetching and managing video gallery
 */

import { useState, useEffect, useCallback } from 'react'
import { videoService } from '../services/videoService'
import type { Video } from '../types'

interface UseVideoGalleryReturn {
  videos: Video[]
  currentIndex: number
  isLoading: boolean
  error: string | null
  handlePrevious: () => void
  handleNext: () => void
  setCurrentIndex: (index: number) => void
  refetch: () => Promise<void>
}

/**
 * Hook to fetch and manage video gallery
 */
export const useVideoGallery = (): UseVideoGalleryReturn => {
  const [videos, setVideos] = useState<Video[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVideos = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const data = await videoService.fetchVisible()

      if (!data || data.length === 0) {
        setError('Geen videos beschikbaar')
        return
      }

      setVideos(data)
    } catch (err) {
      console.error('Error fetching videos:', err)
      setError('Er ging iets mis bij het ophalen van de videos. Probeer het later opnieuw.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const handlePrevious = useCallback(() => {
    if (videos.length <= 1) return
    setCurrentIndex(prev => (prev === 0 ? videos.length - 1 : prev - 1))
  }, [videos.length])

  const handleNext = useCallback(() => {
    if (videos.length <= 1) return
    setCurrentIndex(prev => (prev === videos.length - 1 ? 0 : prev + 1))
  }, [videos.length])

  return {
    videos,
    currentIndex,
    isLoading,
    error,
    handlePrevious,
    handleNext,
    setCurrentIndex,
    refetch: fetchVideos
  }
}

/**
 * Hook to fetch all videos (including hidden)
 */
export const useAllVideos = () => {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVideos = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await videoService.fetchAll()
      setVideos(data)
    } catch (err) {
      console.error('Error fetching all videos:', err)
      setError('Er ging iets mis bij het ophalen van de videos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  return {
    videos,
    isLoading,
    error,
    refetch: fetchVideos
  }
}