/**
 * Program Feature Types
 */

import type { OrderedEntity, VisibleEntity } from '../../types/base'

export type ProgramScheduleRow = {
  id: string
  time: string
  event_description: string
  category: string | null
  icon_name: string | null
  latitude: number | null
  longitude: number | null
  order_number: number
  created_at: string
  updated_at: string
  visible: boolean
}

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