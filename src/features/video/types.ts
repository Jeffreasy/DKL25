/**
 * Video Feature Types
 */

import type { Video as VideoType } from '../../types/supabase'
import type { OrderedEntity, MediaEntity } from '../../types/base'

export type VideoRow = VideoType

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