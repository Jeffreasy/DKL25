/**
 * Program Service
 * API service for program schedule operations using PostgREST
 */

import type { ProgramItem } from '../types'

const POSTGREST_URL = import.meta.env.VITE_POSTGREST_URL || 'https://dklemailservice.onrender.com'

export const programService = {
  /**
   * Fetch all visible program items
   */
  fetchVisible: async (): Promise<ProgramItem[]> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/api/program-schedule`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ProgramItem[] = await response.json()
      return data
    } catch (error) {
      throw new Error('Er ging iets mis bij het ophalen van het programma')
    }
  },

  /**
   * Fetch all program items
   */
  fetchAll: async (): Promise<ProgramItem[]> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/api/program-schedule/admin`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ProgramItem[] = await response.json()
      return data
    } catch (error) {
      throw new Error('Er ging iets mis bij het ophalen van alle programma items')
    }
  },

  /**
   * Fetch program item by ID
   */
  fetchById: async (id: string): Promise<ProgramItem | null> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/api/program-schedule/${id}`)

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ProgramItem = await response.json()
      return data
    } catch (error) {
      return null
    }
  },

  /**
   * Fetch program items by category
   */
  fetchByCategory: async (category: string): Promise<ProgramItem[]> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/api/program-schedule?category=eq.${encodeURIComponent(category)}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ProgramItem[] = await response.json()
      return data
    } catch (error) {
      throw new Error('Er ging iets mis bij het ophalen van programma items per categorie')
    }
  },

  /**
   * Get program items with location data
   */
  fetchWithLocations: async (): Promise<ProgramItem[]> => {
    try {
      const response = await fetch(`${POSTGREST_URL}/api/program-schedule?latitude=not.is.null&longitude=not.is.null`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ProgramItem[] = await response.json()
      return data
    } catch (error) {
      throw new Error('Er ging iets mis bij het ophalen van programma items met locaties')
    }
  },

  /**
   * Group program items by category
   */
  groupByCategory: (items: ProgramItem[]): Record<string, ProgramItem[]> => {
    return items.reduce((acc, item) => {
      const category = item.category || 'Overig'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(item)
      return acc
    }, {} as Record<string, ProgramItem[]>)
  }
}