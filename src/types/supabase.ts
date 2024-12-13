export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface ContactBericht {
  id: string;
  naam: string;
  email: string;
  telefoon: string | null;
  bericht: string;
  aangemaakt_op: string;
  status: 'ongelezen' | 'gelezen' | 'beantwoord';
  gearchiveerd: boolean;
}

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
      contact_berichten: {
        Row: ContactBericht;
        Insert: Omit<ContactBericht, 'id' | 'aangemaakt_op' | 'status' | 'gearchiveerd'>;
        Update: Partial<Omit<ContactBericht, 'id' | 'aangemaakt_op'>>;
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