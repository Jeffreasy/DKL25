/**
 * Program Service
 * API service for program schedule operations
 */

import { createApiService } from '../../../lib/api/createApiService'
import type { ProgramScheduleRow, ProgramItem } from '../types'

const programApiService = createApiService<any>({
  endpoint: 'program_schedule',
  sortBy: 'order_number',
  sortDirection: 'asc'
})

export const programService = {
  /**
   * Fetch all visible program items
   */
  fetchVisible: async (): Promise<ProgramItem[]> => {
    const data = await programApiService.fetchVisible()
    return data as ProgramItem[]
  },

  /**
   * Fetch all program items
   */
  fetchAll: async (): Promise<ProgramItem[]> => {
    const data = await programApiService.fetchAll()
    return data as ProgramItem[]
  },

  /**
   * Fetch program item by ID
   */
  fetchById: async (id: string): Promise<ProgramItem | null> => {
    const data = await programApiService.fetchById(id)
    return data as ProgramItem | null
  },

  /**
   * Fetch program items by category
   */
  fetchByCategory: async (category: string): Promise<ProgramItem[]> => {
    const data = await programApiService.fetchAll({
      filter: { category, visible: true }
    })
    return data as ProgramItem[]
  },

  /**
   * Get program items with location data
   */
  fetchWithLocations: async (): Promise<ProgramItem[]> => {
    const items = await programService.fetchVisible()
    return items.filter(item => item.latitude !== null && item.longitude !== null)
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