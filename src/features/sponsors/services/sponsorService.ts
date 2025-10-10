/**
 * Sponsors Service
 * API service for sponsor operations
 */

import { createApiService } from '../../../lib/api/createApiService'
import type { SponsorRow } from '../types'

const sponsorApiService = createApiService<SponsorRow>({
  endpoint: 'sponsors',
  sortBy: 'order_number',
  sortDirection: 'asc'
})

export const sponsorService = {
  /**
   * Fetch all visible and active sponsors
   */
  fetchActive: async (): Promise<SponsorRow[]> => {
    const data = await sponsorApiService.fetchAll({
      filter: { visible: true, is_active: true }
    })
    return data
  },

  /**
   * Fetch all visible sponsors (active or inactive)
   */
  fetchVisible: async (): Promise<SponsorRow[]> => {
    return sponsorApiService.fetchVisible()
  },

  /**
   * Fetch all sponsors
   */
  fetchAll: async (): Promise<SponsorRow[]> => {
    return sponsorApiService.fetchAll()
  },

  /**
   * Fetch sponsor by ID
   */
  fetchById: async (id: string): Promise<SponsorRow | null> => {
    return sponsorApiService.fetchById(id)
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