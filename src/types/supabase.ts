import type { TextStyling } from './shared';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      partners: {
        Row: {
          id: string
          name: string
          logo: string
          website: string | null
          description: string
          tier: 'bronze' | 'silver' | 'gold'
          since: string
          created_at: string
          updated_at: string
          visible: string
          order_number: number
        }
        Insert: {
          id: string
          name: string
          logo: string
          website?: string | null
          description: string
          tier: 'bronze' | 'silver' | 'gold'
          since: string
          created_at?: string
          updated_at?: string
          visible: string
          order_number: number
        }
        Update: {
          id?: string
          name?: string
          logo?: string
          website?: string | null
          description?: string
          tier?: 'bronze' | 'silver' | 'gold'
          since?: string
          created_at?: string
          updated_at?: string
          visible?: string
          order_number?: number
        }
      }
      photos: {
        Row: {
          id: string
          url: string
          alt: string
          order_number: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          url: string
          alt: string
          order_number: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          url?: string
          alt?: string
          order_number?: number
          created_at?: string
          updated_at?: string
        }
      }
      social_links: {
        Row: {
          id: string
          platform: string
          url: string
          bg_color_class: string
          icon_color_class: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          platform: string
          url: string
          bg_color_class: string
          icon_color_class: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform?: string
          url?: string
          bg_color_class?: string
          icon_color_class?: string
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          video_id: string
          url: string
          title: string
          description: string | null
          visible: string
          order_number: number
          created_at: string
          updated_at: string
          thumbnail_url?: string
        }
        Insert: {
          id?: string
          video_id: string
          url: string
          title: string
          description?: string | null
          visible: string
          order_number: number
          created_at?: string
          updated_at?: string
          thumbnail_url?: string
        }
        Update: {
          id?: string
          video_id?: string
          url?: string
          title?: string
          description?: string | null
          visible?: string
          order_number?: number
          created_at?: string
          updated_at?: string
          thumbnail_url?: string
        }
      }
      title_sections: {
        Row: {
          id: string
          title: string
          subtitle: string
          cta_text: string
          event_details: Array<{
            icon: string
            title: string
            description: string
          }>
          styling?: {
            title?: TextStyling;
            subtitle?: TextStyling;
            cta_text?: TextStyling;
          }
        }
        Insert: {
          id?: string
          title: string
          subtitle: string
          cta_text: string
          event_details: Array<{
            icon: string
            title: string
            description: string
          }>
          styling?: {
            title?: TextStyling;
            subtitle?: TextStyling;
            cta_text?: TextStyling;
          }
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string
          cta_text?: string
          event_details?: Array<{
            icon: string
            title: string
            description: string
          }>
          styling?: {
            title?: TextStyling;
            subtitle?: TextStyling;
            cta_text?: TextStyling;
          }
        }
      }
      social_embeds: {
        Row: {
          id: string
          platform: 'facebook' | 'instagram'
          embed_code: string
          post_url: string
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          platform: 'facebook' | 'instagram'
          embed_code: string
          post_url: string
          likes_count: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform?: 'facebook' | 'instagram'
          embed_code?: string
          post_url?: string
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      aanmeldingen: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          naam: string
          email: string
          telefoon?: string
          rol: 'Deelnemer' | 'Begeleider' | 'Vrijwilliger'
          afstand: '2.5 KM' | '6 KM' | '10 KM' | '15 KM'
          ondersteuning: 'Ja' | 'Nee' | 'Anders'
          bijzonderheden: string
          terms: boolean
          email_verzonden: boolean
          email_verzonden_op?: string
        }
        Insert: Omit<Database['public']['Tables']['aanmeldingen']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['aanmeldingen']['Row']>
      }
      contact_formulieren: {
        Row: {
          id: string;
          naam: string;
          email: string;
          bericht: string;
          privacy_akkoord: boolean;
          created_at: string;
          updated_at: string;
          email_verzonden: boolean;
          email_verzonden_op: string | null;
          status: 'nieuw' | 'in_behandeling' | 'afgehandeld';
          behandeld_door: string | null;
          behandeld_op: string | null;
          notities: string | null;
        };
        Insert: Omit<Database['public']['Tables']['contact_formulieren']['Row'], 
          'id' | 'created_at' | 'updated_at' | 'email_verzonden_op' | 'behandeld_op'>;
        Update: Partial<Database['public']['Tables']['contact_formulieren']['Row']>;
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 