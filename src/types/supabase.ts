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