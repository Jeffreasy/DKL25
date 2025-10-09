/**
 * Route Configuration
 * Centralized route definitions
 */

export interface RouteConfig {
  path: string
  label: string
  icon?: string
  showInNav?: boolean
  external?: boolean
}

/**
 * Main application routes
 */
export const ROUTES = {
  home: {
    path: '/',
    label: 'Home',
    showInNav: true
  },
  about: {
    path: '/over-ons',
    label: 'Over Ons',
    showInNav: true
  },
  dkl: {
    path: '/dkl',
    label: 'De Route',
    showInNav: true
  },
  media: {
    path: '/media',
    label: 'Media',
    showInNav: true
  },
  contact: {
    path: '/contact',
    label: 'Contact',
    showInNav: true
  },
  register: {
    path: '/aanmelden',
    label: 'Aanmelden',
    showInNav: true
  },
  privacy: {
    path: '/privacy',
    label: 'Privacy',
    showInNav: false
  },
  underConstruction: {
    path: '/onder-constructie',
    label: 'Onder Constructie',
    showInNav: false
  }
} as const

/**
 * Navigation items (filtered for nav display)
 */
export const NAV_ITEMS = Object.values(ROUTES).filter(
  route => route.showInNav
)

/**
 * External links
 */
export const EXTERNAL_LINKS = {
  facebook: 'https://www.facebook.com/dekerstloop',
  instagram: 'https://www.instagram.com/dekerstloop',
  twitter: 'https://twitter.com/dekerstloop',
  youtube: 'https://www.youtube.com/@dekerstloop',
  strava: 'https://www.strava.com/clubs/dekerstloop'
} as const

/**
 * Get route path by key
 */
export const getRoutePath = (key: keyof typeof ROUTES): string => {
  return ROUTES[key].path
}

/**
 * Check if current path matches route
 */
export const isActiveRoute = (currentPath: string, routePath: string): boolean => {
  if (routePath === '/') {
    return currentPath === '/'
  }
  return currentPath.startsWith(routePath)
}