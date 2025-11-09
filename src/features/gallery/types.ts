/**
 * Gallery Feature Types
 */

import type { Photo as PhotoType } from '../../types/supabase'
import type { OrderedEntity, MediaEntity, VisibleEntity } from '../../types/base'

export type PhotoRow = PhotoType
export type AlbumRow = {
  id: string
  title: string
  description: string | null
  cover_photo_id: string | null
  visible: boolean | null
  order_number: number | null
  created_at: string | null
  updated_at: string | null
}
export type AlbumPhotoRow = {
  id: string
  album_id: string | null
  photo_id: string | null
  order_number: number | null
  created_at: string | null
}

export interface Photo extends VisibleEntity, MediaEntity {
  alt_text: string
  thumbnail_url: string | null
  title: string | null
  description: string | null
  year: number | null
  cloudinary_folder: string | null
}

export interface Album extends OrderedEntity {
  title: string
  description: string | null
  cover_photo_id: string | null
  cover_photo?: Photo
  photos?: Photo[]
  photo_count?: number
}

export interface AlbumPhoto {
  id: string
  album_id: string | null
  photo_id: string | null
  order_number: number | null
  created_at: string | null
}

export interface GalleryState {
  currentIndex: number
  isAnimating: boolean
  isAutoPlaying: boolean
  touchStart: number | null
}

export interface GalleryFilters {
  visible?: boolean
  year?: number
  album_id?: string
  search?: string
}