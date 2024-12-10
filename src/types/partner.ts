import type { Database } from './supabase'

type PartnerRow = Database['public']['Tables']['partners']['Row']

export interface Partner extends Omit<PartnerRow, 'id'> {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string | null;
  since: string;
  tier: 'bronze' | 'silver' | 'gold';
  created_at: string;
  updated_at: string;
} 