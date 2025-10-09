/**
 * Shared Style Utilities
 * Reusable Tailwind class combinations
 */

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
  }
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
 */
export const animations = {
  fadeIn: 'animate-fadeIn',
  fadeOut: 'animate-fadeOut',
  slideUp: 'animate-slideUp',
  slideDown: 'animate-slideDown',
  scaleIn: 'animate-scaleIn',
  scaleOut: 'animate-scaleOut'
}