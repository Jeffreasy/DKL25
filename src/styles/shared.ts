/**
 * Shared Style Utilities
 * Reusable Tailwind class combinations and color utilities
 */

/**
 * Color utilities
 * Centralized color classes for consistent theming
 */
export const colors = {
  // Primary brand colors
  primary: {
    bg: 'bg-primary',
    bgDark: 'bg-primary-dark',
    bgLight: 'bg-primary-light',
    text: 'text-primary',
    textDark: 'text-primary-dark',
    textLight: 'text-primary-light',
    border: 'border-primary',
    borderDark: 'border-primary-dark',
    hover: 'hover:bg-primary-dark',
    focus: 'focus:ring-primary',
    focusRing: 'focus:ring-2 focus:ring-primary focus:ring-offset-2',
  },

  // Secondary brand colors
  secondary: {
    bg: 'bg-secondary',
    bgDark: 'bg-secondary-dark',
    bgLight: 'bg-secondary-light',
    text: 'text-secondary',
    textDark: 'text-secondary-dark',
    textLight: 'text-secondary-light',
    border: 'border-secondary',
    borderDark: 'border-secondary-dark',
    hover: 'hover:bg-secondary-dark',
    focus: 'focus:ring-secondary',
    focusRing: 'focus:ring-2 focus:ring-secondary focus:ring-offset-2',
  },
  
  // Social media colors
  social: {
    facebook: {
      bg: 'bg-social-facebook',
      hover: 'hover:bg-social-facebook',
      text: 'text-social-facebook',
    },
    instagram: {
      bg: 'bg-social-instagram',
      hover: 'hover:bg-social-instagram',
      text: 'text-social-instagram',
    },
    youtube: {
      bg: 'bg-social-youtube',
      hover: 'hover:bg-social-youtube',
      text: 'text-social-youtube',
    },
    linkedin: {
      bg: 'bg-social-linkedin',
      hover: 'hover:bg-social-linkedin',
      text: 'text-social-linkedin',
    },
  },

  // Neutral colors
  neutral: {
    white: 'bg-white',
    black: 'bg-black',
    gray: {
      50: 'bg-gray-50',
      100: 'bg-gray-100',
      200: 'bg-gray-200',
      300: 'bg-gray-300',
      400: 'bg-gray-400',
      500: 'bg-gray-500',
      600: 'bg-gray-600',
      700: 'bg-gray-700',
      800: 'bg-gray-800',
      900: 'bg-gray-900',
    },
  },

  // Status colors
  status: {
    success: {
      bg: 'bg-green-600',
      text: 'text-green-600',
      border: 'border-green-600',
    },
    warning: {
      bg: 'bg-yellow-600',
      text: 'text-yellow-600',
      border: 'border-yellow-600',
    },
    danger: {
      bg: 'bg-red-600',
      text: 'text-red-600',
      border: 'border-red-600',
    },
    info: {
      bg: 'bg-blue-600',
      text: 'text-blue-600',
      border: 'border-blue-600',
    },
  },

  // Gradient backgrounds
  gradient: {
    construction: 'bg-gradient-to-br from-blue-50 via-white to-indigo-50',
    footer: 'bg-gradient-to-br from-primary to-primary-dark',
  },
} as const

/**
 * Common class combinations (cc)
 */
