// src/styles/colors.ts
// Color tokens for consistent usage across the application

export const colorTokens = {
  // Primary brand colors
  primary: {
    base: '#ff9328',
    dark: '#e67f1c',
    light: '#ffad5c',
  },

  // Social media colors
  social: {
    facebook: '#1877F2',
    instagram: '#E4405F',
    youtube: '#FF0000',
    linkedin: '#0A66C2',
  },

  // Status colors
  status: {
    success: '#16a34a',
    warning: '#ca8a04',
    danger: '#dc2626',
    info: '#2563eb',
  }
} as const

// Tailwind class mappings for components
export const colorClasses = {
  primary: {
    bg: 'bg-primary',
    hover: 'hover:bg-primary-dark',
    text: 'text-primary',
    border: 'border-primary',
    focus: 'focus:ring-primary',
  },

  social: {
    facebook: 'hover:bg-social-facebook',
    instagram: 'hover:bg-social-instagram',
    youtube: 'hover:bg-social-youtube',
    linkedin: 'hover:bg-social-linkedin',
  }
} as const

// Type definitions
export type ColorToken = keyof typeof colorTokens
export type PrimaryColor = keyof typeof colorTokens.primary
export type SocialColor = keyof typeof colorTokens.social
export type StatusColor = keyof typeof colorTokens.status
