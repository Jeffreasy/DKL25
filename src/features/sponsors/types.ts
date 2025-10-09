/**
 * Sponsors Feature Types
 */

import type { Database } from '../../types/supabase'
import type { OrderedEntity, LogoEntity } from '../../types/base'

export type SponsorRow = Database['public']['Tables']['sponsors']['Row']

export interface Sponsor extends OrderedEntity, LogoEntity {
  description: string | null
  is_active: boolean
  logo_url: string
  website_url: string | null
}

export interface SponsorFilters {
  visible?: boolean
  is_active?: boolean
  search?: string
}