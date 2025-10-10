/**
 * Partners Hook
 * React hook for fetching and managing partners
 */

import { useState, useEffect, useMemo } from 'react'
import { partnerService } from '../services/partnerService'
import type { Partner } from '../types'

interface UsePartnersReturn {
  partners: Partner[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook to fetch visible partners
 */
export const usePartners = (): UsePartnersReturn => {
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPartners = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await partnerService.fetchVisible()
      setPartners(data)
    } catch (err) {
      console.error('Error fetching partners:', err)
      setError('Er ging iets mis bij het ophalen van de partners')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(() => ({
    partners,
    isLoading,
    error,
    refetch: fetchPartners
  }), [partners, isLoading, error])
}

/**
 * Hook to fetch partners by tier
 */
export const usePartnersByTier = (tier: string): UsePartnersReturn => {
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPartners = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await partnerService.fetchByTier(tier)
      setPartners(data)
    } catch (err) {
      console.error('Error fetching partners by tier:', err)
      setError('Er ging iets mis bij het ophalen van de partners')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [tier])

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(() => ({
    partners,
    isLoading,
    error,
    refetch: fetchPartners
  }), [partners, isLoading, error])
}

/**
 * Hook to fetch and group partners by tier
 */
export const usePartnersGrouped = () => {
  const { partners, isLoading, error, refetch } = usePartners()

  // Memoize the expensive grouping operation
  const grouped = useMemo(() => partnerService.groupByTier(partners), [partners])

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(() => ({
    grouped,
    partners,
    isLoading,
    error,
    refetch
  }), [grouped, partners, isLoading, error])
}