export const cc = {
  // Grid layouts
  grid: {
    responsive: (options?: { cols?: 'photos' | 'videos' | 'cards' | 'default' }) => {
      const colsMap = {
        photos: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6',
        videos: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        cards: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        default: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }
      const cols = colsMap[options?.cols || 'default']
      return `grid ${cols} gap-4`
    },
    base: 'grid gap-4'
  },

  // Flex layouts
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
    col: 'flex flex-col',
    colCenter: 'flex flex-col items-center justify-center',
    wrap: 'flex flex-wrap'
  },

  // Buttons
  button: {
    primary: 'bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200',
    secondary: 'bg-secondary hover:bg-secondary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200',
    ghost: 'text-primary hover:bg-primary/10 font-semibold py-2 px-6 rounded-lg transition-colors duration-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200',
    disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed py-2 px-6 rounded-lg'
  },

  // Cards
  card: {
    base: 'bg-white rounded-lg shadow-md overflow-hidden',
    hover: 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300',
    bordered: 'bg-white rounded-lg border border-gray-200 overflow-hidden',
    elevated: 'bg-white rounded-lg shadow-lg overflow-hidden'
  },

  // Inputs
  input: {
    base: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
    error: 'w-full px-4 py-2 border border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500',
    disabled: 'w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed'
  },

  // Text
  text: {
    h1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
    h2: 'text-3xl md:text-4xl lg:text-5xl font-bold',
    h3: 'text-2xl md:text-3xl lg:text-4xl font-bold',
    h4: 'text-xl md:text-2xl lg:text-3xl font-semibold',
    h5: 'text-lg md:text-xl lg:text-2xl font-semibold',
    body: 'text-base leading-relaxed',
    small: 'text-sm',
    muted: 'text-gray-600',
    error: 'text-red-600 text-sm'
  },

  // Containers
  container: {
    base: 'container mx-auto px-4',
    narrow: 'container mx-auto px-4 max-w-4xl',
    wide: 'container mx-auto px-4 max-w-7xl',
    section: 'py-12 md:py-16 lg:py-20'
  },

  // Modals
  modal: {
    overlay: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4',
    content: 'bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto',
    header: 'px-6 py-4 border-b border-gray-200',
    body: 'px-6 py-4',
    footer: 'px-6 py-4 border-t border-gray-200 flex justify-end gap-2'
  },

  // Loading states
  loading: {
    spinner: 'animate-spin rounded-full border-4 border-gray-200 border-t-primary',
    skeleton: 'animate-pulse bg-gray-200 rounded',
    overlay: 'absolute inset-0 bg-white/80 flex items-center justify-center'
  },

  // Transitions
  transition: {
    base: 'transition-all duration-300',
    fast: 'transition-all duration-150',
    slow: 'transition-all duration-500',
    colors: 'transition-colors duration-200',
    transform: 'transition-transform duration-300'
  },

  // Spacing
  spacing: {
    section: 'py-12 md:py-16 lg:py-20',
    component: 'py-8 md:py-12',
    element: 'py-4 md:py-6'
  },

  // Shadows
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    inner: 'shadow-inner',
    none: 'shadow-none'
  },

  // Borders
  border: {
    base: 'border border-gray-200',
    thick: 'border-2 border-gray-300',
    primary: 'border-2 border-primary',
    rounded: 'rounded-lg',
    circle: 'rounded-full'
  },

  // Overlays
  overlay: {
    dark: 'absolute inset-0 bg-black/50',
    light: 'absolute inset-0 bg-white/50',
    gradient: 'absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'
  },

  // Typography
  typography: {
    heading: 'font-heading',
    body: 'font-body',
    link: 'text-primary hover:text-primary-dark underline transition-colors',
    linkExternal: 'text-primary hover:text-primary-dark underline transition-colors inline-flex items-center gap-1',
    truncate: 'truncate',
    ellipsis: 'overflow-hidden text-ellipsis',
    uppercase: 'uppercase tracking-wide',
    capitalize: 'capitalize',
  },

  // Z-index layers
  zIndex: {
    base: 'z-0',
    dropdown: 'z-10',
    sticky: 'z-20',
    fixed: 'z-30',
    modalBackdrop: 'z-40',
    modal: 'z-50',
    popover: 'z-60',
    tooltip: 'z-70',
    notification: 'z-80',
    max: 'z-[100]',
  },

  // Tables
  table: {
    base: 'w-full border-collapse',
    striped: 'even:bg-gray-50',
    hover: 'hover:bg-gray-100 transition-colors',
    bordered: 'border border-gray-200',
    cell: 'px-4 py-2 text-left',
    header: 'px-4 py-3 text-left font-semibold bg-gray-50 border-b border-gray-200',
    row: 'border-b border-gray-100',
  },

  // Lists
  list: {
    ul: 'list-disc pl-6 space-y-2',
    ol: 'list-decimal pl-6 space-y-2',
    none: 'list-none',
    item: 'text-gray-700',
    itemHover: 'text-gray-700 hover:text-primary transition-colors cursor-pointer',
  },

  // Dropdowns/Popovers
  dropdown: {
    menu: 'absolute bg-white shadow-lg rounded-lg py-1 mt-2 border border-gray-100 min-w-[200px]',
    item: 'px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer text-gray-700',
    itemActive: 'px-4 py-2 bg-primary text-white',
    divider: 'border-t border-gray-100 my-1',
    header: 'px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide',
  },

  // Toasts/Notifications
  toast: {
    base: 'p-4 rounded-lg shadow-lg flex items-start gap-3 animate-slideIn',
    success: 'bg-green-100 text-green-800 border border-green-200',
    error: 'bg-red-100 text-red-800 border border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
    icon: 'flex-shrink-0 w-5 h-5',
    content: 'flex-1',
    title: 'font-semibold mb-1',
    message: 'text-sm',
    close: 'flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer',
  },

  // Forms (extended)
  form: {
    group: 'space-y-4',
    groupInline: 'flex items-center gap-4',
    label: 'block text-sm font-medium text-gray-700 mb-1',
    labelRequired: 'block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:ml-1 after:text-red-500',
    hint: 'text-xs text-gray-500 mt-1',
    errorMessage: 'text-xs text-red-600 mt-1 flex items-center gap-1',
    fieldset: 'border border-gray-200 rounded-lg p-4',
    legend: 'text-sm font-semibold text-gray-900 px-2',
  },

  // Accessibility helpers
  a11y: {
    srOnly: 'sr-only',
    focusVisible: 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    focusWithin: 'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
    skipLink: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg',
    ariaHidden: 'aria-hidden',
    notFocusable: 'pointer-events-none',
  },

  // Badges
  badge: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-800',
  },

  // Dividers
  divider: {
    horizontal: 'border-t border-gray-200 my-4',
    vertical: 'border-l border-gray-200 mx-4',
    withText: 'flex items-center gap-4 my-4 before:flex-1 before:border-t before:border-gray-200 after:flex-1 after:border-t after:border-gray-200',
  },

  // Avatars
  avatar: {
    base: 'rounded-full object-cover',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    ring: 'ring-2 ring-white',
  },

  // Progress bars
  progress: {
    container: 'w-full bg-gray-200 rounded-full h-2 overflow-hidden',
    bar: 'h-full bg-primary transition-all duration-300',
    barSuccess: 'h-full bg-green-600 transition-all duration-300',
    barWarning: 'h-full bg-yellow-600 transition-all duration-300',
    barDanger: 'h-full bg-red-600 transition-all duration-300',
  },

  // Chips/Tags
  chip: {
    base: 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors',
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    removable: 'pr-1',
    removeButton: 'ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors',
  },
}

