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

// Type for the new title_section_content table data
export interface TitleSectionData {
  id: string;
  event_title: string;
  event_subtitle: string | null;
  image_url: string | null;
  image_alt: string | null;
  detail_1_title: string | null;
  detail_1_description: string | null;
  detail_2_title: string | null;
  detail_2_description: string | null;
  detail_3_title: string | null;
  detail_3_description: string | null;
  participant_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface EventDetail {
  date?: string;
  targetAudience?: string;
  goal?: string;
}
