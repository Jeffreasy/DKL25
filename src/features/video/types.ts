/**
 * Video Feature Types
 */

import type { Database } from '../../types/supabase'
import type { OrderedEntity, MediaEntity } from '../../types/base'

export type VideoRow = Database['public']['Tables']['videos']['Row']

export interface Video extends OrderedEntity, MediaEntity {
  video_id: string
  title: string
  description: string | null
  thumbnail_url: string | null
}

export interface VideoFilters {
  visible?: boolean
  search?: string
}

export interface VideoGalleryState {
  videos: Video[]
  currentIndex: number
  isLoading: boolean
  error: string | null
}