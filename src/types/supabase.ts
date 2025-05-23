export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      aanmeldingen: {
        Row: {
          afstand: Database["public"]["Enums"]["distance_type"]
          bijzonderheden: string | null
          created_at: string | null
          email: string
          email_verzonden: boolean | null
          email_verzonden_op: string | null
          id: string
          naam: string
          ondersteuning: Database["public"]["Enums"]["support_type"]
          rol: Database["public"]["Enums"]["user_role"]
          telefoon: string | null
          terms: boolean
          updated_at: string | null
        }
        Insert: {
          afstand: Database["public"]["Enums"]["distance_type"]
          bijzonderheden?: string | null
          created_at?: string | null
          email: string
          email_verzonden?: boolean | null
          email_verzonden_op?: string | null
          id?: string
          naam: string
          ondersteuning?: Database["public"]["Enums"]["support_type"]
          rol: Database["public"]["Enums"]["user_role"]
          telefoon?: string | null
          terms?: boolean
          updated_at?: string | null
        }
        Update: {
          afstand?: Database["public"]["Enums"]["distance_type"]
          bijzonderheden?: string | null
          created_at?: string | null
          email?: string
          email_verzonden?: boolean | null
          email_verzonden_op?: string | null
          id?: string
          naam?: string
          ondersteuning?: Database["public"]["Enums"]["support_type"]
          rol?: Database["public"]["Enums"]["user_role"]
          telefoon?: string | null
          terms?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      album_photos: {
        Row: {
          album_id: string | null
          created_at: string | null
          id: string
          order_number: number | null
          photo_id: string | null
        }
        Insert: {
          album_id?: string | null
          created_at?: string | null
          id?: string
          order_number?: number | null
          photo_id?: string | null
        }
        Update: {
          album_id?: string | null
          created_at?: string | null
          id?: string
          order_number?: number | null
          photo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "album_photos_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "album_photos_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
        ]
      }
      albums: {
        Row: {
          cover_photo_id: string | null
          created_at: string | null
          description: string | null
          id: string
          order_number: number | null
          title: string
          updated_at: string | null
          visible: boolean | null
        }
        Insert: {
          cover_photo_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          order_number?: number | null
          title: string
          updated_at?: string | null
          visible?: boolean | null
        }
        Update: {
          cover_photo_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          order_number?: number | null
          title?: string
          updated_at?: string | null
          visible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "albums_cover_photo_id_fkey"
            columns: ["cover_photo_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_formulieren: {
        Row: {
          behandeld_door: string | null
          behandeld_op: string | null
          bericht: string
          created_at: string
          email: string
          email_verzonden: boolean | null
          email_verzonden_op: string | null
          id: string
          naam: string
          notities: string | null
          privacy_akkoord: boolean | null
          status: Database["public"]["Enums"]["contact_status"] | null
          updated_at: string
        }
        Insert: {
          behandeld_door?: string | null
          behandeld_op?: string | null
          bericht: string
          created_at?: string
          email: string
          email_verzonden?: boolean | null
          email_verzonden_op?: string | null
          id?: string
          naam: string
          notities?: string | null
          privacy_akkoord?: boolean | null
          status?: Database["public"]["Enums"]["contact_status"] | null
          updated_at?: string
        }
        Update: {
          behandeld_door?: string | null
          behandeld_op?: string | null
          bericht?: string
          created_at?: string
          email?: string
          email_verzonden?: boolean | null
          email_verzonden_op?: string | null
          id?: string
          naam?: string
          notities?: string | null
          privacy_akkoord?: boolean | null
          status?: Database["public"]["Enums"]["contact_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
      email_events: {
        Row: {
          created_at: string | null
          email_id: string
          event_type: string
          from_email: string
          id: string
          metadata: Json | null
          subject: string
          timestamp: string
          to_email: string
        }
        Insert: {
          created_at?: string | null
          email_id: string
          event_type: string
          from_email: string
          id?: string
          metadata?: Json | null
          subject: string
          timestamp?: string
          to_email: string
        }
        Update: {
          created_at?: string | null
          email_id?: string
          event_type?: string
          from_email?: string
          id?: string
          metadata?: Json | null
          subject?: string
          timestamp?: string
          to_email?: string
        }
        Relationships: []
      }
      emails: {
        Row: {
          account: string
          body: string | null
          created_at: string
          created_at_system: string | null
          html: string | null
          id: string
          message_id: string
          metadata: Json | null
          read: boolean | null
          sender: string
          subject: string
        }
        Insert: {
          account: string
          body?: string | null
          created_at: string
          created_at_system?: string | null
          html?: string | null
          id?: string
          message_id: string
          metadata?: Json | null
          read?: boolean | null
          sender: string
          subject: string
        }
        Update: {
          account?: string
          body?: string | null
          created_at?: string
          created_at_system?: string | null
          html?: string | null
          id?: string
          message_id?: string
          metadata?: Json | null
          read?: boolean | null
          sender?: string
          subject?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo: string | null
          name: string
          order_number: number
          since: string
          tier: string
          updated_at: string
          visible: boolean
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo?: string | null
          name: string
          order_number?: number
          since?: string
          tier: string
          updated_at?: string
          visible?: boolean
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo?: string | null
          name?: string
          order_number?: number
          since?: string
          tier?: string
          updated_at?: string
          visible?: boolean
          website?: string | null
        }
        Relationships: []
      }
      photos: {
        Row: {
          alt_text: string
          cloudinary_folder: string | null
          created_at: string
          description: string | null
          id: string
          thumbnail_url: string | null
          title: string | null
          updated_at: string
          url: string
          visible: boolean
          year: number | null
        }
        Insert: {
          alt_text: string
          cloudinary_folder?: string | null
          created_at?: string
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          url: string
          visible?: boolean
          year?: number | null
        }
        Update: {
          alt_text?: string
          cloudinary_folder?: string | null
          created_at?: string
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          url?: string
          visible?: boolean
          year?: number | null
        }
        Relationships: []
      }
      program_schedule: {
        Row: {
          category: string | null
          created_at: string
          event_description: string
          icon_name: string | null
          id: string
          latitude: number | null
          longitude: number | null
          order_number: number
          time: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          category?: string | null
          created_at?: string
          event_description: string
          icon_name?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          order_number: number
          time: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          category?: string | null
          created_at?: string
          event_description?: string
          icon_name?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          order_number?: number
          time?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      radio_recordings: {
        Row: {
          audio_url: string
          created_at: string
          date: string | null
          description: string | null
          id: string
          order_number: number
          thumbnail_url: string | null
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          audio_url: string
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          order_number: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          audio_url?: string
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          order_number?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      social_embeds: {
        Row: {
          created_at: string
          embed_code: string
          id: string
          order_number: number | null
          platform: string
          updated_at: string
          visible: boolean | null
        }
        Insert: {
          created_at?: string
          embed_code: string
          id?: string
          order_number?: number | null
          platform: string
          updated_at?: string
          visible?: boolean | null
        }
        Update: {
          created_at?: string
          embed_code?: string
          id?: string
          order_number?: number | null
          platform?: string
          updated_at?: string
          visible?: boolean | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          bg_color_class: string | null
          created_at: string
          icon_color_class: string | null
          id: string
          order_number: number | null
          platform: string
          updated_at: string
          url: string
          visible: boolean | null
        }
        Insert: {
          bg_color_class?: string | null
          created_at?: string
          icon_color_class?: string | null
          id?: string
          order_number?: number | null
          platform: string
          updated_at?: string
          url: string
          visible?: boolean | null
        }
        Update: {
          bg_color_class?: string | null
          created_at?: string
          icon_color_class?: string | null
          id?: string
          order_number?: number | null
          platform?: string
          updated_at?: string
          url?: string
          visible?: boolean | null
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          logo_url: string
          name: string
          order_number: number
          updated_at: string
          visible: boolean | null
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: string
          is_active?: boolean
          logo_url: string
          name: string
          order_number?: number
          updated_at?: string
          visible?: boolean | null
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string
          name?: string
          order_number?: number
          updated_at?: string
          visible?: boolean | null
          website_url?: string | null
        }
        Relationships: []
      }
      title_section_content: {
        Row: {
          created_at: string
          detail_1_description: string | null
          detail_1_title: string | null
          detail_2_description: string | null
          detail_2_title: string | null
          detail_3_description: string | null
          detail_3_title: string | null
          event_subtitle: string | null
          event_title: string
          id: number
          image_alt: string | null
          image_url: string | null
          participant_count: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          detail_1_description?: string | null
          detail_1_title?: string | null
          detail_2_description?: string | null
          detail_2_title?: string | null
          detail_3_description?: string | null
          detail_3_title?: string | null
          event_subtitle?: string | null
          event_title: string
          id?: number
          image_alt?: string | null
          image_url?: string | null
          participant_count?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          detail_1_description?: string | null
          detail_1_title?: string | null
          detail_2_description?: string | null
          detail_2_title?: string | null
          detail_3_description?: string | null
          detail_3_title?: string | null
          event_subtitle?: string | null
          event_title?: string
          id?: number
          image_alt?: string | null
          image_url?: string | null
          participant_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      title_sections: {
        Row: {
          created_at: string
          cta_text: string
          event_details: Json
          id: string
          image_url: string
          styling: Json | null
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_text: string
          event_details?: Json
          id?: string
          image_url: string
          styling?: Json | null
          subtitle: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_text?: string
          event_details?: Json
          id?: string
          image_url?: string
          styling?: Json | null
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_number: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          url: string
          video_id: string
          visible: boolean | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_number?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          url: string
          video_id: string
          visible?: boolean | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_number?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          url?: string
          video_id?: string
          visible?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_email_events: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_participant_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      reorder_partners: {
        Args: { ordered_ids: string[] }
        Returns: undefined
      }
    }
    Enums: {
      contact_status: "nieuw" | "in_behandeling" | "afgehandeld"
      distance_type: "2.5 KM" | "6 KM" | "10 KM" | "15 KM"
      email_account: "info" | "inschrijving"
      support_type: "Ja" | "Nee" | "Anders"
      user_role: "Deelnemer" | "Begeleider" | "Vrijwilliger"
    }
    CompositeTypes: {
      section_styling: {
        title: Database["public"]["CompositeTypes"]["text_styling"] | null
        subtitle: Database["public"]["CompositeTypes"]["text_styling"] | null
        cta_text: Database["public"]["CompositeTypes"]["text_styling"] | null
      }
      text_styling: {
        fontsize: string | null
        fontweight: string | null
        textalign: string | null
        color: string | null
        lineheight: string | null
        letterspacing: string | null
      }
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      contact_status: ["nieuw", "in_behandeling", "afgehandeld"],
      distance_type: ["2.5 KM", "6 KM", "10 KM", "15 KM"],
      email_account: ["info", "inschrijving"],
      support_type: ["Ja", "Nee", "Anders"],
      user_role: ["Deelnemer", "Begeleider", "Vrijwilliger"],
    },
  },
} as const
