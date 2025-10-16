/**
 * Partners Service
 * API service for partner operations using PostgREST
 */

import type { Partner } from '../types'

const POSTGREST_URL = import.meta.env.VITE_POSTGREST_URL || '/api'

export const partnerService = {
  /**
   * Fetch all visible partners
   */
  fetchVisible: async (): Promise<Partner[]> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/partners`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      throw new Error('Er ging iets mis bij het ophalen van de partners')
    }
  },

  /**
   * Fetch all partners
   */
  fetchAll: async (): Promise<Partner[]> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/partners?order=order_number.asc`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      throw new Error('Er ging iets mis bij het ophalen van alle partners')
    }
  },

  /**
   * Fetch partner by ID
   */
  fetchById: async (id: string): Promise<Partner | null> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/partners?id=eq.${id}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.length > 0 ? data[0] : null
    } catch (error) {
      return null
    }
  },

  /**
   * Fetch partners by tier
   */
  fetchByTier: async (tier: string): Promise<Partner[]> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/partners?tier=eq.${tier}&visible=eq.true&order=order_number.asc`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      throw new Error('Er ging iets mis bij het ophalen van partners per tier')
    }
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