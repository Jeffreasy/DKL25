/**
 * Application Constants
 * Centralized configuration values
 */

/**
 * Event information
 */
export const EVENT_INFO = {
  name: 'De Kerstloop Leiderdorp',
  shortName: 'DKL',
  year: 2026,
  edition: 25,
  date: '2026-05-16',
  location: 'Leiderdorp',
  organizer: 'Stichting De Kerstloop Leiderdorp'
} as const

/**
 * Contact information
 */
export const CONTACT_INFO = {
  email: 'info@dekerstloop.nl',
  registrationEmail: 'inschrijving@dekerstloop.nl',
  phone: '+31 6 12345678',
  address: {
    street: 'Voorstraat 1',
    postalCode: '2351 AA',
    city: 'Leiderdorp',
    country: 'Nederland'
  }
} as const

/**
 * Social media links
 */
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/dekerstloop',
  instagram: 'https://www.instagram.com/dekerstloop',
  twitter: 'https://twitter.com/dekerstloop',
  youtube: 'https://www.youtube.com/@dekerstloop'
} as const

/**
 * Distance options for registration
 */
export const DISTANCES = ['2.5 KM', '6 KM', '10 KM', '15 KM'] as const

/**
 * User roles
 */
export const USER_ROLES = ['Deelnemer', 'Begeleider', 'Vrijwilliger'] as const

/**
 * Support types
 */
export const SUPPORT_TYPES = ['Ja', 'Nee', 'Anders'] as const

/**
 * Partner tiers
 */
export const PARTNER_TIERS = {
  bronze: 'Brons',
  silver: 'Zilver',
  gold: 'Goud',
  platinum: 'Platina'
} as const

/**
 * API Configuration
 */
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://dklemailservice.onrender.com',
  timeout: 5000
} as const

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  registration: '/api/aanmeldingen',
  contact: '/api/contact',
  partners: '/api/partners',
  sponsors: '/api/sponsors',
  photos: '/api/photos',
  videos: '/api/videos',
  program: '/api/program',
  radio: '/api/radio',
  underConstruction: '/api/under-construction/active'
} as const

/**
 * File upload limits
 */
export const UPLOAD_LIMITS = {
  maxImageSize: 5 * 1024 * 1024, // 5MB
  maxVideoSize: 50 * 1024 * 1024, // 50MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedVideoTypes: ['video/mp4', 'video/webm']
} as const

/**
 * Pagination defaults
 */
export const PAGINATION = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100]
} as const

/**
 * Animation durations (ms)
 */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500
} as const

/**
 * Breakpoints (matches Tailwind)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const

/**
 * Z-index layers
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070
} as const

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  theme: 'dkl_theme',
  language: 'dkl_language',
  cookieConsent: 'dkl_cookie_consent',
  userPreferences: 'dkl_user_preferences'
} as const

/**
 * Feature flags
 */
export const FEATURES = {
  enableRegistration: true,
  enableDonations: true,
  enableChat: true,
  enableAnalytics: true,
  enableNewsletter: true
} as const

/**
 * SEO defaults
 */
export const SEO_DEFAULTS = {
  title: 'De Koninklijke Loop 2026',
  description: 'De Koninklijke Loop 2026 is een uniek sponsorloop in Nederland, mede georganiseerd door mensen met een beperking voor mensen met een beperking. Schrijf je in, steun het goede doel en ervaar een onvergetelijke dag!',
  keywords: ['DKL', 'De Koninklijke Loop', 'Koninklijke Loop', 'wandelevenement', '2026'],
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image'
} as const