import { useState, useEffect, useCallback } from 'react'

export const useVideoNavigation = (totalVideos: number) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? totalVideos - 1 : prev - 1))
  }, [totalVideos])

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev === totalVideos - 1 ? 0 : prev + 1))
  }, [totalVideos])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrevious])

  return {
    currentIndex,
    setCurrentIndex,
    handlePrevious,
    handleNext
  }
} 