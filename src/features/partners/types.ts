/**
 * Partners Feature Types
 */

import type { OrderedEntity, LogoEntity } from '../../types/base'

export interface PartnerWithTier extends OrderedEntity, LogoEntity {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  since: string
  description: string | null
  website: string | null
}

export interface PartnerGroup {
  tier: string
  partners: Partner[]
}

export interface PartnerFilters {
  tier?: string
  visible?: boolean
  search?: string
}

// Re-export for backward compatibility
export type { Partner as PartnerType } from '../../types/supabase'
export type Partner = PartnerWithTier