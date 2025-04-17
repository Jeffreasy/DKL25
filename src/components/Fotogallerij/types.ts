import type { Database } from '@/types/supabase';

type PhotoRow = Database['public']['Tables']['photos']['Row'];
type AlbumRow = Database['public']['Tables']['albums']['Row'];

export interface Photo {
  id: string;
  url: string;
  thumbnail_url: string | null;
  alt_text: string;
  visible: boolean;
  order_number: number;
  created_at: string;
  updated_at: string;
  title: string | null;
  description: string | null;
  year: number | null;
  album_id: string | null;
}

export interface Album {
  id: string;
  title: string;
  description: string | null;
  cover_photo_id: string | null;
  visible: boolean | null;
  order_number: number | null;
  created_at: string | null;
  updated_at: string | null;
} 