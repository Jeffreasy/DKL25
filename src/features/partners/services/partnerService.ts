/**
 * Partners Service
 * API service for partner operations
 */

import { createApiService } from '../../../lib/api/createApiService'
import type { Partner } from '../types'

const partnerApiService = createApiService<Partner>({
  endpoint: 'partners',
  sortBy: 'order_number',
  sortDirection: 'asc'
})

export const partnerService = {
  /**
   * Fetch all visible partners
   */
  fetchVisible: async (): Promise<Partner[]> => {
    return partnerApiService.fetchVisible()
  },

  /**
   * Fetch all partners
   */
  fetchAll: async (): Promise<Partner[]> => {
    return partnerApiService.fetchAll()
  },

  /**
   * Fetch partner by ID
   */
  fetchById: async (id: string): Promise<Partner | null> => {
    return partnerApiService.fetchById(id)
  },

  /**
   * Fetch partners by tier
   */
  fetchByTier: async (tier: string): Promise<Partner[]> => {
    return partnerApiService.fetchAll({
      filter: { tier, visible: true }
    })
  },

  /**
   * Group partners by tier
   */
  groupByTier: (partners: Partner[]): Record<string, Partner[]> => {
    return partners.reduce((acc, partner) => {
      const tier = partner.tier
      if (!acc[tier]) {
        acc[tier] = []
      }
      acc[tier].push(partner)
      return acc
    }, {} as Record<string, Partner[]>)
  }
}