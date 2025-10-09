/**
 * Program Feature Types
 */

import type { Database } from '../../types/supabase'
import type { OrderedEntity, VisibleEntity } from '../../types/base'

export type ProgramScheduleRow = Database['public']['Tables']['program_schedule']['Row']

export interface ProgramItem extends OrderedEntity {
  time: string
  event_description: string
  category: string | null
  icon_name: string | null
  latitude: number | null
  longitude: number | null
}

export interface ProgramFilters {
  visible?: boolean
  category?: string
  search?: string
}

export interface ProgramLocation {
  latitude: number
  longitude: number
  description: string
}