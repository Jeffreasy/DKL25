import type { Database } from '@/types/supabase';

type PhotoRow = Database['public']['Tables']['photos']['Row'];

export interface Photo extends PhotoRow {
  id: string;
  url: string;
  thumbnail_url?: string;
  alt_text: string;
  visible: boolean;
  order_number: number;
  created_at: string;
  updated_at: string;
  title?: string;
  description?: string;
  year?: string;
  album_id?: string;
} 