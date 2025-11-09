/**
 * API Endpoints
 * Centralized endpoint definitions for the backend API
 * 
 * Based on Backend Documentation (docs/Backend Doc/api/QUICK_REFERENCE.md)
 * Last Updated: 2025-11-09
 *
 * Development: baseURL='' (empty), Vite proxy matches /api/* and forwards to backend
 * Production: baseURL='https://dklemailservice.onrender.com', /api/ prefix is part of full URL
 */

export const API_ENDPOINTS = {
  // ==================== Authentication ====================
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    profile: '/api/auth/profile',
    resetPassword: '/api/auth/reset-password',
  },

  // ==================== Email Services (Public) ====================
  email: {
    contact: '/api/contact-email',
    registration: '/api/register', // Updated: was /api/aanmelding-email
    send: '/api/emails',
    fetch: '/api/emails',
  },

  // ==================== Events & Registrations ====================
  events: {
    list: '/api/events',
    active: '/api/events/active',
    byId: (id: string) => `/api/events/${id}`,
    create: '/api/events',
    update: (id: string) => `/api/events/${id}`,
    delete: (id: string) => `/api/events/${id}`,
    stats: (id: string) => `/api/events/${id}/stats`,
    registrations: (id: string) => `/api/events/${id}/registrations`,
  },

  // ==================== Participants & Registrations ====================
  participants: '/api/participants',
  eventRegistrations: '/api/event-registrations',
  registration: {
    byId: (id: string) => `/api/registration/${id}`,
    update: (id: string) => `/api/registration/${id}`,
    byRole: (role: string) => `/api/registration/rol/${role}`,
    // Steps tracking
    updateSteps: (id: string) => `/api/registration/${id}/steps`,
    dashboard: (id: string) => `/api/registration/${id}/dashboard`,
  },

  // ==================== Steps & Gamification ====================
  steps: {
    totalSteps: '/api/total-steps',
    fundsDistribution: '/api/funds-distribution',
  },

  gamification: {
    // Achievements
    achievements: '/api/achievements',
    achievementById: (id: string) => `/api/achievements/${id}`,
    userAchievements: (userId: string) => `/api/achievements/user/${userId}`,
    createAchievement: '/api/achievements',
    updateAchievement: (id: string) => `/api/achievements/${id}`,
    deleteAchievement: (id: string) => `/api/achievements/${id}`,
    
    // Badges
    badges: '/api/badges',
    badgeById: (id: string) => `/api/badges/${id}`,
    userBadges: (userId: string) => `/api/badges/user/${userId}`,
    createBadge: '/api/badges',
    updateBadge: (id: string) => `/api/badges/${id}`,
    deleteBadge: (id: string) => `/api/badges/${id}`,
    awardBadge: (id: string) => `/api/badges/${id}/award`,
    removeBadge: (id: string) => `/api/badges/${id}/remove`,
    
    // Leaderboard
    leaderboard: '/api/leaderboard',
    userStats: (userId: string) => `/api/leaderboard/user/${userId}`,
    
    // Route Funds
    routeFunds: '/api/route-funds',
    routeFundById: (id: string) => `/api/route-funds/${id}`,
    createRouteFund: '/api/route-funds',
    updateRouteFund: (id: string) => `/api/route-funds/${id}`,
    deleteRouteFund: (id: string) => `/api/route-funds/${id}`,
  },

  // ==================== CMS - Media ====================
  videos: '/api/videos',
  videosAdmin: '/api/videos/admin',
  videoById: (id: string) => `/api/videos/${id}`,
  
  photos: '/api/photos',
  photosAdmin: '/api/photos/admin',
  photoById: (id: string) => `/api/photos/${id}`,
  
  albums: '/api/albums',
  albumsAdmin: '/api/albums/admin',
  albumById: (id: string) => `/api/albums/${id}`,
  albumPhotos: (id: string) => `/api/albums/${id}/photos`,
  albumReorder: '/api/albums/reorder',
  albumPhotosReorder: (id: string) => `/api/albums/${id}/photos/reorder`,

  // ==================== CMS - Partners & Sponsors ====================
  partners: '/api/partners',
  partnersAdmin: '/api/partners/admin',
  partnerById: (id: string) => `/api/partners/${id}`,
  
  sponsors: '/api/sponsors',
  sponsorsAdmin: '/api/sponsors/admin',
  sponsorById: (id: string) => `/api/sponsors/${id}`,

  // ==================== CMS - Content ====================
  programSchedule: '/api/program-schedule', // Updated: was /api/program
  programScheduleById: (id: string) => `/api/program-schedule/${id}`,
  
  radioRecordings: '/api/radio-recordings', // Updated: was /api/radio
  radioRecordingsAdmin: '/api/radio-recordings/admin',
  radioRecordingById: (id: string) => `/api/radio-recordings/${id}`,
  
  socialEmbeds: '/api/social-embeds',
  socialEmbedById: (id: string) => `/api/social-embeds/${id}`,
  
  socialLinks: '/api/social-links',
  socialLinkById: (id: string) => `/api/social-links/${id}`,
  
  titleSections: '/api/title-sections',
  titleSectionById: (id: string) => `/api/title-sections/${id}`,
  
  underConstruction: '/api/under-construction',
  underConstructionActive: '/api/under-construction/active',
  underConstructionById: (id: string) => `/api/under-construction/${id}`,

  // ==================== Notifications ====================
  notifications: {
    list: '/api/notifications',
    byId: (id: string) => `/api/notifications/${id}`,
    create: '/api/notifications',
    broadcast: '/api/notifications/broadcast',
    markRead: (id: string) => `/api/notifications/${id}/read`,
    markAllRead: '/api/notifications/read-all',
    delete: (id: string) => `/api/notifications/${id}`,
    deleteRead: '/api/notifications/read',
  },

  // ==================== Chat System ====================
  chat: {
    channels: '/api/chat/channels',
    publicChannels: '/api/chat/public-channels',
    createChannel: '/api/chat/channels',
    createDirect: '/api/chat/direct',
    joinChannel: (id: string) => `/api/chat/channels/${id}/join`,
    leaveChannel: (id: string) => `/api/chat/channels/${id}/leave`,
    channelMessages: (id: string) => `/api/chat/channels/${id}/messages`,
    sendMessage: (id: string) => `/api/chat/channels/${id}/messages`,
    updateMessage: (id: string) => `/api/chat/messages/${id}`,
    deleteMessage: (id: string) => `/api/chat/messages/${id}`,
    addReaction: (id: string) => `/api/chat/messages/${id}/reactions`,
    removeReaction: (id: string, emoji: string) => `/api/chat/messages/${id}/reactions/${emoji}`,
    updatePresence: '/api/chat/presence',
    onlineUsers: '/api/chat/online-users',
  },

  // ==================== Newsletter ====================
  newsletter: {
    list: '/api/newsletter',
    byId: (id: string) => `/api/newsletter/${id}`,
    create: '/api/newsletter',
    update: (id: string) => `/api/newsletter/${id}`,
    delete: (id: string) => `/api/newsletter/${id}`,
    send: (id: string) => `/api/newsletter/${id}/send`,
  },

  // ==================== Notulen (Meeting Notes) ====================
  notulen: {
    list: '/api/notulen',
    byId: (id: string) => `/api/notulen/${id}`,
    create: '/api/notulen',
    update: (id: string) => `/api/notulen/${id}`,
    delete: (id: string) => `/api/notulen/${id}`,
    finalize: (id: string) => `/api/notulen/${id}/finalize`,
  },

  // ==================== Admin - Contact Management ====================
  contact: {
    list: '/api/contact',
    byId: (id: string) => `/api/contact/${id}`,
    update: (id: string) => `/api/contact/${id}`,
    delete: (id: string) => `/api/contact/${id}`,
    addAnswer: (id: string) => `/api/contact/${id}/antwoord`,
    byStatus: (status: string) => `/api/contact/status/${status}`,
  },

  // ==================== Admin - Participant Management ====================
  participant: {
    list: '/api/participant',
    byId: (id: string) => `/api/participant/${id}`,
    delete: (id: string) => `/api/participant/${id}`,
    addAnswer: (id: string) => `/api/participant/${id}/antwoord`,
    emails: '/api/participant/emails', // Get all participant emails
  },

  // ==================== Admin - Mail Management ====================
  mail: {
    list: '/api/mail',
    byId: (id: string) => `/api/mail/${id}`,
    markProcessed: (id: string) => `/api/mail/${id}/processed`,
    delete: (id: string) => `/api/mail/${id}`,
    fetch: '/api/mail/fetch',
    unprocessed: '/api/mail/unprocessed',
    byAccount: (type: string) => `/api/mail/account/${type}`,
  },

  // ==================== RBAC (Admin Only) ====================
  rbac: {
    // Permissions
    permissions: '/api/permissions',
    permissionById: (id: string) => `/api/permissions/${id}`,
    createPermission: '/api/permissions',
    updatePermission: (id: string) => `/api/permissions/${id}`,
    deletePermission: (id: string) => `/api/permissions/${id}`,
    checkPermission: '/api/permissions/check',
    
    // Roles
    roles: '/api/roles',
    roleById: (id: string) => `/api/roles/${id}`,
    createRole: '/api/roles',
    updateRole: (id: string) => `/api/roles/${id}`,
    deleteRole: (id: string) => `/api/roles/${id}`,
    rolePermissions: (id: string) => `/api/roles/${id}/permissions`,
    assignPermissions: (id: string) => `/api/roles/${id}/permissions`,
    updatePermissions: (id: string) => `/api/roles/${id}/permissions`,
    removePermission: (roleId: string, permissionId: string) => 
      `/api/roles/${roleId}/permissions/${permissionId}`,
  },

  // ==================== User Management ====================
  users: {
    list: '/api/users',
    byId: (id: string) => `/api/users/${id}`,
    create: '/api/users',
    update: (id: string) => `/api/users/${id}`,
    delete: (id: string) => `/api/users/${id}`,
    roles: (id: string) => `/api/users/${id}/roles`,
    assignRole: (id: string) => `/api/users/${id}/roles`,
    assignRolesBatch: (id: string) => `/api/users/${id}/roles/batch`,
    removeRole: (userId: string, roleId: string) => `/api/users/${userId}/roles/${roleId}`,
  },

  // ==================== Image Upload ====================
  upload: {
    image: '/api/upload/image',
    imagesBatch: '/api/upload/images/batch',
  },

  // ==================== WebSocket Endpoints ====================
  websocket: {
    steps: (token: string) => `/ws/steps?token=${token}`,
    notulen: (token: string) => `/api/ws/notulen?token=${token}`,
    chat: (channelId: string, token: string) => `/api/chat/ws/${channelId}?token=${token}`,
    stats: '/api/ws/stats',
  },

  // ==================== Metrics & Monitoring ====================
  metrics: {
    email: '/api/metrics/email',
    rateLimits: '/api/metrics/rate-limits',
    prometheus: '/metrics',
  },

  // ==================== Telegram Bot (Admin) ====================
  telegram: {
    config: '/api/v1/telegrambot/config',
    send: '/api/v1/telegrambot/send',
    commands: '/api/v1/telegrambot/commands',
  },

  // ==================== Utility ====================
  health: '/api/health',
  version: '/api/version',
  info: '/',
  favicon: '/favicon.ico',
} as const;

/**
 * Helper function to build query strings
 */
export function buildQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Common query parameters interface
 */
export interface QueryParams {
  visible?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  page?: number;
  search?: string;
  status?: string;
  type?: string;
}

/**
 * Type helper to ensure endpoint functions are correctly typed
 */
export type EndpointFunction = (...args: string[]) => string;