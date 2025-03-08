// types.ts
import { TextStyling } from '@/types/shared';
import type { Database } from '@/types/supabase';

export type TitleSectionRow = {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  image_url: string;
  event_details: EventDetail[];
  styling?: {
    title?: TextStyling;
    subtitle?: TextStyling;
    cta_text?: TextStyling;
  };
};

export interface SocialEmbedRow {
  id: string;
  platform: 'facebook' | 'instagram';
  embed_code: string;
  order_number: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventDetail {
  icon: string;
  title: string;
  description: string;
}
