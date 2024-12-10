import type { Database } from '@/types/supabase';

type PhotoRow = Database['public']['Tables']['photos']['Row'];

export interface Photo extends PhotoRow {
  id: string;
  url: string;
  alt: string;
  order_number: number;
} 