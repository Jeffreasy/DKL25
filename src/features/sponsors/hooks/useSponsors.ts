/**
 * Sponsors Hook
 * React hook for fetching and managing sponsors
 */

import { useState, useEffect, useMemo } from 'react'
import { sponsorService } from '../services/sponsorService'
import type { SponsorRow } from '../types'

interface UseSponsorsReturn {
  sponsors: SponsorRow[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook to fetch active sponsors (visible and is_active)
 */
export const useSponsors = (): UseSponsorsReturn => {
  const [sponsors, setSponsors] = useState<SponsorRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSponsors = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await sponsorService.fetchActive()
      setSponsors(data)
    } catch (err) {
      console.error('Error fetching sponsors:', err)
      setError('Er ging iets mis bij het ophalen van de sponsors')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSponsors()
  }, [])

  return {
    sponsors,
    isLoading,
    error,
    refetch: fetchSponsors
  }
}

/**
 * Hook to fetch all visible sponsors (including inactive)
 */
export const useVisibleSponsors = (): UseSponsorsReturn => {
  const [sponsors, setSponsors] = useState<SponsorRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSponsors = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await sponsorService.fetchVisible()
      setSponsors(data)
    } catch (err) {
      console.error('Error fetching visible sponsors:', err)
      setError('Er ging iets mis bij het ophalen van de sponsors')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSponsors()
  }, [])

  return {
    sponsors,
    isLoading,
    error,
    refetch: fetchSponsors
  }
}