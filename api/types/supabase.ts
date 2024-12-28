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
          bijzonderheden?: string
          terms: boolean
          email_verzonden: boolean
          email_verzonden_op?: string | null
        }
        Insert: Omit<Database['public']['Tables']['aanmeldingen']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['aanmeldingen']['Row']>
      }
      // Andere tabellen kunnen weggelaten worden voor de API
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