/**
 * Combine classes utility
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

/**
 * Responsive breakpoint utilities
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}

/**
 * Animation presets
 * Based on Tailwind config animations
 */
export const animations = {
  // Fade animations
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fadeOut',
  
  // Slide animations
  slideIn: 'animate-slideIn',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slideDown',
  slideInRight: 'animate-slide-in',
  
  // Scale animations
  scaleIn: 'animate-scaleIn',
  scaleOut: 'animate-scaleOut',
  
  // Pulse animations
  pulse: 'animate-pulse',
  pulseSlow: 'animate-pulse-slow',
  
  // Spin animations
  spin: 'animate-spin',
  spinSlow: 'animate-spin-slow',
  
  // Float animation
  float: 'animate-float',
  
  // Shine effect
  shine: 'animate-shine',

  // Slide effects
  slide: 'animate-slide',
  slideReverse: 'animate-slide-reverse',

  // Partner carousel
  partnerSlide: 'animate-partnerSlide',

  // Hue rotate
  hueRotate: 'animate-hue-rotate',

  // Delayed animations for staggered effects
  delayedFadeIn: 'animate-delayed-fade-in',
}

/**
 * Icon utilities
 * For Material Icons and custom icon styling
 */
export const icons = {
  // Sizes
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-10 h-10',
  
  // Material Icons specific
  material: {
    base: 'material-icons-round',
    sm: 'material-icons-round text-sm',
    md: 'material-icons-round text-base',
    lg: 'material-icons-round text-lg',
    xl: 'material-icons-round text-xl',
    '2xl': 'material-icons-round text-2xl',
  },
  
  // Colors
  primary: 'text-primary',
  secondary: 'text-gray-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
  info: 'text-blue-600',
  
  // States
  interactive: 'cursor-pointer hover:text-primary transition-colors',
  disabled: 'text-gray-300 cursor-not-allowed',
}

/**
 * Utility functions
 */
export const utils = {
  /**
   * Conditionally join class names
   */
  clsx: cn,
  
  /**
   * Get responsive class based on breakpoint
   */
  responsive: (base: string, sm?: string, md?: string, lg?: string, xl?: string) => {
    return cn(
      base,
      sm && `sm:${sm}`,
      md && `md:${md}`,
      lg && `lg:${lg}`,
      xl && `xl:${xl}`
    )
  },
}

/**
 * Type exports for better TypeScript support
 */
export type ColorKey = keyof typeof colors
export type CCKey = keyof typeof cc
export type AnimationKey = keyof typeof animations
export type IconKey = keyof typeof icons