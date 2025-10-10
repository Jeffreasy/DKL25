/**
 * Program Schedule Hook
 * React hook for fetching and managing program schedule
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { programService } from '../services/programService'
import { trackEvent } from '../../../utils/googleAnalytics'
import type { ProgramItem } from '../types'

interface UseProgramScheduleReturn {
  scheduleItems: ProgramItem[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook to fetch visible program schedule items
 */
export const useProgramSchedule = (): UseProgramScheduleReturn => {
  const [scheduleItems, setScheduleItems] = useState<ProgramItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSchedule = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await programService.fetchVisible()
      setScheduleItems(data)
      trackEvent('program_section', 'loaded', `count:${data.length}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kon het programma niet laden.'
      console.error('Error fetching program schedule:', err)
      setError(errorMessage)
      setScheduleItems([])
      trackEvent('program_section', 'error', 'fetch_failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSchedule()
  }, [fetchSchedule])

  return {
    scheduleItems,
    isLoading,
    error,
    refetch: fetchSchedule
  }
}

/**
 * Hook to fetch program items by category
 */
export const useProgramByCategory = (category: string): UseProgramScheduleReturn => {
  const [scheduleItems, setScheduleItems] = useState<ProgramItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSchedule = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await programService.fetchByCategory(category)
      setScheduleItems(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kon het programma niet laden.'
      console.error('Error fetching program by category:', err)
      setError(errorMessage)
      setScheduleItems([])
    } finally {
      setIsLoading(false)
    }
  }, [category])

  useEffect(() => {
    fetchSchedule()
  }, [fetchSchedule])

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(() => ({
    scheduleItems,
    isLoading,
    error,
    refetch: fetchSchedule
  }), [scheduleItems, isLoading, error])
}

/**
 * Hook to fetch program items with locations
 */
export const useProgramWithLocations = (): UseProgramScheduleReturn => {
  const [scheduleItems, setScheduleItems] = useState<ProgramItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSchedule = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await programService.fetchWithLocations()
      setScheduleItems(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kon het programma niet laden.'
      console.error('Error fetching program with locations:', err)
      setError(errorMessage)
      setScheduleItems([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSchedule()
  }, [fetchSchedule])

  return {
    scheduleItems,
    isLoading,
    error,
    refetch: fetchSchedule
  }
}

/**
 * Hook to fetch and group program items by category
 */
export const useProgramGrouped = () => {
  const { scheduleItems, isLoading, error, refetch } = useProgramSchedule()
  const grouped = programService.groupByCategory(scheduleItems)

  return {
    grouped,
    scheduleItems,
    isLoading,
    error,
    refetch
  }
}