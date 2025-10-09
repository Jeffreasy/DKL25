/**
 * Partners Feature Types
 */

import type { Database } from '../../types/supabase'
import type { OrderedEntity, LogoEntity } from '../../types/base'

export type Partner = Database['public']['Tables']['partners']['Row']

export interface PartnerWithTier extends OrderedEntity, LogoEntity {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  since: string
  description: string | null
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