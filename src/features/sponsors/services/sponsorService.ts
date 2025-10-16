/**
 * Sponsors Service
 * API service for sponsor operations using PostgREST
 */

import type { SponsorRow } from '../types'

const POSTGREST_URL = import.meta.env.VITE_POSTGREST_URL || '/api'

export const sponsorService = {
  /**
   * Fetch all visible and active sponsors
   */
  fetchActive: async (): Promise<SponsorRow[]> => {
    try {
      console.log('Fetching active sponsors from:', `${POSTGREST_URL}/sponsors`)

      const response = await fetch(`${POSTGREST_URL}/sponsors`)

      if (!response.ok) {
        console.error('HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: SponsorRow[] = await response.json()
      console.log('Fetched active sponsors:', data)

      // Filter for active sponsors only
      return data.filter(sponsor => sponsor.is_active === true)
    } catch (error) {
      console.error('Error fetching active sponsors:', error)
      throw new Error('Er ging iets mis bij het ophalen van de actieve sponsors')
    }
  },

  /**
   * Fetch all visible sponsors (active or inactive)
   */
  fetchVisible: async (): Promise<SponsorRow[]> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/api/sponsors`)

      if (!response.ok) {
        console.error('HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: SponsorRow[] = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching visible sponsors:', error)
      throw new Error('Er ging iets mis bij het ophalen van de zichtbare sponsors')
    }
  },

  /**
   * Fetch all sponsors
   */
  fetchAll: async (): Promise<SponsorRow[]> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/api/sponsors/admin`)

      if (!response.ok) {
        console.error('HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: SponsorRow[] = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching all sponsors:', error)
      throw new Error('Er ging iets mis bij het ophalen van alle sponsors')
    }
  },

  /**
   * Fetch sponsor by ID
   */
  fetchById: async (id: string): Promise<SponsorRow | null> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/api/sponsors/${id}`)

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        console.error('HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: SponsorRow = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching sponsor by ID:', error)
      return null
    }
  },

  /**
   * Transform SponsorRow to Sponsor type for components
   */
  transformToSponsor: (sponsorRow: SponsorRow): import('../types').Sponsor => {
    return {
      ...sponsorRow,
      logo: sponsorRow.logo_url,
      website: sponsorRow.website_url || undefined,
      visible: sponsorRow.visible ?? true
    }
  }
}