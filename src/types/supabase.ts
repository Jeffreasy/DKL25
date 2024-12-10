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