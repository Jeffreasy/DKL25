// Database types for DKL Email Service
// Generated from database schema V28

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Core database types for the new schema (V28)
export interface Participant {
  id: string
  naam: string
  email: string
  telefoon: string | null
  participant_role_name: string | null
  distance_route: string | null
  status: string | null
  bijzonderheden: string | null
  terms: boolean
  notities: string | null
  steps: number
  gebruiker_id: string | null
  created_at: string
  updated_at: string
  antwoorden_count: number
}

export interface EventRegistration {
  id: string
  event_id: string
  participant_id: string
  registered_at: string
  check_in_time: string | null
  start_time: string | null
  finish_time: string | null
  tracking_status: string
  last_location_update: string | null
  total_distance: number
  steps: number
  participant_role_name: string | null
  distance_route: string | null
  status: string | null
  bijzonderheden: string | null
  terms: boolean
  notities: string | null
  antwoorden_count: number
}

// Legacy types for backward compatibility (remove after migration)
export interface Aanmelding {
  afstand: string
  bijzonderheden: string | null
  created_at: string | null
  email: string
  email_verzonden: boolean | null
  email_verzonden_op: string | null
  id: string
  naam: string
  ondersteuning: string
  rol: string
  telefoon: string | null
  terms: boolean
  updated_at: string | null
}

// Other existing types
export interface Partner {
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

export interface Photo {
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

export interface Video {
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

export interface Sponsor {
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

// Enums
export const DISTANCE_TYPES = ['2.5 KM', '6 KM', '10 KM', '15 KM'] as const
export const USER_ROLES = ['Deelnemer', 'Begeleider', 'Vrijwilliger'] as const
export const SUPPORT_TYPES = ['Ja', 'Nee', 'Anders'] as const
export const CONTACT_STATUS = ['nieuw', 'in_behandeling', 'afgehandeld'] as const

export type DistanceType = typeof DISTANCE_TYPES[number]
export type UserRole = typeof USER_ROLES[number]
export type SupportType = typeof SUPPORT_TYPES[number]
export type ContactStatus = typeof CONTACT_STATUS[number]
