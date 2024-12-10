import { useState, useCallback } from 'react'
import type { Video } from '@/types/video'

export const useVideoGallery = (videos: Video[]) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const handlePrevious = useCallback(() => {
    setCurrentIndex((current) => (current === 0 ? videos.length - 1 : current - 1))
    setIsLoading(true)
  }, [videos.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((current) => (current === videos.length - 1 ? 0 : current + 1))
    setIsLoading(true)
  }, [videos.length])

  return {
    currentIndex,
    isLoading,
    setIsLoading,
    handlePrevious,
    handleNext,
    setCurrentIndex
  }
} 